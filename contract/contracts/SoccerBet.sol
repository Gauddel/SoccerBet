pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

import "@chainlink/contracts/src/v0.4/LinkToken.sol";
import "@chainlink/contracts/src/v0.4/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.4/vendor/Ownable.sol";
import "@chainlink/contracts/src/v0.4/vendor/SafeMath.sol";


contract SoccerBet is ChainlinkClient, Ownable {

    struct Bet {
        address creator;
        address adversary;
        uint256 betAmount;
        uint256 unlockBetTime;
        string matcheId;
        bool creatorBetHomeTeamWin;
        State state;
    }

    enum State { None, Created, Confirmed, Inactive }

    using SafeMath for uint256;
    uint256 constant private ORACLE_PAYMENT = 1 * LINK;

    address public defaultOracleAddress;
    string public jobId;
    mapping(bytes32 => Bet) bets;
    mapping(address => bytes32[]) betByParticipant;
    mapping(bytes32 => bytes32) requestByBet;
    LinkToken linkToken;
    uint256 benefits;

    event RequestMatchResultFulfilled(bytes32 indexed requestId, bool indexed _homeTeamWon);
    event BetCreated(string matcheId, address sender, address against, uint256 unlockBetTime, uint256 amount);
    event BetCanceled(string matcheId, address sender, address against, uint256 unlockBetTime, uint256 amount);
    event BetConfirmed(string matcheId, address sender, address against, uint256 unlockBetTime, uint256 amount);
    event FinishBetEvent(string matcheId, address sender, address against, uint256 unlockBetTime, uint256 amount);
    event BetFinished(string matcheId, address sender, address against, uint256 unlockBetTime, uint256 amount);

    constructor(address _oracleAddress, string _jobId, address _linkToken) public Ownable() {
        setPublicChainlinkToken();
        defaultOracleAddress = _oracleAddress;// 0xA4CefaDef0B7711Bba47eFBC61d65DCb9a5C8D11; (ropsten)
        jobId = _jobId;// "986b6fc60fb64899a7100d003a2cc531"; (ropsten)
        linkToken = LinkToken(_linkToken);// 0x20fE562d797A42Dcb3399062AE9546cd06f63280; (ropsten) 
    }

    function getAllBetId() public view returns(bytes32[]) {
        return betByParticipant[msg.sender];
    }

    function getBetFromBetId(bytes32 _betId) public view returns(Bet memory){
        return bets[_betId];
    }

    function createBet(string _matcheId, address _against, uint256 _unlockBetTime, bool _creatorBetHomeTeamWin) public payable {
        require(msg.value > 100 finney, "Should at least bet 0.1 ether");
        require(msg.sender != _against, "Creator and adversary should be two different address.");
        require(_unlockBetTime > block.timestamp, "Unlock time should be in futur.");

        bytes32 betId = keccak256(abi.encode(msg.sender, _against, msg.value, _unlockBetTime, _matcheId));
        bets[betId] = Bet(msg.sender, _against, msg.value, _unlockBetTime, _matcheId, _creatorBetHomeTeamWin, State.Created);
        betByParticipant[msg.sender].push(betId);
        betByParticipant[_against].push(betId);
        emit BetCreated(_matcheId, msg.sender, _against, _unlockBetTime, msg.value);
    }

    function cancelBet(string _matcheId, address _against, uint256 _unlockBetTime, uint256 _amount) public {
         bytes32 betId = keccak256(abi.encode(msg.sender, _against, _amount, _unlockBetTime, _matcheId));
         Bet storage bet = bets[betId];
         require(uint(bet.state) == uint(State.Created), "Cannot confirm Bet which is not in Created state.");

         bet.state = State.Inactive;
        bet.creator.transfer(bet.betAmount - 100 finney);
        emit BetCanceled(_matcheId, msg.sender, _against, _unlockBetTime, _amount);
    }

    function comfirmBet(string _matcheId, address _sender, uint256 _unlockBetTime, uint256 _amount) public payable {
        bytes32 betId = keccak256(abi.encode(_sender, msg.sender, _amount, _unlockBetTime, _matcheId));
        Bet storage bet = bets[betId];
        require(msg.value == _amount, "Adversary should bet the same amount than the sender.");
        require(_unlockBetTime > block.timestamp, "Unlock time should be in futur.");
        require(uint(bet.state) == uint(State.Created), "Cannot confirm Bet which is not in Created state.");

        bet.state = State.Confirmed;
        emit BetConfirmed(_matcheId, _sender, msg.sender, _unlockBetTime, msg.value);
    }

    function finishBet(string _matcheId, address _sender, address _against, uint256 _unlockBetTime, uint _amount) public {
        require(block.timestamp > _unlockBetTime, "Cannot finish the bet before unlock time.");
        bytes32 betId = keccak256(abi.encode(_sender, _against, _amount, _unlockBetTime, _matcheId));
        Bet storage bet = bets[betId];
        require(uint(bet.state) == uint(State.Confirmed), "Cannot finish a bet which is not confirmed.");

        requestMatchResult(defaultOracleAddress, jobId, _matcheId, betId);
        emit FinishBetEvent(_matcheId, _sender, _against, _unlockBetTime, _amount);
    }

    function finishBetWithPayingLink(string _matcheId, address _sender, address _against, uint256 _unlockBetTime, uint _amount) public {
        require(linkToken.allowance(msg.sender, address(this)) >= 1 * LINK, "Sender should approve the transfer of 1 Link for the oracle call fees");
        require(block.timestamp > _unlockBetTime, "Cannot finish the bet before unlock time.");
        bytes32 betId = keccak256(abi.encode(_sender, _against, _amount, _unlockBetTime, _matcheId));
        Bet storage bet = bets[betId];
        require(uint(bet.state) == uint(State.Confirmed), "Cannot finish a bet which is not confirmed.");

        linkToken.transferFrom(msg.sender, address(this), 1 * LINK);
        requestMatchResult(defaultOracleAddress, jobId, _matcheId, betId);
        emit FinishBetEvent(_matcheId, _sender, _against, _unlockBetTime, _amount);
    }

    function requestMatchResult(address _oracle, string _jobId, string _matcheId, bytes32 _betId) internal {
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), this, this.fulfillMatchResult.selector);
        req.add("matche", _matcheId);
        req.add("copyPath", "match.score.winner");
        req.add("value", "HOME_TEAM");
        req.add("operator", "eq");
        bytes32 requestId = sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
        requestByBet[requestId] = _betId;
    }

    function fulfillMatchResult(bytes32 _requestId, bool _homeTeamWon) external recordChainlinkFulfillment(_requestId) {

        bytes32 betId = requestByBet[_requestId];
        Bet storage bet = bets[betId];

        bet.state = State.Inactive;
        benefits = benefits + 100 finney;

        if (bet.creatorBetHomeTeamWin == _homeTeamWon) {
            bet.creator.transfer((bet.betAmount*2) - 100 finney);
        }
        else {
            bet.adversary.transfer((bet.betAmount*2) - 100 finney);
        }

        emit BetFinished(bet.matcheId, bet.creator, bet.adversary, bet.unlockBetTime, bet.betAmount);
    }

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
        return 0x0;
        }

        assembly { // solhint-disable-line no-inline-assembly
        result := mload(add(source, 32))
        }
    }

    function transferBenefits(address _dest) public onlyOwner {
        benefits = 0;
        _dest.transfer(benefits);
    }
}
