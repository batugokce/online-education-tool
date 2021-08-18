import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class InstructorInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            this.props.instructor != null ?
                <div className={"pl-4"} style = {{"fontSize":"17px"}}  >
                    <Row className={"justify-content-center mb-2"} ><h3>Instructor Info</h3></Row>
                    <Row className={"my-2"} >
                        <Col sm={{offset: "1", span: "4"}}  >
                            <strong>Name & Surname:</strong>
                        </Col>
                        <Col sm={{offset: "0", span: "7"}}>
                            {this.props.instructor.nameSurname}
                        </Col>
                    </Row>
                    <Row className={"my-2"} >
                        <Col sm={{offset: "1", span: "4"}} >
                            <strong>E-mail:</strong>
                        </Col>
                        <Col sm={{offset: "0", span: "7"}}>
                            {this.props.instructor.emailAddress}
                        </Col>
                    </Row>
                    <Row className={"my-2"} >
                        <Col sm={{offset: "1", span: "4"}} >
                            <strong>Username:</strong>
                        </Col>
                        <Col sm={{offset: "0", span: "7"}}>
                            {this.props.instructor.username}
                        </Col>
                    </Row>
                    <Row className={"my-2"} >
                        <Col sm={{offset: "1", span: "4"}} >
                            <strong>Telephone No:</strong>
                        </Col>
                        <Col sm={{offset: "0", span: "7"}}>
                            {this.props.instructor.telephoneNumber}
                        </Col>
                    </Row>
                    <Row className={"my-2"} >
                        <Col sm={{offset: "1", span: "4"}} >
                            <strong>Registered Classes:</strong>
                        </Col>
                        <Col sm={{offset: "0", span: "7"}}>
                            <ul className={"pl-0"}  >
                                {
                                    this.props.instructor.registeredClassrooms.map((classroom, idx) => {
                                        return <li key={idx}>{classroom}</li>
                                    })
                                }
                            </ul>
                        </Col>
                    </Row>
                </div> :
                <Row className={"justify-content-center mt-3"} >
                    <h5>Choose an instructor to view information.</h5>
                </Row>
        );
    }
}

export default InstructorInfo;