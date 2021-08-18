import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Image from "react-bootstrap/Image";
import axios from "axios";
import authHeader from "../service/authHeader";
import * as ReactBootstrap from 'react-bootstrap';
import Row from "react-bootstrap/Row";
import "../../styles/Notification.css";
import {Tooltip} from "primereact/tooltip";
import {Badge} from "primereact/badge";
//   <Dropdown options= {["Profile", "Log Out"]} onClick= {this.direct} onChange={(e) => {this.setState({opt: e.value})}}  placeholder="Select"/>


const MyImage = (props) => {
    const data=props.data;
    if (data!=null) {
        return <Image id="profilepic" roundedCircle src={`data:image/jpeg;base64,${data.image}`} alt="profilepic" width="30" height="30"/>;
    }
    else{
        return <Image src="default.png" width="30" height="30" alt="profilepic" roundedCircle/>;

    }
};

class StudentNavbar extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
        this.state = {
            image:null,
            name:"",
            surname:"",
            unreadNotificationsLength: 0
        };
    }

    logOut() {
        localStorage.clear();
    }
    componentDidMount() {
        let username=localStorage.getItem("username")
        this.retrieveUser(username);
        this.retrieveUnreadNotificationsLength(username);
        this.retrieveImage(username);
    }
    retrieveImage(username){
        axios.get("/api/v1/personInformation/getImage/"+username,{headers:  authHeader()})
            .then(response=>{
                this.setState({
                    image:response.data.data
                })
            })
    }
    retrieveUser(username){
        axios.get("/api/v1/student/findByName/"+username,{headers:authHeader()})
            .then(response => {
                this.setState({
                    name:response.data.data.name,
                    surname:response.data.data.surname,
                    className:response.data.data.className
                })
            })
    }

    /*
            <div className="navbar-brand">
                <li className="nav-item">
                    <p style={{color:"white"}}>CLASS-{this.state.className}</p>
                </li>
            </div>

     */
    retrieveUnreadNotificationsLength=(username)=>{
        axios.get("/api/v1/notification/retrieveUnreadLength/student/" + username, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                this.setState({
                    unreadNotificationsLength: responseObject.data
                });
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.showToast("error", "You are redirected to login page.")
                    this.redirectToLogin();
                }
            })
    }


    render() {
        let text = this.state.unreadNotificationsLength > 0 ? "You have " + this.state.unreadNotificationsLength + " new notification": "No new notification";
        return (
            <nav style={{background: "#380B61"}} className="navbar navbar-collapse navbar-dark">

                <Link to={"/student/home"} className="navbar-brand">
                    OET
                </Link>


                <div className="navbar-nav navbar-expand navbar-center">

                    <li className="nav-item mx-5">
                        <Link to={"/student/grades"} className="nav-link">
                            Grades
                        </Link>
                    </li>


                    <li className="nav-item mx-5">
                        <Link to={"/student/profile"} className="nav-link">
                            Profile
                        </Link>
                    </li>

                    <li className="nav-item mx-5">
                        <Link to={"/student/notification"} className="nav-link">
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon pi pi-bell p-text-secondary p-overlay-badge" data-pr-tooltip= {text} data-pr-position="right" data-pr-at="right+5 bottom" data-pr-my="left center+10" style={{ fontSize: '1.2rem', cursor: 'pointer' }}>
                                {this.state.unreadNotificationsLength > 0 ?  <Badge value={this.state.unreadNotificationsLength} severity="danger" /> : null}
                            </i>
                        </Link>
                    </li>

                </div>

                <div className="navbar-brand navbar-expand navbar-right">
                    <Row className={"justify-content-end align-items-end"}>
                        <div className="nav-item">

                            <Link to={"/student/profile"} className="nav-link">
                                <MyImage data={this.state.image}/>
                            </Link>

                        </div>
                        <div className="nav-item mr-5 ml-0">

                            <ReactBootstrap.NavDropdown
                                alignRight
                                title={this.state.name + " " + this.state.surname}
                            >
                                <ReactBootstrap.NavDropdown.Item>
                                    <Link
                                        style={{color:"black"}}
                                        to={"/student/profile"}
                                        className="nav-link"
                                    >
                                        Profile
                                    </Link>
                                </ReactBootstrap.NavDropdown.Item>
                                <ReactBootstrap.NavDropdown.Item >
                                    <Link
                                        style={{color:"black"}}
                                        to="/"
                                        className="nav-link"
                                        onClick={this.logOut}
                                    >
                                        Log Out
                                        &nbsp;&nbsp;&nbsp;
                                        <i className="pi pi-sign-out"/>
                                    </Link>

                                </ReactBootstrap.NavDropdown.Item>
                            </ReactBootstrap.NavDropdown>

                        </div></Row>

                </div>

            </nav>
        );
    }
}

export default StudentNavbar;

