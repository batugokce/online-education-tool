import React,{Component} from "react";
import { RadioButton } from 'primereact/radiobutton';
import {Message} from "primereact/message";
import {ProgressSpinner} from "primereact/progressspinner";

// Class to design t-f question related answers inside assignment page
export default class TrueFalseBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedAnswer: undefined,
            isLoading: true,
            isSaved:false
        };
    }

    componentDidMount() {
        if (this.props.questionField.studentAnswer!==null) {
            if (this.props.questionField.studentAnswer === 1) {
                this.setState( {
                    selectedAnswer: "T",
                });
            }
            else if (this.props.questionField.studentAnswer === 0) {
                this.setState( {
                    selectedAnswer: "F",
                });
            }
        }
        this.setState({
            isLoading: false
        })
    }

    saveAnswer=(answer)=> {
        //this.props.saveAnswer(answer, this.props.questionField.id, correct===answer);
        let booleanAnswer =  answer === "T" ? 1 : 0;
        this.props.questionField.studentAnswer = booleanAnswer;
        //console.log(this.props.questionField)
        this.props.saveAnswer();
        this.setState({
            selectedAnswer:answer,
            isSaved:true
        })
    }

    render() {
        return (
            this.state.isLoading ?
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <ProgressSpinner className="p-d-block p-mx-auto"  style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                </div>
                :
            <div style={{ padding: '.5em'}}>
                <div  className="p-field-radiobutton">
                    <RadioButton  name="questionField" value="T"  disabled={this.props.isSubmitted} onChange={(e) => this.saveAnswer(e.value)} checked={this.state.selectedAnswer==="T"}/>
                    <label >T</label>
                </div>

                <div  className="p-field-radiobutton">
                    <RadioButton  name="questionField" value="F"  disabled={this.props.isSubmitted} onChange={(e) => this.saveAnswer(e.value)} checked={this.state.selectedAnswer==="F"}/>
                    <label >F</label>
                </div>
                {
                    this.props.isSubmitted && (this.props.questionField.correctAnswer!==null) && (this.props.questionField.correctAnswer===this.props.questionField.studentAnswer) ?
                    <div className="p-col-50 p-md-50">
                        <Message severity="success" text="CORRECT" />
                    </div>
                    :
                    this.props.isSubmitted && (this.props.questionField.correctAnswer!==null) && (this.props.questionField.correctAnswer!==this.props.questionField.studentAnswer) &&
                    <div className="p-col-50 p-md-50">
                        <Message severity="error" text={this.props.questionField.correctAnswer ? "Correct choice : T" : "Correct choice : F"} />
                    </div>
                }
            </div>
        )
    }
};
