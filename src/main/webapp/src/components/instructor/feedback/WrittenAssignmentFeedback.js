import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, {Component} from 'react';
import InstructorNavbar from "../InstructorNavbar";
import {Col, Divider, Row} from "antd";
import {ProgressSpinner} from "primereact/progressspinner";
import {ScrollPanel} from "primereact/scrollpanel";
import {Toast} from "primereact/toast";
import {Editor} from "primereact/editor";
import axios from "axios";
import authHeader from "../../service/authHeader";
import sanitizeHtml from "sanitize-html";
import Container from "react-bootstrap/Container";
import {InputText} from "primereact/inputtext";
import {Message} from "primereact/message";

export default class WrittenAssignmentFeedback extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show:false,
            setShow:false,
            newFeedback:"",
            isLastFeedbackGiven:false,
            lastFeedback:"",
            writtenAssignment:undefined,
            writtenAssignmentText:"",
            grade : 0,
            progressiveGrading:false,
            graded:false,
            isLoading:true,
            feedbackVersion:null
        };
    }

    componentDidMount() {
        this.getWrittenAssignment();
    }

    getWrittenAssignment=()=>{
        axios.get("/api/v1/answer/writtenAssignment/"+ this.props.match.params.articleId +"/" + this.props.match.params.username, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                console.log(responseObject)
                if (responseObject.type === "success") {
                    let writtenAssignment= responseObject.data;
                    this.setState({
                        writtenAssignment: writtenAssignment,
                        writtenAssignmentText: writtenAssignment.writtenAnswer.text,
                        newFeedback:writtenAssignment.writtenAnswer.instructorFeedback,
                        progressiveGrading: writtenAssignment.writtenAnswer.progressiveGrading,
                        grade:writtenAssignment.writtenAnswer.point,
                        graded:writtenAssignment.writtenAnswer.graded,
                        feedbackVersion: writtenAssignment.writtenAnswer.feedbackVersion,
                        isCompleted: writtenAssignment.isCompleted,
                        point: writtenAssignment.point,
                        isLastFeedbackGiven:writtenAssignment.isLastFeedbackGiven,
                        lastFeedback:writtenAssignment.lastFeedback,
                        isLoading: false
                    })
                }
                else if (responseObject.type === "error") {
                    console.log("error while fetching written assignment")
                }
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
            })
    }

    redirectToAssignments = () => {
        this.props.history.push("/instructor/assignments")
    }

    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
    }

    submitFeedback=()=>{
        let articleId = this.state.writtenAssignment.articleId;
        let instructorUsername = localStorage.getItem("username");
        let studentUsername = this.state.writtenAssignment.username;
        let writtenAssignment = {
            articleId: articleId,
            title: this.state.writtenAssignment.title,
            username: studentUsername,
            graded: (this.state.grade > 0.0),
            point: this.state.grade,
            feedbackGiven: this.state.newFeedback,
            feedbackVersion: this.state.feedbackVersion+1
        }
        console.log(writtenAssignment)

        axios.post("/api/v1/answer/writtenAssignment/"+ articleId +"/" + instructorUsername + "/" +studentUsername, writtenAssignment,{headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                console.log(responseObject);
                this.showToast(responseObject.type, responseObject.message);

            })
            .catch(e => {
                //console.log(e.response);
            });
    }

    handleFeedback=(feedback)=> {
        this.setState( {
            newFeedback: feedback,
        });
    }

    saveGrade=(e)=> {
        if(e.target.value > this.state.point) {
            this.showToast("error", "The grade should not be greater than max grade!");
        } else {
            this.setState({grade: e.target.value});
        }
    }


    render() {
        const sanitizationOptions = {
            allowedTags: [ 'p','h2','h1','strong','span','em','u','ol','ul','li','img'],
            allowedAttributes: {
                'span': [ 'class','style' ],
                'img': ['src', 'width']
            },
            allowedSchemes: [
                'data'
            ]
        }

        let cleanHtmlForLastFeedback;
        if (this.state.isLastFeedbackGiven) cleanHtmlForLastFeedback = sanitizeHtml(this.state.lastFeedback, sanitizationOptions);
        let cleanHtmlForFirstFeedback;
        if (this.state.newFeedback.length > 0) cleanHtmlForFirstFeedback = sanitizeHtml(this.state.newFeedback, sanitizationOptions);
        const cleanHtmlForWrittenAnswer = sanitizeHtml(this.state.writtenAssignmentText, sanitizationOptions);

        let feedback = this.state.isLastFeedbackGiven ? this.state.lastFeedback :this.state.newFeedback;
        return(
            <div>
                <InstructorNavbar/>
                <div  style={{margin: 24}}>
                    <Row style = {{height:"100vh"}}>
                        <Col style = {{margin:24}}>
                            <Row>
                                <Col span={11}>
                                    <h2>STUDENT ANSWER</h2>
                                </Col>
                            </Row>
                            <br/>
                            {this.state.isLoading ?
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100vh'
                                }}>
                                    <ProgressSpinner className="p-d-block p-mx-auto"
                                                     style={{width: '50px', height: '50px'}} strokeWidth="8"
                                                     fill="#EEEEEE" animationDuration=".8s"/>
                                </div>
                                : !this.state.isCompleted
                                    ?   <Message severity="warn"
                                                 text={"When the student completed the second draft, it will be available."}/>
                                    : <Row className="scrollpanel">
                                        <div className="card">
                                            <ScrollPanel style={{height: "60vh", width:'650px'}} className="custombar1">
                                                <div dangerouslySetInnerHTML={{ __html: cleanHtmlForWrittenAnswer }} />
                                            </ScrollPanel>
                                        </div>
                                    </Row> }

                        </Col>
                        <Col style = {{height:"100vh"}}>
                            <Divider type="vertical" style={{ height: "90%" }} />
                        </Col>
                        <Col style = {{margin:24}}>
                            <div className="top">
                                <h2>FEEDBACK</h2>

                            </div>
                            <br/>
                            {this.state.progressiveGrading && (this.state.feedbackVersion === 0) &&
                            <Message severity="info"
                                     text={"You have chosen Progressing Grading as the grading option. After student submits their last submission, you will be able to grade."}/>
                            }
                            {this.state.progressiveGrading && (this.state.feedbackVersion === 3) &&this.state.isLastFeedbackGiven && this.state.lastFeedback.length > 0
                                ?  <Row className="scrollpanel">
                                    <div className="card" style={{width:"600px"}} >
                                        <ScrollPanel style={{height: "50vh"}} className="custombar1">
                                            <div style={{margin: 24}}>
                                                <h5  >Your Feedback For First Draft: </h5>
                                                <p dangerouslySetInnerHTML={{ __html: cleanHtmlForFirstFeedback }}/>
                                                <h5 >Your Feedback For Last Draft: </h5>
                                                <p dangerouslySetInnerHTML={{ __html: cleanHtmlForLastFeedback }}/>
                                            </div>
                                        </ScrollPanel>
                                    </div>
                                </Row>
                                : (!this.state.isCompleted
                                ?  null
                                : <div>
                                    <Row className="scrollpanel">
                                        <div className="card">
                                            <Editor readOnly={this.state.isLastFeedbackGiven} style={{height: '320px'}} value= {feedback}
                                                    onTextChange={(e) => this.handleFeedback(e.htmlValue)}/>
                                        </div>
                                    </Row>
                                    <br/>
                                </div>)
                            }
                            {this.state.progressiveGrading===false || (this.state.progressiveGrading && this.state.isCompleted && (this.state.feedbackVersion >= 1)) ?
                                <Container className={"mt-3"} style={{"maxWidth": "1600px"}}>
                                    {this.state.graded ? <p> You have already graded this assignment. </p> :<p> You can now grade it.</p>}
                                    <Row className={"my-2"} >
                                        <Col sm={{offset: "0", span: "3"}}  >
                                            <strong>Grade:</strong>
                                        </Col>
                                        <Col sm={{offset: "0", span: "7"}}>
                                            <InputText disabled = {this.state.graded} type="number" className="p-inputtext-sm p-d-block p-mb-2" value={this.state.grade} onChange={e => this.saveGrade(e)} />
                                        </Col>
                                        <Col sm={{offset: "0", span: "9"}}>
                                            / {this.state.point}
                                        </Col>
                                    </Row>
                                </Container>
                                : null
                            }
                            <br/>
                            <br/>
                            <div style={{ display: "flex" }} className={"mb-5"} >
                                <button onClick={()=>this.redirectToAssignments()} className="btn btn-secondary">
                                    Back to Assignments
                                </button>
                                &nbsp;
                                {!this.state.isCompleted
                                    ? null
                                    : (this.state.graded ? null
                                        : <button  onClick={() => this.submitFeedback()}
                                                 className="btn btn-primary">
                                            Submit
                                        </button>)

                                }
                            </div>
                            <br/>
                        </Col>
                    </Row>
                    <Toast ref={(el) => this.toast = el} />
                </div>
            </div>




        );
    }
}