import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, {Component} from "react";
import {withRouter} from 'react-router-dom';
import {Col, Row} from "antd";
import "antd/dist/antd.css";
import {ArticleScrollPanel} from "./article/ArticleScrollPanel";
import {ScrollPanel} from "primereact/scrollpanel";
import './ScrollPanel.css';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import {Toast} from 'primereact/toast';
import Draggable from 'react-draggable';
import authHeader from "../service/authHeader";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Timer from "./Timer";
import TranslationWindow from "./TranslationWindow";
import {ProgressSpinner} from "primereact/progressspinner";
import {Section} from "./question/Section";
import {Quiz} from "./question/Quiz";
import DisplayDefinitions from "./DisplayDefinitions";
import StudentNavbar from "./StudentNavbar";
import CambridgeDictionary from "./CambridgeDictionary";
import sanitizeHtml from "sanitize-html";
import Dictionary from "./Dictionary";
import Loading from "../service/Loading";
import {Container} from "react-bootstrap";

class AssignmentPage extends Component {
    constructor() {
        super();
        this.state = {
            minutes: 0,
            seconds: 0,
            hour: 0,
            isQuizFinished: false,
            studentId: 12,
            articleId: null,
            assignment: null,
            answerSections: [],
            sectionArray: [],
            isWrittenGraded: false,
            article: null,
            articleTitle: "",
            show: false,
            setShow: false,
            correctAnswersAndQuiz: null,
            pointDTO: null,
            message: "",
            isLoading: true,
            isLoadingQuiz: false,
            multipleChoicePoint: null,
            trueFalsePoint: null,
            orderingPoint: null,
            matchingPoint: null,
            gapFillingPoint: null,
            lastSavedTime: null,
            definitions: [],
            estimatedTime: 1,
            feedback: null,
            ttserror: false
        };
    }

    redirectToStudentHome = () => {
        this.props.history.push("/student/home")
    }
    redirectToLogin = () => {
        this.props.history.push("/")
    }

    componentDidMount() {
        this.retrieveQuestionsAndArticle();
        this.getFeedback();
    }
    
    componentWillUnmount() {
        speechSynthesis.cancel();
    }

    retrieveQuestionsAndArticle = () => {
        if (this.props.match.params.userName !== undefined) {
            axios.post("/api/v1/review/getAssignmentById/" + this.props.match.params.assignmentID + "/" + this.props.match.params.userName, {}, {headers: authHeader()})
                .then(response => {
                    if (response.data.type === "error") {
                        this.redirectToStudentHome();
                    } else if (response.data.type === "warn") {
                        if (response.data.data.article.timeTaken != null) {
                            let secondsDB = response.data.data.article.timeTaken;
                            this.updateTimer(secondsDB);
                        }
                        this.setState({
                            articleId: response.data.data.article.id,
                            correctAnswersAndQuiz: response.data.data.article.sections,
                            pointDTO: response.data.data.pointDTO,
                            message: response.data.message,
                            article: response.data.data.article.text.text,
                            articleTitle: response.data.data.article.text.title,
                            isQuizFinished: true,
                        })
                        this.setState({sectionArray: []})
                        this.state.correctAnswersAndQuiz.forEach(section => this.classifyCorrectAnswers(section));
                        this.setState({isLoading: false})
                    } else {
                        if (response.data.data.timeTaken != null) {
                            let secondsDB = response.data.data.timeTaken;
                            this.updateTimer(secondsDB);
                        }
                        this.setState({
                            studentId: response.data.data.studentId,
                            articleId: response.data.data.articleId,
                            answerSections: response.data.data.answerSections,
                            assignment: response.data.data,
                            article: response.data.data.articleText.text,
                            articleTitle: response.data.data.articleText.title,
                            lastSavedTime: response.data.data.lastSavedDate
                        })
                        this.state.answerSections.forEach(section => this.classify(section));

                        this.setState({
                            isLoading: false,
                        })
                    }
                })
                .catch(e => {
                    if (e.response.status && e.response.status === 403) {
                        this.redirectToLogin();
                    }

                });

        } else {
            let username = localStorage.getItem("username");
            axios.post("/api/v1/answer/startAssignment/" + this.props.match.params.assignmentID + "/" + username, {}, {headers: authHeader()})
                .then(response => {
                    if (response.data.type === "error") {
                        this.redirectToStudentHome();
                    } else if (response.data.type === "warn") {
                        if (response.data.data.article.timeTaken != null) {
                            let secondsDB = response.data.data.article.timeTaken;
                            this.updateTimer(secondsDB);
                        }
                        this.setState({
                            articleId: response.data.data.article.id,
                            correctAnswersAndQuiz: response.data.data.article.sections,
                            pointDTO: response.data.data.pointDTO,
                            message: response.data.message,
                            article: response.data.data.article.text.text,
                            articleTitle: response.data.data.article.text.title,
                            isQuizFinished: true,
                            definitions: response.data.data.article.definitions
                        })
                        this.setState({sectionArray: []})
                        this.state.correctAnswersAndQuiz.forEach(section => this.classifyCorrectAnswers(section));
                        this.setState({isLoading: false})
                    } else {
                        if (response.data.data.timeTaken != null) {
                            let secondsDB = response.data.data.timeTaken;
                            this.updateTimer(secondsDB);
                        }
                        let str = response.data.data.articleText.text;
                        var length = str.trim().split(/\s+/).length;
                        let est_time = Math.round(length / 200)

                        this.setState({
                            studentId: response.data.data.studentId,
                            articleId: response.data.data.articleId,
                            answerSections: response.data.data.answerSections,
                            assignment: response.data.data,
                            article: response.data.data.articleText.text,
                            articleTitle: response.data.data.articleText.title,
                            lastSavedTime: response.data.data.lastSavedDate,
                            definitions: response.data.data.definitions,
                            estimatedTime: est_time
                        })
                        this.state.answerSections.forEach(section => this.classify(section));

                        this.setState({
                            isLoading: false,
                        })
                    }
                })
                .catch(e => {
                    if (e.response.status && e.response.status === 403) {
                        this.redirectToLogin();
                    }
                });
        }


    }

    getFeedback() {
        let username = localStorage.getItem("username")
        axios.get("api/v1/answer/assignments/getFeedback/" + this.props.match.params.assignmentID + "/" + username, {headers: authHeader()})
            .then(response => {
                this.setState({
                    feedback: response.data.data,
                })
            })
    }

    updateTimer = (secondsDB) => {
        let calculatedHour = Math.floor(secondsDB / 3600);
        secondsDB %= 3600;
        let calculatedMinutes = Math.floor(secondsDB / 60);
        let calculatedSeconds = secondsDB % 60;
        this.setState({
            hour: calculatedHour,
            minutes: calculatedMinutes,
            seconds: calculatedSeconds
        })
    }

    classify(section) {
        let newSection = new Section();
        if (section.multipleChoiceAnswers != null && section.multipleChoiceAnswers.length > 0) {
            newSection.changeMultipleChoice(
                section.id,
                true,
                section.order,
                section.multipleChoiceAnswers,
                section.description,
                section.point
            )
        } else if (section.orderingAnswers != null && section.orderingAnswers.length > 0) {
            newSection.changeOrdering(
                section.id,
                true,
                section.order,
                section.orderingAnswers,
                section.description,
                section.point
            )
        } else if (section.trueFalseAnswers != null && section.trueFalseAnswers.length > 0) {
            newSection.changeTrueFalse(
                section.id,
                true,
                section.order,
                section.trueFalseAnswers,
                section.description,
                section.point,
            )
        } else if (section.matchingAnswers != null && section.matchingAnswers.length > 0) {
            newSection.changeMatching(
                section.id,
                true,
                section.order,
                section.matchingAnswers,
                section.description,
                section.point,
            )
        } else if (section.gapFillingMain != null && section.gapFillingMain.gapFillingAnswers.length > 0) {
            let words = section.gapFillingMain.clues.split('##');
            let words2 = [];
            words.map((word) => words2.push(word + ","));
            words2[words2.length - 1] = words[words.length - 1]
            newSection.changeGapFilling(
                section.id,
                true,
                section.order,
                section.gapFillingMain.gapFillingAnswers,
                section.description,
                words2,
                section.gapFillingMain.clues,
                section.gapFillingMain.id,
                section.point,
            )
        } else if (section.writtenAnswer != null) {
            newSection.changeWritten(
                section.id,
                true,
                section.order,
                section.description,
                section.writtenAnswer,
                section.point,
                section.graded
            )
        }
        this.setState({
            sectionArray: [...this.state.sectionArray, newSection]
        })
    }

    classifyCorrectAnswers(sectionWithCorrectAnswers) {
        let newSection = new Section();
        if (sectionWithCorrectAnswers.multipleChoices != null && sectionWithCorrectAnswers.multipleChoices.length > 0) {
            newSection.changeMultipleChoice(
                sectionWithCorrectAnswers.id,
                true,
                sectionWithCorrectAnswers.order,
                sectionWithCorrectAnswers.multipleChoices,
                sectionWithCorrectAnswers.description,
                sectionWithCorrectAnswers.point
            )
        } else if (sectionWithCorrectAnswers.orderings != null && sectionWithCorrectAnswers.orderings.length > 0) {
            newSection.changeOrdering(
                sectionWithCorrectAnswers.id,
                true,
                sectionWithCorrectAnswers.order,
                sectionWithCorrectAnswers.orderings,
                sectionWithCorrectAnswers.description,
                sectionWithCorrectAnswers.point
            )
        } else if (sectionWithCorrectAnswers.trueFalses != null && sectionWithCorrectAnswers.trueFalses.length > 0) {
            newSection.changeTrueFalse(
                sectionWithCorrectAnswers.id,
                true,
                sectionWithCorrectAnswers.order,
                sectionWithCorrectAnswers.trueFalses,
                sectionWithCorrectAnswers.description,
                sectionWithCorrectAnswers.point,
            )
        } else if (sectionWithCorrectAnswers.matchings != null && sectionWithCorrectAnswers.matchings.length > 0) {
            newSection.changeMatching(
                sectionWithCorrectAnswers.id,
                true,
                sectionWithCorrectAnswers.order,
                sectionWithCorrectAnswers.matchings,
                sectionWithCorrectAnswers.description,
                sectionWithCorrectAnswers.point,
            )
        } else if (sectionWithCorrectAnswers.gapFillingMain != null && sectionWithCorrectAnswers.gapFillingMain.gapFillings.length > 0) {
            let words = sectionWithCorrectAnswers.gapFillingMain.clues.split('##');
            let words2 = [];
            words.map((word) => words2.push(word + ","));
            words2[words2.length - 1] = words[words.length - 1]
            newSection.changeGapFilling(
                sectionWithCorrectAnswers.id,
                true,
                sectionWithCorrectAnswers.order,
                sectionWithCorrectAnswers.gapFillingMain.gapFillings,
                sectionWithCorrectAnswers.description,
                words2,
                sectionWithCorrectAnswers.gapFillingMain.clues,
                sectionWithCorrectAnswers.gapFillingMain.id,
                sectionWithCorrectAnswers.point,
            )
        } else if (sectionWithCorrectAnswers.writtenQuestion != null) {
            newSection.changeWritten(
                sectionWithCorrectAnswers.id,
                true,
                sectionWithCorrectAnswers.order,
                sectionWithCorrectAnswers.description,
                sectionWithCorrectAnswers.writtenQuestion,
                sectionWithCorrectAnswers.point,
                sectionWithCorrectAnswers.writtenQuestion.graded
            )
        }
        this.setState({
            sectionArray: [...this.state.sectionArray, newSection]
        })
    }

    finishQuiz = () => {
        this.setState({
            isQuizFinished: true
        })
    }

    submitAnswers() {
        let username = localStorage.getItem("username");
        axios.post("/api/v1/answer/submit/" + this.state.articleId + "/" + username, this.state.assignment, {headers: authHeader()})
            .then(response => {
                this.setState({
                    correctAnswersAndQuiz: response.data.data.article.sections,
                    pointDTO: response.data.data.pointDTO,
                    message: response.data.message,
                    isLoading: false,
                    sectionArray: []

                })
                this.state.correctAnswersAndQuiz.forEach(section => this.classifyCorrectAnswers(section));
                this.toast.show({
                    severity: 'success',
                    summary: 'Success Message',
                    detail: "Your answers have been successfully submitted!",
                    life: 3000
                });
                if (response.data.data.timeTaken != null) {
                    let secondsDB = response.data.data.timeTaken;
                    this.updateTimer(secondsDB);
                }
                this.setState({
                    isLoadingQuiz: false,
                })

            })
            .catch(e => {
                //this.toast.show({severity:'error', summary: 'Error Message', detail:"An error occurred, please try again!", life: 3000});
            });

        this.finishQuiz();
    }


    saveAnswers = () => {
        let username = localStorage.getItem("username");
        axios.post("/api/v1/answer/saveAnswers/" + this.state.articleId + "/" + username, this.state.assignment, {headers: authHeader()})
            .then(response => {
                this.toast.show({
                    severity: 'success',
                    summary: 'Success Message',
                    detail: "Your answers have been successfully saved!",
                    life: 3000
                });
                this.setState({
                    lastSavedTime: response.data.data,
                })
            })
            .catch(e => {
                this.toast.show({
                    severity: 'error',
                    summary: 'Error Message',
                    detail: "An error occurred, please try again!",
                    life: 3000
                });
            });
    }

    saveAnswersForSectionwise = (section) => {
        let username = localStorage.getItem("username");
        axios.post("/api/v1/answer/saveSection/" + this.state.articleId + "/" + username, section, {headers: authHeader()})
            .then(response => {
                this.setState({
                    lastSavedTime: response.data.data,
                })
            })
            .catch(e => {
                console.log(e);
            });
    }

    addnote() {
        let ul = document.getElementById("list");
        let li = document.createElement("li");
        li.setAttribute("contenteditable", "true");
        let a = document.createElement("a");
        li.appendChild(a);
        ul.appendChild(li);
    }

    deletenote() {
        let ul = document.getElementById("list");
        ul.removeChild(ul.lastChild);
    }

    handleClose = () => {
        this.setState({
            show: false
        })
    }
    handleShow = () => {
        this.setState({
            show: true
        })
    }

    handleCloseAndSubmit = () => {
        this.setState({
            show: false,
            isLoadingQuiz: true
        })
        this.submitAnswers();
    }

    textToAudio = () => {  
      
        speechSynthesis.cancel();
    

        var regex = /(<([^>]+)>|&nbsp;)/ig;

        var body = this.state.articleTitle + ". " + this.state.article;

        var result = body.replace(regex, "");
        
        var len = 200;
        var curr = len;
        var prev = 0;
        var output;
        output = [];

        while (result[curr]) {
            if (result[curr++] == ' ') {
                output.push(result.substring(prev,curr));
                prev = curr;
                curr += len;
            }
        }
        output.push(result.substr(prev));  
     
  
        let x=0;
        while(x<output.length){   
           
                let utterance = new SpeechSynthesisUtterance();
                utterance.text = output[x];   
                utterance.rate = 0.90;
                let voices = speechSynthesis.getVoices();
                if(voices.filter(function(voice) { return voice.lang === 'en-US'; }) == null){
                    this.setState({
                        ttserror: true
                    })
                    return;
                }
            
           
                
                utterance.voice = voices.filter(function(voice) { return voice.lang === 'en-US'; })[0];

                utterance.lang = "en-US"; 
                utterance.rate=0.8;

                speechSynthesis.speak(utterance);

      
                x= x+1;
            
        }
        
       
    }

    stop = () => {

        speechSynthesis.pause();

    }

    resume = () => {

        speechSynthesis.resume();

    }
    
    openSite = () => {

        window.open("https://support.microsoft.com/en-us/topic/download-voices-for-immersive-reader-read-mode-and-read-aloud-4c83a8d8-7486-42f7-8e46-2b0fdf753130");

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

        const cleanHtml = sanitizeHtml(this.state.feedback, sanitizationOptions);

        return (
            this.state.isLoading ?
                <Loading />

                : <div>
                    <StudentNavbar/>

                    <Container fluid className={"py-3 px-3"} >
                        <Row lg={24} >
                            <Col lg={8} sm={8}  >
                                <Row>
                                    <Button variant="primary" size="sm" onClick={this.textToAudio}> Read out loud </Button>
                                    <Button variant="danger" className={"mx-2"} size="sm" onClick={this.stop}> Pause </Button>
                                    <Button variant="secondary" size="sm" onClick={this.resume}> Resume </Button>
                                </Row>
                               {this.state.ttserror === false ?
                                    <div />
                                                :
                                    <div>  <Button variant="link" size="sm" onClick={this.openSite}> Text to speech is not supported in your device. Please install the English (United States) language package. </Button> </div>
                               }
                                <Row className={"mt-2"} >
                                    Estimated reading time: {this.state.estimatedTime} minutes
                                </Row>
                            </Col>

                            <Col lg={5} sm={8} className={"ml-5 mr-auto"} >
                                <CambridgeDictionary/>
                            </Col>

                            <Col lg={2} sm={8} >
                                {
                                    this.state.assignment || this.state.pointDTO ?
                                        <Timer isQuizFinished={this.state.isQuizFinished} minutes={this.state.minutes}
                                               seconds={this.state.seconds} hours={this.state.hour} /> :
                                        null
                                }
                            </Col>
                        </Row>


                        <Row >
                            <Col lg={12} sm={24} className={"pr-lg-3"} >
                                <ArticleScrollPanel article={this.state.article} title={this.state.articleTitle}
                                                    articleId={this.state.articleId}/>
                            </Col>

                            <Col lg={12} sm={24} className={"pl-lg-2"} >

                                {this.state.isLoadingQuiz ?
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
                                    : <Row className="scrollpanel" >
                                        <div className="card" style={{"width":"100%"}} >
                                            <ScrollPanel style={{height: "100vh"}} className="custombar1">
                                                <Quiz sectionArray={this.state.sectionArray}
                                                      showResults={this.state.isQuizFinished}
                                                      pointDTO={this.state.pointDTO}
                                                      saveAnswer={this.saveAnswersForSectionwise}
                                                      isStudent={true}/>
                                            </ScrollPanel>
                                        </div>
                                    </Row>}
                                {!this.state.isQuizFinished ?
                                    <Row className={"my-3"} lg={24} sm={24}  >

                                        <Col lg={7} xs={12}>
                                            <button onClick={() => this.redirectToStudentHome()} className="btn btn-secondary">
                                                Back to Home
                                            </button>
                                        </Col>


                                        <Col lg={4} xs={12}   >
                                            <DisplayDefinitions definitions={this.state.definitions}/>
                                        </Col >
                                        <Col lg={4} xs={12} className={"pl-lg-1"} >
                                            <Dictionary />
                                        </Col>
                                        <Col lg={3} xs={12} className={"pl-lg-1"}  >
                                            <TranslationWindow/>
                                        </Col>
                                        <Col lg={3} xs={12} className={"pl-lg-1"}  >
                                            <Button style={{width: "100%"}} onClick={() => this.handleShow()} className="btn btn-success">
                                                Submit
                                            </Button>
                                        </Col>
                                        <Col lg={3} xs={12} className={"pl-lg-1"} >
                                            <button style={{width: "100%"}} onClick={() => this.saveAnswers()}
                                                    className="btn btn-primary">
                                                Save
                                            </button>
                                        </Col>



                                        <Modal show={this.state.show} onHide={this.handleClose}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Confirm</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>Are you sure to submit the quiz ?</Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={this.handleClose}>
                                                    Cancel
                                                </Button>
                                                <Button variant="primary" onClick={this.handleCloseAndSubmit}>
                                                    Submit
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </Row>
                                    :
                                    <div className={"my-3"} >
                                        <div className="card my-3 py-3 pl-3">
                                            <h2>Instructor Comments</h2>
                                            {this.state.feedback == null ?
                                                <div>Your instructor did not give any feedback yet </div>
                                                :
                                                <div dangerouslySetInnerHTML={{ __html: cleanHtml }}/>
                                            }
                                        </div>
                                        <button onClick={() => this.redirectToStudentHome()}
                                                className="btn btn-secondary">
                                            Back to Home
                                        </button>
                                    </div>
                                }
                                {!this.state.isQuizFinished && this.state.lastSavedTime ?
                                    <div className="p-mb-3 p-text-light p-text-right">Last saved
                                        : {this.state.lastSavedTime}</div> : null}
                            </Col>
                        </Row>
                        <Draggable>

                            <ul id="list">
                            </ul>

                        </Draggable>
                        <Toast ref={(el) => this.toast = el}/>
                    </Container>
                </div>

        )
    }
}

export default withRouter(AssignmentPage);
