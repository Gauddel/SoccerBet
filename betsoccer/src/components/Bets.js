import React from 'react';
import SoccerBetContract from './../services/SoccerBetContract';
import Web3Access from './../services/Web3Access';
import Bet from './Bet';

class Bets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contract : SoccerBetContract.GetInstance().contract,
            bets : [],
            account : null
        }

        this.betsVue = this.betsVue.bind(this);
        this.getBets = this.getBets.bind(this);
        this.getAccount = this.getAccount.bind(this);
        this.getAccount();
    }

    getAccount() {
        Web3Access.GetInstance().web3.eth.getAccounts().then((accounts) => {
            console.log(accounts);
            this.setState({account : accounts[0]});
            this.getBets();
        });
    }

    getBets() {
        this.state.contract.methods.getAllBetId().call({from : this.state.account}).then((betIds) => {
            console.log(betIds);
            for(var i=0; i < betIds.length; i++) {
                this.state.contract.methods.getBetFromBetId(betIds[i]).call({from : this.state.account}).then((bet) => {
                        console.log(bet);
                        this.state.bets.push(bet);
                        this.forceUpdate();

                });
            }
        });
    }

    betsVue() {
        // console.log(this.state.bets);
        return this.state.bets.map(bet => {
            var adversary = bet.adversary;
            var yourBet = bet.creatorBetHomeTeamWin;
            var isCreator = true;
            if (bet.adversary == this.state.account) {
                adversary = bet.creator;
                yourBet = !yourBet;
                isCreator = false;
            }

            return <Bet adversary={adversary} matcheId={bet.matcheId}
            betAmount={bet.betAmount} unlockBetTime={bet.unlockBetTime} yourBet={yourBet}
            state={bet.state}
            isCreator={isCreator}/>
        })
    }

    render() {
        return (<div>
            {this.betsVue()}
        </div>);
    }
}

export default Bets;