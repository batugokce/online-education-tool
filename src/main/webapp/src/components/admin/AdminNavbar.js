import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {changeBackground} from "../service/BackgroundColor";
import Row from "react-bootstrap/Row";


class AdminNavbar extends Component {
    constructor(props) {
        super(props);

    }

    logOut = () => {
        localStorage.clear();
    }

    render() {
        return (
                
        
        <nav style={{background: "#380B61"}} className="navbar navbar-collapse navbar-dark">
                <Link to={"/admin/home"} className="navbar-brand">
                    OET
                </Link>
     

                <div className="navbar-nav navbar-expand navbar-center">
                  
                    <li className="nav-item mx-5">
                        <Link to={"/admin/classes"} className="nav-link">
                            Classrooms
                        </Link>
                    </li>
                 
                    <li className="nav-item mx-5">
                        <Link to={"/admin/new-account"} className="nav-link">
                            New Account
                        </Link>
                    </li>

                    <li className="nav-item mx-5">
                        <Link to={"/admin/students"} className="nav-link">
                            Students
                        </Link>
                    </li>

                    <li className="nav-item mx-5">
                        <Link to={"/admin/instructors"} className="nav-link">
                            Instructors
                        </Link>
                    </li>
                </div>

            <div className="navbar-brand navbar-expand navbar-right" >
                <Row className={"justify-content-end align-items-end"} >
                    <div className="nav-item mr-5">
                        <button id="darkModeNav" onClick={changeBackground}/>
                    </div>
                    <Link onClick={this.logOut} className="navbar-brand" to={"/"}>
                        Log Out
                    </Link>
                </Row>

            </div>



        </nav>
     
 
        );
    }
}

export default AdminNavbar;
   