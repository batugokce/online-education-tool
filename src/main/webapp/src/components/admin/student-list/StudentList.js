import React, {Component} from 'react';
import axios from "axios";
import authHeader from "../../service/authHeader";
import {ProgressSpinner} from "primereact/progressspinner";
import AdminNavbar from "../AdminNavbar";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { DataTable } from 'primereact/datatable';
import {Column} from "primereact/column";
import {Link} from "react-router-dom";
import {Button} from "primereact/button";
import StudentInfo from "./StudentInfo";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import {Toast} from "primereact/toast";
import Card from "react-bootstrap/Card";
import { confirmDialog } from 'primereact/confirmdialog';

class StudentList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            students: [],
            selectedStudent: null,
            visibilityOfDialog: false,
            id: "",
            name: "",
            surname: "",
            emailAddress: "",
            studentNumber: "",
            telephoneNumber: "",
            isLoading: true,
            banConfirmationVisibility: false,
            unbanConfirmationVisibility: false,
            deleteConfirmationVisibility: false
        }
    }

    redirectToLogin = () => {
        this.props.history.push("/")
    }

    openDialog = (student) => {
        this.setState({
            id: student.id,
            name: student.name || "",
            surname: student.surname || "",
            emailAddress: student.emailAddress || "",
            telephoneNumber: student.telephoneNumber || "",
            studentNumber: student.studentNumber || "",
            visibilityOfDialog: true
        })
    }

    sortFunction = (a,b) => (a.id > b.id) ? 1 : -1;


    generateStudentButtons = (rowData) => {
        const banConfirm = (id) => {
            confirmDialog({
                message: 'Are you sure you want to ban this student?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: () => this.banStudent(id),
                reject: () => this.setState({banConfirmationVisibility: false})
            });
        }

        const unbanConfirm = (id) => {
            confirmDialog({
                message: "Are you sure you want to remove this student's ban?",
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: () => this.unbanStudent(id),
                reject: () => this.setState({unbanConfirmationVisibility: false})
            });
        }

        const deleteConfirm = (id) => {
            confirmDialog({
                message: 'Are you sure you want to delete this student?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: () => this.deleteStudent(id),
                reject: () => this.setState({deleteConfirmationVisibility: false})
            });
        }

        return (
            <Row className={"justify-content-center"} >
                {
                    rowData.banned ?
                        <Button type="button" icon="pi pi-check" className="p-button-success mx-1"
                                onClick={() => unbanConfirm(rowData.id)}/> :
                        <Button type="button" icon="pi pi-ban" className="p-button-danger mx-1"
                                onClick={() => banConfirm(rowData.id)}/>
                }
                <Button type="button" icon="pi pi-trash" className="p-button-danger mx-1"
                        onClick={() => deleteConfirm(rowData.id)}/>
                <Button type="button" icon="pi pi-user-edit" className="p-button-info mx-1"
                        onClick={() => this.openDialog(rowData)}/>
            </Row>
        );
    }

    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
    }

    banStudent = id => {
        axios.put("/api/v1/student/ban/"+id, {}, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data
                this.showToast(responseObject.type, responseObject.message)
                this.setState({
                    selectedStudent: null
                })
                if (responseObject.type === "success") {
                    this.setState({
                        students: responseObject.data
                    })
                }
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
                else {
                    this.showToast("error", "Unexpected error")
                }
            })
    }

    unbanStudent = id => {
        axios.put("/api/v1/student/unban/"+id, {}, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data
                this.showToast(responseObject.type, responseObject.message)
                this.setState({
                    selectedStudent: null
                })
                if (responseObject.type === "success") {
                    this.setState({
                        students: responseObject.data
                    })
                }
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
                else {
                    this.showToast("error", "Unexpected error")
                }
            })
    }

    deleteStudent = id => {
        axios.delete("/api/v1/people/deleteStudent/"+id, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data
                console.log(responseObject)

                this.showToast(responseObject.type, responseObject.message)
                this.setState({
                    students: responseObject.data,
                    selectedStudent: null
                })
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
                else {
                    this.showToast("error", "Unexpected error")
                }
            })
    }

    updateStudent = () => {
        let student = {
            id: this.state.id,
            name: this.state.name,
            surname: this.state.surname,
            emailAddress: this.state.emailAddress,
            telephoneNumber: this.state.telephoneNumber ,
            studentNumber: this.state.studentNumber,
        };

        console.log(student);

        axios.put("/api/v1/people/updateStudent", student, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;

                if ( responseObject.type === "ERROR" || responseObject.type === "WARN") {
                    this.showToast(responseObject.type, responseObject.message)
                }
                else {
                    this.showToast("success", "Student has been updated successfully")
                    this.setState({
                        students: responseObject.data,
                        selectedStudent: null
                    })
                }
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
                else {
                    this.showToast("error", "Check the fields and try again")
                }
            })
    }

    componentDidMount() {
        axios.get("/api/v1/people/listStudentsForAdmin", {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                console.log(responseObject.data)
                this.setState({
                    students: responseObject.data,
                    isLoading: false
                })
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
            })
    }

    render() {
        const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
        const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;
        return (
            this.state.isLoading ?
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <ProgressSpinner className="p-d-block p-mx-auto"  style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                </div> :
                <div>
                    <AdminNavbar/>
                    <Toast ref={(el) => this.toast = el} />

                    <Container className={"mt-3"} style={{"maxWidth": "1600px"}} >
                        <Row>
                        <Col sm={7} className={"ml-0 pl-0"} >
                            <Card>
                            <DataTable value={this.state.students.sort(this.sortFunction)} className="p-datatable-striped" rowHover
                                       emptyMessage={"There is no student registered in the system."}
                                       onSelectionChange={e => this.setState({selectedStudent: e.value})} selectionMode="single"
                                       paginator
                                       paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                       currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={5} rowsPerPageOptions={[5,10,15]}
                                       paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                                <Column field={"studentNumber"} header="Student Number" filter filterPlaceholder={"Search by student no"} sortable/>
                                <Column field={"nameSurname"} header={"Name & Surname"} filter filterPlaceholder={"Search by name"} sortable />
                                <Column field={"classroomName"} header="Class Name" filter filterPlaceholder="Search by class name" sortable />
                                <Column body={this.generateStudentButtons} headerStyle={{width:'10em', textAlign: 'center'}}
                                        bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                            </DataTable>
                            </Card>
                        </Col>
                        <Col sm={5} className={"mt-4 pl-2"} >
                            <Card>
                            <StudentInfo student={this.state.selectedStudent} />
                            </Card>
                        </Col>
                        </Row>
                    </Container>

                    <Dialog visible={this.state.visibilityOfDialog} style={{ width: '50vw' }}
                            onHide={() => this.setState({visibilityOfDialog: false})}>
                        <Container className={"mt-3"} style={{"maxWidth": "1600px"}}>
                            <Card>
                            <Row className={"my-2"} >
                                <Col sm={{offset: "2", span: "3"}}  >
                                    <strong>Name:</strong>
                                </Col>
                                <Col sm={{offset: "0", span: "7"}}>
                                    <InputText value={this.state.name} onChange={e => this.setState({name: e.target.value})}  />
                                </Col>
                            </Row>
                            <Row className={"my-2"} >
                                <Col sm={{offset: "2", span: "3"}}  >
                                    <strong>Surname:</strong>
                                </Col>
                                <Col sm={{offset: "0", span: "7"}}>
                                    <InputText value={this.state.surname} onChange={e => this.setState({surname: e.target.value})} />
                                </Col>
                            </Row>
                            <Row className={"my-2"} >
                                <Col sm={{offset: "2", span: "3"}}  >
                                    <strong>Student No:</strong>
                                </Col>
                                <Col sm={{offset: "0", span: "7"}}>
                                    <InputText value={this.state.studentNumber} onChange={e => this.setState({studentNumber: e.target.value})} />
                                </Col>
                            </Row>
                            <Row className={"my-2"} >
                                <Col sm={{offset: "2", span: "3"}}  >
                                    <strong>E-mail:</strong>
                                </Col>
                                <Col sm={{offset: "0", span: "7"}}>
                                    <InputText value={this.state.emailAddress} onChange={e => this.setState({emailAddress: e.target.value})} />
                                </Col>
                            </Row>
                            <Row className={"my-2"} >
                                <Col sm={{offset: "2", span: "3"}}  >
                                    <strong>Telephone No:</strong>
                                </Col>
                                <Col sm={{offset: "0", span: "7"}}>
                                    <InputText value={this.state.telephoneNumber} onChange={e => this.setState({telephoneNumber: e.target.value})} />
                                </Col>
                            </Row>
                            <Row className={"justify-content-end mr-3"} >
                                <Button label={"Save"} icon="pi pi-save" onClick={this.updateStudent} />
                            </Row>
                            </Card>
                        </Container>
                    </Dialog>
                </div>


        );
    }
}

export default StudentList;