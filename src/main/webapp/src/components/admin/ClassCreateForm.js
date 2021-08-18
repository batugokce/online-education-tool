import React, { Component } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import authHeader from "../service/authHeader";
import {Toast} from "primereact/toast";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Card } from 'primereact/card';

export default class ClassCreateForm extends Component {
    constructor(props) {
        super(props);

        this.state={
            className:'',
            capacity:'',
            EnglishLevel:''
        }
    }  
   
    onChangeClassName = (e) => {
        this.setState({
            className: e.target.value
        });
    }

    onChangeCapacity = (e) => {
        this.setState({
            capacity: e.target.value
        });
    }
    onChangeEnglishLevel = (e) => {
        this.setState({
            EnglishLevel: e.target.value
        });
    }

    handleValidation(){
        let fields = this.state;
        let formIsValid = true;

       
        if(!fields["className"]){
            formIsValid = false;
            this.showToast("error","Class name field is required!")
        }
        if(!fields["capacity"]){
            formIsValid = false;
            this.showToast("error","Capacity field is invalid!")
        }
        if(!fields["EnglishLevel"]){
            formIsValid = false;
            this.showToast("error","English level field is required!")
        }
        return formIsValid;
    }
    
    clearFields = () => {
        this.setState({
            className:"",
            capacity:"",
            EnglishLevel:""
        });
    }

    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
    }

    saveClass = () => {
        console.log(this.state.capacity)
        if(this.handleValidation()){
            let data = {
                className:this.state.className,
                capacity:this.state.capacity,
                englishLevel:this.state.EnglishLevel,
            };
            console.log(data)
            axios.post("/api/v1/classroom", data, {headers: authHeader()})
                .then(response => {
                    this.showToast(response.data.type,response.data.message);
                    console.log(response.data);
                    this.clearFields();
                })
                .catch(e => {
                    this.showToast("error","Unknown error! Check fields and try again please.")
                });
        }
    }
    
    render() {
        return (
            <div>
                <AdminNavbar/>
                <Toast ref={(el) => this.toast = el} />
                <Container className={"mt-3"} style={{"maxWidth": "800px"}} >

                    <Card>
                        <div className="form-group" >
                            <label htmlFor="EnglishLevel">English Level</label>
                            <select className="form-control" id="role"
                                    required
                                    value={this.state.EnglishLevel}
                                    onChange={this.onChangeEnglishLevel}
                                    name="EnglishLevel">
                                <option defaultValue={"Choose..."}>Choose...</option>

                                <option>BEGINNER</option>
                                <option>ELEMENTARY</option>
                                <option>PRE_INTERMEDIATE</option>
                                <option>INTERMEDIATE</option>
                                <option>UPPER_INTERMEDIATE</option>

                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="ClassName">Class Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="className"
                                required
                                value={this.state.className}
                                onChange={this.onChangeClassName}
                                name="className"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="Capacity">Capacity</label>
                            <input
                                className="form-control"
                                id="capacity"
                                required
                                value={this.state.capacity}
                                onChange={this.onChangeCapacity}
                                name="capacity"
                                type = "number"
                                min={2}
                            />
                        </div>

                        <button className="btn btn-primary" onClick={this.saveClass} >
                            Submit
                        </button>
                    </Card>
                </Container>
            </div>
        );
    }
}