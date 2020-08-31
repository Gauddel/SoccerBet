import Web3 from 'web3';

class Web3Access {

    web3;

    constructor () {
        console.log('Test');
        window.ethereum.enable().then(() => {
            this.web3 = new Web3(window.ethereum);
        })
    }


    static Instance;

    static GetInstance = () => {
        if(Web3Access.Instance === undefined) {
            Web3Access.Instance = new Web3Access();
        }
        return Web3Access.Instance;
    }

    static checkIfDappConnectedToMetamask(callback) {
        var w3 = new Web3(window.ethereum);

        w3.eth.getAccounts().then((accounts) => {
            callback(accounts[0]);
        });
    }
}

export default Web3Access;