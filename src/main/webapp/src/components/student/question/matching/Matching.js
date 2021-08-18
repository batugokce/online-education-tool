import React, {Component} from "react";
import {Message} from "primereact/message";
import {Dropdown} from 'primereact/dropdown';
import "./matching.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

// Class to design matching question related answers inside assignment page
export default class Matching extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rightSelectItems: [],
            rightPart: ""
        };
    }

    componentDidMount() {
        if (this.props.questionField.studentAnswer!==""){
            this.setState( {
                rightPart: this.props.questionField.studentRightPart
            });
        }
        let selectItems = this.props.rightArray.map(function (item) {
            return {"label": item, "value": item};
        })
        this.setState({
            rightSelectItems: selectItems
        })
    }

    saveAnswer=(answer)=> {
        this.props.questionField.studentRightPart = answer;
        this.props.saveAnswer();
    }

    render() {


        return (
            <Form.Group as={Row} controlId={this.props.questionField.number} className={"my-4"} style={{ padding: '.5em'}}>
                <Form.Label column sm="3">
                    {this.props.questionField.number.toString() + ') ' + this.props.questionField.leftPart}
                </Form.Label>
                <Col sm="9">
                    <div className={"dropdown-demo"}>
                    <Dropdown disabled={this.props.isSubmitted} value={this.state.rightPart} options={this.state.rightSelectItems}
                              onChange={(e) => {this.setState({rightPart: e.value}); this.saveAnswer( e.value);}}
                              placeholder="Select an option"  />
                    </div>
                </Col>
                    {
                        this.props.isSubmitted && (this.props.questionField.rightPart!==null) && (this.props.questionField.rightPart===this.props.questionField.studentRightPart) ?
                            <div className="p-col-50 p-md-50">
                                <Message severity="success" text="CORRECT" />
                            </div>
                            :
                            this.props.isSubmitted && (this.props.questionField.rightPart!==null) && (this.props.questionField.rightPart!==this.props.questionField.studentRightPart) &&
                            <div className="p-col-50 p-md-50">
                                <Message severity="error" text={"Correct choice : "+ this.props.questionField.rightPart} />
                            </div>
                    }

            </Form.Group>);
    }
};
