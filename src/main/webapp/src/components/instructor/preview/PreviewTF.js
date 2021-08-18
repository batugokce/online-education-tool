import React from 'react'
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {RadioButton} from "primereact/radiobutton";
import {prepareDescription} from "../../service/PrepareDescription";

function PreviewTF(props) {
    return (
        <Row className={"px-3"}>
            <Col>
                {prepareDescription(props.section.description, props.idx+1, props.section.point)}
                {
                    props.section.trueFalses.map((tf,qidx) => {
                        return <Col className={"mb-5"} key={qidx} >
                            <Row><h6><b>{qidx+1}){tf.text}</b></h6></Row>
                            <Row className={"my-3 align-items-center"} ><RadioButton disabled className={"mr-2"} checked={tf.correctAnswer === 1} /> True</Row>
                            <Row className={"my-3 align-items-center"} ><RadioButton disabled className={"mr-2"} checked={tf.correctAnswer === 0} /> False</Row>
                        </Col>
                    })
                }
            </Col>
        </Row>
    )
}

export default PreviewTF;