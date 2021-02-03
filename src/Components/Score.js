import React from 'react';

export default class Score extends React.Component {
  constructor(props) {
    super(props);
    this.state = { gameOver: props.gameOn, currentScore: 0 };
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.updateScore('from did mount');
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  
  updateScore = (message) => {
    this.setState({ currentScore: this.state.currentScore + 1 }, () => {
      this.props.setScore(this.state.currentScore - 1);
    });
  };

  render() {
    return (
      <span>
        {`SCORE: ${this.props.convertSecondsToMMSS(this.state.currentScore)}`}
      </span>
    );
  }
}
