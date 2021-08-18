import React, {Component} from "react";
import axios from "axios";
import authHeader from "../service/authHeader";
import {ProgressSpinner} from "primereact/progressspinner";
import InstructorNavbar from "../instructor/InstructorNavbar";
import {useTable} from "react-table";
import Image from "react-bootstrap/Image";
import StudentNavbar from "../student/StudentNavbar";
import {Box, Input, TextField} from "@material-ui/core";
import {Toast} from "primereact/toast";
import {Dialog} from "primereact/dialog";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import {InputText} from "primereact/inputtext";
import Row from "react-bootstrap/Row";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import './ProfileMain.css';
import {Form} from "antd";
import Button from "react-bootstrap/Button";
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

export default class StudentProfile extends Component{
    constructor() {
        super();
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
            editProfile:false,
            canEdit:false,
            ext:null,
            newProfilePicture:null,
            visibilityOfDialog:false,
            oldPassword:null,
            newPassword:null,
            confirmPassword:null,
            showPassword1:false,
            showPassword2:false,
            showPassword3:false,
            averageAsNum:0

        }
    }
    componentDidMount() {
        this.getUser();
        this.getAssignments();
        this.getProfilePicture();
    }

    getUser() {
        axios.get("/api/v1/personInformation/get/" + localStorage.getItem("username"), {headers: authHeader()})
            .then(response => {
                this.setState({name: response.data.data.name,
                    studentNumber: response.data.data.studentNo,
                    surname: response.data.data.surname,
                    telephoneNumber: response.data.data.telephoneNumber,
                    emailAddress: response.data.data.emailAddress,
                    id: response.data.data.id,
                    username: response.data.data.username
                })
                if(localStorage.getItem("username")===this.state.username){
                    this.setState({
                        canEdit:true
                    })
                }
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

    saveChanges = () => {
        let student = {
            id: this.state.id,
            name: this.state.name,
            surname: this.state.surname,
            emailAddress: this.state.emailAddress,
            telephoneNumber: this.state.telephoneNumber ,
            studentNumber: this.state.studentNumber,
        };

        console.log(student);

        axios.put("/api/v1/personInformation/updateStudent", student, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;

                if ( responseObject.type === "ERROR" || responseObject.type === "WARN") {
                    this.showToast(responseObject.type, responseObject.message)
                }
                else {
                    this.showToast("success", "Student has been updated successfully")
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
        window.location.reload();
    }
    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
    }
    redirectToLogin = () => {
        this.props.history.push("/")
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
        axios.get("api/v1/classroom/assignmentOfStudent/"+localStorage.getItem("username"),{headers:authHeader()})
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
                    averageAsNum:(average/response.data.data.length).toFixed(2),
                    maxPoint:( maxGrade/response.data.data.length).toFixed(2),
                    finishedClassAverage:finishedCount===0? 0: (finishedAverageSum/finishedCount).toFixed(2),
                    finishedPointAverage:finishedCount===0? 0:(finishedPointSum/finishedCount).toFixed(2),
                    finishedMaxAverage:finishedCount===0? 0:(finishedMaxSum/finishedCount).toFixed(2),
                    finishedCount:finishedCount
                })


            });


    }
    changeValue(e) {
        let id = e.target.id;
        let value = e.target.value;
        if (id === 'oldPassword') {
            this.setState({
                oldPassword: value
            })
        } else if(id=='newPassword') {
            this.setState({
                newPassword: value
            })
        }
        else if(id=='confirmPassword') {
            this.setState({
                confirmPassword: value
            })
        }
    }
    getProfilePicture() {
        axios.get("api/v1/personInformation/getImage/" + localStorage.getItem("username"), {headers: authHeader()})
            .then(response => {
                this.setState(
                    {
                        image: response.data.data
                    }
                )
            });
    }

    removeImage(){
        axios.get("/api/v1/personInformation/removeImage/"+localStorage.getItem("username"),{headers:authHeader()})
            .then(response=>{
                this.showToast("success","Removed Succesfully")
            })

    }
    changeImage(e){
        let ext=e.target.value.match(/\.([^\.]+)$/)[1];
        switch(ext){
            case 'jpg':
            case 'bmp':
            case 'png':
            case 'tif':
                this.setState({
                    newProfilePicture:e.target.files[0],
                    ext:ext
                });
                break;
            default:
                this.showToast("error","Please only select image files.");
                this.setState({
                    ext:null
                });
        }

    }
    imageUpload(e){
        if(this.state.ext!=null){
            const form = new FormData();
            form.append("file", this.state.newProfilePicture);
            axios.post("api/v1/personInformation/changeImage/"+localStorage.getItem("username"),form,{headers:authHeader()})
                .then(response=>{
                    this.showToast(response.data.type,response.data.message)
                })
        }
        window.location.reload();
    }
    editProfile(e){
        this.setState({
            editProfile:!this.state.editProfile
        })
    }
    hiding=()=>{
        this.setState({visibilityOfDialog: false,
                            oldPassword:"",
                            newPassword:"",
                            confirmPassword:""})
        }
    changePassword=()=>{
        if(this.state.oldPassword==null || this.state.newPassword == null || this.state.confirmPassword==null)
            this.showToast("error","Fields can not be left blank")
        else{
            if(this.state.newPassword!==this.state.confirmPassword)
                this.showToast("error","Passwords do not match")
            else if(this.state.newPassword.length<8)
                this.showToast("error","Password length must be greater than 8")
            else if(!(/[A-Z]/.test(this.state.newPassword)) || !(/[a-z]/.test(this.state.newPassword)) || !(/[0-9]/.test(this.state.newPassword)))
                this.showToast("error", 'Password should contain at least one uppercase,one lowercase and a numeric character');
            else{
                let data={
                    oldPass:this.state.oldPassword,
                    newPass:this.state.newPassword,
                    username:localStorage.getItem("username")
                };
                axios.post("forgot-password/changePass",data,{headers:authHeader()})
                    .then(response=>{
                        this.showToast(response.data.type,response.data.message);
                        if(response.data.type==="success"){
                            this.setState({visibilityOfDialog:false})
                        }
                    })
            }
        }
    }
    changeTel(e){
        this.setState({
            telephoneNumber:e.target.value
        })
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
                    <StudentNavbar/>
                    <div className="container">
                        <Toast ref={(el) => this.toast = el}/>
                        <div className="main-body">
                            <div className="row gutters-sm">
                                <div className="col-md-4 mb-3">
                                    <div className="card" style={{height: "40em"}}>
                                        <div className="card-body">
                                            <div className="d-flex flex-column align-items-center text-center">
                                                <MyImage data={this.state.image}/>
                                                <div className="mt-3">
                                                    <h4>{this.state.name} {this.state.surname}</h4>
                                                    <br/>
                                                    <h5>Class: {this.state.className}</h5>
                                                </div>
                                                {this.state.editProfile ?
                                                    <div>
                                                        <label className="custom-file-upload">
                                                        <input accept="image/*" type="file" onChange={(e) =>this.changeImage(e)}/>
                                                        </label>
                                                        <Button className="btn btn-info" onClick={(e)=>this.imageUpload(e)}>Upload image</Button>
                                                        &nbsp;&nbsp;{this.state.image!=null ?<div style={{marginTop:'20px'}}>
                                                        <Button className="btn btn-danger"  onClick={()=>{if(window.confirm("Are you sure to delete your image")){
                                                        this.removeImage();
                                                    }}}>Remove image</Button></div>:null}
                                                    </div>

                                                    :
                                                    null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="card mb-3" style={{height: "40em"}}>
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
                                                    {this.state.name}  {this.state.surname}
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0"> Student Number:</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {this.state.studentNumber}
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0"> Email address</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {this.state.editProfile ? <TextField type="text" value={this.state.emailAddress} onChange={(e)=>this.setState({emailAddress:e.target.value})}/> : <a>{this.state.emailAddress}</a> }
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0"> Telephone Number:</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {this.state.editProfile ? <TextField type="text" value={this.state.telephoneNumber} onChange={(e)=>this.changeTel(e)}/> : <a>{this.state.telephoneNumber}</a> }
                                                </div>
                                            </div>
                                            <hr/>

                                            <p align={"right"}>
                                                {this.state.editProfile ?
                                                    <Button className="btn btn-info" onClick={()=>this.setState({visibilityOfDialog:true})} >Change Password</Button>:null}
                                                &nbsp;&nbsp;
                                                    <span>
                                                {this.state.editProfile  ?
                                                <Button className="btn btn-primary" onClick={(e)=>this.saveChanges(e)}>Save</Button>:null}
                                                &nbsp;&nbsp;

                                                {this.state.canEdit ?
                                                    <Button className="btn btn-dark" onClick={(e) => this.editProfile(e)}>
                                                        {this.state.editProfile ?
                                                            "Return":
                                                            "Edit Profile"}
                                                    </Button>
                                                    :null}
                                                </span>
                                            </p >
                                            <Box textAlign="center">

                                            </Box>
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

                            <p>&nbsp; Your finished assignments' average is: {this.state.finishedPointAverage}, classroom's average is: {this.state.finishedClassAverage}, max average is: {this.state.finishedMaxAverage} </p>
                            <p>&nbsp; Your average is {this.state.sum===  this.state.averageAsNum? <span> equal to </span> :this.state.sum<this.state.average ? <span className="bold red"> below than</span>:<span className="bold blue"> higher than</span>} classroom's average (considering all assignments).</p>
                            <p>&nbsp; Your average is {this.state.sum===  this.state.averageAsNum? <span> equal to</span> :this.state.finishedPointAverage<this.state.finishedClassAverage ? <span className="bold red">  below than</span>:<span className="bold blue"> higher than</span>} classroom's average (considering student's finished assignments).</p>
                        </div>
                    </div>
                    &nbsp;&nbsp;
                    <Dialog visible={this.state.visibilityOfDialog} style={{ width: '50vw' }} onHide={() => this.hiding()}>
                        <Container className={"mt-3"} style={{"maxWidth": "1600px"}}>
                            <Card>
                                <Row className={"my-2"} >
                                    <Col sm={{offset: "2", span: "3"}}  >
                                        <strong>Old Password</strong>
                                    </Col>
                                    <Col sm={{offset: "0", span: "7"}}>
                                        <Input type={this.state.showPassword1 ? "text" : "password"}
                                               onChange={(e)=>this.changeValue(e)}
                                               value={this.state.oldPassword}
                                               id="oldPassword"
                                               endAdornment={<InputAdornment position="end">
                                                   <IconButton onClick={(e)=>this.setState({showPassword1:!this.state.showPassword1})}
                                                               onMouseDown={this.handleMouseDownPassword}>
                                                       {this.state.showPassword1 ? <Visibility/> : <VisibilityOff/>}
                                                   </IconButton>
                                               </InputAdornment>}>
                                        </Input>
                                    </Col>
                                </Row>
                                <Row className={"my-2"} >
                                    <Col sm={{offset: "2", span: "3"}}  >
                                        <strong>New Password</strong>
                                    </Col>
                                    <Col sm={{offset: "0", span: "7"}}>
                                        <Input type={this.state.showPassword2 ? "text" : "password"}
                                               onChange={(e)=>this.changeValue(e)}
                                               value={this.state.newPassword}
                                               id="newPassword"
                                               endAdornment={<InputAdornment position="end">
                                                   <IconButton onClick={(e)=>this.setState({showPassword2:!this.state.showPassword2})}
                                                               onMouseDown={this.handleMouseDownPassword}>
                                                       {this.state.showPassword2 ? <Visibility/> : <VisibilityOff/>}
                                                   </IconButton>
                                               </InputAdornment>}>
                                        </Input>
                                    </Col>
                                </Row>
                                <Row className={"my-2"} >
                                    <Col sm={{offset: "2", span: "3"}}  >
                                        <strong>Confirm Password</strong>
                                    </Col>
                                    <Col sm={{offset: "0", span: "7"}}>
                                        <Input type={this.state.showPassword3 ? "text" : "password"}
                                               onChange={(e)=>this.changeValue(e)}
                                               value={this.state.confirmPassword}
                                               id="confirmPassword"
                                               endAdornment={<InputAdornment position="end">
                                                   <IconButton onClick={(e)=>this.setState({showPassword3:!this.state.showPassword3})}
                                                               onMouseDown={this.handleMouseDownPassword}>
                                                       {this.state.showPassword3 ? <Visibility/> : <VisibilityOff/>}
                                                   </IconButton>
                                               </InputAdornment>}>
                                        </Input>
                                    </Col>
                                </Row>
                                <p align={"right"}>
                                    {this.state.editProfile ?
                                        <Button className="btn btn-info" onClick={()=>this.changePassword()} >Change Password</Button>:null}
                                    &nbsp;&nbsp;
                                </p >

                            </Card>
                        </Container>
                    </Dialog>
                </div>
        )
    }
}