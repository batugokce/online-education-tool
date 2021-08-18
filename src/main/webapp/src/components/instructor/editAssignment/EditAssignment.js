import React,{Component} from "react";
import InstructorNavbar from "../InstructorNavbar";
import authHeader from "../../service/authHeader";
import { Toast } from "primereact/toast";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DropdownButton  from "react-bootstrap/Dropdown";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from "axios";
import ReactQuill, {Quill} from 'react-quill';
import ImageResize  from 'quill-image-resize-module-react';
import OrderingQuestion from "../question/OrderingQuestion";
import {addSection} from "../../../redux/actions";
import { connect } from "react-redux";
import { Card } from 'primereact/card';
import {
    generateEmptyGapFillingJson,
    generateEmptyMatchingJson, generateEmptyMCJson,
    generateEmptyOrderingJson,
    generateEmptyTrueFalseJson,
    generateEmptyWrittenJson
} from "../SectionJSON";
import { ScrollTop } from 'primereact/scrolltop';
import TrueFalse from "../question/TrueFalse";
import Matching from "../question/Matching";
import Written from "../question/Written";
import GapFilling from "./GapFilling";
import MultipleChoice from "./MultipleChoice";

import {
    getAdvancedEditorToolbar,
    getCategories,
    getDifficultyLevels,
    getEnglishLevelItems
} from "../../service/AssignmentCreationConstants";
import PreviewAdapter from "../preview/PreviewAdapter";
import {Dialog} from "primereact/dialog";

Quill.register('modules/imageResize', ImageResize)

class EditAssignment extends Component {

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
            showPreview: false,
            isOtherClassesUsing:false,
            isAnyStudentStarted:false,
            dialogOpen:false,
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
        axios.get("api/v1/article/findForEdit/"+this.props.match.params.assignmentId+"/"+localStorage.getItem("username"),{headers:authHeader()})
            .then(response=>{
                Object.assign(this.props.sections,response.data.data.sections)
                console.log(response.data.data.sections);
                this.setState({
                    articleText:response.data.data.articleText.text,
                    selectedDifficultyLevel:response.data.data.difficultyLevel,
                    selectedEnglishLevel:response.data.data.englishLevel,
                    selectedCategory:response.data.data.category,
                    articleTitle:response.data.data.articleText.title,
                    isAnyStudentStarted:response.data.data.isAnyStudentStarted,
                    isOtherClassesUsing:response.data.data.isOtherClassesUsing,
                    definitions:response.data.data.definitions

                });
                if(this.state.definitions!==[]){
                    this.setState({isDefinitionsOpen:true
                    })
                }
            })
    }


    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
    }

    submitHandler = (type) => {
        if (this.state.selectedEnglishLevel === "") {
            this.showToast("error", "You should choose an English level for this assignment")
            return;
        } else if (this.state.selectedDifficultyLevel === "") {
            this.showToast("error", "You should choose a difficulty level for this assignment")
            return;
        } else if (this.state.selectedCategory === "") {
            this.showToast("error", "You should choose a category for this assignment")
            return;
        } else if (type !== 2 && this.state.selectedClassroom === null) {
            this.showToast("error", "You should choose a classroom for this assignment")
            return;
        }
        let senddata={};
        if(type===1) {
             senddata = {
                article: {
                    text: {
                        title: this.state.articleTitle,
                        text: this.state.articleText
                    },
                    id:this.props.match.params.assignmentId,
                    englishLevel: this.state.selectedEnglishLevel,
                    sections: this.props.sections,
                    definitions: this.state.definitions,
                    classroomId: this.state.selectedClassroom,
                    category: this.state.selectedCategory,
                    difficultyLevel: this.state.selectedDifficultyLevel
                },
                type: 0
            }
        }
        else if(type===2) {
             senddata = {
                article: {
                    text: {
                        title: this.state.articleTitle,
                        text: this.state.articleText
                    },
                    id:this.props.match.params.assignmentId,
                    englishLevel: this.state.selectedEnglishLevel,
                    sections: this.props.sections,
                    definitions: this.state.definitions,
                    classroomId: 0,
                    category: this.state.selectedCategory,
                    difficultyLevel: this.state.selectedDifficultyLevel
                },
                type: 0
            }
        }
        else if(type===3) {
             senddata = {
                article: {
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
                },
                type: 1
            }
        }


        let username = localStorage.getItem("username");
        axios.post("/api/v1/article/edit/"+ username, senddata, {headers: authHeader()})
            .then(response => {
                let responseObject = response.data;
                console.log(responseObject);
                this.showToast(responseObject.type, responseObject.message);

            })
            .catch(e => {
                console.log(senddata)
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
        if(!this.state.isDefinitionsOpen) {
            this.setState({
                definitions: [{word: "", definition: ""}],
                isDefinitionsOpen: true
            })
        }
    }

    render() {

        return (
            <div>
                <InstructorNavbar/>
                <Toast ref={(el) => this.toast = el} />
                <ScrollTop threshold={300} />
                <Container fluid >

                    <Col sm={{offset: "2", span: "8"}} >
                        <Row className="my-4 pt-0 align-items-center">
                        {this.state.isOtherClassesUsing ? <h5 className="p-text-center">You can not edit this assignment since other classes are using it. If you want, you can use this template to create a new assignment.</h5>:
                            this.state.isAnyStudentStarted ? <h5>Some students have started this assigment. If you edit it, their progress will disappear. You can also create a new assignment from this template without editing selected assignment.</h5>:
                                <h5>You can edit this assignment</h5>}
                        </Row>
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
                        { (this.state.isAnyStudentStarted || this.state.isOtherClassesUsing) ? <Row className="my-4 pt-0 align-items-center">
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
                            </Row>:null}
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
                                             onChange={this.onEditorChange} modules={getAdvancedEditorToolbar()}  />

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
                                    //console.log(section);
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
                                    onClick={(e)=>this.setState({dialogOpen:true})} />

                        </Row>
                        {
                            this.state.showPreview ?
                                <Row>
                                    <PreviewAdapter title={this.state.articleTitle} text={this.state.articleText} />
                                </Row> : null
                        }
                    </Col>
                    <Dialog visible={this.state.dialogOpen} style={{ width: '50vw' }}
                             onHide={() => this.setState({dialogOpen: false})}  >
                        {!this.state.isAnyStudentStarted && !this.state.isOtherClassesUsing ?
                            <Container className={"mt-3"} style={{"maxWidth": "1600px"}}>
                                <Card>
                                    <Row className="my-4 pt-0 align-items-center" >
                                        Are you sure?
                                    </Row>
                                    <Row className="my-4 pt-0 align-items-center" >
                                        <Button onClick={(e)=>this.submitHandler(2)}>Yes</Button>
                                        &nbsp;&nbsp;&nbsp;
                                        <Button onClick={(e)=>this.setState({dialogOpen: false})}>No</Button>
                                    </Row>

                                </Card>
                            </Container>:!this.state.isOtherClassesUsing ?
                                <Container className={"mt-3"} style={{"maxWidth": "1600px"}}>
                                    <Card>
                                        <Row className="my-4 pt-0 align-items-center" >
                                            Only your classes are using this assignment. You can either edit or create a new assignment from here. If you edit, your student's progress on this assignment will be loss.
                                        </Row>

                                            <Button onClick={(e)=>this.submitHandler(1)}>Edit and assign to selected classroom</Button>
                                            <br/><br/>
                                            <Button onClick={(e)=>this.submitHandler(2)}>Edit and assign to already assigned classroom(s).</Button>
                                            <br/><br/>
                                            <Button onClick={(e)=>this.submitHandler(3)}>Create a new assignment and assign to selected classroom</Button>


                                    </Card>
                                </Container>:
                                <Container className={"mt-3"} style={{"maxWidth": "1600px"}}>
                                    <Card>
                                        <Row className="my-4 pt-0 align-items-center" >
                                           You can only create a new assignment from here.
                                        </Row>
                                        <Row className="my-4 pt-0 align-items-center" >
                                            <Button onClick={(e)=>this.submitHandler(3)}>OK</Button>
                                            &nbsp;&nbsp;&nbsp;
                                            <Button onClick={(e)=>this.setState({dialogOpen: false})}>NO</Button>
                                        </Row>

                                    </Card>
                                </Container>}

                    </Dialog>


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

export default connect(mapStateToProps, mapDispatchToProps)(EditAssignment);