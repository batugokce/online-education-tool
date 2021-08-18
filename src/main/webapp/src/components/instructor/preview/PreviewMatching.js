import React from 'react'
import {Col} from "react-bootstrap";
import {prepareDescription} from "../../service/PrepareDescription";
import Row from "react-bootstrap/Row";
import {Dropdown} from "primereact/dropdown";

function PreviewMatching(props) {
    return (
        <Row className={"px-3"}>
            <Col>
                {prepareDescription(props.section.description, props.idx+1, props.section.point)}
                {
                    props.section.matchings.map((mtc, index) => {
                        return <Col className={"my-5"} key={index} >
                            <Row className={"justify-content-space-between align-items-center"} >
                                <b className={"mr-1"} >{index+1}) </b>
                                <Col>{mtc.leftPart}</Col>
                                <Col><Dropdown  placeholder={mtc.rightPart} disabled  /></Col>
                            </Row>
                        </Col>
                    })
                }
            </Col>
        </Row>
    )
}

export default PreviewMatching;