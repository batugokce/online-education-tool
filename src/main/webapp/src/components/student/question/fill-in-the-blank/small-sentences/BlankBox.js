import React,{Component} from "react";
import {InputText} from "primereact/inputtext";
import {Message} from "primereact/message";
import {ProgressSpinner} from "primereact/progressspinner";

let timer;
// Class to design fill in the blank type question inside assignment page
export default class BlankBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedAnswer: undefined,
            isLoading: true,
            isSaved:false,
            newAnswer: ""
        };
    }

    componentDidMount() {
        if (this.props.questionField.studentAnswer!==""){
            this.setState( {
                selectedAnswer: this.props.questionField.studentAnswer,
                newAnswer: this.props.questionField.studentAnswer,
            });
            timer = setInterval(this.saveAnswer
                , 15000)
        }
        this.setState({
            isLoading: false
        })
    }

    saveAnswer=()=> {
        if(this.state.selectedAnswer !== this.state.newAnswer){
            this.props.saveAnswer();
            this.setState({
                isSaved:true
            })
        }
        //clearInterval(timer);
        this.setState( {
            selectedAnswer: this.state.newAnswer,
        });
    }

    saveWhenBlur=(answer)=> {
        this.props.questionField.studentAnswer = answer;
        this.setState({
            newAnswer: answer,
            selectedAnswer: answer,
            isSaved:true
        })
        this.props.saveAnswer();
    }

    handleState=(answer)=> {
        this.props.questionField.studentAnswer = answer;
        this.setState({
            newAnswer: answer,
        })
    }

    render() {
        let fields = this.props.questionField.questionText.split('#*#');
        let firstPart = fields[0];
        let secondPart = fields[1];
        return (this.state.isLoading ?
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <ProgressSpinner className="p-d-block p-mx-auto"  style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                </div>
                :
            <div style={{ padding: '.5em'}}>
                <div>
                    <p>
                        {this.props.indexNumber}-) {firstPart}
                        <InputText style={{ marginLeft: "auto" }}  value={this.state.newAnswer} disabled={this.props.isSubmitted} onBlur={(e) => this.saveWhenBlur( e.target.value)} onChange={(e) => this.handleState(e.target.value)}  />
                        {secondPart}
                    </p>
                </div>
                {
                    this.props.isSubmitted && (this.props.questionField.correctAnswer!==null) && (this.props.questionField.answer===this.props.questionField.studentAnswer) ?
                        <div className="p-col-50 p-md-50">
                            <Message severity="success" text="CORRECT" />
                        </div>
                        :
                        this.props.isSubmitted && (this.props.questionField.correctAnswer!==null) && (this.props.questionField.answer!==this.props.questionField.studentAnswer) &&
                        <div className="p-col-50 p-md-50">
                            <Message severity="error" text={"Correct choice: "+this.props.questionField.answer} />
                        </div>
                }
            </div>
        )
    }
};
