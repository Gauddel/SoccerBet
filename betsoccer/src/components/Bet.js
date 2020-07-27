import React from 'react';
import SoccerApi from './../services/SoccerApi';
import Web3Access from './../services/Web3Access';
import SoccerBetContract from './../services/SoccerBetContract';

class Bet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            adversary : props.adversary,
            betAmount : props.betAmount,
            unlockBetTime : new Date(props.unlockBetTime * 1000),
            matcheId : props.matcheId,
            yourBet : props.yourBet,
            state : props.state,
            isCreator : props.isCreator,
            matche : null,
            contract : SoccerBetContract.GetInstance().contract
        };
        this.getMatchInformation = this.getMatchInformation.bind(this);
        this.setMatchInformation = this.setMatchInformation.bind(this);
        this.getStyle = this.getStyle.bind(this);
        this.getCenterVue = this.getCenterVue.bind(this);
        this.getBetResult = this.getBetResult.bind(this);
        this.gain = this.gain.bind(this);
        this.win = this.win.bind(this);
        this.styleOnHomeTeam = this.styleOnHomeTeam.bind(this);
        this.styleOnAwayTeam = this.styleOnAwayTeam.bind(this);
        this.getAction = this.getAction.bind(this);
        this.earn = this.earn.bind(this);
        this.cancel = this.cancel.bind(this);
        this.confirm = this.confirm.bind(this);
        this.getMatchInformation();
    }

    getMatchInformation () {
        SoccerApi.getSpecificMatche(this.state.matcheId, this.setMatchInformation);
    }

    setMatchInformation(matche) {
        this.setState({
            matche : matche.match
        })
    }

    getStyle() {
        if(this.state.state === "1") {// Bet Created
            return 'is-text-violet';
        }
        if(this.state.state === "2") {// Bet Confirmed
            return 'is-green'
        }
        return 'is-light';
    }

    getCenterVue() {

        if (this.state.state === "3") {
            return (
                <div className="center centerTitle">
                    <h4 className="subtitle is-4">
                        {this.state.matche.score.fullTime.homeTeam} - {this.state.matche.score.fullTime.awayTeam}
                    </h4>
                </div>
            );
        }
        return (
            <div className="center centerTitle">
                <h4 className="subtitle is-4">
                     - 
                </h4>
            </div>
        );
    }

    getBetResult() {
        var dateStr = this.state.unlockBetTime.toLocaleString("en-GB");

        if (this.state.state === "3") {
            return (
                <div className=" parentTitle">
                    <div className="center leftTitle">
                        <p className="is-size-7">
                            Unlock Time : {dateStr}
                        </p>
                    </div>
                    <div className={`center centerTitle `}>
                        <h4 className={`title is-4 ${this.win()}`}>
                            {this.gain()} Eth
                        </h4>
                    </div>
                    <div className="center rightTitle">
                        <p className="is-size-7">
                            {this.state.adversary}
                        </p>
                    </div>
                </div>
            );
        }
        return (
            <div className="container parentTitle">
                <div className="center leftTitle">
                    <p className="is-size-7">
                        Unlock Time : {dateStr}
                    </p>
                </div>
                <div className={`center centerTitle `}>
                    <h4 className={`title is-4`}>
                       Up to {this.gain()} Eth
                    </h4>
                </div>
                <div className="center rightTitle">
                    <p className="is-size-7">
                        {this.state.adversary}
                    </p>
                </div>
            </div>
        );
    }

    earn() {
        Web3Access.GetInstance().web3.eth.getAccounts().then((accounts) => {
            var sender = accounts[0];
            var opponent = this.state.adversary;

            if(!this.state.isCreator) {
                sender = this.state.adversary;
                opponent = accounts[0];
            }

            console.log(sender, 'SENDER');
            console.log(opponent, 'OPPONENT');
            console.log(this.state.matcheId.toString(), 'MATCH ID');
            console.log(this.props.unlockBetTime, 'UNLOCK TIME');
            console.log(this.state.betAmount, 'BET AMOUNT');

            this.state.contract.methods.finishBet(this.state.matcheId.toString(), sender, opponent, this.props.unlockBetTime, this.state.betAmount).send({from : accounts[0]}).then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            })
        })
    }

    cancel() {
        Web3Access.GetInstance().web3.eth.getAccounts().then((accounts) => {
            this.state.contract.methods.cancelBet(this.state.matcheId.toString(), this.state.adversary, this.props.unlockBetTime, this.state.betAmount).send({from : accounts[0]}).then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            })
        })
    }

    confirm() {
        Web3Access.GetInstance().web3.eth.getAccounts().then((accounts) => {
            this.state.contract.methods.comfirmBet(this.state.matcheId.toString(), this.state.adversary, this.props.unlockBetTime, this.state.betAmount).send({from : accounts[0], value : this.state.betAmount}).then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            })
        })
    }

    getAction() {
        if (this.state.state === "3") {
            return (<div></div>)
        }
        if (this.state.state === "2") {
            return (<button className="button is-violet mt-5" onClick={() => this.earn()}>Get Earned Money</button>);
        }
        if (this.state.state === "1") {
            if(this.state.isCreator === true) {
                return (<button className="button is-violet mt-5" onClick={() => this.cancel()}>Cancel</button>);
            }
            return (<button className="button is-violet mt-5" onClick={() => this.confirm()}>Confirm</button>);
        }
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

    win() {
        if ((this.state.matche.score.winner == "HOME_TEAM" && this.state.yourBet)
        || (this.state.matche.score.winner !== "HOME_TEAM" && !this.state.yourBet)) {
            return 'is-win';
        }
        return 'is-lost';
    }

    gain() {
        var fees = Web3Access.GetInstance().web3.utils.toWei('101', 'finney');
        fees = Web3Access.GetInstance().web3.utils.fromWei(fees, 'ether');

        var betAmount = Web3Access.GetInstance().web3.utils.fromWei(this.state.betAmount, 'finney');

        return parseFloat((betAmount * 2 - 100).toString()) / 1000;
    }

    render() {
        if (this.state.matche === null || this.state.matche === undefined) {
            return (<div></div>);
        }
        return (
            <section class={`hero ${this.getStyle()}`}>
                <div class="hero-body">
                    {this.getBetResult()}
                    <div class="container parentTitle mt-5">
                        <div className="center leftTitle">
                            <h4 className={`${this.styleOnHomeTeam()}`}>
                                {this.state.matche.homeTeam.name}
                            </h4>
                        </div>
                       {this.getCenterVue()}
                        <div className="center rightTitle">
                            <h4 className={`${this.styleOnAwayTeam()}`}>
                                {this.state.matche.awayTeam.name}
                            </h4>
                        </div>
                    </div>
                    {this.getAction()}
                </div>
            </section>
        );
    }
}

export default Bet;