import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Card } from 'primereact/card';
import {InputText} from "primereact/inputtext";
import { connect } from "react-redux";
import {deleteSection, goDown, goUp, saveSection} from "../../../redux/actions";
import { generateMCJson, generateMultipleChoices} from "../SectionJSON";
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import {Editor} from "primereact/editor";
import {getEditorSimpleHeader} from "../utilities";
import { Dropdown } from 'primereact/dropdown';
import {Divider} from "primereact/divider";
import { RadioButton } from 'primereact/radiobutton';

class MultipleChoice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedNumberForOptions:"3",
            optionSelections: []
        }

        this.numbersForOptions = [
            {label: 'Three options', value: '3'},
            {label: 'Four options', value: '4'},
            {label: 'Five options', value: '5'},
        ];
    }

    componentDidMount() {
        let updatedObject = Object.assign({}, this.props.section, {order: this.props.order });
        this.props.saveSection(this.props.order, updatedObject)
        this.setAnswers(this.props.section.multipleChoices);
        if(this.props.section.multipleChoices.length!=0){
            if(this.props.section.multipleChoices[0].option4===""){
                this.setState({
                    selectedNumberForOptions:"3"
                })
            }
            else if(this.props.section.multipleChoices[0].option5===""){
                this.setState({
                    selectedNumberForOptions:"4"
                })
            }
            else{
                this.setState({
                    selectedNumberForOptions:"5"
                })
            }
        }


    }
    setAnswers(section){
        console.log(section.length)
        for(let i=0;i<section.length;i++){
            let ans=section[i].correctAnswer;
            if(section[i].option1===ans){
                this.state.optionSelections.push("option1");
            }
            else if(section[i].option2===ans){
                this.state.optionSelections.push("option2");
            }
            else if(section[i].option3===ans){
                this.state.optionSelections.push("option3");
            }
            else if(section[i].option4===ans){
                this.state.optionSelections.push("option4");
            }
            else if(section[i].option5===ans){
                this.state.optionSelections.push("option5");
            }
        }
    }
    onDescriptionChange = e => {
        let section = this.props.section;
        let object = generateMCJson(e.htmlValue, section.multipleChoices, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);
    }

    onPointChange = e => {
        let section = this.props.section;
        let object = generateMCJson(section.description, section.multipleChoices, e.value, this.props.order);
        this.props.saveSection(this.props.order, object);
    }

    questionTextChangeHandler = (e,idx) => {
        let section = this.props.section;

        const newMultipleChoices = this.prepareNewMultipleChoiceArray(idx, {text: e.target.value });

        let object = generateMCJson(section.description, newMultipleChoices, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);
    }

    option1ChangeHandler = (e,idx) => {
        let section = this.props.section;

        const changeJson = this.state.optionSelections[idx] === "option1" ?
            {option1: e.target.value, correctAnswer: e.target.value } : {option1: e.target.value };

        const newMultipleChoices = this.prepareNewMultipleChoiceArray(idx, changeJson);

        let object = generateMCJson(section.description, newMultipleChoices, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);
    }

    option2ChangeHandler = (e,idx) => {
        let section = this.props.section;

        const changeJson = this.state.optionSelections[idx] === "option2" ?
            {option2: e.target.value, correctAnswer: e.target.value } : {option2: e.target.value };

        const newMultipleChoices = this.prepareNewMultipleChoiceArray(idx, changeJson);

        let object = generateMCJson(section.description, newMultipleChoices, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);
    }

    option3ChangeHandler = (e,idx) => {
        let section = this.props.section;

        const changeJson = this.state.optionSelections[idx] === "option3" ?
            {option3: e.target.value, correctAnswer: e.target.value } : {option3: e.target.value };

        const newMultipleChoices = this.prepareNewMultipleChoiceArray(idx, changeJson);

        let object = generateMCJson(section.description, newMultipleChoices, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);
    }

    option4ChangeHandler = (e,idx) => {
        let section = this.props.section;

        const changeJson = this.state.optionSelections[idx] === "option4" ?
            {option4: e.target.value, correctAnswer: e.target.value } : {option4: e.target.value };

        const newMultipleChoices = this.prepareNewMultipleChoiceArray(idx, changeJson);

        let object = generateMCJson(section.description, newMultipleChoices, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);
    }

    option5ChangeHandler = (e,idx) => {
        let section = this.props.section;

        const changeJson = this.state.optionSelections[idx] === "option5" ?
            {option5: e.target.value, correctAnswer: e.target.value } : {option5: e.target.value };

        const newMultipleChoices = this.prepareNewMultipleChoiceArray(idx, changeJson);

        let object = generateMCJson(section.description, newMultipleChoices, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);
    }

    onDropDownChange = e => {
        this.setState({
            selectedNumberForOptions: e.value
        })

        if (e.value === 5) {
            return;
        }

        let section = this.props.section;
        const multipleChoices  = section.multipleChoices;
        let optionSelections = this.state.optionSelections;

        if (e.value == 3) {
            // clear both option4 and option5
            for(let i = 0; i < multipleChoices.length; i++) {
                let question = multipleChoices[i];
                question.option4 = "";
                question.option5 = "";
                if (this.state.optionSelections[i] === "option4" || this.state.optionSelections[i] === "option5" ) {
                    question.correctAnswer = question.option1;
                    optionSelections[i] = "option1";
                }
            }
        }
        else if (e.value == 4) {
            // clear only option5
            for(let i = 0; i < multipleChoices.length; i++) {
                let question = multipleChoices[i];
                question.option5 = "";
                if (this.state.optionSelections[i] === "option5" ) {
                    question.correctAnswer = question.option1;
                    optionSelections[i] = "option1";
                }
            }
        }

        this.setState({
            optionSelections: optionSelections
        })
        let object = generateMCJson(section.description, multipleChoices, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);
    }

    changeSelectedOption = (idx, newValue) => {
        this.setState({
            optionSelections: [
                ...this.state.optionSelections.slice(0,idx),
                newValue,
                ...this.state.optionSelections.slice(idx+1)
            ]
        })
    }

    prepareNewMultipleChoiceArray = (idx, updatedJson) => {
        let section = this.props.section;
        const multipleChoices  = section.multipleChoices;

        return [...multipleChoices.slice(0, idx),
            Object.assign({}, multipleChoices[idx], updatedJson) ,
            ...multipleChoices.slice(idx + 1)
        ]
    }

    onRadioButtonChange = (e,idx, selectedOption) => {
        let section = this.props.section;

        this.changeSelectedOption(idx, e.value);
        let newMultipleChoices = this.prepareNewMultipleChoiceArray(idx, {correctAnswer: selectedOption });

        let object = generateMCJson(section.description, newMultipleChoices, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);
    }

    addRowButton = () => {
        let section = this.props.section;
        let newMultipleChoices = [...section.multipleChoices, generateMultipleChoices(section.multipleChoices.length+1)]
        let object = generateMCJson(section.description, newMultipleChoices, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);
        this.setState({
            optionSelections: [...this.state.optionSelections, 'option1']
        })
    }

    removeRowButton = () => {
        let section = this.props.section;
        let newMultipleChoices = [...section.multipleChoices.slice(0,section.multipleChoices.length-1)]
        let object = generateMCJson(section.description, newMultipleChoices, section.point, this.props.order);
        this.props.saveSection(this.props.order, object);
        this.setState({
            optionSelections: [...this.state.optionSelections.slice(0,this.state.optionSelections.length-1)]
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
                                <h4>Multiple Choice Section</h4>
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
                        <Row className="mt-3">
                            <Col sm={2} ><strong>Number of options: </strong></Col>
                            <Col sm={7} >
                                <Dropdown options={this.numbersForOptions}
                                          value={this.state.selectedNumberForOptions}
                                          onChange={this.onDropDownChange}
                                />

                            </Col>
                        </Row>

                        {
                            section.multipleChoices.map((item,idx) =>
                                <Col key={idx} className="my-5" sm={12} >
                                    <Divider className={"my-4"} />
                                    <Row sm={10} className={"align-items-center mb-4"} >
                                        {idx+1}) <InputText key={idx} style={{"width":"90%"}} onChange={e => this.questionTextChangeHandler(e,idx)}
                                                            className="ml-2" placeholder={"Enter the question text"} value={item.text} />
                                    </Row>
                                    <Row sm={10} className={"align-items-center my-2"} >
                                        <RadioButton value="option1" name="option" className={"mx-2"}
                                                     checked={this.state.optionSelections[idx] === 'option1'}
                                                     onChange={e => this.onRadioButtonChange(e,idx, item.option1)} />
                                        <InputText key={idx} style={{"width":"60%"}} onChange={e => this.option1ChangeHandler(e,idx)}
                                                   className="p-inputtext-sm ml-2" placeholder={"Enter the first option"}
                                                   value={item.option1} />
                                    </Row>
                                    <Row sm={10} className={"align-items-center my-2"} >
                                        <RadioButton value="option2" name="option" className={"mx-2"}
                                                     checked={this.state.optionSelections[idx] === 'option2'}
                                                     onChange={e => this.onRadioButtonChange(e,idx, item.option2)} />
                                        <InputText key={idx} style={{"width":"60%"}} onChange={e => this.option2ChangeHandler(e,idx)}
                                                   className="p-inputtext-sm ml-2" placeholder={"Enter the second option"}
                                                   value={item.option2} />
                                    </Row>
                                    <Row sm={10} className={"align-items-center my-2"} >
                                        <RadioButton value="option3" name="option" className={"mx-2"}
                                                     checked={this.state.optionSelections[idx] === 'option3'}
                                                     onChange={e => this.onRadioButtonChange(e,idx, item.option3)} />
                                        <InputText key={idx} style={{"width":"60%"}} onChange={e => this.option3ChangeHandler(e,idx)}
                                                   className="p-inputtext-sm ml-2" placeholder={"Enter the third option"}
                                                   value={item.option3} />
                                    </Row>
                                    {
                                        this.state.selectedNumberForOptions > 3 ?
                                            <Row sm={10} className={"align-items-center my-2"} >
                                                <RadioButton value="option4" name="option" className={"mx-2"}
                                                             checked={this.state.optionSelections[idx] === 'option4'}
                                                             onChange={e => this.onRadioButtonChange(e,idx, item.option4)} />
                                                <InputText key={idx} style={{"width":"60%"}} onChange={e => this.option4ChangeHandler(e,idx)}
                                                           className="p-inputtext-sm ml-2" placeholder={"Enter the forth option"}
                                                           value={item.option4} />
                                            </Row> : null
                                    }
                                    {
                                        this.state.selectedNumberForOptions > 4 ?
                                            <Row sm={10} className={"align-items-center my-2"} >
                                                <RadioButton value="option5" name="option" className={"mx-2"}
                                                             checked={this.state.optionSelections[idx] === 'option5'}
                                                             onChange={e => this.onRadioButtonChange(e,idx, item.option5)} />
                                                <InputText key={idx} style={{"width":"60%"}} onChange={e => this.option5ChangeHandler(e,idx)}
                                                           className="p-inputtext-sm ml-2" placeholder={"Enter the fifth option"}
                                                           value={item.option5} />
                                            </Row> : null
                                    }


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


export default connect(null, mapDispatchToProps)(MultipleChoice);