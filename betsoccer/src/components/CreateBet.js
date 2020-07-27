import React from 'react';
import SoccerBetContract from './../services/SoccerBetContract';
import Web3Access from './../services/Web3Access';

class CreateBet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            homeTeam : props.homeTeam,
            awayTeam : props.awayTeam,
            date : props.date,
            matcheId : props.matcheId,
            unlockTimeBet : props.unlockTimeBet,
            yourBet : props.yourBet,
            opponent : 'Your opponent',
            amount : 'Bet Amount in Ether',
            contract : SoccerBetContract.GetInstance().contract
        }

        this.createBet = this.createBet.bind(this);
        this.styleOnHomeTeam = this.styleOnHomeTeam.bind(this);
        this.styleOnAwayTeam = this.styleOnAwayTeam.bind(this);
        this.handleOpponent = this.handleOpponent.bind(this);
        this.handleAmount = this.handleAmount.bind(this);
    }

    styleOnHomeTeam() {
        if (this.state.yourBet) {
            return 'title is-3';
        }

        return 'subtitle is-4';
    }

    styleOnAwayTeam() {
        if (this.state.yourBet) {
            return 'subtitle is-4';
        }

        return 'title is-3';
    }

    createBet() {
        // Use Web3
        if(!Web3Access.GetInstance().web3.utils.isAddress(this.state.opponent)) {
            alert('Opponent Address not correct');
            return;
        }

        if (!Number.isInteger(Number(this.state.amount))) {
            alert('Amount not correct.');
            return;
        }

        var amt = Web3Access.GetInstance().web3.utils.toWei(this.state.amount , 'ether');
        var timestamp = (this.state.date.getTime() + 7200000)/1000; // + 2 Hours / in seconds
        Web3Access.GetInstance().web3.eth.getAccounts().then((accounts) => {
            console.log(this.state.matcheId);
            this.state.contract.methods.createBet(this.state.matcheId.toString(), this.state.opponent, timestamp, this.state.yourBet).send({from: accounts[0], value: amt}).then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err);
            })
        });
        

    }

    handleOpponent(event) {
        this.setState({
            opponent : event.target.value,
        })
    }

    handleAmount(event) {
        this.setState({
            amount : event.target.value
        })
    }

    render() {
        return (<section class="hero is-light">
            <div class="hero-body">
                <div class="container parentTitle">
                    <div className="center leftTitle">
                        <h4 className={`${this.styleOnHomeTeam()}`}>
                            {this.state.homeTeam}
                        </h4>
                    </div>
                    <div className="center centerTitle">
                        <h6 className="subtitle is-6">
                            {this.state.date.toString()}
                        </h6>
                    </div>
                    <div className="center rightTitle">
                        <h4 className={`${this.styleOnAwayTeam()}`}>
                            {this.state.awayTeam}
                        </h4>
                    </div>
                </div>
                <input className="input mt-5" type="text" value={this.state.opponent} onChange={this.handleOpponent}></input>
                <input className="input mt-5" type="number" placeholder="Bet Amount in Ether" value={this.state.amount} onChange={this.handleAmount}></input>
                <button className="button is-violet  is-fullwidth mt-5" onClick={() => this.createBet()}>Bet</button>
            </div>
        </section>);
    }
}

export default CreateBet;
