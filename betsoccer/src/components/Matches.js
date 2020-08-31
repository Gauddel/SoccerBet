import React from 'react';
import SoccerApi from './../services/SoccerApi';
import Matche from './Matche';

class Matches extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            teamId : props.teamId,
            matches : []
        }
        
        this.getMatches = this.getMatches.bind(this);
        this.setCards = this.setCards.bind(this);
        this.getMatches();
    }

    getMatches() {
        SoccerApi.getMatches(this.state.teamId, this.setCards)
    }

    setCards(matches) {
        matches.matches.forEach(matche => {
            this.state.matches.push(matche);
        });
        this.forceUpdate();
    }

    matchesVue() {
        var isdark = false;
        console.log(this.state.matches);
        return this.state.matches.map(matche => {
            isdark = !isdark;
            var date = new Date(matche.utcDate);

            if(date < Date.now()) {
                return;
            }
            return <Matche date={matche.utcDate} matcheId={matche.id}
            homeTeam={matche.homeTeam.name} homeTeamId={matche.homeTeam.id} awayTeam={matche.awayTeam.name}
            awayTeamId={matche.awayTeam.id} isdark={isdark}
            wantedTeamId={this.state.teamId}
            loadCreateBetComponent={this.props.loadCreateBetComponent}/>
        })
    }

    render() {
        return (<div>
            {this.matchesVue()}
        </div>);
    }
}

export default Matches;