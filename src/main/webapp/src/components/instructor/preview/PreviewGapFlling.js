import React from 'react'
import {Col} from "react-bootstrap";
import {prepareDescription} from "../../service/PrepareDescription";
import Row from "react-bootstrap/Row";
import {InputText} from "primereact/inputtext";

function PreviewGapFilling(props) {
    return (
        <Row className={"px-3"}>
            <Col>
                {prepareDescription(props.section.description, props.idx+1, props.section.point)}
                <div>
                        <span className="block-example border border-secondary">
                            <h5 style={{ padding: '.5em'}}>{props.section.gapFillingMain.clues}</h5>
                        </span>
                </div>
                {
                    props.section.gapFillingMain.gapFillings.map((item, index) => {
                        let blankIndex = item.questionText.indexOf("#*#");
                        let leftString = item.questionText.slice(0,blankIndex);
                        let rightString = item.questionText.slice(blankIndex+3);
                        return <Row className={"align-items-center my-3 ml-2"} key={index} >
                            <b>{index+1})</b>{leftString}<InputText value={item.answer} disabled /> {rightString}
                        </Row>
                    })
                }
            </Col>
        </Row>
    )
}

export default PreviewGapFilling;