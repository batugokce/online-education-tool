import React, {Component} from 'react';
import Button from "react-bootstrap/Button";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {ProgressSpinner} from "primereact/progressspinner";
import axios from "axios";
import authHeader from "../service/authHeader";
import {Dropdown} from "primereact/dropdown";
import Row from "react-bootstrap/Row";

class Dictionary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            word: "",
            type: "NOUN",
            waiting:false,
            meanings: null
        }
    }

    toggleShow = () => {
        this.setState({
            show: !this.state.show
        })
    }

    getMeaning = () => {
        let requestBody = {
            type: this.state.type,
            word: this.state.word
        }

        this.setState({
            waiting: true,
            meanings: null
        })
        axios.post("/api/v1/wordnet/", requestBody,{headers: authHeader()})
            .then(response => {
                console.log(response.data);
                this.setState( {
                    waiting:false,
                    meanings:response.data
                })
            })
            .catch(e => {
                console.log(e);
            });
    }

    displayMeanings = () => {
        console.log("display called")
        console.log(this.state.meanings)
        if (this.state.meanings.length === 0) {
            return <p className={"mt-3 ml-3"} ><b>No meaning has been found for this word.</b></p>
        }
        return <ul className={"mt-3 ml-3"} >
            {
                this.state.meanings.map((meaning, idx) => <li key={idx} >{meaning}</li>)
            }
        </ul>
    }

    render() {
        const queryTypes = [
            {label: 'Noun', value: 'NOUN'},
            {label: 'Verb', value: 'VERB'},
            {label: 'Adjective', value: 'ADJECTIVE'},
            {label: 'Adverb', value: 'ADVERB'},
        ];

        return (
            <div>
                <Button variant="info" style={{width: "100%"}} onClick={() => this.setState({show:true})}>
                    Dictionary#2
                </Button>
                <Dialog header="Dictionary" visible={this.state.show} style={{ width: '50vw' }}
                        onHide={() => this.setState({show:false})} modal={false} position={"top-right"} >
                    <Row>
                        <p><b>NOTE:</b> This dictionary works with just 1 word.</p>
                    </Row>
                    <Row>
                        <InputText className={"mr-2"}
                                   value={this.state.word}
                                   onChange={(e) => this.setState({word: e.target.value})} />
                        <Dropdown options={queryTypes} value={this.state.type}
                                  onChange={e => this.setState({type: e.value})}
                                  placeholder={"Choose a category"}
                                  style={{width: '30%'}} className={"mr-2"} >
                        </Dropdown>
                        <Button label="Info" className="p-button-info" onClick={this.getMeaning} >Search</Button>
                    </Row>
                    {
                        <Row >
                            {this.state.waiting ?
                                <ProgressSpinner strokeWidth={"5"}
                                                 style={{width: '70px', height: '70px'}}/> :

                                this.state.meanings !== null ? this.displayMeanings() : null

                            }
                        </Row>
                    }
                </Dialog>
            </div>
        );
    }
}

export default Dictionary;