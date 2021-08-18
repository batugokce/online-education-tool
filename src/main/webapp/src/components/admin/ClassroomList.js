import React, {Component} from 'react';
import AdminNavbar from "./AdminNavbar";
import Container from "react-bootstrap/Container";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios';
import {ProgressSpinner} from "primereact/progressspinner";
import authHeader from "../service/authHeader";
import Row from 'react-bootstrap/Row';
import {Link} from "react-router-dom";
import Card from "react-bootstrap/Card";

class ClassroomList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            classrooms: [],
            isLoading: true
        }
    }

    redirectToLogin = () => {
        this.props.history.push("/")
    }
    redirectToCreateClassroom = () => {
        this.props.history.push("/admin/new-class")
    }


    componentDidMount = () => {
        axios.get("/api/v1/classroom/listForAdmin", {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                console.log(responseObject.data)
                this.setState({
                    classrooms: responseObject.data,
                    isLoading: false
                })
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
            })
    }

    goToClassPage = (rowData) => {
        return (
            <Link to={"/admin/class/"+rowData.id} >
                <Button type="button" icon="pi pi-eye" className="p-button-info"/>
            </Link>

        );
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

                <Container className="py-4">
                    <Row className="py-3">
                        <Button icon="pi pi-plus"
                                label={"New Classroom"} onClick={this.redirectToCreateClassroom} />
                    </Row>
                    <Row>
                        <Card>
                        <DataTable value={this.state.classrooms} className="p-datatable-striped" rowHover
                                    emptyMessage={"There is no classroom."}
                                   paginator
                                   paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={5} rowsPerPageOptions={[5,10,15]}
                                   paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                            <Column field={"englishLevel"} header="Level" sortable/>
                            <Column field={"className"} header="Class Name" filter filterPlaceholder="Search by class name" />
                            <Column field={"numberOfStudents"} header="Registered Students" sortable/>
                            <Column body={this.goToClassPage} headerStyle={{width: '5em', textAlign: 'center'}} bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                        </DataTable>
                        </Card>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ClassroomList;