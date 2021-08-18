import axios from "axios";
import authHeader from "../service/authHeader";
import {ProgressSpinner} from "primereact/progressspinner";
import StudentNavbar from "../student/StudentNavbar";
import React, {Component} from "react";
import Image from "react-bootstrap/Image";
import {Form} from "antd";
import "./ProfileMain.css";
import Button from "@material-ui/core/Button";
import {Toast} from "primereact/toast";
const MyImage = (props) => {
    const data = props.data;
    if (data != null) {
        return <Image id="profilepic" roundedCircle src={`data:image/jpeg;base64,${data.image}`} alt="profilepic" width="90"
                      height="80"/>;
    } else {
        return <Image src="default.png" roundedCircle width="30" height="30" alt="profilepic" roundedCircle/>;

    }
};
export default class EditProfile extends Component{

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
            type: '',
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
        this.getProfilePicture();
        this.getUser();
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
    getUser() {
        axios.get("/api/v1/personInformation/get/" + localStorage.getItem("username"), {headers: authHeader()})
            .then(response => {
                this.setState({name: response.data.data.name,
                    studentNumber: response.data.data.studentNo,
                    surname: response.data.data.surname,
                    telephoneNumber: response.data.data.telephoneNumber,
                    emailAddress: response.data.data.emailAddress,
                    id: response.data.data.id,
                    username: response.data.data.username,
                    isLoading:false
                })
                if("studentNo" in response.data.data){
                    this.setState({
                        type:"student"
                    })
                }
                else{
                    this.setState({
                        type:"instructor"
                    })
                }


            })
    }
    changeValue(e){
        let id = e.target.id;
        let value = e.target.value;
        if(id=="telNum"){
            this.setState({
                telephoneNumber:value
            })
        }
        else{
            this.setState({
                emailAddress:value
            })
        }
    }
    submit(e){
        axios.post("api/v1/personInformation/editProfile/"+localStorage.getItem("username"),{username:localStorage.getItem("username"),
                                                                                                          email:this.state.emailAddress,
                                                                                                           telephoneNumber:this.state.telephoneNumber},{headers:authHeader()})
            .then(response=>{
                
            })
    }
    render() {

        return (
            this.state.isLoading ?
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <ProgressSpinner className="p-d-block p-mx-auto" style={{width: '50px', height: '50px'}}
                                     strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                </div>
                : <div>
                    <StudentNavbar/>
                    <Toast ref={(el) => this.toast = el}/>
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
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <Form>
                                                <Form.Item>
                                                    <label>Username</label>
                                                    <input type="text"
                                                           className="form-control"
                                                           id="username"
                                                           name="username"
                                                           value={this.state.username}
                                                           readonly/>
                                                </Form.Item>
                                                <Form.Item>
                                                    <label>Name</label>
                                                    <input type="text"
                                                           className="form-control"
                                                           id="name"
                                                           name="name"
                                                           value={this.state.name}
                                                           readonly/>
                                                </Form.Item>
                                                <Form.Item>
                                                    <label>Surname</label>
                                                    <input type="text"
                                                           className="form-control"
                                                           id="surname"
                                                           name="surname"
                                                           value={this.state.surname}
                                                           readonly/>
                                                </Form.Item>
                                                {this.state.type=="student" ?
                                                    <Form.Item>
                                                        <label>Student No</label>
                                                        <input type="text"
                                                               className="form-control"
                                                               id="studentNo"
                                                               name="studentNo"
                                                               value={this.state.studentNumber}
                                                               readonly/>
                                                    </Form.Item>:null}
                                                <Form.Item>
                                                    <label>Telephone Number</label>
                                                    <input type="text"
                                                           className="form-control"
                                                           id="telNum"
                                                           name="telNum"
                                                           value={this.state.telephoneNumber}
                                                           onChange={(e) => this.changeValue(e)}/>

                                                </Form.Item>
                                                <Form.Item>
                                                    <label>E-mail</label>
                                                    <input type="text"
                                                           className="form-control"
                                                           id="email"
                                                           name="email"
                                                           value={this.state.emailAddress}
                                                           onChange={(e) => this.changeValue(e)}/>
                                                </Form.Item>
                                                <Button fullWidth variant="contained"
                                                        color="primary"
                                                        onClick={(e) => this.submit(e)}
                                                        className="btn btn-primary"> Submit Changes </Button>
                                            </Form>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    &nbsp;&nbsp;
                </div>
        )
    }
}