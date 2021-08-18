import React,{Component} from "react";
import {InputTextarea} from "primereact/inputtextarea";
import {Message} from "primereact/message";
import {ProgressSpinner} from "primereact/progressspinner";

// Class to design ordering question related answers inside assignment page
export default class MultipleChoiceBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedAnswer:  undefined,
            isLoading: true,
            isSaved:false
        };
    }

    componentDidMount() {
        if (this.props.questionField.studentOrder!==null){
            this.setState( {
                selectedAnswer: this.props.questionField.studentOrder,
            });
        }
        this.setState({
            isLoading: false
        })
    }

    saveAnswer=(answer)=> {
        //this.props.saveAnswer(answer, this.props.questionField.id, this.props.questionField.correctOrder===answer);
        this.props.questionField.studentOrder = answer;
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
                <div>
                    <span>
                        <div style={{ display: "flex" }}>
                        {this.props.questionField.text}
                        <InputTextarea style={{ marginLeft: "auto" }}  value={this.state.selectedAnswer} disabled={this.props.isSubmitted} onChange={(e) => this.saveAnswer( e.target.value)} rows={1} cols={1} autoResize />
                        </div>
                        {
                            this.props.isSubmitted && (this.props.questionField.correctOrder!==null) && (this.props.questionField.correctOrder===this.props.questionField.studentOrder) ?
                            <div className="p-col-50 p-md-50">
                                <Message severity="success" text="CORRECT" />
                            </div>
                            :
                            this.props.isSubmitted && (this.props.questionField.correctOrder!==null) && (this.props.questionField.correctOrder!==this.props.questionField.studentOrder) &&
                            <div className="p-col-50 p-md-50">
                                <Message severity="error" text={"Correct choice : "+ this.props.questionField.correctOrder} />
                            </div>
                        }
                    </span>
                </div>
            </div>);
    }
};
