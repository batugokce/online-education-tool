import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import './Paginator.css';

import React, {Component} from 'react';
import axios from "axios";
import authHeader from "../../service/authHeader";
import InstructorNavbar from "../InstructorNavbar";
import Container from "react-bootstrap/Container";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Link} from "react-router-dom";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {Toast} from "primereact/toast";
import {AutoComplete} from "primereact/autocomplete";
import Card from "react-bootstrap/Card";



export default class WrittenAssignmentList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            writtenAssignmentList:[],
            classroomList:[],
            classroomObjectArray: [],
            assignmentList:[],
            selectedClassroom: "",
            selectedAssignment: "",
            enteredStudentNumber: "",
            isLoadingQuery: true,
            isLoadingParametric:false,
            basicFirst: 0,
            basicRows: 5,
            assignmentNames:[],
            filteredAssignmentNames:null,
            studentNames:[],
            filteredStudentNames:null,
        };

        this.onClassChange = this.onClassChange.bind(this);
        this.onBasicPageChange = this.onBasicPageChange.bind(this);
        this.searchTitles=this.searchTitles.bind(this);
        this.searchNames=this.searchNames.bind(this);
    }

    componentDidMount() {
        this.getClasses();
        this.getAllWrittenAssignments();
        this.getParameters();
    }

    onBasicPageChange(event) {
        this.setState({
            basicFirst: event.first,
            basicRows: event.rows
        });
    }

    redirectToLogin= () => {
        this.props.history.push("/");
    }

    onClassChange(e) {
        console.log(e.value)
        this.setState({selectedClassroom: e.value});
    }

    onClickClearParameters = () =>{
        this.setState({
            selectedClassroom: "",
            selectedAssignment: "",
            enteredStudentNumber: "",
        })
        this.getAllWrittenAssignments();
    }

    onClickQuery = () =>{
        this.setState({
            isLoadingParametric:true
        })
        console.log(this.state.selectedClassroom+ " "+ this.state.selectedAssignment+ " " +this.state.enteredStudentNumber);
        this.getAllWrittenAssignmentsByParameters(this.state.selectedClassroom, this.state.selectedAssignment, this.state.enteredStudentNumber);
    }
    getParameters(){
        let instructorUsername = localStorage.getItem("username");
        axios.get("api/v1/answer/assignments/getParameters/"+instructorUsername,{headers:authHeader()})
            .then(response=>{
                this.setState({
                    assignmentNames:response.data.data.titles,
                    studentNames:response.data.data.names

                });

            })
    }
    getClasses = () => {
        let instructorUsername = localStorage.getItem("username");
        axios.get("/api/v1/classroom/listNamesForInstructor/"+ instructorUsername, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                //console.log(responseObject)
                if (responseObject.type === "success" || responseObject.type === "warn" ) {
                    let classroomList= responseObject.data;
                    this.setState({
                        classroomList: classroomList
                    })

                    this.state.classroomList.forEach(classroom=>
                        this.setState(prevState => ({
                            classroomObjectArray: [
                                ...prevState.classroomObjectArray,
                                {
                                    name: classroom,
                                    code: classroom
                                }
                            ]
                        })))
                }
                else if (responseObject.type === "error") {
                    console.log("error while fetching classroom list")
                }
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
            })
    }
    /*
    getWrittenAssignments =() => {
        //TODO:: adjust articleId and classId later on
        let articleId = 703; //653
        let classId = 2;
        axios.get("/api/v1/answer/writtenAssignments/"+ articleId +"/" + classId, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                console.log(responseObject)
                if (responseObject.type === "success" || responseObject.type === "warn" ) {
                    let writtenAssignmentList= responseObject.data;
                    this.setState({
                        writtenAssignmentList: writtenAssignmentList,
                    })
                    this.state.writtenAssignmentList.forEach(writtenAssignment=> {
                        if (writtenAssignment.graded) writtenAssignment.graded = <i className="pi pi-check"/>;
                        else writtenAssignment.graded = <i className="pi pi-times"/>;

                        if (writtenAssignment.feedbackGiven) writtenAssignment.feedbackGiven = <i className="pi pi-check"/>;
                        else writtenAssignment.feedbackGiven = <i className="pi pi-times"/>;

                        if (writtenAssignment.progressiveGrading) writtenAssignment.progressiveGrading = <i className="pi pi-check"/>;
                        else writtenAssignment.progressiveGrading = <i className="pi pi-times"/>;
                    })
                    this.setState(this.state.writtenAssignmentList)

                }
                else if (responseObject.type === "error") {
                    console.log("error while fetching written assignment list")
                }
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
            })
    }
     */

    getAllWrittenAssignments =() => {
        let instructorUsername = localStorage.getItem("username");
        axios.get("/api/v1/answer/writtenAssignments/"+  instructorUsername, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                console.log(responseObject)
                if (responseObject.type === "success") {
                    let writtenAssignmentList= responseObject.data;
                    this.setState({
                        writtenAssignmentList: writtenAssignmentList,
                    })
                    this.state.writtenAssignmentList.forEach(writtenAssignment=> {
                        if (writtenAssignment.graded) writtenAssignment.graded = <i className="pi pi-check"/>;
                        else writtenAssignment.graded = <i className="pi pi-times"/>;

                        if (writtenAssignment.feedbackGiven === "yes") writtenAssignment.feedbackGiven = <i className="pi pi-check"/>;
                        else writtenAssignment.feedbackGiven = <i className="pi pi-times"/>;

                        if (writtenAssignment.progressiveGrading) writtenAssignment.progressiveGrading = <i className="pi pi-check"/>;
                        else writtenAssignment.progressiveGrading = <i className="pi pi-times"/>;

                        if(writtenAssignment.isTest) writtenAssignment.isTest='Test'
                        else writtenAssignment.isTest='Written'
                    })
                    this.setState({
                        isLoadingQuery: false
                    })


                }
                else if (responseObject.type === "warn") {
                    this.showToast(responseObject.type, responseObject.message)
                }
                else if (responseObject.type === "error") {
                    console.log("error while fetching assignment list")
                }
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
            })
    }

    getAllWrittenAssignmentsByParameters =(className, assignmentName, studentNumber) => {
        if (className!=="" || assignmentName!=="" || studentNumber!==""){
            let instructorUsername = localStorage.getItem("username");
            let getWrittenAssignmentDTO = {
                className: className,
                assignmentName: assignmentName,
                studentNumber: studentNumber
            }
            axios.post("/api/v1/answer/writtenAssignmentsByParameters/" + instructorUsername , getWrittenAssignmentDTO, {headers: authHeader()})
                .then(response => {
                    let responseObject = response.data;
                    console.log(responseObject)
                    if (responseObject.type === "success") {
                        let writtenAssignmentList= responseObject.data;
                        this.setState({
                            writtenAssignmentList: writtenAssignmentList,
                        })
                        this.state.writtenAssignmentList.forEach(writtenAssignment=> {
                            if (writtenAssignment.graded) writtenAssignment.graded = <i className="pi pi-check"/>;
                            else writtenAssignment.graded = <i className="pi pi-times"/>;

                            if (writtenAssignment.feedbackGiven === "yes") writtenAssignment.feedbackGiven = <i className="pi pi-check"/>;
                            else writtenAssignment.feedbackGiven = <i className="pi pi-times"/>;

                            if (writtenAssignment.progressiveGrading) writtenAssignment.progressiveGrading = <i className="pi pi-check"/>;
                            else writtenAssignment.progressiveGrading = <i className="pi pi-times"/>;
                            if(writtenAssignment.isTest) writtenAssignment.isTest='Test'
                            else writtenAssignment.isTest='Written'
                        })
                        this.setState({
                            isLoadingParametric:false
                        })
                        this.showToast(responseObject.type, responseObject.message)

                    }
                    else if (responseObject.type === "warn") {
                        this.showToast(responseObject.type, responseObject.message)
                    }
                    else if (responseObject.type === "error") {
                        console.log("error while fetching assignment list by parameters")
                    }
                })
                .catch(error => {
                    if(error.response.status && error.response.status === 403){
                        console.log(error.response)
                        this.redirectToLogin();
                    }
                })
            }
    }

    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
    }

    actionBodyTemplate = (rowData) => {
        if(rowData.isTest=="Written") {
            return (
                <Link to={"/instructor/feedback/" + rowData.articleId + "/" + rowData.username}>
                    <Button type="button" icon="pi pi-eye" className="p-button-info"/>
                </Link>
            );
        }
        else{
            return (
                <Link to={"/instructor/studentReview/" + rowData.articleId + "/" + rowData.username}>
                    <Button type="button" icon="pi pi-eye" className="p-button-info"/>
                </Link>
            );
        }
    }
    searchTitles(event){
        console.log(event.query);
        setTimeout(()=>{
            let filteredAssignmentNames;
            if (!event.query.trim().length) {
                filteredAssignmentNames = [...this.state.assignmentNames];
            }
            else{
                filteredAssignmentNames = this.state.assignmentNames.filter((assignment) => {
                    return assignment.toLowerCase().includes(event.query.toLowerCase());
                });
            }
            this.setState({filteredAssignmentNames})
        },250)
    }
    searchNames(event){
        setTimeout(()=>{
            let filteredStudentNames;
            if (!event.query.trim().length) {
                filteredStudentNames = [...this.state.studentNames];
            }
            else{
                filteredStudentNames = this.state.studentNames.filter((student) => {
                    return student.toLowerCase().includes(event.query.toLowerCase());
                });
            }
            this.setState({filteredStudentNames})
        },250)
    }




    render() {
        //console.log(this.state.classroomObjectArray)
       // console.log(this.state.writtenAssignmentList)
        const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
        const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;

        return(
                <div>
                    <InstructorNavbar/>
                    <br/>
                    <Toast ref={(el) => this.toast = el} />
                    <Container className={"mt-3"} style={{"maxWidth": "1600px"}}>
                        <h5>ALL ASSIGNMENTS</h5>
                        <h6>You can enter the parameters below for a detailed query, then just click the Query button below.
                            As default, all assignments listed.</h6>
                        <div className="p-fluid p-formgrid p-grid">
                            <div className="p-field p-col-12 p-md-4">
                                <label htmlFor="assignment6">Assignment</label>
                                <AutoComplete id="assignment6" type="text" value={this.state.selectedAssignment} completeMethod={this.searchTitles} suggestions={this.state.filteredAssignmentNames} onChange={(e) => this.setState({selectedAssignment: e.target.value})}/>
                            </div>
                            <div className="p-field p-col-12 p-md-4">
                                <label htmlFor="class6">Class</label>
                                <Dropdown inputId="class6" value={this.state.selectedClassroom} options={this.state.classroomList} onChange={this.onClassChange} placeholder="Select class" />
                            </div>
                            <div className="p-field p-col-12 p-md-4">
                                <label htmlFor="student">Student Name</label>
                                <AutoComplete id="student" type="text" value={this.state.enteredStudentNumber} completeMethod={this.searchNames} suggestions={this.state.filteredStudentNames} onChange={(e) => this.setState({enteredStudentNumber: e.target.value})}/>
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={this.onClickQuery}>Query</button>
                        &nbsp;&nbsp;
                        <button className="btn btn-secondary" onClick={this.onClickClearParameters}>Clear Parameters </button>
                        <br/><br/>
                        { <Card>
                         <DataTable value={this.state.writtenAssignmentList} className="p-datatable-striped" rowHover
                                   emptyMessage="No student has submitted an answer yet."
                                    paginator
                                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={5} rowsPerPageOptions={[5,10,15]}
                                    paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                            <Column field="title" header="Assignment" sortable />
                            <Column field="username" header="Username" sortable />
                             <Column field="name" header="Student Name" sortable />
                             <Column field="className" header="Classroom" sortable />
                            <Column field="graded" header="Is Graded"/>
                            <Column field="point" header="Grade" sortable/>
                            <Column field="isTest" header="Type" />
                            <Column field="progressiveGrading" header="Progressive Grading" />
                            <Column field="feedbackGiven" header="Feedback / Last Draft Feedback Given"/>
                            <Column body={this.actionBodyTemplate} headerStyle={{width: '5em', textAlign: 'center'}} bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                        </DataTable>
                        </Card>}
                    </Container>
                </div>
        );
    }
}