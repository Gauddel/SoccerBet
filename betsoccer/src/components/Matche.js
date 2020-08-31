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
            return 'bg-vert text-gray-900';
        }
        return 'bg-gray-800 text-gray-100'
    }

    getAwayTeamStyle() {
        if (this.state.awayTeamId === this.state.wantedTeamId) {
            return 'bg-vert text-gray-900';
        }
        return 'bg-gray-800 text-gray-100'
    }

    loadCreateBetComponentCall(homeTeam) {
        this.state.loadCreateBetComponent(this.state.homeTeam, this.state.awayTeam, this.state.date, this.state.matcheId, this.props.date, homeTeam);
    }

    render() {
        return (
            <div className="shadow-md border border-gray-300 flex items-center justify-center p-10 m-10">
                    <div className={`shadow-2xl rounded-lg w-2/5 m-5 ${this.getHomeTeamStyle()}`}>
                        <div class='flex items-center justify-center'>
                            <h5 class="w-3/5 text-3xl font-extrabold p-5">{this.state.homeTeam}</h5>
                            <div className="cursor-pointer w-2/5 flex items-center justify-center">
                                <button className=" p-2 rounded-full border border-gray-100  text-xl font-bold hover:font-semibold" onClick={() => this.loadCreateBetComponentCall(true)}>WIN</button>
                            </div>
                            
                        </div>
                    </div>
                    <div className="w-1/5 text-xs">
                        <div class="tile is-child notification">
                        <h6 class="subtitle is-6 is-text-violet">{this.state.date.toString()}</h6>
                        </div>
                    </div>
                    <div className={`shadow-2xl rounded-lg w-2/5 m-5 ${this.getAwayTeamStyle()}`}>
                        <div class={`flex items-center justify-center`}>
                            <div className="cursor-pointer w-2/5 flex items-center justify-center">
                                <button className="p-2 rounded-full border border-gray-100 text-xl font-bold hover:font-semibold" onClick={() => this.loadCreateBetComponentCall(false)}>WIN</button>
                            </div>
                            <h5 className="w-3/5 text-3xl font-extrabold p-5">{this.state.awayTeam}</h5>
                        </div>
                    </div>
            </div>
        );
    }
}

export default Matche;