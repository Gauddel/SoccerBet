import Web3 from 'web3';

class Web3Access {

    web3;

    constructor () {
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
}

export default Web3Access;