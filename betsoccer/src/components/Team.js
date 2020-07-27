import React from 'react';

class Team extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id : props.id,
            name : props.name,
            website : props.website,
            svg : props.svg,
            clubColors : props.clubColors,
            isdark : props.isdark,
            getMatches : props.getMatches,
        }
        this.getCustomStyle = this.getCustomStyle.bind(this);
        this.getMatches = this.getMatches.bind(this);
        this.getCustomStyle();
    }

    getCustomStyle() {
        if(this.state.isdark == false) {
            return 'hero'
        }
        return 'hero is-green';
    }

    getMatches() {
        this.state.getMatches(this.state.id);
    }

    render() {
        return (<section className={this.getCustomStyle()}>
            <div className="hero-body">
                <div className="heroContainer">
                    <div className="heroImage image is-128x128">
                        <a target="_blank" rel="noopener noreferrer" href={this.state.website}>
                            <img className="resize" src={this.state.svg}/>  
                        </a>
                    </div>
                    <div className="heroContent">
                        <h1 className="title">
                            {this.state.name}
                        </h1>
                    </div>
                    <div className="center">
                        <h3 className="button is-violet" onClick={() => this.getMatches()}>
                           Bet 
                        </h3>
                    </div>
                </div>
            </div>
        </section>);
    }
}

export default Team;