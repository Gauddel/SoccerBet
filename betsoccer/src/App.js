import React from 'react';
import logo from './images/Soccer Bet.png';
import './App.css';
import Competitions from './components/Competitions';
import Bets from './components/Bets';
import Web3Access from './services/Web3Access';
import Home from './components/Home';

require('dotenv').config();

const PAGE = {
  HOME: 'HOME',
  NEWBET: 'NEWBET',
  MYBET: 'MYBET'
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      resetCompetition : null,
      page : PAGE.HOME,
      connected : false // Check if we are connected to metamask plugin.
    }

    this.getCompetitionReset = this.getCompetitionReset.bind(this);
    this.resetCompetitionView = this.resetCompetitionView.bind(this);
    this.getVue = this.getVue.bind(this);
    this.getUnconnectedHomePage = this.getUnconnectedHomePage.bind(this);
    this.getConnectedHomePage = this.getConnectedHomePage.bind(this);
    this.connectToMetamask = this.connectToMetamask.bind(this);
    this.checkDappConnetectToMetamask = this.checkDappConnetectToMetamask.bind(this);
    this.getConnectedActionPage = this.getConnectedActionPage.bind(this);
    this.checkDappConnetectToMetamask();
    //Init Web3 
  }

  checkDappConnetectToMetamask() {
    var callback = (account) => {
      if (account !== undefined) {
        Web3Access.GetInstance();
        this.setState({
          connected : true
        })
        this.forceUpdate()
      }
    }
    Web3Access.checkIfDappConnectedToMetamask(callback);
  }

  resetCompetitionView() {
    this.setState({
      page : PAGE.NEWBET
    });
    if (this.state.resetCompetition !== null) {
      this.state.resetCompetition();
    }
    this.forceUpdate();
  }

  getCompetitionReset(resetFunction) {
    this.setState({
      resetCompetition : resetFunction
    })
  }

  getMyBets() {
    this.setState({
      page : PAGE.MYBET
    })
  }

  getVue() {
    if (this.state.page === PAGE.NEWBET) {
      return (<Competitions getCompetitionReset={this.getCompetitionReset}/>);
    }
    if (this.state.page === PAGE.MYBET) {
      return (<Bets/>);
    }
    return (<Home/>);
  }

  connectToMetamask() {

    Web3Access.GetInstance();
    this.setState({
      connected :true
    })
  }

  getUnconnectedHomePage() {
    return (<div>
      <header className="bg-image bg-cover">
        <div className="flex items-center justify-center">
          <div className="col-start-1 col-end-2 align-middle my-2 mx-8">
            <img className="w-32" src="./SoccerBetNoir.png"/>
          </div>
        </div>
        <div className="flex items-center justify-center">
                      <div className="flex items-center justify-center text-left my-16 py-10 px-16 mx-5">
                              <h1 className="text-xl text-gray-900">
                              <span className="text-2xl font-bold ">Bet against your friends</span>
                                  <br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bet on Big 5 European soccer championship matches
                              </h1>

            </div>
        </div>
        <div className="flex items-center justify-center">
        <button onClick={() => this.connectToMetamask()} className="bg-black border border-vert text-2xl text-vert font-extrabold hover:font-bold hover:text-sm my-8 px-5 py-1 rounded-full ml-2">
        Connect to Metamask
                      </button>
        </div>
        <div className="flex items-center justify-center">
        <svg className="animate-bounce w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
<path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
</svg>
        </div>
      </header>
{this.getVue()}
    </div>)
  }

  getConnectedHomePage() {
    return (
      <div>
        <header className="bg-image bg-cover">
          <div className="flex items-center justify-center">
            <button onClick={() => this.getMyBets()} className="contourVert text-xl text-gray-900 font-extrabold hover:font-bold hover:text-sm py-2 px-16 rounded-full ml-2">
                        My Bets
             </button>
            <div className="col-start-1 col-end-2 align-middle my-2 mx-8">
              <img className="w-24" src="./SoccerBetNoir.png"/>
            </div>
             <button onClick={() => this.resetCompetitionView()} className="contourNoir text-xl text-vert font-extrabold hover:font-bold hover:text-sm py-2 px-16 rounded-full ml-2">
                        New Bets
             </button>
          </div>
          <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center text-left my-20 py-10 px-16 mx-5">
                                <h1 className="text-xl text-gray-900">
                                <span className="text-2xl font-bold ">Bet against your friends</span>
                                    <br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bet on Big 5 European soccer championship matches
                                </h1>

              </div>
          </div>
          <div className="flex items-center justify-center">
          <button onClick={() => this.resetCompetitionView()} className="bg-black border border-vert text-2xl text-vert font-extrabold hover:font-bold hover:text-sm my-8 px-5 py-1 rounded-full ml-2">
          New Bets
                        </button>
          </div>
          <div className="flex items-center justify-center">
          <svg className="animate-bounce w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
  <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
</svg>
          </div>
        </header>
{this.getVue()}
      </div>
    );
  }

  getConnectedActionPage() {
    return (<div>
      <header className="border border-gray-100">
          <div className="flex items-center justify-center">
            <button onClick={() => this.getMyBets()} className="text-lg text-gray-900 font-extrabold hover:font-bold hover:text-sm py-2 px-16 rounded-full ml-2">
                        My Bets
             </button>
            <div className="col-start-1 col-end-2 align-middle mx-8">
              <img className="w-16" src="./SoccerBetNoir.png"/>
            </div>
             <button onClick={() => this.resetCompetitionView()} className="text-lg text-vert font-extrabold hover:font-bold hover:text-sm py-2 px-16 rounded-full ml-2">
                        New Bets
             </button>
          </div>
        </header>
{this.getVue()}
    </div>)
  }

  render() {
    if(this.state.connected && this.state.page !== PAGE.HOME) {
      return (<div>
        {this.getConnectedActionPage()}
      </div>);
    }

    if(this.state.connected) {
      return (<div>
        {this.getConnectedHomePage()}
      </div>)
    }
    return (<div>
      {this.getUnconnectedHomePage()}
    </div>)
  }
}

export default App;
