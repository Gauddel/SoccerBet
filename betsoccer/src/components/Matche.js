import React from 'react';
import Web3Access from './../services/Web3Access';

class Matche extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date : new Date(props.date),
            wantedTeamId : props.wantedTeamId,
            matcheId : props.matcheId,
            homeTeam : props.homeTeam,
            homeTeamId : props.homeTeamId,
            awayTeam : props.awayTeam,
            awayTeamId : props.awayTeamId,
            isdark : props.isdark,
            loadCreateBetComponent : props.loadCreateBetComponent,
        }

        this.getHomeTeamStyle = this.getHomeTeamStyle.bind(this);
        this.getAwayTeamStyle = this.getAwayTeamStyle.bind(this);
        this.loadCreateBetComponentCall = this.loadCreateBetComponentCall.bind(this);
    }

    getHomeTeamStyle() {
        if (this.state.homeTeamId === this.state.wantedTeamId) {
            return 'is-green';
        }
    }

    getAwayTeamStyle() {
        if (this.state.awayTeamId === this.state.wantedTeamId) {
            return 'is-green';
        }
    }

    loadCreateBetComponentCall(homeTeam) {
        this.state.loadCreateBetComponent(this.state.homeTeam, this.state.awayTeam, this.state.date, this.state.matcheId, this.props.date, homeTeam);
    }

    render() {
        return (
        <div className="tile is-ancestor">
            <div className="tile is-half is-offset-one-quarte">
                <div className="tile">
                    <div className={`tile is-parent ${this.getHomeTeamStyle()}`}>
                        <div class={`tile is-child is-primary center has-text-centered`}>
                            <h5 class="has-text-weight-bold is-5 mr-1">{this.state.homeTeam}</h5>
                            <button className="button is-violet ml-1" onClick={() => this.loadCreateBetComponentCall(true)}>WIN</button>
                        </div>
                    </div>
                </div>
                <div className="tile">
                    <div className="tile is-parent">
                        <div class="tile is-child notification">
                        <h6 class="subtitle is-6 is-text-violet">{this.state.date.toString()}</h6>
                        </div>
                    </div>
                </div>
                <div className="tile">
                    <div className={`tile is-parent ${this.getAwayTeamStyle()}`}>
                        <div class={`tile is-child is-primary center has-text-centered`}>
                            <button className="button is-violet mr-1" onClick={() => this.loadCreateBetComponentCall(false)}>WIN</button>
                            <h5 className="has-text-weight-bold is-5 ml-1">{this.state.awayTeam}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Matche;