import React,{Component} from "react";
import {InputText} from "primereact/inputtext";

// Class to design fill in the blank type question inside assignment page
export default class ParagraphBlankBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            answers:[]
        };
    }

    saveAnswer=(answer)=> {
        //TODO
    }

    render() {
        let fields = this.props.questionField.question.split('/');
        let resultsRender = [];
        for (let i = 0; i < fields.length; i++) {
            resultsRender.push(fields[i]);
            if(i !== fields.length - 1)
                resultsRender.push(
                        <InputText className="p-mb-2" onChange={(e) => this.setState(prevState => ({
                            answers: [...prevState.answers, e.target.value]
                        }))}/>);
        }

        return (
            <div style={{padding: '.5em'}}>
                {resultsRender}
            </div>
        );
    }
};
