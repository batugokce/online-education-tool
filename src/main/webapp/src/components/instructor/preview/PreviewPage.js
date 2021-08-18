import React, {Component} from 'react';
import InstructorNavbar from "../InstructorNavbar";
import axios from "axios";
import authHeader from "../../service/authHeader";
import { Toast } from "primereact/toast";
import Loading from "../../service/Loading";
import Preview from "./Preview";

class PreviewPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            article: null
        }
    }

    redirectToLogin = () => this.props.history.push("/")

    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
    }

    componentDidMount() {
        let requestURL = "/api/v1/article/find/" + this.props.match.params.assignmentId;

        axios.get(requestURL, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                console.log(responseObject)
                if (responseObject.type === "success") {
                    this.setState({
                        isLoading: false,
                        article: responseObject.data
                    })
                }
                else if (responseObject.type === "error") {
                    this.showToast(responseObject.type, responseObject.message)
                    this.setState({
                        isLoading: false
                    })
                }
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
            })
    }


    render() {
        return (
            this.state.isLoading ?
                <div>
                    <Loading />
                    <Toast ref={(el) => this.toast = el} />
                </div>
                    :
                <div>
                    <InstructorNavbar/>
                    <Toast ref={(el) => this.toast = el} />
                    <Preview article={this.state.article} />

                </div>
        );
    }
}

export default PreviewPage;