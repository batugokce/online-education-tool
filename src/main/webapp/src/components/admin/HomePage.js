import React, {Component} from "react";
import {Link, Redirect} from 'react-router-dom'
import AdminNavbar from "./AdminNavbar";
import Container from "react-bootstrap/Container";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import axios from 'axios';
import authHeader from "../service/authHeader";
import Row from 'react-bootstrap/Row';
import Loading from "../service/Loading";
import Card from "react-bootstrap/Card";
import {Message} from "primereact/message";
import {Tab, Tabs} from "react-bootstrap";
import PeopleIcon from "@material-ui/icons/People";
import PersonIcon from '@material-ui/icons/Person';
import DashboardIcon from '@material-ui/icons/Dashboard';

export default class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            students: [],
            classrooms: [],
            instructors: [],
            isLoading: true,
            redirectTo: false,
            numberOfStudents: null,
            numberOfInstructors: null,
            numberOfClassrooms: null,
            tab:'Students'
        }
    }


    RedirectTo = () => {
        this.setState({
            redirectTo: true
        })
    }

    RedirectToPage = () => {
        if (this.state.redirectTo) {
            return <Redirect to='/admin/home'/>
        }
    }

    redirectToLogin = () => {
        this.props.history.push("/")
    }
    redirectToCreateClassroom = () => {
        this.props.history.push("/admin/new-class")
    }


    componentDidMount = () => {

        axios.get("/api/v1/people/listStudentsForAdmin", {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                this.setState({

                    students: responseObject.data,
                    numberOfStudents: responseObject.data.length,
                    isLoading: false
                })
            })
            .catch(error => {
                if (error.response.status && error.response.status === 403) {
                    this.redirectToLogin();
                }
            })
        axios.get("/api/v1/people/listInstructorsForAdmin", {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                this.setState({
                    instructors: responseObject.data,
                    numberOfInstructors: responseObject.data.length,
                    isLoading: false
                })
            })
            .catch(error => {
                if (error.response.status && error.response.status === 403) {
                    this.redirectToLogin();
                }
            })

        axios.get("/api/v1/classroom/listForAdmin", {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                this.setState({
                    classrooms: responseObject.data,
                    numberOfClassrooms: responseObject.data.length,
                    isLoading: false,

                })
            })
            .catch(error => {
                if (error.response.status && error.response.status === 403) {
                    this.redirectToLogin();
                }
            })
    }


    goToClassPage = (rowData) => {
        return (
            <Link to={"/admin/class/" + rowData.id}>
                <Button type="button" icon="pi pi-eye" className="p-button-info"/>
            </Link>

        );
    }

    setKey(k){
        this.setState({
            tab:k
        })
    }

    render() {
        const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
        const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;
        return (
            this.state.isLoading ? <Loading/> :
            <div id="admin">
                <AdminNavbar/>

                <div style={{display: 'flex', justifyContent: 'center'}}>
                    {this.RedirectToPage()}
                </div>
                <Container className={"py-2"} >
                    &nbsp;&nbsp;
                    <Tabs activeKey={this.state.tab} onSelect={(k)=>this.setKey(k)}>
                        <Tab eventKey="Students" title={<span><PeopleIcon/>   Students</span>}>
                            <div>
                                &nbsp;
                                <h3 className={"mb-3 mt-4"} >
                                    <Message style={{fontSize: "44px"}} severity="info"
                                             text={"Number of students in the system: " + this.state.numberOfStudents}/>
                                </h3>
                                <Container>
                                    <Row>
                                        <Card>
                                            <DataTable value={this.state.students} className="p-datatable-striped" rowHover
                                                       emptyMessage={"There is no student registered in the system."}
                                                       paginator
                                                       paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                                       currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={5} rowsPerPageOptions={[5,10,15]}
                                                       paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                                                <Column field={"studentNumber"} header="Student Number" filter
                                                        filterPlaceholder={"Search by student no"} sortable/>
                                                <Column field={"nameSurname"} header={"Name & Surname"} filter
                                                        filterPlaceholder={"Search by name"} sortable/>
                                                <Column field={"classroomName"} header="Class Name" filter
                                                        filterPlaceholder="Search by class name" sortable/>

                                            </DataTable>
                                        </Card>
                                    </Row>
                                </Container>
                            </div>
                        </Tab>
                        <Tab eventKey="Instructors" title={<span><PersonIcon/> Instructors</span>}>
                            &nbsp;
                            <h3 className={"mb-3 mt-4"} >
                                <Message style={{fontSize: "44px"}} severity="info"
                                         text={"Number of instructors in the system: " + this.state.numberOfInstructors}/>
                            </h3>
                            <Container>
                                <Row>
                                    <Card>
                                        <DataTable value={this.state.instructors} className="p-datatable-striped" rowHover
                                                   emptyMessage={"There is no instructor registered in the system."}
                                                   paginator
                                                   paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={5} rowsPerPageOptions={[5,10,15]}
                                                   paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                                            <Column field={"nameSurname"} header={"Name & Surname"} filter
                                                    filterPlaceholder={"Search by name"} sortable/>
                                            <Column field={"numberOfClassrooms"} header={"Number of registered classes"} sortable/>

                                        </DataTable>
                                    </Card>
                                </Row>
                            </Container>
                        </Tab>
                        <Tab eventKey="Classes" title={<span><DashboardIcon/> Classes</span>}>
                            &nbsp;
                            <h3 className={"mb-3 mt-4"} >
                                <Message style={{fontSize: "44px"}} severity="info"
                                         text={"Number of classrooms in the system: " + this.state.numberOfClassrooms}/>
                            </h3>
                            <Container className={"mb-3"}>
                                <Row>
                                    <Card>
                                        <DataTable value={this.state.classrooms} className="p-datatable-striped" rowHover
                                                   emptyMessage={"There is no classroom."}
                                                   paginator
                                                   paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={5} rowsPerPageOptions={[5,10,15]}
                                                   paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                                            <Column field={"englishLevel"} header="Level" sortable/>
                                            <Column field={"className"} header="Class Name" filter
                                                    filterPlaceholder="Search by class name"/>
                                            <Column field={"numberOfStudents"} header="Registered Students" sortable/>
                                        </DataTable>
                                    </Card>
                                </Row>
                            </Container>
                        </Tab>
                    </Tabs>
                </Container>


            </div>
        )
    }
}
