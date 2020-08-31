# SoccerBet

![alt text](https://soccer-b.herokuapp.com/Soccer%20Bet.png)

SoccerBet is a platform where you can bet on future football match outcome (currently on testnet ropsten).

Supported Championship :

![alt text](https://upload.wikimedia.org/wikipedia/fr/thumb/c/ca/Logo_Ligue_1_Uber_Eats_2020.svg/langfr-130px-Logo_Ligue_1_Uber_Eats_2020.svg.png)
![alt text](https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/LaLiga_Santander.svg/langfr-200px-LaLiga_Santander.svg.png)
![alt text](https://upload.wikimedia.org/wikipedia/fr/thumb/f/f2/Premier_League_Logo.svg/langfr-440px-Premier_League_Logo.svg.png)
![alt text](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Serie_A_Logo_%28ab_2019%29.svg/langfr-180px-Serie_A_Logo_%28ab_2019%29.svg.png)
![alt text](https://upload.wikimedia.org/wikipedia/fr/thumb/0/0a/Bundesliga-logo.svg/langfr-180px-Bundesliga-logo.svg.png)


## A Video is better than an explanation

[![](http://img.youtube.com/vi/Bt0FqrHWzi0/0.jpg)](https://youtu.be/Bt0FqrHWzi0 "SoccerBet")

## Test It

[SoccerBet](https://soccer-b.herokuapp.com/)

Oracle contract address (Ropsten) : [0xA4CefaDef0B7711Bba47eFBC61d65DCb9a5C8D11](https://ropsten.etherscan.io/address/0xA4CefaDef0B7711Bba47eFBC61d65DCb9a5C8D11)
SoccerBet contract address (Ropsten) : [0x7599AB7dCE4F416FF88238b74627E43C90fD4c99](https://ropsten.etherscan.io/address/0x7599AB7dCE4F416FF88238b74627E43C90fD4c99)
JobId (Ropsten) : 986b6fc60fb64899a7100d003a2cc531

## Parts

### Adapter
 It's the implementation of an external adapter needed to call football api to retrieve football match outcome. A chainlink node will call it via a job (in ropsten 986b6fc60fb64899a7100d003a2cc531).
 
### BetSoccer
Implementation of the front-end used by client to create, cancel, confirm and finish (earn) bet. This front end iteract with the smart contract of soccerbet to realize this set of actions.

### Contract
Implementation of smart contract needed to create features like creating, cancelling, comfirming and finishing bet. The soccerbet smart contract will interact with an oracle (ropsten 0xA4CefaDef0B7711Bba47eFBC61d65DCb9a5C8D11) to get data which not accessible in ethereum network.

