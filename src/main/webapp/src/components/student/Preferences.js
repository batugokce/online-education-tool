import React, { Component } from "react";
import { Redirect } from 'react-router-dom';

import StudentNavbar from "./StudentNavbar";

export default class Preferences extends Component {
      render () {
        return (
            <div>
                 <StudentNavbar/>
                
            </div>  
        )
      }
}