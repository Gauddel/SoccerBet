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
        return (
            <div className="shadow-lg w-1/3 flex items-center justify-center p-10">
                <div className="">
                    <div className="heroImage image is-128x128">
                        <a target="_blank" className="cursor-pointer" rel="noopener noreferrer" onClick={() => this.getMatches()}>
                            <img className="w-32" src={this.state.svg}/>  
                        </a>
                    </div>
                </div>
            </div>);
    }
}

export default Team;