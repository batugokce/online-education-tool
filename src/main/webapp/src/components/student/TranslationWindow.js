import React, {Component} from 'react';
import { Dialog } from 'primereact/dialog';
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { InputText } from 'primereact/inputtext';
import axios from "axios";
import authHeader from "../service/authHeader";
import { ProgressSpinner } from 'primereact/progressspinner';

class TranslationWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            word: "",
            waiting:false,
            translation: ""
        }
    }

    toggleShow = () => {
        this.setState({
            show: !this.state.show
        })
    }

    translate = () => {
        this.setState({
            waiting:true
        })
        axios.get("/api/v1/translate/"+this.state.word,{headers: authHeader()})
            .then(response => {
                if (response.data.type === "error") {
                    this.setState( {
                        waiting:false,
                        translation:response.data.message
                    })
                } else {
                    this.setState( {
                        waiting:false,
                        translation:response.data.data
                    })
                }
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        return (
            <div >
                <Button variant="info" style={{width: "100%"}} onClick={() => this.setState({show:true})}>
                    Translate
                </Button>
                <Dialog header="Translator" visible={this.state.show} style={{ width: '50vw' }}
                        onHide={() => this.setState({show:false})} modal={false} position={"top-right"} >

                        <Row>
                            <p><b>NOTE:</b> This translator works with just 1 word, and may not work as expected.</p>
                        </Row>
                        <Row >
                            <InputText className={"mr-2"}
                                       value={this.state.word}
                                       onChange={(e) => this.setState({word: e.target.value})} />
                            <Button label="Info" className="p-button-info" onClick={this.translate} >Translate</Button>
                        </Row>
                        {
                            <Row>
                                {this.state.waiting ?
                                    <ProgressSpinner className={"my-5 mx-5"} strokeWidth={"5"}
                                                     style={{width: '70px', height: '70px'}}/> :

                                    this.state.translation !== "" ?<h4 className={"mt-5"}>Result: {this.state.translation}</h4> : null
                                }
                            </Row>
                        }

                </Dialog>
            </div>
        );
    }
}

export default TranslationWindow;