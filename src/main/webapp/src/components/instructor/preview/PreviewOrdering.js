import React from 'react'
import {Col} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import {InputTextarea} from "primereact/inputtextarea";
import {prepareDescription} from "../../service/PrepareDescription";

function PreviewOrdering(props) {
    return (
        <Row className={"px-3"}>
            <Col>
                {prepareDescription(props.section.description, props.idx+1, props.section.point)}
                {
                    props.section.orderings.map((ord, index) => {
                        return <Col className={"my-5"} key={index} >
                            <Row className={"justify-content-space-between"} ><b className={"mr-1"} >{index+1}) </b> {ord.text}
                            <InputTextarea style={{ marginLeft: "auto" }} value={ord.correctOrder} disabled autoResize rows={1} cols={1} />
                            </Row>
                        </Col>
                    })
                }
            </Col>
        </Row>
    )
}

export default PreviewOrdering;