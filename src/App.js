import React from 'react';
import './App.css';
//import InputField from './Components/InputField'
import Keyboard from './images/keyboard-icon.svg'
import PlayAgain from './images/play-icon.svg'
import cross from './images/cross-icon.svg'
import Game from './Components/Game'

class App extends React.Component {
    constructor(props) {
      super(props);
      this.initialState = {
        gameOn: false,
        playerName: '',
        selectedLevel: 'easy',
        playerNameError: '',
        selectedLevelError: '',
      };
      this.state = { ...this.initialState };
    }
  
    // handles the change in difficulty level select element
  
    setLevel = (event) => {
      const value = event.target.value;
      this.setState({
        selectedLevel: value,
        selectedLevelError: '',
      });
    };
  
    // handles the player name change
  
    onPlayerNameChange = (event) => {
      const value = event.target.value;
      this.setState({
        playerName: value,
        playerNameError: '',
      });
    };
  
    // checks with the name
    validateInput = () => {
      let nameError = '';
      if (this.state.playerName.length === 0) {
        nameError = 'Please enter your name.';
        this.setState({ nameError });
        return false;
      }
      return true;
    };
  
    onStartGame = () => {
      const isValid = this.validateInput();
      if (isValid) {
        this.setState({ gameOn: true });
      }
    };
  
    onStopGame = () => {
      this.setState(this.initialState);
    };
  
    startGameComponent = () => {
      return (
        <div className="game-element">
          <div className="div-title">
            <img src={Keyboard} alt="Fast Fingers" className="img-keyboard"></img>
            <br></br>
            <br></br>
            <h1 className="text">fast fingers</h1>
            <div className="text">------the ultimate typing game------</div>
          </div>
          <div className="">
            <input
              placeholder="Type your name"
              onChange={this.onPlayerNameChange}
              value={this.state.playerName}
              className="input-name"
            ></input>
            <div className="input-error">{this.state.playerNameError}</div>
            
            <select
              className="select-level"
              onChange={this.setLevel}
              defaultValue="easy"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <div className="input-error">{this.state.selectedLevelError}</div>
            <br></br>
            <button className="btn-start-game" onClick={this.onStartGame}>
              <img className="icon-play" src={PlayAgain} alt="" />
              Start Game
            </button>
          </div>
        </div>
      );
    };
  
    render() {
      let startGame;
      let stopGameButton;
      if (this.state.gameOn) {
        startGame = (
          <Game
            playerName={this.state.playerName}
            level={this.state.selectedLevel}
          />
        );
        stopGameButton = (
          <div className="row">
            <div className="col-md-3">
              <div className="start-game-element">
                <button className="btn-quit-game" onClick={this.onStopGame}>
                  <img className="icon-play" src={cross} alt="" />
                  STOP GAME
                </button>
              </div>
            </div>
          </div>
        );
      } else {
        startGame = this.startGameComponent();
        stopGameButton = null;
      }
  
      return (
        <div className="app">
          {startGame}
          {stopGameButton}
        </div>
      );
    }
  }
  
  export default App;
  