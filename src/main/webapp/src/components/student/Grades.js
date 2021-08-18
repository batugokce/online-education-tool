import React, { Component } from "react";
import {Link} from 'react-router-dom';
import StudentNavbar from "./StudentNavbar";
import Container from "react-bootstrap/Container";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios';
import {ProgressSpinner} from "primereact/progressspinner";
import authHeader from "../service/authHeader";
import Card from "react-bootstrap/Card";

class Grades extends Component {
    constructor() {
        super();

        this.state = {
            assignments: [],
            isLoading: true,
            a:"asdd"
        }
    }

    redirectToLogin = () => {
        this.props.history.push("/")
    }

    componentDidMount() {
        axios.get("/api/v1/answer/pastAssignments/"+localStorage.getItem("username"), {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                this.setState({
                    assignments: responseObject.data,
                    isLoading: false
                })
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
            })
    }

    actionBodyTemplate = (rowData) => {
        return (
            <Link to={"/student/assignment/"+rowData.articleId} >
                <Button type="button" icon="pi pi-eye" className="p-button-info"/>
            </Link>

        );
    }
    TrueOrFalse(rowData) {
        return (
            rowData.feedbackGiven ?
            <p>&#9989;</p>:
                <p>&#10006;</p>
        );
    }
    render () {
        const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
        const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;
        return (
            this.state.isLoading ?
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <ProgressSpinner className="p-d-block p-mx-auto"  style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                </div> :
            <div>
                 <StudentNavbar/>

                 <Container className={"mt-3"} style={{"maxWidth": "1600px"}}>
                     <Card>
                     <DataTable value={this.state.assignments} className="p-datatable-striped" rowHover
                                emptyMessage="You have not submitted an assignment yet."
                                paginator
                                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={5} rowsPerPageOptions={[5,10,15]}
                                paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                         <Column field="title" header="Assignment" filter filterPlaceholder="Search by title" />
                         <Column field="point" header="Grade"/>
                         <Column field="average" header="Average"/>
                         <Column field="maxPoint" header="Max Grade"/>
                         <Column field="feedbackGiven" header="FEEDBACK" body={this.TrueOrFalse}/>
                         <Column body={this.actionBodyTemplate} headerStyle={{width: '5em', textAlign: 'center'}} bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                     </DataTable>
                     </Card>
                 </Container>
            </div>  
        )
      }
}

export default Grades;