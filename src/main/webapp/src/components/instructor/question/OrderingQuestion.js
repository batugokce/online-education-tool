import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Card } from 'primereact/card';
import {InputText} from "primereact/inputtext";
import { connect } from "react-redux";
import {deleteSection, goDown, goUp, saveSection} from "../../../redux/actions";
import {generateOrderingJson, generateOrderings} from "../SectionJSON";
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import {Editor} from "primereact/editor";
import {getEditorSimpleHeader} from "../utilities";

class OrderingQuestion extends Component {

    componentDidMount() {
        let updatedObject = Object.assign({}, this.props.section, {order: this.props.order });
        this.props.saveSection(this.props.order, updatedObject)
    }


    statementChangeHandler = (e,idx) => {
        let section = this.props.section;
        const orderings  = section.orderings;

        const newOrderings = [...orderings.slice(0, idx),
            Object.assign({}, orderings[idx], {text: e.target.value }) ,
            ...orderings.slice(idx + 1)
        ]

        let orderingObj = generateOrderingJson(section.description, newOrderings, section.point, this.props.order);
        this.props.saveSection(this.props.order, orderingObj);
    }

    onDescriptionChange = e => {
        let section = this.props.section;
        let orderingObj = generateOrderingJson(e.htmlValue, section.orderings, section.point, this.props.order);
        this.props.saveSection(this.props.order, orderingObj);
    }

    onPointChange = e => {
        let section = this.props.section;
        let orderingObj = generateOrderingJson(section.description, section.orderings, e.value, this.props.order);
        this.props.saveSection(this.props.order, orderingObj);
    }

    orderChangeHandler = (e,idx) => {
        let section = this.props.section;
        const  orderings  = section.orderings;

        const newOrderings = [...orderings.slice(0, idx),
            Object.assign({}, orderings[idx], {correctOrder: e.value }) ,
            ...orderings.slice(idx + 1)
        ]

        let orderingObj = generateOrderingJson(section.description, newOrderings, section.point, this.props.order);
        this.props.saveSection(this.props.order, orderingObj);
    }

    addRowButton = () => {
        let section = this.props.section;
        let newOrderings = [...section.orderings, generateOrderings()]
        let orderingObj = generateOrderingJson(section.description, newOrderings, section.point, this.props.order);
        this.props.saveSection(this.props.order, orderingObj);
    }

    removeRowButton = () => {
        let section = this.props.section;
        let newOrderings = [...section.orderings.slice(0,section.orderings.length-1)]
        let orderingObj = generateOrderingJson(section.description, newOrderings, section.point, this.props.order);
        this.props.saveSection(this.props.order, orderingObj);
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
                                <h4>Ordering Section</h4>
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
                        {
                            section.orderings.map((item,idx) =>
                                <Row key={idx} className="mt-3" sm={12} >
                                <Col sm={9}>
                                    {idx+1}) <InputText key={idx} style={{"width":"90%"}} onChange={e => this.statementChangeHandler(e,idx)}
                                               className="p-inputtext-sm" placeholder={"Enter the question text"} value={item.text} />
                                </Col>
                                    {console.log(item)}
                                <Col sm={3}>
                                    <InputNumber key={idx} onChange={e => this.orderChangeHandler(e,idx)} style={{"width":"30%"}}
                                               className="p-inputtext-sm" placeholder={"Enter the order"} min={1} max={20} value={item.correctOrder} />
                                </Col>
                            </Row>)

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


export default connect(null, mapDispatchToProps)(OrderingQuestion);