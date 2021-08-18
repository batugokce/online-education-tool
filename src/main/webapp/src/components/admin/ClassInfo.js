import React, {Component} from 'react';
import AdminNavbar from "./AdminNavbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import axios from "axios";
import authHeader from "../service/authHeader";
import {ProgressSpinner} from "primereact/progressspinner";
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import {Toast} from "primereact/toast";
import MediaQuery  from 'react-responsive'
import "./style.css";

class ClassInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            className: "",
            students: [],
            instructors: [],
            level: "",
            nOfStudents: 0,
            capacity: 0,
            isLoading: true,
            visibilityDialog: false,
            availableStudents: [],
            availableInstructors: [],
            selectedInstructor: null,
            selectedStudent: null,
            isLoadingDialog: true
        }

        this.classID = this.props.match.params.classID;
    }

    mapStudentsToList = () => {
        return this.state.students.map(item =>
            <li key={item.id} >
                {item.studentNumber} - {item.nameSurname}
                <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text "
                        onClick={() => this.deleteStudent(item.id)}   />
            </li>);
    }

    mapInstructorsToList = () => {
        return this.state.instructors.map(item =>
            <li key={item.id} >
                {item.nameSurname}
                <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text "
                        onClick={() => this.deleteInstructor(item.id)}   />
            </li>);
    }

    handleDialogButton = () => {
        this.setState({
            visibilityDialog: true
        });
        this.fetchAvailablePeople();
    }

    redirectToLogin = () => {
        this.props.history.push("/")
    }

    fetchAvailablePeople = () => {
        axios.get("/api/v1/classroom/listAvailablePeople/", {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                if (responseObject.type === "success") {
                    let availablePeople = responseObject.data;
                    this.setState({
                        availableStudents: availablePeople.students,
                        availableInstructors: availablePeople.instructors,
                        isLoadingDialog: false
                    })
                }
                else if (responseObject.type === "error") {
                    console.log("error while fetching available people")
                }
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
            })
    }

    addStudent = () => {
        if (this.state.selectedStudent != null) {
            axios.post("/api/v1/classroom/add/student/" + this.classID + "/" + this.state.selectedStudent, {}, {headers: authHeader()})
                .then(response => {
                    let responseObject = response.data;
                    this.showToast(responseObject.type, responseObject.message)
                    if (responseObject.type === "success") {
                        let studentList = responseObject.data;
                        this.setState({
                            students: studentList,
                            availableStudents: this.state.availableStudents.filter(item => item.id !== this.state.selectedStudent),
                            nOfStudents: this.state.nOfStudents + 1
                        })
                    }
                })
                .catch(error => {
                    if(error.response.status && error.response.status === 403){
                        this.redirectToLogin();
                    }
                })
        }
    }

    deleteStudent = (studentId) => {
        axios.delete("/api/v1/classroom/delete/student/" + this.classID + "/" + studentId, {headers: authHeader()})
            .then(res => {
                let responseObject = res.data;
                this.showToast(responseObject.type, responseObject.message)
                if (responseObject.type === "success") {
                    this.setState({
                        students: this.state.students.filter(item => item.id !== studentId),
                        nOfStudents: this.state.nOfStudents - 1
                    })
                }
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
            })
    }

    deleteInstructor = (instructorId) => {
        axios.delete("/api/v1/classroom/delete/instructor/" + this.classID + "/" + instructorId, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                this.showToast(responseObject.type, responseObject.message)
                if (responseObject.type === "success") {
                    this.setState({
                        instructors: this.state.instructors.filter(item => item.id !== instructorId),
                    })
                }
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
            })
    }

    addInstructor = () => {
        if (this.state.selectedInstructor != null) {
            axios.post("/api/v1/classroom/add/instructor/" + this.classID + "/" + this.state.selectedInstructor, {}, {headers: authHeader()})
                .then(response => {
                    let responseObject = response.data;
                    this.showToast(responseObject.type, responseObject.message)
                    if (responseObject.type === "success") {
                        let instructorList = responseObject.data;
                        this.setState({
                            instructors: instructorList
                        })
                    }
                })
                .catch(error => {
                    if(error.response.status && error.response.status === 403){
                        this.redirectToLogin();
                    }
                })
        }
    }


    componentDidMount = () => {
        axios.get("/api/v1/classroom/find/"+ this.classID, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                if (responseObject.type === "success") {
                    let classroomData = responseObject.data;
                    this.setState({
                        className: classroomData.className,
                        level: classroomData.englishLevel,
                        nOfStudents: classroomData.numberOfStudents,
                        capacity: classroomData.capacity,
                        students: classroomData.students,
                        instructors: classroomData.instructors,
                        isLoading: false
                    })
                }
                else if (responseObject.type === "error") {
                    console.log("error")
                }
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
            })
    }

    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
    }

    render() {
        return (
            this.state.isLoading ?
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <ProgressSpinner className="p-d-block p-mx-auto"  style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                </div> :
            <div>
                <AdminNavbar/>
                <Toast ref={(el) => this.toast = el} />
                <Container className="py-4 px-5" fluid >
                    <Row>
                        <Col sm={5} style={{"fontSize":"large"}} className="pt-4" >
                            <Row className="mb-4" >
                                <Col sm={{ span: 4, offset: 2 }}>
                                    <b>Class name</b>
                                </Col>
                                <Col sm={6}>
                                    {this.state.className}
                                </Col>
                            </Row>
                            <Row className="mb-4" >
                                <Col sm={{ span: 4, offset: 2 }}>
                                    <b>Level</b>
                                </Col>
                                <Col sm={6}>
                                    {this.state.level}
                                </Col>
                            </Row>
                            <Row className="mb-4" >
                                <Col sm={{ span: 4, offset: 2 }}>
                                    <b>Registered Students</b>
                                </Col>
                                <Col sm={6}>
                                    {this.state.nOfStudents}
                                </Col>
                            </Row>
                            <Row className="mb-4" >
                                <Col sm={{ span: 4, offset: 2 }}>
                                    <b>Capacity</b>
                                </Col>
                                <Col sm={6}>
                                    {this.state.capacity}
                                </Col>
                            </Row>
                        </Col>

                        <Col sm={2} >
                            <MediaQuery minDeviceWidth={1224}>
                                <Divider layout="vertical" />
                            </MediaQuery>
                        </Col>

                        <Col sm={5} >
                            <Row>
                                <Button label="Add Person" icon="pi pi-user-plus" onClick={this.handleDialogButton}/>
                            </Row>
                            <h4 className="mt-4" >Instructor List</h4>
                            {
                                this.state.instructors.length > 0 ?

                                    <ul className="noBulletList" >
                                        {this.mapInstructorsToList()}
                                    </ul> :
                                <div>No instructor registered for this classroom.</div>
                            }
                            <Divider className="ml-0 pl-0" />
                            <h4>Student List</h4>
                            {
                                this.state.students.length > 0 ?
                                    <ul className="noBulletList" >
                                        {this.mapStudentsToList()}
                                    </ul>
                                     :
                                    <div>No student registered for this classroom.</div>
                            }
                        </Col>
                    </Row>
                </Container>
                <Dialog visible={this.state.visibilityDialog} style={{ width: '50vw' }}
                         onHide={() => this.setState({visibilityDialog: false})}>

                    {
                        this.state.isLoadingDialog ?
                            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100%'}}>
                                <ProgressSpinner className="p-d-block p-mx-auto"  style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                            </div> :
                        <Container className={"mt-3"} style={{"maxWidth": "1600px"}}>
                        <Row>
                            <Col>
                                <Row>
                                    <h5>Add Instructor</h5>
                                </Row>
                                <Row>
                                    <MediaQuery minDeviceWidth={1224}>
                                        <Dropdown optionLabel={"nameSurname"} optionValue={"id"}
                                                  value={this.state.selectedInstructor}
                                                  onChange={(e) => this.setState({selectedInstructor: e.value})}
                                                  options={this.state.availableInstructors}
                                                  placeholder={"Select an instructor"} filter/>
                                    </MediaQuery>
                                    <MediaQuery maxDeviceWidth={1223} >
                                        <Dropdown optionLabel={"nameSurname"} optionValue={"id"}
                                                  value={this.state.selectedInstructor}
                                                  onChange={(e) => this.setState({selectedInstructor: e.value})}
                                                  options={this.state.availableInstructors}
                                                  placeholder={"Select an instructor"} />
                                    </MediaQuery>
                                </Row>
                                <Row className={"mt-3"}>
                                    <Button onClick={this.addInstructor}>Add</Button>
                                </Row>
                            </Col>
                            <MediaQuery minDeviceWidth={1224} ><Divider layout="vertical"/></MediaQuery>
                            <Col>
                                <Row>
                                    <h5>Add Student</h5>
                                </Row>
                                <Row>
                                    <MediaQuery minDeviceWidth={1224}>
                                        <Dropdown optionLabel={"nameSurname"} optionValue={"id"}
                                                  value={this.state.selectedStudent}
                                                  onChange={(e) => this.setState({selectedStudent: e.value})}
                                                  options={this.state.availableStudents} placeholder={"Select a student"} filter
                                                  filterBy={"nameSurname,studentNumber"} />
                                    </MediaQuery>
                                    <MediaQuery maxDeviceWidth={1223} >
                                        <Dropdown optionLabel={"nameSurname"} optionValue={"id"}
                                                  value={this.state.selectedStudent}
                                                  onChange={(e) => this.setState({selectedStudent: e.value})}
                                                  options={this.state.availableStudents} placeholder={"Select a student"}/>
                                    </MediaQuery>
                                </Row>
                                <Row className={"mt-3"}>
                                    <Button onClick={this.addStudent}>Add</Button>
                                </Row>
                            </Col>
                        </Row>

                    </Container>
                    }
                </Dialog>
            </div>
        );
    }
}

export default ClassInfo;