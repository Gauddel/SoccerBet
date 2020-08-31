import React from 'react';
import SoccerApi from './../services/SoccerApi';
import Team from './Team';

class Teams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionId : props.competitionId,
            teams : [],
            getMatches : props.getMatches,
        }

        this.getTeams = this.getTeams.bind(this);
        this.setTeams = this.setTeams.bind(this);
        this.teamsVue = this.teamsVue.bind(this);
        this.optionComponent = this.optionComponent.bind(this);
        this.getMatches = this.getMatches.bind(this);
        this.getTeams();
    }

    getTeams() {
        if(this.state.competitionId == null) {
            return;
        }
        SoccerApi.getTeams(this.state.competitionId, this.setTeams);
    }

    setTeams(competition) {
        competition.teams.forEach(team => {
            this.state.teams.push(team);
        });
        this.forceUpdate();
    }

    teamsVue() {
        var isdark = false;
        return this.state.teams.map(team => {
            isdark = !isdark;
            return <Team id={team.id} name={team.name} website={team.website} svg={team.crestUrl} clubColors={team.clubColors} isdark={isdark}
            getMatches={this.getMatches}/>
        });
    }

    optionComponent() {
        var options = (compet) => {
            return <option value={compet.code}>{compet.name}</option>
        }

        return <select value={this.state.team} onChange={this.handleCompetitionChange}>{this.state.listOfSupportedComp.map(options)}</select>;
    }

    getMatches(teamId) {
        this.state.getMatches(teamId);
    }

    render() {
        // this.getTeams();
        return (<div className="flex content-start flex-wrap mb-10">
            {this.teamsVue()}
        </div>);
    }
}

export default Teams;