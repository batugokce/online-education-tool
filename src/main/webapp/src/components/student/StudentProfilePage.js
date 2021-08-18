import React, {Component} from "react";
import StudentNavbar from "./StudentNavbar";
import axios from 'axios';
import authHeader from "../service/authHeader";
import {Card, Col, Row, Upload} from "antd";
import Image from 'react-bootstrap/Image'
import UploadService from "../service/UploadService";
import {ProgressSpinner} from "primereact/progressspinner";
import {View} from "@react-pdf/renderer";
import {Toast} from "primereact/toast";
import {Container} from "react-bootstrap";
import "./StudentProfilePage.css";
import {Label} from "@material-ui/icons";

export default class StudentProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            image: null,
            name: "",
            surname: "",
            email: "",
            telnum: "",
            username: "",
            studentno: "",
            comp1: false,
            comp2: false,
            comp3: false,
            comp4: false,
            comp5: false,
            term1: "",
            term2: "",
            term3: "",
            term4: "",
            term5: "",
            term6: "",
            term7: "",
            noteditable: true,
        };
        this.handleSubmitName = this.handleSubmitName.bind(this);
        this.handleSubmitSurname = this.handleSubmitSurname.bind(this);
        this.handleSubmitEmail = this.handleSubmitEmail.bind(this);
        this.handleSubmitTelephoneNumber = this.handleSubmitTelephoneNumber.bind(this);
        this.handleSubmitPass = this.handleSubmitPass.bind(this);
        this.handleSubmitStudentNo = this.handleSubmitStudentNo.bind(this);
        this.changeValue = this.changeValue.bind(this);


    }

    componentDidMount() {
        this.retrieveUser();
        this.getImage();
    }

    retrieveUser() {
        let username = localStorage.getItem("username");
        axios.get("/api/v1/student/findByName/" + username, {headers: authHeader()})
            .then(response => {
                this.setState({
                    name: response.data.data.name,
                    surname: response.data.data.surname,
                    email: response.data.data.email_address,
                    telnum: response.data.data.telephone_number,
                    username: response.data.data.username,
                    studentno: response.data.data.studentno,
                })
            })
    }
    getImage(){
        let username = localStorage.getItem("username");
        axios.get("/api/v1/student/getImage/"+username,{headers:authHeader()})
            .then(response=>{
                if(response.data.data!=null)
                {
                    this.setState({
                        image:response.data.data.image
                    })
                }
            });
    }
    imageremove(){
        let username=localStorage.getItem("username");
        axios.get("")
    }
    imagesend() {
        let currentFile = this.state.imagesend;
        let username = localStorage.getItem("username");
        let FormData = new FormData();
        FormData.append("file", this.state.imagesend);
        axios.post("/api/v1/student/changeImage/" + username, FormData, {headers: authHeader() + {"Content-Type": "multipart/form-data"}})
            .then(response => {
                this.setState({imagesend: undefined})
            })

    }

    selectfile = event => {
        this.setState({selectedFile: event.target.files[0]});
    }
    imageupload = () => {
        const form = new FormData();
        let username = localStorage.getItem("username");
        form.append("file", this.state.selectedFile);
        axios.post("api/v1/student/changeImage/" + username, form, {headers: authHeader()});
        window.location.reload();

    }

    changeValue(e) {
        let id = e.target.id;
        let value = e.target.value;
        if (id == 'name') {
            this.setState({term1: e.target.value});
        } else if (id == 'surname') {
            this.setState({term2: e.target.value});
        } else if (id == 'email') {
            this.setState({term3: e.target.value});
        } else if (id == 'telnum') {
            this.setState({term4: e.target.value});
        } else if (id == 'pass1') {
            this.setState({term5: e.target.value});
        } else if (id == 'pass2') {
            this.setState({term6: e.target.value});
        }
        else if(id=='studentno'){
            this.setState({term7: e.target.value});
        }
        else if (id = 'image') {
            this.setState({selectedFile: e.target.files[0]});
        }


    }

    handleSubmitName(event) {
        let username = localStorage.getItem("username");
        axios.post("api/v1/student/changeName/" + username + "?newname=" + this.state.term1, null, {headers: authHeader()})
            .then(response => {
                if (response.data.type == "success") {
                    this.showToast(response.data.type, response.data.message);
                }
            });
        this.setState({comp1: false, name: this.state.term1, term1: ""})
    }
    handleSubmitStudentNo(event) {
        let username = localStorage.getItem("username");
        axios.post("api/v1/student/changeStudentNo/" + username + "?newname=" + this.state.term7, null, {headers: authHeader()})
            .then(response => {
                if (response.data.type == "success") {
                    this.showToast(response.data.type, response.data.message);
                }
            });
        this.setState({comp7: false, name: this.state.term7, term7: ""})
    }

    handleSubmitSurname(event) {
        let username = localStorage.getItem("username");
        axios.post("api/v1/student/changeSurname/" + username + "?surname=" + this.state.term2, null, {headers: authHeader()})
            .then(response => {
                if (response.data.type == "success") {
                    this.showToast(response.data.type, response.data.message);
                }
            });
        this.setState({comp2: false, surname: this.state.term2, term2: ""});
    }

    handleSubmitPass(event) {
        let username = localStorage.getItem("username");
        let oldpass = this.state.term5;
        let newpass = this.state.term6
        axios.post("api/v1/student/changePassword/" + username, {
            oldpass: this.state.term5,
            newpass: this.state.term6
        }, {headers: authHeader()})
            .then(response => {
                if (response.data.type !== "success") {
                    this.showToast(response.data.type, response.data.message);
                } else {
                    this.showToast(response.data.type, response.data.message);
                }
            });
    }

    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
    }

    handleSubmitEmail(event) {
        let username = localStorage.getItem("username");
        axios.post("api/v1/student/changeEmail/" + username + "?email=" + this.state.term3, null, {headers: authHeader()})
            .then(response => {
                if (response.data.type == "success") {
                    this.showToast(response.data.type, response.data.message);
                }
            });
        this.setState({comp3: false, email: this.state.term3, term3: ""})
    }

    handleSubmitTelephoneNumber(event) {
        let username = localStorage.getItem("username");
        axios.post("api/v1/student/changeTelephone/" + username + "?telnum=" + this.state.term4, null, {headers: authHeader()})
            .then(response => {
                if (response.data.type == "success") {
                    this.showToast(response.data.type, response.data.message);
                }
            });
        this.setState({comp4: false, telnum: this.state.term4, term4: ""})
    };

    render() {
        function MyImage(props) {
            const data = props.data;
            if (data != null) {
                return <Image id="profilepic" src={`data:image/jpeg;base64,${data}`} alt="profilepic" width="170"
                              height="170"/>;
            } else {
                return <Image src="default.png" roundedCircle width="110" height="110" alt="profilepic" roundedCircle/>;

            }
        };

        return (
            <div>
                <StudentNavbar/>
                <br/>
                <div>
                    <section style={{border: '2px black'}}>
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">


                                    <Row>
                                        <Col><MyImage data={this.state.image}/></Col>

                                        <Col><h2>{this.state.name} {this.state.surname}</h2></Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
                <section className="page">
                    <div id="intro">
                        <h1>Profile</h1>
                        <div className="row">
                            <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                <h5>Username:</h5>
                            </div>
                            <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">{this.state.username}</div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                <h5>Name:</h5>
                            </div>
                            {this.state.noteditable ? <div
                                    className="col-md-5 col-form-label d-flex pb-0 pr-md-0">{this.state.name}</div> :
                                <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                    <form onSubmit={this.handleSubmitName}>
                                        <label>
                                            <input type="number" id="name" value={this.state.term1}   placeholder={this.state.name} onChange={(e) => this.changeValue(e)}/>
                                        </label>
                                        <input type="submit" value="Submit"/>
                                    </form>
                                </div>}
                        </div>
                        <div className="row">
                            <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                <h5>Surname:</h5>
                            </div>
                            {this.state.noteditable ? <div
                                    className="col-md-5 col-form-label d-flex pb-0 pr-md-0">{this.state.surname}</div> :
                                <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                    <form onSubmit={this.handleSubmitSurname}>
                                        <label>
                                            <input type="number" id="surname" value={this.state.term2}   placeholder={this.state.surname} onChange={(e) => this.changeValue(e)}/>
                                        </label>
                                        <br/>
                                        <input type="submit" value="Submit"/>
                                    </form>
                                </div>}

                        </div>
                        <div className="row">
                            <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                <h5>E-mail:</h5>
                            </div>
                            {this.state.noteditable ? <div
                                    className="col-md-5 col-form-label d-flex pb-0 pr-md-0">{this.state.email}</div> :
                                <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                    <form onSubmit={this.handleSubmitEmail}>
                                        <label>
                                            <input type="number" id="email" value={this.state.term3} placeholder={this.state.email} onChange={(e) => this.changeValue(e)}/>
                                        </label>
                                        <br/>
                                        <input type="submit" value="Submit"/>
                                    </form>
                                </div>}
                        </div>
                        <div className="row">
                            <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                <h5>Telephone number:</h5>
                            </div>
                            {this.state.noteditable ? <div
                                    className="col-md-5 col-form-label d-flex pb-0 pr-md-0">{this.state.telnum}</div> :
                                <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                    <form onSubmit={this.handleSubmitTelephoneNumber}>
                                        <label>
                                            <input type="number" id="telnum" value={this.state.term4}   placeholder={this.state.telnum} onChange={(e) => this.changeValue(e)}/>
                                        </label>
                                        <input type="submit" value="Submit"/>
                                    </form>
                                </div>}
                        </div>
                        <div className="row">
                            <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                <h5>Student no:</h5>
                            </div>
                            {this.state.noteditable ? <div
                                    className="col-md-5 col-form-label d-flex pb-0 pr-md-0">{this.state.studentno}</div> :
                                <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                    <form onSubmit={this.handleSubmitStudentNo}>
                                        <label>
                                            <input type="number" id="studentno" value={this.state.term7}   placeholder={this.state.studentno} onChange={(e) => this.changeValue(e)}/>
                                        </label>
                                        <input type="submit" value="Submit"/>
                                    </form>
                                </div>}
                        </div>
                        {this.state.noteditable? <div></div>:
                            <div className="row">
                                <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                    <h5>Change Profile Picture:</h5>
                                </div>
                                <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                    <label className="btn btn-default">
                                        <input type="file" id="image"  onChange={(e) => { this.changeValue(e)}} />
                                        <button className="btn btn-success"
                                                onClick={this.imageupload}
                                        >
                                            Upload
                                        </button>

                                    </label>

                                </div>
                            </div>}
                            {this.state.noteditable? <div></div>:
                            <div className="row">
                                <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                    <h5>Remove Profile Picture:</h5>
                                </div>
                                <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                    <button className="btn"
                                            onClick={this.imageremove}
                                    >
                                        Remove
                                    </button>


                                </div>
                            </div>}
                        {this.state.noteditable ? <div></div> :
                            <div className="row">
                                <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                    <h5>Change Password</h5>
                                </div>

                                <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                    <form onSubmit={this.handleSubmitPass}>
                                        <input type="password" id="pass1" value={this.state.term5} placeholder="Old password" onChange={(e) => this.changeValue(e)}/>
                                        <br/><br/>
                                        <input type="password" id="pass2" value={this.state.term6}  placeholder="New password"onChange={(e) => this.changeValue(e)}/>
                                        <br/><input type="submit" value="Change password"/>
                                    </form>
                                </div>
                            </div>}
                        <div>
                            <br/><br/>
                            <p align="center">
                                <button className="btn btn-primary"
                                        onClick={event => this.setState({noteditable: !this.state.noteditable})}>
                                    Edit Profile
                                </button>
                            </p>
                        </div>

                    </div>

                    <div id="col2a"> <h1 align='center'>Classroom Information</h1>
                        <div className="row">
                            <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                <h5>Instructor name:</h5>
                            </div>
                            <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                Temp value
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                <h5>Classroom Name</h5>
                            </div>
                            <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                Temp value
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                <h5>Student count</h5>
                            </div>
                            <div className="col-md-5 col-form-label d-flex pb-0 pr-md-0">
                                Temp value
                            </div>
                        </div>
                        <p>Maybe a link to go to the list of students can be added here.</p>
                    </div>
                    <div id="col2b"><h1 align='center'>Grades Information</h1>
                    <p>Grade information can be added,level can be added,information on progress can be added.</p></div>
                </section>

            </div>

        );
    }

}
