import React, {Component, useMemo} from "react";
import axios from "axios";
import authHeader from "../../service/authHeader";
import {ProgressSpinner} from "primereact/progressspinner";
import InstructorNavbar from "../InstructorNavbar";
import Table from "./Table";
import { Button } from 'primereact/button';
import {Link} from "react-router-dom";

export default class AssignmentList extends Component{

    constructor() {
        super();
        this.state={
            assignmentList:[],
            isLoading:true
        }
    }
    componentDidMount() {
        this.getAssignmentList();
    }
    redirectToLogin= () => {
        this.props.history.push("/");
    }

    getAssignmentList(){
        let username=localStorage.getItem("username");
        axios.get("api/v1/answer/assignments/"+username,{headers:authHeader()})
            .then(response=>{
                let responseObject=response.data;
                console.log(responseObject.data)
                if(responseObject.type=="success"){
                    this.setState({
                        assignmentList:responseObject.data,
                        isLoading:false
                    })
                }
            })
            .catch(error=>{
                if(error.response.status && error.response.status === 403)
                    this.redirectToLogin();
            })
    }

    columns=
    [
        {Header:"Class Information",
        columns:[{
            Header:"Class Name",
            accessor:"className"
        }]
        },
        {
            Header: "Assignment Information",
            columns: [{
                Header:"Assignment Name",
                accessor: "articleName",
            },
                {
                    Header: "Assignment Type",
                    accessor: "isWritten",
                    Cell: ({ cell: { value } }) => {
                        return (
                            <>
                                {value ? "Written" : "Test"}
                            </>
                        );
                    }
                },
            ]
        },
        {
            Header:"Student Information",
            columns:[
                {
                    Header:"Student UserName",
                    accessor: "links.username"
                },
                {
                    Header:"Student Name",
                    accessor: "name"
                },
                {
                    Header:"Student Surname",
                    accessor: "surname"
                },
            ]
        },
        {
            Header:"FEEDBACK GIVEN",
            accessor:"feedbackGiven",
            Cell: ({ cell: { value } }) => {
                return (
                    <>
                        {value==true ? <p>&#9989;</p>: <p>&#10006;</p>}
                    </>
                );
            }
        },
        {
            Header: "",
            accessor:"links",
            Cell: ({ cell: { value } }) => {
                return (
                    <>
                        <Link to={"/instructor/studentReview/"+value.articleID+"/"+value.username} >
                            <Button type="button" icon="pi pi-eye" className="p-button-info"/>
                        </Link>
                    </>
                );
            }

        }

    ]
    render() {
        return(this.state.isLoading ?
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                <ProgressSpinner className="p-d-block p-mx-auto"  style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
            </div> :
        <div>
            <InstructorNavbar/>
            <Table columns={this.columns} data={this.state.assignmentList}/>
        </div>)
    }
}