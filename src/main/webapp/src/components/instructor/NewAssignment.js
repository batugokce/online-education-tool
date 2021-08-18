import React,{Component} from "react";
import InstructorNavbar from "./InstructorNavbar";
import authHeader from "../service/authHeader";
import { Toast } from "primereact/toast";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DropdownButton  from "react-bootstrap/Dropdown";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import axios from "axios";
import ReactQuill, {Quill} from 'react-quill';
import ImageResize  from 'quill-image-resize-module-react';
import OrderingQuestion from "./question/OrderingQuestion";
import {addSection} from "../../redux/actions";
import { connect } from "react-redux";
import { Card } from 'primereact/card';
import {
    generateEmptyGapFillingJson,
    generateEmptyMatchingJson, generateEmptyMCJson,
    generateEmptyOrderingJson,
    generateEmptyTrueFalseJson,
    generateEmptyWrittenJson
} from "./SectionJSON";
import { ScrollTop } from 'primereact/scrolltop';
import TrueFalse from "./question/TrueFalse";
import Matching from "./question/Matching";
import Written from "./question/Written";
import GapFilling from "./question/GapFilling";
import MultipleChoice from "./question/MultipleChoice";

import {
    getAdvancedEditorToolbar,
    getCategories,
    getDifficultyLevels,
    getEnglishLevelItems
} from "../service/AssignmentCreationConstants";
import PreviewAdapter from "./preview/PreviewAdapter";

Quill.register('modules/imageResize', ImageResize)

class NewAssignment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            articleText: '',
            selectedEnglishLevel: '',
            selectedDifficultyLevel: '',
            selectedCategory: '',
            articleTitle: '',
            selectedClassroom: null,
            classrooms: [],
            definitions: [],
            isDefinitionsOpen: false,
            showPreview: false
        }
    }

    onEditorChange = (e) => {
        this.setState({
            articleText: e
        })
    }

    redirectToLogin = () => {
        this.props.history.push("/")
    }


    componentDidMount() {
        axios.get("/api/v1/classroom/listForInstructor/" + localStorage.getItem("username"), {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                console.log(responseObject);
                this.setState({
                    classrooms: responseObject.data
                });
            })
            .catch(error => {
                if(error.response.status && error.response.status === 403){
                    this.redirectToLogin();
                }
            })
    }


    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
    }

    submitHandler = () => {
        if (this.state.selectedEnglishLevel === "") {
            this.showToast("error", "You should choose an English level for this assignment")
            return;
        } else if (this.state.selectedDifficultyLevel === "") {
            this.showToast("error", "You should choose a difficulty level for this assignment")
            return;
        } else if (this.state.selectedCategory === "") {
            this.showToast("error", "You should choose a category for this assignment")
            return;
        }
        let article = {
            text: {
                title: this.state.articleTitle,
                text: this.state.articleText
            },
            englishLevel: this.state.selectedEnglishLevel,
            sections: this.props.sections,
            definitions: this.state.definitions,
            classroomId: this.state.selectedClassroom,
            category: this.state.selectedCategory,
            difficultyLevel: this.state.selectedDifficultyLevel
        }

        console.log(article)

        let username = localStorage.getItem("username");
        axios.post("/api/v1/article/"+ username, article, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                console.log(responseObject);
                this.showToast(responseObject.type, responseObject.message);

            })
            .catch(e => {
                console.log(e.response);
            });
    }

    wordChangeHandler = (e,idx) => {
        this.setState({
            definitions: [...this.state.definitions.slice(0,idx),
                Object.assign({}, this.state.definitions[idx], {word: e.target.value }),
                ...this.state.definitions.slice(idx+1)
            ]
        })
    }

    definitionChangeHandler = (e,idx) => {
        this.setState({
            definitions: [...this.state.definitions.slice(0,idx),
                Object.assign({}, this.state.definitions[idx], {definition: e.target.value }),
                ...this.state.definitions.slice(idx+1)
            ]
        })
    }

    addDefinitionButton = () => {
        this.setState({
            definitions: [...this.state.definitions, {word:"", definition:""}]
        })
    }

    removeDefinitionButton = () => {
        this.setState({
            definitions: [...this.state.definitions.slice(0, this.state.definitions.length-1)]
        })
    }

    closeDefinitions = () => {
        this.setState({
            definitions: [],
            isDefinitionsOpen: false
        })
    }

    openDefinitions = () => {
        this.setState({
            definitions: [{word:"", definition:""}],
            isDefinitionsOpen: true
        })
    }

    render() {
        const toolbarOptions = [
            [{ font: [] }],
            [{ align: [] }],
            ['bold', 'italic', 'underline'],
            [{ color: [] }, { background: [] }],
            ['video'],
            ['image'],
        ];
        
        const modules = {
            toolbar: toolbarOptions,
            imageResize: {
                modules: [ 'Resize', 'DisplaySize' ]
            }
        };

        return (
            <div>
                <InstructorNavbar/>
                <Toast ref={(el) => this.toast = el} />
                <ScrollTop threshold={300} />
                <Container fluid >
                    <Col sm={{offset: "2", span: "8"}} >
                        <Row className="my-4 pt-0 align-items-center">
                            <Col sm={2}><div style={{"fontSize":"17px"}} >English Level</div></Col>
                            <Col sm={10}>
                                <Dropdown options={getEnglishLevelItems()} value={this.state.selectedEnglishLevel}
                                          onChange={e => this.setState({selectedEnglishLevel: e.value})}
                                          placeholder={"Choose an English level"}
                                          tooltip={"You should choose appropriate English level for this assignment"}
                                          tooltipOptions={{position: 'bottom'}}
                                          style={{width: '30%'}}>
                                </Dropdown>
                            </Col>
                        </Row>
                        <Row className="my-4 pt-0 align-items-center">
                            <Col sm={2}><div style={{"fontSize":"17px"}} >Difficulty Level</div></Col>
                            <Col sm={10}>
                                <Dropdown options={getDifficultyLevels()} value={this.state.selectedDifficultyLevel}
                                          onChange={e => this.setState({selectedDifficultyLevel: e.value})}
                                          placeholder={"Choose a difficulty level"}
                                          tooltip={"You should choose appropriate difficulty level within the English level specified above for this assignment"}
                                          tooltipOptions={{position: 'bottom'}}
                                          style={{width: '30%'}}>
                                </Dropdown>
                            </Col>
                        </Row>
                        <Row className="my-4 pt-0 align-items-center">
                            <Col sm={2}><div style={{"fontSize":"17px"}} >Category</div></Col>
                            <Col sm={10}>
                                <Dropdown options={getCategories()} value={this.state.selectedCategory}
                                          onChange={e => this.setState({selectedCategory: e.value})}
                                          placeholder={"Choose a category"}
                                          tooltip={"Choose the most suitable category for the assignment"}
                                          tooltipOptions={{position: 'bottom'}}
                                          style={{width: '30%'}}>
                                </Dropdown>
                            </Col>
                        </Row>
                        <Row className="my-4 pt-0 align-items-center">
                            <Col sm={2}><div style={{"fontSize":"17px"}} >Classroom</div></Col>
                            <Col sm={10}>
                                <Dropdown options={this.state.classrooms} value={this.state.selectedClassroom}
                                          onChange={e => this.setState({selectedClassroom: e.value})}
                                          placeholder={"Choose a classroom"}
                                          tooltip={"Choose one of your classrooms to add this assignment"}
                                          tooltipOptions={{position: 'bottom'}}
                                          optionValue={"id"} optionLabel={"className"} style={{width: '30%'}} >

                                </Dropdown>
                            </Col>
                        </Row>
                        <Row className="my-4 pt-0 align-items-center">
                            <Col sm={2}><div style={{"fontSize":"17px"}}>Article Title</div></Col>
                            <Col sm={10}>
                                <InputText className="p-inputtext-sm" value={this.state.articleTitle}
                                           onChange={(e) => this.setState({articleTitle: e.target.value})}
                                           style={{width: '30%'}} />
                            </Col>
                        </Row>
                        <Row >
                            <Col className="px-0 pb-4" style={{"height":"300px", "backgroundColor":"white"}} >
                                <ReactQuill  value={this.state.articleText} style={{"height":"95%"}}
                                            onChange={this.onEditorChange} modules={modules}  />

                            </Col>
                        </Row>
                        {
                            this.state.isDefinitionsOpen ?
                                <Row sm={12} >
                                    <Container className = "px-0 mt-4" fluid >
                                        <Card sm={12} >
                                            <Col>
                                                <Row>
                                                    <Row className="justify-content-center"  style={{"width":"20%"}} >

                                                    </Row>
                                                    <Row className="justify-content-center" style={{"width":"60%"}} >
                                                        <h4>Word & Definition</h4>
                                                    </Row>
                                                    <Row className="justify-content-end" style={{"width":"20%"}} >
                                                        <Button  className="p-button-danger p-button-rounded ml-3" icon="pi pi-times"
                                                                 onClick={this.closeDefinitions} />
                                                    </Row>
                                                </Row>
                                                <Row>
                                                    <div className={"ml-4 my-3"}>In this section, you can specify some words and their definitions like a dictionary to help students in this assignment.</div>
                                                </Row>
                                                {
                                                    this.state.definitions.map((item, idx) =>
                                                        <Row key={idx} className={"mt-3"} sm={12} >
                                                            <Col sm={3} >
                                                                <InputText onChange={e => this.wordChangeHandler(e, idx)}
                                                                           placeholder={"Enter the word"} style={{"width":"90%"}}
                                                                           value={this.state.definitions[idx].word} />
                                                            </Col>
                                                            <Col sm={9} >
                                                                <InputText onChange={e => this.definitionChangeHandler(e, idx)}
                                                                           placeholder={"Enter the definition"} style={{"width":"90%"}}
                                                                           value={this.state.definitions[idx].definition} />
                                                            </Col>
                                                        </Row>
                                                    )
                                                }
                                                <Row className="mt-4 justify-content-center">
                                                    <Button  className="p-button-danger mx-1" icon="pi pi-minus"
                                                             onClick={this.removeDefinitionButton}  />
                                                    <Button  className="mx-1" icon="pi pi-plus"
                                                             onClick={this.addDefinitionButton}   />
                                                </Row>
                                            </Col>
                                        </Card>
                                    </Container>
                                </Row> : null
                        }

                        <Row sm={12} >
                            {
                                this.props.sections.map((section, idx) => {
                                    switch (section.type) {
                                        case 'tf':
                                            return <TrueFalse key={idx} order={idx+1} section={section} />
                                        case 'ordering':
                                            return <OrderingQuestion key={idx} order={idx+1} section={section} />
                                        case 'matching':
                                            return <Matching key={idx} order={idx+1} section={section} />
                                        case 'written':
                                            return <Written key={idx} order={idx+1} section={section} />
                                        case 'fill':
                                            return <GapFilling key={idx} order={idx+1} section={section} />
                                        case 'mc':
                                            return <MultipleChoice key={idx} order={idx+1} section={section} />
                                        default:
                                            return <div>There is something wrong :(</div>
                                    }
                                })
                            }
                        </Row>

                        <Row className="mt-4 pb-5 justify-content-end" >
                            <DropdownButton  >
                                <DropdownButton.Toggle variant="primary" id="dropdown-basic" disabled={this.props.sections.length === 1 && this.props.sections[0].type === 'written'}  >
                                    Add new section
                                </DropdownButton.Toggle>

                                <DropdownButton.Menu>
                                    <DropdownButton.Item onClick={() => this.props.addSection(generateEmptyMCJson(this.props.sections.length+1))} >Multiple Choice</DropdownButton.Item>
                                    <DropdownButton.Item onClick={() => this.props.addSection(generateEmptyTrueFalseJson(this.props.sections.length+1))} >True/False</DropdownButton.Item>
                                    <DropdownButton.Item onClick={() => this.props.addSection(generateEmptyMatchingJson(this.props.sections.length+1))} >Matching</DropdownButton.Item>
                                    <DropdownButton.Item onClick={() => this.props.addSection(generateEmptyGapFillingJson(this.props.sections.length+1))}>Gap Filling</DropdownButton.Item>
                                    <DropdownButton.Item onClick={() => this.props.addSection(generateEmptyOrderingJson(this.props.sections.length+1))}  >Ordering</DropdownButton.Item>
                                    {this.props.sections.length===0 ? <DropdownButton.Item onClick={() => this.props.addSection(generateEmptyWrittenJson(this.props.sections.length+1))}>Written Assignment</DropdownButton.Item> : null}
                                </DropdownButton.Menu>
                            </DropdownButton>
                            <Button label={"Display Preview"} icon="pi pi-eye" className="ml-3 p-button-sm p-button-secondary"
                                    onClick={() => this.setState({showPreview: !this.state.showPreview})} />
                            <Button label={"Add Word & Definitions"} icon="pi pi-plus" className="ml-3 p-button-sm p-button-secondary"
                                    onClick={this.openDefinitions} />
                            <Button label={"Submit"} icon="pi pi-check" className="ml-3 p-button-sm p-button-success"
                                    onClick={this.submitHandler} />

                        </Row>
                        {
                            this.state.showPreview ?
                                <Row>
                                    <PreviewAdapter title={this.state.articleTitle} text={this.state.articleText} />
                                </Row> : null
                        }
                    </Col>


                </Container>



            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addSection: section => dispatch(addSection(section))
    };
}

const mapStateToProps = state => {
    return {
        sections: state.sections
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewAssignment);