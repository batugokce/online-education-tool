import React, {Component} from "react";
import {ProgressSpinner} from "primereact/progressspinner";
import Image from "react-bootstrap/Image";
import {Link} from "react-router-dom";
import "./ProfileMain.css";
import axios from "axios";
import authHeader from "../service/authHeader";

import InstructorNavbar from "../instructor/InstructorNavbar";
import {useTable} from 'react-table';
import {CircularProgressbar,buildStyles} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

function MyTable({ columns, data }) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    })
    return (
        <table {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                    </tr>
                )
            })}
            </tbody>

            <tfoot style={{borderTop: "2px solid black"}}>
            {
                footerGroups.map(footerGroup => (
                    <tr {...footerGroup.getFooterGroupProps()}>
                        {
                            footerGroup.headers.map(column=>(
                                <td {... column.getFooterProps()}>
                                    {
                                        column.render('Footer')
                                    }
                                </td>
                            ))
                        }
                    </tr>
                ))
            }
            </tfoot>
        </table>
    )
}



const MyImage = (props) => {
    const data = props.data;
    if (data != null) {
        return <Image id="profilepic" roundedCircle src={`data:image/jpeg;base64,${data.image}`} alt="profilepic" width="90"
                      height="80"/>;
    } else {
        return <Image src="default.png" roundedCircle width="30" height="30" alt="profilepic" roundedCircle/>;

    }
};

export default class ProfileMain extends Component {
    constructor(props) {
        super(props);
        console.log("started")
        this.state = {
            isLoading: false,
            navbar: '',
            name: '',
            surname: '',
            telephoneNumber: '',
            studentNumber: '',
            emailAddress: '',
            englishLevel:'',
            id: 0,
            type: 'STUDENT',
            className:'',
            capacity:'',
            image: null,
            class:null,
            assignments:[],
            sum:0,
            average:0,
            maxPoint:0,
            finishedClassAverage:0,
            finishedPointAverage:0,
            finishedMaxAverage:0,
            finishedCount:0,
        }
    }

    componentDidMount() {
        this.getUser();
        this.getAssignments();

    }

    getUser() {
        axios.get("/api/v1/personInformation/get/" + this.props.match.params.userName, {headers: authHeader()})
            .then(response => {
                this.setState({name: response.data.data.name,
                    studentNumber: response.data.data.studentNo,
                    surname: response.data.data.surname,
                    telephoneNumber: response.data.data.telephoneNumber,
                    emailAddress: response.data.data.emailAddress,
                    id: response.data.data.id,
                    username: response.data.data.username
                })
                this.retrieveClassName(this.state.username);
            })
    }


    retrieveClassName(username){
        axios.get("/api/v1/student/findByName/"+username,{headers:authHeader()})
            .then(response => {
                this.setState({
                    className:response.data.data.className
                })
            })
    }

    getAssignments(){
        let sum=0;
        let average=0;
        let maxCount=0;
        let temp=0;
        let maxGrade=0;
        let finishedCount=0;
        let finishedPointSum=0;
        let finishedMaxSum=0;
        let finishedAverageSum=0;
        axios.get("api/v1/classroom/assignmentOfStudent/"+this.props.match.params.userName,{headers:authHeader()})
            .then(response=>{
                this.setState({
                    assignments:response.data.data,
                    isLoading: false
                })
                for(let i=0;i<response.data.data.length;i++){
                    sum+=parseFloat(response.data.data[i].point.replace(/,/,'.'));
                    average+=parseFloat(response.data.data[i].average.replace(/,/,'.'));
                    let temp=parseInt(response.data.data[i].average.substr(response.data.data[i].average.indexOf("(")+1));
                    if(temp>maxCount)
                        maxCount=temp;
                    maxGrade+=parseFloat(response.data.data[i].maxPoint);
                    if(response.data.data[i].text=="FINISHED"){
                        finishedCount++;
                        finishedPointSum+=parseFloat(response.data.data[i].point.replace(/,/,'.'));
                        finishedAverageSum+=parseFloat(response.data.data[i].average.replace(/,/,'.'));
                        finishedMaxSum+=parseFloat(response.data.data[i].maxPoint);
                    }
                }

                this.setState({
                    sum:(sum/response.data.data.length).toFixed(2),
                    average:(average/response.data.data.length).toFixed(2).toString()+"("+maxCount.toString()+")",
                    maxPoint:( maxGrade/response.data.data.length).toFixed(2),
                    finishedClassAverage:(finishedAverageSum/finishedCount).toFixed(2),
                    finishedPointAverage:(finishedPointSum/finishedCount).toFixed(2),
                    finishedMaxAverage:(finishedMaxSum/finishedCount).toFixed(2),
                    finishedCount:finishedCount
                })
            });


    }

    getProfilePicture() {
        axios.get("api/v1/personInformation/getImage/" + this.props.match.params.userName, {headers: authHeader()})
            .then(response => {
                this.setState(
                    {
                        image: response.data.data
                    }
                )
            });
    }


    render() {
        const columns=[
            {
                Header:"Assignment Name",
                accessor:"title",
                align:"center",
                Footer:"Averages:"
            },
            {
                Header:"Grade",
                accessor:"point",
                Footer:this.state.sum
            },
            {
                Header:"Average",
                accessor:"average",
                Footer:this.state.average
            },
            {
                Header:"Max grade",
                accessor:"maxPoint",
                Footer:this.state.maxPoint
            },
            {
                Header:"",
                accessor:"text"
            }
        ]

        return (
            this.state.isLoading ?
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <ProgressSpinner className="p-d-block p-mx-auto" style={{width: '50px', height: '50px'}}
                                     strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                </div>
                : <div>
                    <InstructorNavbar/>
                    <div className="container">
                        <div className="main-body">
                            <div className="row gutters-sm">
                                <div className="col-md-4 mb-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex flex-column align-items-center text-center">
                                                <MyImage data={this.state.image}/>
                                                <div className="mt-3">
                                                    <h4>{this.state.name} {this.state.surname}</h4>
                                                    <h5>Class: {this.state.className}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0"> Username:</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {this.state.username}
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0"> Name:</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {this.state.name} {this.state.surname}
                                                </div>
                                            </div>
                                            <hr/>
                                            {this.state.type == "STUDENT" ?
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <h6 className="mb-0"> Student Number:</h6>
                                                    </div>
                                                    <div className="col-sm-9 text-secondary">
                                                        {this.state.studentNumber}
                                                    </div>
                                                </div> :
                                                null
                                            }
                                            {this.state.type == "STUDENT" ? <hr/> : null}
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0"> Email address</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {this.state.emailAddress}
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0"> Telephone Number:</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {this.state.telephoneNumber}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="card h-100">
                            &nbsp;&nbsp;
                            <MyTable columns={columns} data={this.state.assignments.sort((a,b)=>a.articleId>b.articleId ? 0:-1)} />
                            &nbsp;&nbsp; &nbsp;&nbsp;
                            {this.state.finishedCount==0 ? <p>&nbsp; Student didn't finish any assignment</p>:<p>&nbsp; This student's finished assignments' average is: {this.state.finishedPointAverage}, classroom's average is: {this.state.finishedClassAverage}, max average is: {this.state.finishedMaxAverage} </p>}
                            <p>&nbsp; The student's average is {this.state.sum<this.state.average ? <span className="bold red"> below than</span>:<span className="bold blue"> is higher than</span>} classroom's average (considering all assignments).</p>
                            <p>&nbsp; The student's average is {this.state.finishedPointAverage<=this.state.finishedClassAverage ? <span className="bold red"> below than</span>:<span className="bold blue"> higher than</span>} classroom's average (considering student's finished assignments).</p>
                        </div>
                    </div>
                    &nbsp;&nbsp;
                </div>
        )
    }

}
