import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Card } from 'primereact/card';
import { connect } from "react-redux";
import {deleteSection, goDown, goUp, saveSection} from "../../../redux/actions";
import {generateWrittenJson} from "../SectionJSON";
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import {Editor} from "primereact/editor";
import {getEditorSimpleHeader} from "../utilities";
import {ToggleButton} from "primereact/togglebutton";

class Written extends Component {

    componentDidMount() {
        let updatedObject = Object.assign({}, this.props.section, {order: this.props.order });
        this.props.saveSection(this.props.order, updatedObject)
    }

    onDescriptionChange = e => {
        let section = this.props.section;
        let object = generateWrittenJson(e.htmlValue, section.point, this.props.order, section.writtenQuestion.progressiveGrading);
        this.props.saveSection(this.props.order, object);
    }

    onPointChange = e => {
        let section = this.props.section;
        let object = generateWrittenJson(section.description, e.value, this.props.order, section.writtenQuestion.progressiveGrading);
        this.props.saveSection(this.props.order, object);
    }

    onGradingOptionChange = e => {
        let section = this.props.section;
        console.log(e.value)
        let object = generateWrittenJson(section.description, section.point, this.props.order, e.value);
        this.props.saveSection(this.props.order, object);
    }

    render() {
        let section = this.props.section;

        return (
            <Container className = "px-0" fluid >
                <Card className="mt-3" sm={12} >
                    <Col  >
                        <Row>
                            <Row className="justify-content-center"  style={{"width":"20%"}} >
                                <Button  className="p-button-rounded p-button-text mx-0" icon="pi pi-arrow-up"
                                         onClick={() => this.props.goUp(this.props.order)}   />
                                <Button  className="p-button-rounded  p-button-text mx-0" icon="pi pi-arrow-down"
                                         onClick={() => this.props.goDown(this.props.order)}   />
                            </Row>
                            <Row className="justify-content-center" style={{"width":"60%"}} >
                                <h4>Written Section</h4>
                            </Row>
                            <Row className="justify-content-end" style={{"width":"20%"}} >
                                <Button  className="p-button-danger p-button-rounded ml-3" icon="pi pi-times"
                                         onClick={() => this.props.deleteSection(this.props.order)} />
                            </Row>
                        </Row>
                        <Row className="mt-3" sm={12} >
                            <Col sm={2} ><strong>Question: </strong></Col>
                            <Col sm={7}>
                                <Editor placeholder={"Enter the question text for this section"} headerTemplate={getEditorSimpleHeader()}
                                        value={section.description}
                                        onTextChange={this.onDescriptionChange} style={{"height":"200px"}}  />
                            </Col>
                            <Col sm={3} >

                                    <InputNumber style={{"width":"60%"}} className="mr-3 p-inputtext-sm" suffix={" points"} placeholder={"Enter maximum points"}
                                                 min={0} max={100} value={this.props.section.point}
                                                 onChange={this.onPointChange} />
                                                 <br/>

                                    <Row className={"my-5"} >
                                        <Col sm={{offset: "0", span: "5"}}  >
                                            <strong>Progressive Grading:</strong>
                                        </Col>
                                        <Col sm={{offset: "0", span: "7"}}>
                                            <ToggleButton checked={section.writtenQuestion.progressiveGrading} onChange={(e) => this.onGradingOptionChange(e)} />
                                        </Col>
                                    </Row>

                            </Col>

                        </Row>
                    </Col>
                </Card>
            </Container>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        saveSection: (key, section) => dispatch(saveSection(key, section)),
        deleteSection: (key) => dispatch(deleteSection(key)),
        goUp: (key) => dispatch(goUp(key)),
        goDown: (key) => dispatch(goDown(key))
    };
}


export default connect(null, mapDispatchToProps)(Written);