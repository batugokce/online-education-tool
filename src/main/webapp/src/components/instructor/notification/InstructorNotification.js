import React,{Component} from "react";
import InstructorNavbar from "../InstructorNavbar";
import { Toast } from "primereact/toast";
import axios from "axios";
import authHeader from "../../service/authHeader";
import moment from "moment";
import {ProgressSpinner} from "primereact/progressspinner";
import Container from "react-bootstrap/Container";

export default class InstructorNotification extends Component {

    constructor(props) {
        super(props);

        this.state = {
            readNotifications: [],
            unreadNotifications: [],
            isLoading: true
        }
    }

    redirectToLogin = () => {
        this.props.history.push("/")
    }


    componentDidMount() {
       let username =  localStorage.getItem("username");
        this.retrieveReadNotifications(username);
        this.retrieveUnreadNotifications(username);


        this.setState({
            isLoading: false
        });

    }

    retrieveReadNotifications = (username) => {
        axios.get("/api/v1/notification/retrieveRead/instructor/" + username, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                console.log(responseObject);
                this.setState({
                    readNotifications: responseObject.data
                });
            })
            .catch(error => {
                console.log(error.response);
                if(error.response.status && error.response.status === 403){
                    this.showToast("error", "You are redirected to login page.")
                    this.redirectToLogin();
                }
            })
    }

    retrieveUnreadNotifications = (username) => {
        axios.get("/api/v1/notification/retrieveUnread/instructor/" + username, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                console.log(responseObject);
                this.setState({
                    unreadNotifications: responseObject.data
                });
                let unreadNotifIdList = [];
                this.state.unreadNotifications.forEach(unread => unreadNotifIdList.push(unread.id));
                if (unreadNotifIdList.length > 0) this.markAsRead(username, unreadNotifIdList);
            })
            .catch(error => {
                console.log(error.response);
                if(error.response.status && error.response.status === 403){
                    this.showToast("error", "You are redirected to login page.")
                    this.redirectToLogin();
                }
            })
    }

    markAsRead = (username, notificationIdList) => {
        axios.post("/api/v1/notification/read/instructor/" + username, notificationIdList,{headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                console.log(responseObject);
            })
            .catch(error => {
                console.log(error.response);
                if(error.response.status && error.response.status === 403){
                    this.showToast("error", "You are redirected to login page.")
                    this.redirectToLogin();
                }
            })
    }

    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
    }

    convertToHTML = (notification) => {
        let m = moment(notification.createdDate);
        let date = m.format('LLL')
        let message = notification.eventType;
        if(notification.eventType === "ASSIGNMENT_COMPLETED") {
            message += ": The student with username " + notification.createdBy + " has completed the assignment" +
                "    with title '" + notification.assignmentTitle  +
                "'   on " + date + ".";
        } else if(notification.eventType ==="NEW_ASSIGNMENT") {
            message += ": New assignment with the title '"+ notification.assignmentTitle +"' is uploaded on \n" +
                date + ".";
        } else if(notification.eventType === "NEW_FEEDBACK") {
            message += ": Your instructor "+ notification.createdBy +" has given feedback for your assignment\n" +
                "  with title '" + notification.assignmentTitle + "' on\n" +
                date + ".";
        }
        return (
            <div className="product-item">
                <div>
                    <h6>{message}</h6>
                </div>
            </div>
        );
    }

    render() {
        return (
            this.state.isLoading ?
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <ProgressSpinner className="p-d-block p-mx-auto" style={{width: '50px', height: '50px'}}
                                     strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                </div>
                :
                <div>
                    <InstructorNavbar/>
                    <Toast ref={(el) => this.toast = el} />

                    <Container className={"mt-3"} style={{"maxWidth": "1600px"}}>
                        <br/>
                        <h3>Notification Panel</h3>
                        <div style={{margin: 14}}>
                            <h5>Unread Notifications</h5>
                            <div style={{margin: 10}}>
                                {this.state.unreadNotifications && this.state.unreadNotifications.length > 0 ? <p  style={{fontSize:"18px"}}> You have {this.state.unreadNotifications.length} new notification/s as listed below:</p>
                                    : <p style={{fontSize:"18px"}}>You have no new notification.</p> }
                                <ul  className="list-group list-group-flush">
                                    {this.state.unreadNotifications && this.state.unreadNotifications.map(item => (
                                        <li style={{marginRight: 24}} className="list-group-item list-group-item-warning" key={item.id}> {this.convertToHTML(item)}</li>
                                    ))}
                                </ul>
                            </div>
                            <br/>
                            <h5>Last Seen Notifications</h5>
                            <div style={{margin: 10}}>
                                {this.state.readNotifications && this.state.readNotifications.length > 0 ? <p  style={{fontSize:"18px"}}> The last {this.state.readNotifications.length} notification/s that you have received are listed below:</p>
                                    : <p style={{fontSize:"18px"}}>You have no seen notification yet.</p> }
                                <ul  className="list-group list-group-flush">
                                    {this.state.readNotifications && this.state.readNotifications.map(item => (
                                        <li style={{marginRight: 24}} className="list-group-item " key={item.id}> {this.convertToHTML(item)}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Container>
                </div>
        );
    }
}