import React,{Component} from "react";
import { RadioButton } from 'primereact/radiobutton';
import {Message} from "primereact/message";
import {ProgressSpinner} from "primereact/progressspinner";

// Class to design multiple choice question related answers inside assignment page
export default class MultipleChoiceBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedAnswer: undefined,
            isLoading: true,
            isSaved:false
        };
    }

    componentDidMount() {
        if (this.props.questionField.studentAnswer!==""){
            this.setState( {
                selectedAnswer: this.props.questionField.studentAnswer,
            });
        }
        this.setState({
            isLoading: false
        })
    }

    saveAnswer=(answer)=> {
        //this.props.saveAnswer(answer, this.props.questionField.id);
        this.props.questionField.studentAnswer = answer;
        //console.log(this.props.questionField);
        this.props.saveAnswer();
        this.setState({
            selectedAnswer:answer,
            isSaved:true
        })
    }

    render() {
        return (  this.state.isLoading ?
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <ProgressSpinner className="p-d-block p-mx-auto"  style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                </div>
                :
            <div style={{ padding: '.5em'}}>

                <div  className="p-field-radiobutton">
                    <RadioButton  name="questionField" value={this.props.questionField.option1}  disabled={this.props.isSubmitted} onChange={(e) => this.saveAnswer(e.value)} checked={this.state.selectedAnswer===this.props.questionField.option1}/>
                    <label >{this.props.questionField.option1}</label>
                </div>

                <div  className="p-field-radiobutton">
                    <RadioButton  name="questionField" value={this.props.questionField.option2}  disabled={this.props.isSubmitted} onChange={(e) => this.saveAnswer(e.value)} checked={this.state.selectedAnswer===this.props.questionField.option2}/>
                    <label >{this.props.questionField.option2}</label>
                </div>

                {this.props.questionField.option3 &&
                <div className="p-field-radiobutton">
                    <RadioButton name="questionField" value={this.props.questionField.option3}
                                 disabled={this.props.isSubmitted} onChange={(e) => this.saveAnswer(e.value)}
                                 checked={this.state.selectedAnswer === this.props.questionField.option3}/>
                    <label>{this.props.questionField.option3}</label>
                </div>
                }

                {this.props.questionField.option4 &&
                <div  className="p-field-radiobutton">
                    <RadioButton  name="questionField" value={this.props.questionField.option4}  disabled={this.props.isSubmitted} onChange={(e) => this.saveAnswer(e.value)} checked={this.state.selectedAnswer===this.props.questionField.option4}/>
                    <label >{this.props.questionField.option4}</label>
                </div>
                }

                {this.props.questionField.option5 &&
                <div  className="p-field-radiobutton">
                    <RadioButton  name="questionField" value={this.props.questionField.option5}  disabled={this.props.isSubmitted} onChange={(e) => this.saveAnswer(e.value)} checked={this.state.selectedAnswer===this.props.questionField.option5}/>
                    <label >{this.props.questionField.option5}</label>
                </div>
                }
                {
                    this.props.isSubmitted && (this.props.questionField.correctAnswer!==null) && (this.props.questionField.correctAnswer===this.props.questionField.studentAnswer) ?
                    <div className="p-col-50 p-md-50">
                        <Message severity="success" text="CORRECT" />
                    </div>
                    :
                    this.props.isSubmitted && (this.props.questionField.correctAnswer!==null) && (this.props.questionField.correctAnswer!==this.props.questionField.studentAnswer) &&
                    <div className="p-col-50 p-md-50">
                        <Message severity="error" text={"Correct choice: "+this.props.questionField.correctAnswer} />
                    </div>
                }

            </div>
        )
    }
};
