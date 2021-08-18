import React from 'react'
import Col from "react-bootstrap/Col";
import {prepareDescription} from "../../service/PrepareDescription";
import Row from "react-bootstrap/Row";
import {getEditorSimpleHeader} from "../utilities";
import {Editor} from "primereact/editor";

function PreviewWritten(props) {
    return (
        <Row className={"px-3"}>
            <Col>
                {prepareDescription(props.section.description, props.idx+1, props.section.point)}
                <Editor readOnly style={{height: '320px'}} headerTemplate={getEditorSimpleHeader()}/>
            </Col>
        </Row>
    )
}

export default PreviewWritten;