import React from 'react';

class Competition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id : props.id,
            name : props.name,
            url : props.url,
            loadCompetition : props.loadCompetition,
            isloadedCompetition : false,
            isGreen : props.isGreen,
        }
        // isloadedCompetition is a props property not state property
        this.loadCompetition = this.loadCompetition.bind(this);
        this.isGreen = this.isGreen.bind(this);
    }

    loadCompetition() {
        this.props.loadCompetition(this.state.id);
    }

    isGreen() {
        if(this.state.isGreen) {
            return 'is-green';
        }
    }

    render() {
        return (
        <div className={`card ${this.isGreen()}`} >
            <div className="card-image center">
                <figure className="imageC image is-128x128">
                        <img className="resize" src={this.state.url} alt={this.state.name}/>
                </figure>
            </div>
            <div className="card-content">
                <a onClick={() => this.loadCompetition()}>
                    <h3 className="has-text-weight-semibold is-uppercase">{this.state.name}</h3>
                </a>
                
            </div>
        </div>);
    }
}

export default Competition;