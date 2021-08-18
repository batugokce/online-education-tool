import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Card } from 'primereact/card';
import {InputText} from "primereact/inputtext";
import { connect } from "react-redux";
import {deleteSection, goDown, goUp, saveSection} from "../../../redux/actions";
import {generateGapFillingJson, generateGapFillings} from "../SectionJSON";
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import {Editor} from "primereact/editor";
import {getEditorSimpleHeader} from "../utilities";
import {InputTextarea} from "primereact/inputtextarea";
import { Divider } from 'primereact/divider';

class GapFilling extends Component {
    constructor() {
        super();

        this.state = {
            leftParts: [],
            rightParts: []
        }
    }

    componentDidMount() {
        let updatedObject = Object.assign({}, this.props.section, {order: this.props.order });
        this.props.saveSection(this.props.order, updatedObject)
        this.setAnswers(this.props.section.gapFillingMain.gapFillings);
    }
    setAnswers(section){
        for(let i=0;i<section.length;i++){
            var parts=section[i].questionText.split('#*#');
            this.state.leftParts.push(parts[0]);
            this.state.rightParts.push(parts[1]);
        }
    }

    onDescriptionChange = e => {
        let section = this.props.section;
        let object = generateGapFillingJson(e.htmlValue, section.gapFillingMain.gapFillings, section.gapFillingMain.clues, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);
    }

    onPointChange = e => {
        let section = this.props.section;
        let object = generateGapFillingJson(section.description, section.gapFillingMain.gapFillings, section.gapFillingMain.clues, e.value, this.props.order);
        this.props.saveSection(this.props.order, object);
    }

    onCluesChange = e => {
        let section = this.props.section;
        let object = generateGapFillingJson(section.description, section.gapFillingMain.gapFillings, e.target.value, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);
    }

    leftPartChangeHandler = (e,idx) => {
        // handle local state
        const newLeftParts = [...this.state.leftParts.slice(0, idx),
            e.target.value, ...this.state.leftParts.slice(idx + 1)
        ]
        this.setState({
            leftParts: newLeftParts
        })

        // handle redux state
        let section = this.props.section;
        const gapFillings  = section.gapFillingMain.gapFillings;
        let newQuestionText = e.target.value + " #*# " + this.state.rightParts[idx];

        const newGapFillings = [...gapFillings.slice(0, idx),
            Object.assign({}, gapFillings[idx], {questionText: newQuestionText }) ,
            ...gapFillings.slice(idx + 1)
        ]

        let object = generateGapFillingJson(section.description, newGapFillings, section.gapFillingMain.clues, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);
    }

    answerChangeHandler = (e,idx) => {
        let section = this.props.section;
        const gapFillings  = section.gapFillingMain.gapFillings;

        const newGapFillings = [...gapFillings.slice(0, idx),
            Object.assign({}, gapFillings[idx], {answer: e.target.value }) ,
            ...gapFillings.slice(idx + 1)
        ]

        let object = generateGapFillingJson(section.description, newGapFillings, section.gapFillingMain.clues, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);
    }

    rightPartChangeHandler = (e,idx) => {
        // handle local state
        const newRightParts = [...this.state.rightParts.slice(0, idx),
            e.target.value, ...this.state.rightParts.slice(idx + 1)
        ]
        this.setState({
            rightParts: newRightParts
        })

        // handle redux state
        let section = this.props.section;
        const gapFillings  = section.gapFillingMain.gapFillings;
        let newQuestionText = this.state.leftParts[idx] + " #*# " + e.target.value

        const newGapFillings = [...gapFillings.slice(0, idx),
            Object.assign({}, gapFillings[idx], {questionText: newQuestionText }) ,
            ...gapFillings.slice(idx + 1)
        ]

        let object = generateGapFillingJson(section.description, newGapFillings, section.gapFillingMain.clues, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);
    }

    addRowButton = () => {
        let section = this.props.section;
        let newGapFillings = [...section.gapFillingMain.gapFillings, generateGapFillings(section.gapFillingMain.gapFillings.length+1)]
        let object = generateGapFillingJson(section.description, newGapFillings, section.gapFillingMain.clues, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);

        this.setState({
            leftParts: [...this.state.leftParts, ''],
            rightParts: [...this.state.rightParts, '']
        })
    }

    removeRowButton = () => {
        let section = this.props.section;
        let newGapFillings = [...section.gapFillingMain.gapFillings.slice(0,section.gapFillingMain.gapFillings.length-1)]
        let object = generateGapFillingJson(section.description, newGapFillings, section.gapFillingMain.clues, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);

        this.setState({
            leftParts: [...this.state.leftParts.slice(0, this.state.length-1)],
            rightParts: [...this.state.rightParts.slice(0, this.state.length-1)]
        })
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
                                <h4>Gap Filling Section</h4>
                            </Row>
                            <Row className="justify-content-end" style={{"width":"20%"}} >
                                <Button  className="p-button-danger p-button-rounded ml-3" icon="pi pi-times"
                                         onClick={() => this.props.deleteSection(this.props.order)} />
                            </Row>
                        </Row>
                        <Row className="mt-3" sm={12} >
                            <Col sm={2} ><strong>Description: </strong></Col>
                            <Col sm={7}>
                                <Editor placeholder={"Enter the description for this section"} headerTemplate={getEditorSimpleHeader()}
                                        value={section.description} style={{"height":"100px"}}
                                        onTextChange={this.onDescriptionChange}  />
                            </Col>
                            <Col sm={2} >
                                <InputNumber style={{"width":"60%"}} className="mr-3 p-inputtext-sm" suffix={" points"} placeholder={"Enter maximum points"}
                                             min={0} max={100} value={this.props.section.point}
                                             onChange={this.onPointChange} />
                            </Col>
                        </Row>
                        <Row className="mt-3" sm={12} >
                            <Col sm={2} ><strong>Clues: </strong></Col>
                            <Col sm={7}>
                                <InputTextarea placeholder={"Please enter the clues for this section, you can specify the words that will be used in the gaps."}
                                                value={section.gapFillingMain.clues} style={{"width":"100%", "height":"100px"}} autoResize
                                               onChange={this.onCluesChange} />
                            </Col>
                        </Row>
                        {
                            section.gapFillingMain.gapFillings.map((item,idx) =>
                                <Col key={idx} className="mt-3" sm={12} >
                                    <Divider className={"my-4"} />
                                    <Col sm={12} className="my-3">

                                            <b className="px-0 mx-0">{idx+1})</b> Left Part:

                                        <Row sm={8}>
                                            <InputText key={idx} style={{"width":"90%"}} onChange={e => this.leftPartChangeHandler(e,idx)}
                                                       className="p-inputtext-sm" value={this.state.leftParts[idx]}
                                                       placeholder={"Please enter the left part of the sentence here, i.e. before the gap"} />
                                        </Row>

                                    </Col>
                                    <Col sm={12} className="my-3" >
                                        Right Part:
                                        <Row sm={8}>
                                            <InputText key={idx} style={{"width":"90%"}} onChange={e => this.rightPartChangeHandler(e,idx)}
                                                       className="p-inputtext-sm" value={this.state.rightParts[idx]}
                                                       placeholder={"Please enter the right part of the sentence here, i.e., after the gap"}  />
                                        </Row>
                                    </Col>
                                    <Col sm={12} className="my-3">
                                            Correct answer:
                                        <Row sm={8}>
                                            <InputText key={idx} style={{"width":"90%"}} onChange={e => this.answerChangeHandler(e,idx)}
                                                       className="p-inputtext-sm" value={item.answer}
                                                       placeholder={"Enter the correct answer which will be put in the gap"}  />
                                        </Row>
                                    </Col>

                                </Col>)
                        }
                        <Row className="mt-4 justify-content-center">
                            <Button  className="p-button-danger mx-1" icon="pi pi-minus"
                                     onClick={this.removeRowButton}  />
                            <Button  className="mx-1" icon="pi pi-plus"
                                     onClick={this.addRowButton}   />
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


export default connect(null, mapDispatchToProps)(GapFilling);