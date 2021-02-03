import React from 'react';

import CountDownTimer from './CountdownTimer';
import Score from './Score';
import data from '../data/dictionary.json';

import person from '../images/person-icon.svg';
import gamepad from '../images/gamepad-icon.svg';
import keyboard from '../images/keyboard-icon.svg';
import reload from '../images/reload-icon.svg';
import '../css/Game.css';
export default class Game extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      currentWord: '',
      userInput: '',
      startTimer: false,
      level: this.props.level,
      difficultyFactor: null,
      words: {},
      timeForWord: 10,
      gameOver: false,
      currentScore: 0,
    };

    this.state = { ...this.initialState };
    this.scoreList = [];
    this.highScore = 0;
    this.highScoreIndex = 0;
  }

  componentDidMount() {
    const easyWords = [];
    const mediumWords = [];
    const hardWords = [];

    for (let word of data) {
      if (word.length <= 4) {
        easyWords.push(word);
      } else if (word.length <= 8) {
        mediumWords.push(word);
      } else {
        hardWords.push(word);
      }
    }
    const words = { easy: easyWords, medium: mediumWords, hard: hardWords };

    let difficultyFactor;

    if (this.state.level === 'easy') {
      difficultyFactor = 1;
    } else if (this.state.level === 'medium') {
      difficultyFactor = 1.5;
    } else {
      difficultyFactor = 2;
    }

    const newWord = this.getNewWord(words, difficultyFactor);
    let timeForWord = Math.round(newWord.length / difficultyFactor);
    timeForWord = Math.max(timeForWord, 2);

    this.setState({
      startTimer: true,
      words: words,
      currentWord: newWord,
      difficultyFactor: difficultyFactor,
      timeForWord: timeForWord,
    });
  }

  getNewWord = ({ easy, medium, hard }, difficultyFactor = null) => {
    if (difficultyFactor >= 1.5 && difficultyFactor < 2) {
      const random = Math.round(Math.random() * (medium.length - 1));
      return medium[random].toUpperCase();
    }
    if (difficultyFactor < 1.5) {
      const random = Math.round(Math.random() * (easy.length - 1));
      return easy[random].toUpperCase();
    }
    const random = Math.round(Math.random() * (hard.length - 1));
    return hard[random].toUpperCase();
  };

  onUserInputChange = (event) => {
    const value = event.target.value.toUpperCase();
    if (value === this.state.currentWord) {
      const difficultyFactor = this.state.difficultyFactor + 0.01;

      let level;
      if (difficultyFactor >= 2) level = 'hard';
      else if (difficultyFactor < 1.5) level = 'easy';
      else level = 'medium';

      const newWord = this.getNewWord(this.state.words, difficultyFactor);
      let timeForWord = Math.round(newWord.length / difficultyFactor);
      timeForWord = Math.max(timeForWord, 2);

      this.setState({
        currentWord: newWord,
        userInput: '',
        timeForWord: timeForWord,
        level: level,
        difficultyFactor: parseFloat(difficultyFactor.toFixed(2)),
      });
    } else {
      this.setState({ userInput: value });
    }
  };
  convertSecondsToMMSS = (seconds) => {
    let mm = Math.floor(seconds / 60);
    let ss = seconds % 60;
    if (ss < 10) {
      ss = `0${ss}`;
    }
    if (mm < 10) {
      mm = `0${mm}`;
    }
    return `${mm}:${ss}`;
  };

  setScore = (value) => {
    this.setState({ currentScore: value });
  };
  onGameOver = () => {
    this.scoreList.push(this.state.currentScore);
    if (this.state.currentScore >= this.highScore) {
      this.highScore = this.state.currentScore;
      this.highScoreIndex = this.scoreList.length - 1;
    }
    this.setState({ gameOver: true });
  };

  onPlayAgain = () => {
    this.setState(this.initialState, this.componentDidMount);
  };
  getCurrentWordComponent = () => {
    const wordCharacters = this.state.currentWord.split('');
    const userInputCharacters = this.state.userInput.split('');
    return (
      <div className="new-word">
        {wordCharacters.map((char, i) => {
          let color;
          if (i < this.state.userInput.length) {
            color = char === userInputCharacters[i] ? '#54ba18' : '#445298';
          }
          return (
            <span key={i} style={{ color: color }}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  getScoreList = () => {
    if (this.scoreList.length === 0) {
      return;
    }
    const scoresList = this.scoreList.map((score, i) => (
      <div key={i}>
        <p className="high-score-text">
          {this.highScoreIndex === i ? 'Personal Best' : null}
        </p>
        <p className="text-white">{`Game ${i + 1}: ${this.convertSecondsToMMSS(
          score
        )}`}</p>
      </div>
    ));
    return scoresList;
  };

  render() {
    // if creating three arrays takes time

    let timerComponent;
    if (this.state.startTimer) {
      timerComponent = (
        <CountDownTimer
          timeForWord={this.state.timeForWord}
          onGameOver={this.onGameOver}
          word={this.state.currentWord}
        />
      );
    } else timerComponent = <h3 className="text">Loading...</h3>;

    // high Score check
    const newHighScore =
      this.highScore === this.state.currentScore ? (
        <h3 className="text-white">New High Score!</h3>
      ) : null;


    let gameControls;

    let scoreComponent;

    if (this.state.gameOver) {
      gameControls = (
        <div className="text-center text-white">
          <h1>Game Over!</h1>
          <br></br>
          <h1>Your Score</h1>
          <br></br>
          <h1>{this.convertSecondsToMMSS(this.state.currentScore)}</h1>
          <br></br>
          {newHighScore}
          <br></br>
          <button className="btn-play-again" onClick={this.onPlayAgain}>
            <img className="icon-play-again" src={reload} alt="" />
            Play Again
          </button>
        </div>
      );

      scoreComponent = (
        <span>{`SCORE: ${this.convertSecondsToMMSS(
          this.state.currentScore
        )}`}</span>
      );
    } else {
      gameControls = (
        <div className="div-timer text-center">
          <div className="timer">{timerComponent}</div>
          <br></br>
          {this.getCurrentWordComponent()}
          <br></br>
          <input
            value={this.state.userInput}
            onChange={this.onUserInputChange}
            className="input-box"
            autoFocus
          ></input>
          <br></br>
        </div>
      );

      scoreComponent = (
        <Score
          convertSecondsToMMSS={this.convertSecondsToMMSS}
          gameOver={this.state.gameOver}
          setScore={this.setScore}
        />
      );
    }

    return (
      <div>
        <div className="row">
          <div className="col-md-9 mb-2 left-align">
            <h3 className="text text-heading">
              <img className="icon-player" src={keyboard} alt="Player" />
              Fast Fingers
            </h3>

            <br />
            <div className="text text-heading">
              <img className="icon-player" src={gamepad} alt="Player" />
              {`LEVEL: ${this.state.level.toUpperCase()}`}
            </div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="text text-heading">
              <img className="icon-player" src={person} alt="Player" />
              {this.props.playerName}
            </div>
            <br />

            <div className="text text-heading">{scoreComponent}</div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-3 mb-3">
            <div className="text-center">
              <div className="scores-box">
                <div className="mt-2">
                  <h5 className="text mb-2">Score Board</h5>
                  <hr />
                  {this.getScoreList()}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">{gameControls}</div>
        </div>
      </div>
    );
  }
}
