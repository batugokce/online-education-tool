import React, { Component } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import authHeader from "../service/authHeader";
import Container from "react-bootstrap/Container";
import { Card } from 'primereact/card';
import { Toast } from "primereact/toast";

export default class UserCreateForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName:"",
            lastName:"",
            username:"",
            role:"",
            email:"",
            studentNumber:""
        };
    }

    handleValidation = () => {
        let fields = this.state;

        if(!fields["role"]){
            this.showToast("warn","Please choose a role!");
            return false;
        } if(!fields["firstName"]){
            this.showToast("warn","First name field is required.");
            return false;
        } if(!fields["lastName"]){
            this.showToast("warn","Last name field is required.");
            return false;
        } if(!fields["email"]){
            this.showToast("warn","E-mail field is required.");
            return false;
        } if(!fields["username"]){
            this.showToast("warn","Username field is required.");
            return false;
        } if(!fields["studentNumber"] && this.state.role==="Student") {
            this.showToast("warn","Student number field is required.");
            return false;
        }

        return true;
    }

    saveUser = () => {
        if(this.handleValidation()){
            let data = {
                name:this.state.firstName,
                surname:this.state.lastName,
                username:this.state.username,
                emailAddress:this.state.email
            };

            if(this.state.role==="Student"){
                data.studentNo=this.state.studentNumber;
                axios.post("/api/v1/student", data, {headers: authHeader()})
                    .then(response => {
                        let responseObject = response.data;
                        console.log(responseObject);
                        this.showToast(responseObject.type, responseObject.message);

                        if (responseObject.type === "success") {
                            this.clearFields();
                        }
                    })
                    .catch(e => {
                        console.log(e.response);
                    });
            }
            else{
                axios.post("/api/v1/instructor", data, {headers: authHeader()})
                    .then(response => {
                        let responseObject = response.data;
                        console.log(responseObject);
                        this.showToast(responseObject.type, responseObject.message);

                        if (responseObject.type === "success") {
                            this.clearFields();
                        }
                    })
                    .catch(e => {
                        console.log(e.response);
                    });
            }
        }
    }

    showToast = (type, message) => {
        this.toast.show({severity: type, detail: message});
    }

    clearFields = () => {
        this.setState({
            firstName:"",
            lastName:"",
            username:"",
            role:"",
            email:"",
            studentNumber:""
        });
    }

    render() {
        return (
            <div>
                <AdminNavbar/>
                <Toast ref={(el) => this.toast = el} />
                <Container className={"mt-3"} style={{"maxWidth": "800px"}} >
                    <Card>
                        <div className="form-group">
                            <label htmlFor="role">Choose a role</label>
                            <select className="form-control" id="role"
                                    required
                                    value={this.state.role}
                                    onChange={e => this.setState({role: e.target.value})}
                                    name="role">
                                <option defaultValue={"Choose..."}>Choose...</option>
                                <option>Student</option>
                                <option>Instructor</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                required
                                value={this.state.firstName}
                                onChange={e => this.setState({firstName: e.target.value})}
                                name="firstName"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                required
                                value={this.state.lastName}
                                onChange={e => this.setState({lastName: e.target.value})}
                                name="lastName"
                            />
                        </div>

                        <div className="form-group">
                            <label  htmlFor="email">E-mail</label>
                            <div className="input-group">
                                <input type="text" className="form-control" id="email"
                                       required
                                       value={this.state.email}
                                       onChange={e => this.setState({email: e.target.value})}
                                       placeholder="Enter a valid e-mail address"
                                />

                            </div>
                        </div>

                        <div className="form-group">
                            <label  htmlFor="username">Username</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <div className="input-group-text">@</div>
                                </div>
                                <input type="text" className="form-control" id="username"
                                       required
                                       value={this.state.username}
                                       onChange={e => this.setState({username: e.target.value})}
                                       placeholder="username"
                                />
                            </div>
                        </div>

                        {this.state.role==="Student" ? (
                            <div className="form-group">
                                <label htmlFor="studentNumber">Student Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="studentNumber"
                                    required
                                    value={this.state.studentNumber}
                                    onChange={e => this.setState({studentNumber: e.target.value})}
                                    name="studentNumber"
                                />

                            </div>

                        ):null
                        }

                        <button onClick={this.saveUser} className="btn btn-primary">
                            Submit
                        </button>
                    </Card>
                </Container>
            </div>
        );
    }
}