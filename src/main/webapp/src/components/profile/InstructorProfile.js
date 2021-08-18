import React, {Component} from "react";
import Image from "react-bootstrap/Image";
import {ProgressSpinner} from "primereact/progressspinner";
import InstructorNavbar from "../instructor/InstructorNavbar";
import axios from "axios";
import authHeader from "../service/authHeader";
import "./ProfileMain.css";
import {Toast} from "primereact/toast";
import {Input, TextField} from "@material-ui/core";
import Button from "react-bootstrap/Button";
import {Dialog} from "primereact/dialog";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";

const MyImage = (props) => {
    const data = props.data;
    if (data != null) {
        return <Image id="profilepic" roundedCircle src={`data:image/jpeg;base64,${data.image}`} alt="profilepic" width="100"
                      height="100"/>;
    } else {
        return <Image src="default.png" roundedCircle width="100" height="100" alt="profilepic" roundedCircle/>;

    }
};
export default class InstructorProfile extends Component{
    constructor() {
        super();
        this.state = {
            isLoading: true,
            navbar: '',
            name: '',
            surname: '',
            telephoneNumber: '',
            studentNumber: '',
            emailAddress: '',
            englishLevel:'',
            id: 0,
            type: '',
            className:'',
            capacity:'',
            image: null,
            class:null,
            canEdit:false,
            editProfile:false,
            newProfilePicture:null,
            ext:null,
            visibilityOfDialog:false,
            newPassword:null,
            confirmPassword:null,
            showPassword1:false,
            showPassword2:false,
            showPassword3:false,
        }
    }
    componentDidMount() {
        this.getUser();
        this.getProfilePicture();
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
    getUser() {
        axios.get("/api/v1/personInformation/get/" + localStorage.getItem("username"), {headers: authHeader()})
            .then(response => {
                if(response.data.data.type==="STUDENT"){
                    this.setState({
                        type:response.data.data.type,
                        name: response.data.data.name,
                        studentNumber: response.data.data.studentNo,
                        surname: response.data.data.surname,
                        telephoneNumber: response.data.data.telephoneNumber,
                        emailAddress: response.data.data.emailAddress,
                        id: response.data.data.id,
                        username: response.data.data.username
                    })
                }
                else if(response.data.data.type==="INSTRUCTOR"){
                    this.setState({
                        type:response.data.data.type,
                        name: response.data.data.name,
                        surname: response.data.data.surname,
                        telephoneNumber: response.data.data.telephoneNumber,
                        emailAddress: response.data.data.emailAddress,
                        id: response.data.data.id,
                        username: response.data.data.username
                    })
                }
                if(this.state.username===localStorage.getItem("username")){
                    this.setState({
                        canEdit:true
                    })
                }
            })
    }
    editProfile(e){
        this.setState({
            editProfile:!this.state.editProfile
        })
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
                        image: response.data.data,
                        isLoading:false
                    }
                )
            });
    }
    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
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
    redirectToLogin = () => {
        this.props.history.push("/")
    }
    saveChanges(e){
        let instructor = {
            id: this.state.id,
            name: this.state.name,
            surname: this.state.surname,
            emailAddress: this.state.emailAddress,
            telephoneNumber: this.state.telephoneNumber
        };
        axios.put("/api/v1/personInformation/updateInstructor", instructor, {headers: authHeader()})
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
                }
                else {
                    this.showToast("error", "Check the fields and try again")
                }
            })
        window.location.reload();
    }
    changeTel(e){
        this.setState({
            telephoneNumber:e.target.value
        })
    }
    removeImage(){
        axios.get("/api/v1/personInformation/removeImage/"+localStorage.getItem("username"),{headers:authHeader()})
            .then(response=>{
                this.showToast("success","Removed Succesfully")
            })
        window.location.reload();
    }
    hiding=()=>{
        this.setState({visibilityOfDialog: false,
            oldPassword:"",
            newPassword:"",
            confirmPassword:""})
    }
    render(){
        return(
            this.state.isLoading ?
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <ProgressSpinner className="p-d-block p-mx-auto" style={{width: '50px', height: '50px'}}
                                     strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                </div>
                :
                <div>
                    <InstructorNavbar/>
                    <div className="container">
                        <Toast ref={(el) => this.toast = el}/>
                        <div className="main-body">
                            <div className="row gutters-sm">
                                <div className="col-md-4 mb-3" align="center">
                                    <div className="card" style={{height: "40em"}}>
                                        <div className="card-body">
                                            <div className="d-flex flex-column align-items-center text-center my-auto">
                                                <MyImage data={this.state.image} />
                                                <div className="mt-3">
                                                    {<h4>{this.state.name} {this.state.surname}</h4>}
                                                </div>
                                                {this.state.editProfile ?
                                                    <div>
                                                        <input accept="image/*" type="file" onChange={(e) =>this.changeImage(e)}/>
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
                                    <div className="card mb-3">
                                        <div className="card-body" style={{height: "40em"}}>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0"> Username:</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                   <p>{this.state.username}</p>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0"> Name:</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                   <p>{this.state.name}  {this.state.surname}</p>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0"> Email address</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {this.state.editProfile ? <TextField readOnly type="text" value={this.state.emailAddress}/> : <p>{this.state.emailAddress}</p> }
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
                                                {this.state.editProfile  ?
                                                    <Button className="btn btn-primary" onClick={(e)=>this.saveChanges(e)}>Save</Button>:null}
                                                &nbsp;&nbsp;
                                                <span>
                                                {this.state.canEdit ?
                                                    <Button className="btn btn-dark" onClick={(e) => this.editProfile(e)}>
                                                        {this.state.editProfile ?
                                                            "Return":
                                                            "Edit Profile"}
                                                    </Button>
                                                    :null}
                                                </span>
                                            </p >
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}