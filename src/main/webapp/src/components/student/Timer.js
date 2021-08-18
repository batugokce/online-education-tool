import React, {Component} from 'react';
import './ScrollPanel.css';


class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            minutes: 0,
            seconds: 0,
            hours: 0
        }
    }

    componentDidMount() {
        this.setState({
            minutes: this.props.minutes,
            seconds: this.props.seconds,
            hours: this.props.hours
        })
        this.myInterval = setInterval(() => {
            if (!this.props.isQuizFinished) {
                this.setState({
                    seconds: this.state.seconds + 1
                })
                if (this.state.seconds === 60) {
                    this.setState(({minutes}) => ({
                        minutes: minutes + 1,
                        seconds: 0
                    }))
                }
                if (this.state.minutes === 60) {
                    this.setState(({hours}) => ({
                        hours: hours + 1,
                        minutes: 0
                    }))
                }
            }
        }, 1000)
    }

    showTime = () => {
        return (
            !this.props.isQuizFinished ?
                <div style={{display: "flex"}}>
                    <h3 style={{marginLeft: "auto"}}>{this.state.hours}:{this.state.minutes < 10 ? '0' + this.state.minutes : this.state.minutes}:{this.state.seconds < 10 ? '0' + this.state.seconds : this.state.seconds}</h3>
                </div>
                : <h3> Total
                    Time: {this.state.hours} hour {this.state.minutes} min {this.state.seconds < 10 ? '0' + this.state.seconds : this.state.seconds} sec</h3>
        );
    }

    toggle = () => {
        const timer = document.getElementById('timer');
        timer.style.display = timer.style.display === "none" ? "block" : "none";
    }

    render() {
        return (
            <div>
                <div id="timer">
                    {this.showTime()}
                </div>
                <button className="toggle-button" onClick={this.toggle}>
                    hide / show
                </button>
            </div>
        );
    }
}

export default Timer;