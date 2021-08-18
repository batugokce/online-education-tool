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
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import {Toast} from "primereact/toast";
import InstructorInfo from "./InstructorInfo";
import Card from "react-bootstrap/Card";

class InstructorList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            instructors: [],
            selectedInstructor: null,
            visibilityOfDialog: false,
            id: "",
            name: "",
            surname: "",
            emailAddress: "",
            telephoneNumber: "",
            isLoading: true
        }
    }

    redirectToLogin = () => {
        this.props.history.push("/")
    }

    openDialog = (instructor) => {
        this.setState({
            id: instructor.id,
            name: instructor.name || "",
            surname: instructor.surname || "",
            emailAddress: instructor.emailAddress || "",
            telephoneNumber: instructor.telephoneNumber || "",
            visibilityOfDialog: true
        })
    }

    generateButtons = (rowData) => {
        return (
            <Row className={"justify-content-center"} >
                <Button type="button" icon="pi pi-trash" className="p-button-danger mx-1"
                        onClick={() => this.deleteInstructor(rowData.id)}/>
                <Button type="button" icon="pi pi-user-edit" className="p-button-info mx-1"
                        onClick={() => this.openDialog(rowData)}/>
            </Row>
        );
    }

    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
    }

    deleteInstructor = id => {
        axios.delete("/api/v1/people/deleteInstructor/"+id, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data
                console.log(responseObject)

                this.showToast(responseObject.type, responseObject.message)
                this.setState({
                    instructors: responseObject.data,
                    selectedInstructor: null
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

    updateInstructor = () => {
        let instructor = {
            id: this.state.id,
            name: this.state.name,
            surname: this.state.surname,
            emailAddress: this.state.emailAddress,
            telephoneNumber: this.state.telephoneNumber
        };

        console.log(instructor);

        axios.put("/api/v1/people/updateInstructor", instructor, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;

                if ( responseObject.type === "ERROR" || responseObject.type === "WARN") {
                    this.showToast(responseObject.type, responseObject.message)
                }
                else {
                    this.showToast("success", "Instructor has been updated successfully")
                    this.setState({
                        instructors: responseObject.data,
                        selectedInstructor: null
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
        axios.get("/api/v1/people/listInstructorsForAdmin", {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                console.log(responseObject.data)
                this.setState({
                    instructors: responseObject.data,
                    isLoading: false
                })
            })
            .catch(error => {
                console.log(error)
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
                            <Col sm={6} className={"ml-0 pl-0"} >
                                <div>
                                    <Card>
                                    <DataTable value={this.state.instructors} className="p-datatable-striped" rowHover
                                               emptyMessage={"There is no instructor registered in the system."}
                                               onSelectionChange={e => this.setState({selectedInstructor: e.value})} selectionMode="single"
                                                paginator
                                                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={5} rowsPerPageOptions={[5,10,15]}
                                                paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                                        <Column field={"nameSurname"} header={"Name & Surname"} filter filterPlaceholder={"Search by name"} sortable />
                                        <Column field={"numberOfClassrooms"} header={"Number of registered classes"} sortable />
                                        <Column body={this.generateButtons} headerStyle={{width:'10em', textAlign: 'center'}}
                                                bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                                    </DataTable>
                                    </Card>
                                </div>
                            </Col>
                            <Col sm={6} className={"mt-4 pl-2"} >
                                <Card>
                                <InstructorInfo instructor={this.state.selectedInstructor} />
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
                                <Button label={"Save"} icon="pi pi-save" onClick={this.updateInstructor} />
                            </Row>
                            </Card>
                        </Container>
                    </Dialog>
                </div>


        );
    }
}

export default InstructorList;