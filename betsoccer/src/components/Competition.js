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
            return 'border border-gray-300';
        }
    }

    render() {
        return (
        <div className={`shadow-md p-3 mb-20 flex items-center justify-center ${this.isGreen()}`} >
            <a className="cursor-pointer" onClick={() => this.loadCompetition()}>
                <div class="container">
                    <div className="card-image center">
                        <figure className="imageC image is-128x128">
                                <img className="w-32 " src={this.state.url} alt={this.state.name}/>
                        </figure>
                    </div>
                </div>
            </a>
        </div>);
    }
}

export default Competition;