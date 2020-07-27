import React from 'react';
import logo from './images/Soccer Bet.png';
import './App.css';
import Competitions from './components/Competitions';
import Bets from './components/Bets';
import Web3Access from './services/Web3Access';

require('dotenv').config();

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      resetCompetition : null,
      newBet : true
    }

    this.getCompetitionReset = this.getCompetitionReset.bind(this);
    this.resetCompetition = this.resetCompetition.bind(this);
    this.getVue = this.getVue.bind(this);
    //Init Web3 
    Web3Access.GetInstance();
  }

  resetCompetition() {
    this.setState({
      newBet : true
    });
    this.state.resetCompetition();
  }

  getCompetitionReset(resetFunction) {
    this.setState({
      resetCompetition : resetFunction
    })
  }

  getMyBets() {
    this.setState({
      newBet : false
    })
  }

  getVue() {
    if (this.state.newBet) {
      return (<Competitions getCompetitionReset={this.getCompetitionReset}/>);
    }
    return (<Bets/>);
  }

  render() {return (
      <div className="App">
          <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
              <a class="navbar-item" href="#">
                <img src="./Soccer Bet.png" class="image is-50x50" alt="Bulma: Free, open source, and modern CSS framework based on Flexbox" width="50" height="50"/>
              </a>
            </div>
            <div class="navbar-menu">
              <div class="navbar-end center mr-1">
                <button className="button is-violet mr-1" onClick={() => this.getMyBets()}>My Bets</button>
                <button className="button button-violet is-text-violet" onClick={() => this.resetCompetition()}>New Bets</button>
              </div>
            </div>
          </nav>
        <header>
          {this.getVue()}
        </header>
      </div>
    );
  }
}

export default App;
