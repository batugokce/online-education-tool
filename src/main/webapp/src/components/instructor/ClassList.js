import React, {Component} from "react";
import {ProgressSpinner} from "primereact/progressspinner";
import axios from "axios";
import authHeader from "../service/authHeader";
import {Link} from 'react-router-dom';
import InstructorNavbar from "./InstructorNavbar";
import {DataTable} from 'primereact/datatable';
import Container from "react-bootstrap/Container";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {Column} from "primereact/column";


export default class ClassList extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            classList: [],
        }
    };

    componentDidMount() {
        this.retrieveClasses();
    };

    retrieveClasses() {
        let username = localStorage.getItem("username");
        axios.get("/api/v1/classroom/allClasses/" + username, {headers: authHeader()})
            .then(response => {
                this.setState({
                    classList: response.data.data,
                    isLoading: false
                });
            })

    }
    generateButton= (rowData) =>{
        return(
            <Link to={"/instructor/class-detail/" + rowData.id} >
                <Button type="button" icon="pi pi-eye" className="p-button-info mx-1"
                        onClick={() => console.log("")}/>
            </Link>
        )
    }
    render() {
        const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
        const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;
        return (
            this.state.isLoading ?
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <ProgressSpinner className="p-d-block p-mx-auto" style={{width: '50px', height: '50px'}}
                                     strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                </div>
                : <div>
                    <InstructorNavbar/>
                <br/> <br/>
                <Container className={"mt-3"} style={{"maxWidth": "1600px"}}>
                    <h5> Your classes are listed in below table. You can click the class name for further details.</h5>
                    <Card>
                        <DataTable
                            value={this.state.classList.sort((a, b) => (a.id > b.id) ? 1 : -1)}
                            className="p-datatable-striped" rowHover
                            emptyMessage={"There is no classroom registered in the system."}
                        paginator
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={5} rowsPerPageOptions={[5,10,15]}
                        paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                            <Column field={"className"} header="Class Name" filter filterPlaceholder={"Search by class Name"} sortable/>
                            <Column field={"englishLevel"} header="English Level" sortable />
                            <Column field={"capacity"} header="Capacity" sortable />
                            <Column body={this.generateButton} headerStyle={{width:'10em', textAlign: 'center'}}
                                    bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                        </DataTable>
                    </Card>
                </Container>
                </div>
        );
    }
}