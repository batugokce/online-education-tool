import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class StudentInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        console.log(this.props.student)
        return (
            this.props.student != null ?
                <div className={"pl-4"} style = {{"fontSize":"17px"}}  >
                    <Row className={"justify-content-center mb-2"} ><h3>Student Info</h3></Row>
                    <Row className={"my-2"} >
                        <Col sm={{offset: "1", span: "4"}}  >
                            <strong>Name & Surname:</strong>
                        </Col>
                        <Col sm={{offset: "0", span: "7"}}>
                            {this.props.student.nameSurname}
                        </Col>
                    </Row>
                    <Row className={"my-2"} >
                        <Col sm={{offset: "1", span: "4"}} >
                            <strong>Student No:</strong>
                        </Col>
                        <Col sm={{offset: "0", span: "7"}}>
                            {this.props.student.studentNumber}
                        </Col>
                    </Row>
                    <Row className={"my-2"} >
                        <Col sm={{offset: "1", span: "4"}} >
                            <strong>E-mail:</strong>
                        </Col>
                        <Col sm={{offset: "0", span: "7"}}>
                            {this.props.student.emailAddress}
                        </Col>
                    </Row>
                    <Row className={"my-2"} >
                        <Col sm={{offset: "1", span: "4"}} >
                            <strong>Username:</strong>
                        </Col>
                        <Col sm={{offset: "0", span: "7"}}>
                            {this.props.student.username}
                        </Col>
                    </Row>
                    <Row className={"my-2"} >
                        <Col sm={{offset: "1", span: "4"}} >
                            <strong>Telephone No:</strong>
                        </Col>
                        <Col sm={{offset: "0", span: "7"}}>
                            {this.props.student.telephoneNumber}
                        </Col>
                    </Row>
                    <Row className={"my-2"} >
                        <Col sm={{offset: "1", span: "4"}} >
                            <strong>Class Name:</strong>
                        </Col>
                        <Col sm={{offset: "0", span: "7"}}>
                            {this.props.student.classroomName}
                        </Col>
                    </Row>
                    <Row className={"my-2"} >
                        <Col sm={{offset: "1", span: "4"}} >
                            <strong>Banned:</strong>
                        </Col>
                        <Col sm={{offset: "0", span: "7"}}>
                            {this.props.student.banned ? "Banned": "Allowed"}
                        </Col>
                    </Row>
                </div> :
                <Row className={"justify-content-center mt-3"} >
                    <h5>Choose a student to view information.</h5>
                </Row>
        );
    }
}

export default StudentInfo;