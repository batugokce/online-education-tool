import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {ProgressSpinner} from "primereact/progressspinner";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import InstructorNavbar from "./InstructorNavbar";
import authHeader from "../service/authHeader";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {Dropdown} from "primereact/dropdown";
import { Toast } from "primereact/toast";
import {Link} from "react-router-dom";
import Loading from "../service/Loading";
import Card from "react-bootstrap/Card";

class AllAssignments extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            assignments: [],
            classrooms: [],
            classroomsForArticle:[],
            visibilityDialog: false,
            selectedClassroom: null,
            selectedAssignment: null,
            visibilityDialog2:false,
            selectedAssignmentForUnassign:null,
            selectedClassroomForArticle:null,
        }
    }

    redirectToLogin = () => this.props.history.push("/")
    showToast = (type, message) => this.toast.show({severity: type, detail: message})

    componentDidMount() {
        axios.get("/api/v1/article/listForInstructor", {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                console.log(responseObject.data)
                this.setState({
                    assignments: responseObject.data,
                    isLoading: false
                })
            })
            .catch(error => {
                console.log(error)
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
            })

        axios.get("/api/v1/classroom/listForInstructor/" + localStorage.getItem("username"), {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                console.log(responseObject.data);
                this.setState({
                    classrooms: responseObject.data
                });
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
            })
    }
    getClassrooms=(id)=>{
        axios.get("/api/v1/article/getAssignedClassrooms/" + id+"/"+localStorage.getItem("username"), {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                this.setState({
                    classroomsForArticle: responseObject.data,
                    visibilityDialog2:true,
                    selectedAssignmentForUnassign:id,

                });
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
            })

    }
    unassignFromClassroom = () =>{
        console.log(this.state.selectedClassroomForArticle);
        if (this.state.selectedClassroomForArticle === null || this.state.selectedAssignmentForUnassign === null)
            this.showToast("error", "Please choose a classroom.");
        else{
            axios.post("api/v1/classroom/unassign/" + this.state.selectedAssignmentForUnassign + "/" + localStorage.getItem("username") + "/" + this.state.selectedClassroomForArticle, {}, {headers: authHeader()})
                .then(response => {
                        this.showToast(response.data.type, response.data.message);
                    }
                )

        }

    }
    generateButtons = (rowData) => {
        return (
            <Row className={"justify-content-center"} >
                <Button className="p-button-success mx-1" label={"Use"}
                        onClick={() => this.setState({visibilityDialog: true, selectedAssignment: rowData.id})} />

                <Link to={"/instructor/preview/" + rowData.id} >
                    <Button type="button" icon="pi pi-eye" className="p-button-info mx-1"
                            onClick={() => console.log("")}/>
                </Link>
                <Button className="p-button-success mx-1" label={"Unuse"}
                        onClick={() => this.getClassrooms(rowData.id) } />
                <Link to={"/instructor/edit-assignment/" + rowData.id} >
                    <Button type="button" icon="pi pi-user-edit" className="p-button-info mx-1"
                            onClick={() => console.log("")}/>
                </Link>
            </Row>
        );
    }

    assignArticle = () => {
        if (this.state.selectedClassroom === null || this.state.selectedAssignment === null) {
            this.showToast("error", "Please choose a classroom.");
            return;
        }

        let requestURL = "/api/v1/classroom/assignArticle/" + localStorage.getItem("username") + '/' + this.state.selectedClassroom + '/' + this.state.selectedAssignment;
        axios.post( requestURL, {}, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                this.showToast(responseObject.type, responseObject.message);
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
                <Loading />
                : <div>
                    <InstructorNavbar/>
                    <Toast ref={(el) => this.toast = el} />
                    <Container fluid>
                        <Card>
                        <DataTable value={this.state.assignments} className="p-datatable-striped" rowHover emptyMessage={"There is no assignment registered in the system."}
                                   paginator
                                   paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={5} rowsPerPageOptions={[5,10,15]}
                                   paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                            <Column field={"title"} header={"Assignment Name"} filter filterPlaceholder={"Search by name"} sortable />
                            <Column field={"englishLevel"} header={"English Level"} sortable filter filterPlaceholder={"Search by difficulty level"} />
                            <Column field={"nofClassesUser"} header={"Number of using classes"} sortable />
                            <Column body={this.generateButtons} headerStyle={{width:'20em', textAlign: 'center'}}
                                    bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                        </DataTable>
                        </Card>
                    </Container>

                    <Dialog visible={this.state.visibilityDialog} style={{ width: '35vw' }}
                            onHide={() => this.setState({visibilityDialog: false})}
                            header={"Use assignment for your classrooms"} >
                        <Container className={"py-1"} >
                            <Col>
                                <Row className={"justify-content-around"} >
                                    <Dropdown options={this.state.classrooms} value={this.state.selectedClassroom}
                                              onChange={e => this.setState({selectedClassroom: e.value})}
                                              placeholder={"Choose a classroom"} className={"my-2"}
                                              optionValue={"id"} optionLabel={"className"} />
                                    <Button label={"Assign"} onClick={this.assignArticle} className={"my-2"} />
                                </Row>
                            </Col>
                        </Container>
                    </Dialog>
                    <Dialog visible={this.state.visibilityDialog2} style={{ width: '35vw' }}
                            onHide={() => this.setState({visibilityDialog2: false})}
                            header={"Unassign assignment from your classrooms"} >
                        <Container className={"py-1"} >
                            <Col>
                                <Row className={"justify-content-around"} >
                                    <Dropdown options={this.state.classroomsForArticle} value={this.state.selectedClassroomForArticle}
                                              onChange={e => this.setState({selectedClassroomForArticle: e.value})}
                                              placeholder={"Choose a classroom"} className={"my-2"}
                                              optionValue={"id"} optionLabel={"className"} />
                                    <Button label={"Unuse"} onClick={this.unassignFromClassroom} className={"my-2"} />
                                </Row>
                            </Col>
                        </Container>
                    </Dialog>

                </div>
        );
    }
}

export default AllAssignments;