/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


import React, {Component} from "react";
import {Link} from 'react-router-dom'
import StudentNavbar from "./StudentNavbar";
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import authHeader from "../service/authHeader";
import {Col, Row} from "antd";
import {ScrollPanel} from "primereact/scrollpanel";
import {Button as PrimeButton} from "primereact/button";

import { Rating } from 'primereact/rating';

import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import './ScrollPanel.css';
import '../instructor/feedback/Paginator.css';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {Toast} from "primereact/toast";
import {Column} from "primereact/column";
import Card from "react-bootstrap/Card";
import Loading from "../service/Loading";
import Container from "react-bootstrap/Container";

export default class StudentHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignmentList: [],
            isLoading: true,
            isLoadingUser: true,
            show: false,
            user: null,
            levelPercentage: null
        };
    }

    componentDidMount() {
        this.retrieveUser();
        this.retrieveAssignmentList();
    }

    redirectToLogin = () => {
        this.props.history.push("/")
    }

    retrieveUser() {
        let username = localStorage.getItem("username")
        axios.get("/api/v1/student/findByName/" + username, {headers: authHeader()})
            .then(response => {
                this.setState({
                    user: response.data.data,
                    isLoadingUser: false
                })
                if(this.state.user.level === 'Newbie'){
                    this.setState({
                        levelPercentage: 14.2857143
                    })
                }
                if(this.state.user.level === 'Amateur'){
                    this.setState({
                        levelPercentage: 28.5714286
                    })
                }
                if(this.state.user.level === 'Normal'){
                    this.setState({
                        levelPercentage: 42.8571429
                    })
                }
                if(this.state.user.level === 'Semi-pro'){
                    this.setState({
                        levelPercentage: 57.1428571
                    })
                }
                if(this.state.user.level === 'Professional'){
                    this.setState({
                        levelPercentage: 71.4285714
                    })
                }
                if(this.state.user.level === 'Legend'){
                    this.setState({
                        levelPercentage: 85.7142857
                    })
                }
                if(this.state.user.level === 'Ultimate'){
                    this.setState({
                        levelPercentage: 100
                    })
                }
            })
    }

    retrieveAssignmentList() {
        axios.get("/api/v1/article/getListForStudent/" + localStorage.getItem("username"), {headers: authHeader()})
            .then(response => {
                this.setState({
                    assignmentList: response.data.data,
                    isLoading: false
                });
            })
            .catch(e => {
                if (e.response.status && e.response.status === 403) {
                    this.redirectToLogin();
                }
            });
    }

    Link = row => <Link to={"/admin/new-account"} className="nav-link">
        {row.title}</Link>;

    clearAll = () => {
        let username = localStorage.getItem("username");
        axios.delete("/api/v1/answer/deleteAll/" + username, {headers: authHeader()})
            .then(response => {
                this.toast.show({
                    severity: 'success',
                    summary: 'Success Message',
                    detail: "All related answers and time have been deleted successfully!",
                    life: 3000
                });
            })
            .catch(e => {
                console.log(e);
                //this.toast.show({severity:'error', summary: 'Error Message', detail:"An error occurred, please try again!", life: 3000});
            });
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

    generateButtons = (rowData) => {
        return (
            <Row className={"justify-content-center"}>
                <PrimeButton type="button" className={rowData.started ? "p-button-danger" : "p-button-info"}
                             label={rowData.started ? "Continue" : "Start"}
                             onClick={() => this.props.history.push("/student/assignment/" + rowData.id)} />
            </Row>
        );
    }

    levelBody = (rowData) => {
        return (
            <Rating value={rowData.level} stars={3} readOnly cancel={false} />
        )
    }

    handleCloseAndClearAll = () => {
        this.setState({
            show: false
        })
        this.clearAll();
    }
    onFileChangeHandler = (e) => {
        e.preventDefault();
        this.setState({
            selectedFile: e.target.files[0]
        });
        const formData = new FormData();
        formData.append('file', this.state.selectedFile);
    };

    sortFunction = (a,b) => (a.started === b.started) ? ((a.id > b.id) ? 1 : -1) : a.started ? -1 : 1;

    render() {
        return (
            (this.state.isLoading || this.state.isLoadingUser) ?
                <Loading />
                : <div>
                    <StudentNavbar/>
                    <Toast ref={(el) => this.toast = el}/>

                    <Container fluid className={"px-0 "} >

                        <Row span={24} className={"mx-0 px-0"} style={{ background: "#ddd"}} >
                            <div className={"pl-2"} style={{width:  `${ this.state.levelPercentage }%`, height: "30px", background: "#04AA6D", color: "white"}}>{this.state.user.level}</div>
                        </Row>

                        <Row className={"mt-4"} >
                            <Col lg={15} sm={24} className={"pl-3 pr-2 mb-3"} >
                                <Card className={"mb-3"}>
                                    <Card.Body>
                                        <Card.Title  >
                                            {"Hello " + this.state.user.name + ' ' + this.state.user.surname + '!'}
                                        </Card.Title>
                                        <Card.Subtitle className={"mb-3 mt-1 text-muted"} >
                                            <small className="text-muted">{"Your level is " + this.state.user.englishLevel + '/' + this.state.user.level +'.'}</small>
                                        </Card.Subtitle>
                                        <Card.Text>
                                            You can find the assignments given by your teacher below. {this.state.assignmentList.length > 0 ?
                                            "You have " + this.state.assignmentList.length + " assignment/s." : "You don't have any assignments."}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>

                                <Card>
                                    <DataTable value={this.state.assignmentList.sort(this.sortFunction)} className="p-datatable-striped"
                                               rowHover emptyMessage={"There is no homework assigned for your classroom. "} paginator
                                               paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]}>
                                        <Column field={"title"} header={"Assignment Name"}
                                                 sortable/>
                                        <Column field={"level"} header={"Difficulty Level"} body={this.levelBody} sortable/>
                                        <Column field={"category"} header={"Category"} sortable  />
                                        <Column body={this.generateButtons} headerStyle={{width: '10em', textAlign: 'center'}}
                                                bodyStyle={{textAlign: 'center', overflow: 'visible'}}/>
                                    </DataTable>
                                </Card>

                                <p className={"mt-4"} style={{marginLeft: "5px"}}>You can clear all assignment related answers and time and
                                    retry again if you want.</p>
                                <Button style={{marginLeft: "5px"}} onClick={() => this.handleShow()}
                                        className="btn btn-primary">
                                    Clear All
                                </Button>

                                <Modal show={this.state.show} onHide={this.handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Confirm</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Are you sure to clear all the related things with assignments?</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={this.handleClose}>
                                            Cancel
                                        </Button>
                                        <Button variant="primary" onClick={this.handleCloseAndClearAll}>
                                            Clear
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </Col>

                            <Col lg={9} sm={24} className={"px-2"} >
                                <Card>
                                    <ScrollPanel style={{height: "80vh"}}>
                                        <h3 className={"pl-3 pt-2"} >Instructions</h3>
                                        <p className={"px-3"} >
                                            In left-side, there is a list with sample articles. You can click on any of
                                            them to reach that assignment.<br/><br/>
                                            In assignment page:<br/>
                                            1. You can follow the timer from the top right after you clicked on one of the
                                            assignments. Your total solving time will be calculated as the time from the
                                            moment the assignment is clicked until you submit it.<br/>
                                            2. Each assignment consists of one or more sections. The score of the relevant
                                            section is written in the section header.<br/>
                                            3. You will experience Multiple Choice, True / False, Fill in the blank,
                                            Ordering, Matching and Open-ended question types.<br/>
                                            4. With the "Save" button under the quiz, you can save the questions you have
                                            marked / typed at any time. However, do not worry! All your answer are being <b>auto-saved</b>.
                                            In this way, your answers will not be lost even when
                                            you return to home-page or log-out and exit. You can continue where you left last time.<br/>
                                            5. The "Submit" button will be pressed at the end of the quiz, after that your
                                            answers will be compared with the correct answers, and <b>your score will be
                                            calculated automatically</b>. You can view your score, solving time, answers and
                                            correctness right after submitting, apart from written assignments. They will be evaluated by your
                                            instructor.<br/>
                                            6. After submitting, you cannot attempt the quiz again, you can only view it for
                                            now except written type assignments. They can be progressively graded as two drafts.<br/>
                                            7. You can return to the home page with the "Back to Home" button.<br/><br/>
                                            On articles, there is a <b>highlight and comment</b> feature. After selecting a part of
                                            the text, you can add your notes by clicking the comment button. Your comments
                                            will appear at the bottom of the article panel under "My Notes" section. Besides,
                                            you can take/edit/delete any of your notes without highlighting in that section, too.<br/>
                                            Note: If you click anywhere outside of the comment button, button will
                                            disappear.<br/>
                                            Note: You can close comment box by clicking "comment" again.<br/><br/>
                                            For <b>Text-to-Speech</b> feature,<br/>
                                            By pressing "Read out loud" button above the article text, you can hear the text from
                                            a native speaker. You can pause and resume listening any time you want.<br/><br/>
                                            For <b>online dictionary</b>,<br/>
                                            You can search for any word (noun, verb, adjective, adverb) to retrieve an English definition
                                            and example sentences regarding to that if possible. Do not forget to check out the dictionary
                                            your instructor prepared for that assignment, if any.<br/><br/>
                                            For <b>translator</b>,<br/>
                                            - You can use the translation feature by clicking the "Translate" button below
                                            each assignment page.<br/>
                                            - Translation feature  may not work as
                                            expected. If you encounter an unexpected situation, any feedback is
                                            appreciated.<br/>
                                            - For now, it works with just one single word. For example, you can translate
                                            'table', 'essential', 'product' etc. However, you cannot translate 'healthy
                                            diet', 'variety of foods' etc.<br/><br/>


                                        </p>
                                    </ScrollPanel>
                                </Card>
                                <Card className={"my-3"} >
                                    <p style={{margin: 12}}>
                                        Your feedback is very valuable to us, we would be glad if you can take your time and
                                        fill out this form after trying the application:
                                        <br/>
                                        <a href={"https://forms.gle/4S7sU6NoSEDmnt2u7"}>https://forms.gle/4S7sU6NoSEDmnt2u7</a>
                                    </p>
                                </Card>

                            </Col>
                        </Row>
                    </Container>
                </div>

        )
    }
}

