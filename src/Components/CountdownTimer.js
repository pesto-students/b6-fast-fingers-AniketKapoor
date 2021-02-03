import React from 'react';

import '../css/CoundownTimer.css';

export default class CountdownTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: props.timeForWord,
      prevWordTime: props.timeForWord,
      maxTimer: 10,
      currentScore: 0,
    };
    this.timer = null;
    this.timerRef = React.createRef();
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.decrementTimeRemaining();
    }, 1000);
  }

  // the words are coming in from the parent(Game) component
  // here checking if a new word has come.
  // if and only if a new word comes in the props, then this component should update

  componentDidUpdate(prevProps) {
    if (prevProps.word !== this.props.word) {
      if (this.timer !== null) clearInterval(this.timer);
      const score = this.state.prevWordTime - this.state.timeLeft;
      this.timer = setInterval(() => {
        this.decrementTimeRemaining();
      }, 1000);

      this.timerRef.current.setAttribute('stroke-dasharray', '283 283');

      this.setState({
        timeLeft: this.props.timeForWord,
        currentScore: this.state.currentScore + score,
        prevWordTime: prevProps.timeForWord,
      });
    }
  }

  // added because of the error
  // canceling subscription of all timers

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // decrements the time you see inside the countdown timer
  // also handles gameOver scenario
  // clears the set interval when game over condition occurs

  decrementTimeRemaining = () => {
    if (this.state.timeLeft > 0) {
      this.setState(
        {
          timeLeft: this.state.timeLeft - 1,
        },
        () => {
          this.setCircleDasharray();
        }
      );
    } else {
      clearInterval(this.timer);
      this.props.onGameOver();
    }
  };

  renderTime = (time) => {
    let seconds = time % 60;

    return `${seconds}`;
  };

  calculateTimeFraction = () => {
    return this.state.timeLeft / this.props.timeForWord;
  };
  // this makes the countdown timer animation move

  setCircleDasharray = () => {
    const circleDasharray = `${(this.calculateTimeFraction() * 360).toFixed(
      0
    )} 360`;
    if (this.timerRef && this.timerRef.current) {
      this.timerRef.current.setAttribute('stroke-dasharray', circleDasharray);
    }
  };

  render() {
    return (
      <div className="base-timer">
        <svg
          className="base-timer__svg"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="base-timer__circle">
            <circle
              className="base-timer__path-elapsed"
              cx="50"
              cy="50"
              r="45"
            />
            <path
              ref={this.timerRef}
              id="base-timer-path-remaining"
              strokeDasharray="360"
              className="base-timer__path-remaining"
              d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
            ></path>
          </g>
        </svg>
        <span className="base-timer__label">
          {this.renderTime(this.state.timeLeft)}
        </span>
      </div>
    );
  }
}
