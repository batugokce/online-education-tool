import React from 'react'
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {RadioButton} from "primereact/radiobutton";
import {prepareDescription} from "../../service/PrepareDescription";

function PreviewMC(props) {

    return (
        <Row className={"px-3"}>
            <Col>
                {prepareDescription(props.section.description, props.idx+1, props.section.point)}
                {
                    props.section.multipleChoices.map((mc,qidx) => {
                        return <Col className={"mb-5"} key={qidx} >
                            <Row><h6><b>{qidx+1}){mc.text}</b></h6></Row>
                            <Row className={"my-3 align-items-center"} ><RadioButton disabled className={"mr-2"} checked={mc.option1 === mc.correctAnswer} /> <Col>{mc.option1}</Col></Row>
                            <Row className={"my-3 align-items-center"} ><RadioButton disabled className={"mr-2"} checked={mc.option2 === mc.correctAnswer} /> <Col>{mc.option2}</Col></Row>
                            <Row className={"my-3 align-items-center"} ><RadioButton disabled className={"mr-2"} checked={mc.option3 === mc.correctAnswer} /> <Col>{mc.option3}</Col></Row>
                            {
                                mc.option4 !== "" ?  <Row className={"my-3 align-items-center"} ><RadioButton checked={mc.option4 === mc.correctAnswer} disabled className={"mr-2"} /> <Col>{mc.option4}</Col></Row> : null
                            }
                            {
                                mc.option5 !== "" ?  <Row className={"my-3 align-items-center"} ><RadioButton checked={mc.option5 === mc.correctAnswer} disabled className={"mr-2"} /> <Col>{mc.option5}</Col></Row> : null
                            }
                        </Col>
                    })
                }
            </Col>
        </Row>
    )
}

export default PreviewMC;