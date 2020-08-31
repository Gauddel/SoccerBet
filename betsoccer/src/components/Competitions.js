import React from 'react';
import SoccerApi from './../services/SoccerApi';
import Teams from './Teams';
import Competition from './Competition';
import Matches from './Matches';
import CreateBet from './CreateBet';
import goBack from './../images/goBack.png';

const listOfCompetition = [
    { code:'FL1', url:"https://upload.wikimedia.org/wikipedia/fr/thumb/1/14/Ligue_1_Conforama.svg/langfr-800px-Ligue_1_Conforama.svg.png"}, // Ligue 1
    { code:'PL', url:"https://upload.wikimedia.org/wikipedia/fr/thumb/f/f2/Premier_League_Logo.svg/langfr-1280px-Premier_League_Logo.svg.png"}, // Premier League
    { code:'PD', url:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/LaLiga_Santander.svg/langfr-800px-LaLiga_Santander.svg.png"}, // Primera Division
    { code:'SA', url:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Serie_A_Logo_%28ab_2019%29.svg/234px-Serie_A_Logo_%28ab_2019%29.svg.png"}, // Serie A
    { code:'BL1', url:"https://upload.wikimedia.org/wikipedia/fr/thumb/0/0a/Bundesliga-logo.svg/langfr-800px-Bundesliga-logo.svg.png"}, // Bundesliga 1
]

class Competitions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            competition : 'FL1',
            result : null,
            team : null,
            listOfSupportedComp : [],
            bet : null,
        }

        this.handleCompetitionChange = this.handleCompetitionChange.bind(this);
        // this.setSoccerCompetition = this.setSoccerCompetition.bind(this);
        this.getCompetitionId = this.getCompetitionId.bind(this);
        this.setSoccerCompetitions = this.setSoccerCompetitions.bind(this);
        this.goToTeamsVue = this.goToTeamsVue.bind(this);
        this.loadTeam = this.loadTeam.bind(this);
        this.cardsComponent = this.cardsComponent.bind(this);
        this.loadCompetition = this.loadCompetition.bind(this);
        this.matchesComponent = this.matchesComponent.bind(this);
        this.goToCompetitionVue = this.goToCompetitionVue.bind(this);
        this.resetComponent = this.resetComponent.bind(this);
        this.createBetComponent = this.createBetComponent.bind(this);
        this.loadCreateBetComponent = this.loadCreateBetComponent.bind(this);

        props.getCompetitionReset(this.resetComponent);

        this.getCompetitionId();
    }

    resetComponent() {
        this.setState({
            competition : 'FL1',
            result : null,
            team : null,
            bet : null,
        });
        this.forceUpdate();
    }

    goToCompetitionVue() {
        this.setState({
            result : null,
        })
    }

    goToTeamsVue() {
        this.setState({
            team : null,
        })
    }

    getCompetitionId() {
        SoccerApi.getCompetitionId(this.setSoccerCompetitions);
    }

    setSoccerCompetitions(competitions) {
        // Find supported competitions (i.e listOfCompetition)

        listOfCompetition.forEach((competitionCode) => {
            competitions.competitions.forEach((compet) => {
                if(compet.code === competitionCode.code) {
                    compet.emblemUrl = competitionCode.url;
                    this.state.listOfSupportedComp.push(compet);
                }
            });
        });
        this.forceUpdate();
    }

    cardsComponent() {
        if(this.state.result != null) {
            return (<div></div>);
        }

        var isGreen = false;

        var cards = (compet) => {
            isGreen = !isGreen;
            return (<Competition key={compet.id} id={compet.id} name={compet.name} url={compet.emblemUrl} loadCompetition={this.loadCompetition} isGreen={isGreen}></Competition>);
        }

        return (<div>
        <h1 className="text-3xl font-extrabold my-16 flex items-center justify-center">Choose the wanted Competition</h1>
            <div className="flex justify-around">
                {this.state.listOfSupportedComp.map(cards)}

            </div>
        </div>);
    }

    teamComponent() {
        if(this.state.result === null || this.state.team !== null) {
            return (<div></div>);
        }
        return (
        <div>
            <div className="m-3">
                <a target="_blank" className="cursor-pointer" rel="noopener noreferrer" onClick={() => this.goToCompetitionVue()}>
                                <img className="w-8" src={goBack}/>  
                        </a>
            </div>


            <h1 className="text-3xl font-extrabold my-16 flex items-center justify-center">Choose the wanted Team</h1>
            <Teams competitionId={this.state.result} getMatches={this.loadTeam}/>
        </div>
        );
    }

    matchesComponent() {
        if(this.state.team == null || this.state.bet != null) {
            return (<div></div>);
        }
        return (<div>
            <div className="m-3">
                <a target="_blank" className="cursor-pointer"  onClick={() => this.goToTeamsVue()}>
                                <img className="w-8" src={goBack}/>  
                        </a>
            </div>
            <br/>
            <Matches teamId={this.state.team} loadCr
            eateBetComponent={this.loadCreateBetComponent}/>
        </div>);
    }

    loadCreateBetComponent(homeTeam, awayTeam, date, matcheId, unlockTimeBet, yourBet) {
        this.setState({
            bet : {
                'homeTeam' : homeTeam,
                'awayTeam' : awayTeam,
                'date' : date,
                'matcheId' : matcheId,
                'unlockTimeBet' : unlockTimeBet,
                'yourBet' : yourBet
            }
        })
    }

    createBetComponent() {
        if(this.state.bet == null) {
            return (<div></div>);
        }

        return (<CreateBet homeTeam={this.state.bet.homeTeam} awayTeam={this.state.bet.awayTeam}
        date={this.state.bet.date} matcheId={this.state.bet.matcheId} unlockTimeBet={this.state.bet.unlockTimeBet} yourBet={this.state.bet.yourBet}/>);
    }

    loadCompetition(competitionId) {
        this.setState({
            result : competitionId
        })
    }

    handleCompetitionChange(event) {
        this.setState({
            competition : event.target.value
        });
    }

    loadTeam(teamId) {
        this.setState({
            team : teamId,
        })
    }

    render() {
        return (<div>
            {this.cardsComponent()}
            {this.teamComponent()}
            {this.matchesComponent()}
            {this.createBetComponent()}
        </div>);
    }
}

export default Competitions;