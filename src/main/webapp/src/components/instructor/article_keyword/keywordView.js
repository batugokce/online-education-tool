import React,{Component} from "react";
import KeywordList from "./keywordList";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ReactDOM from 'react-dom';

let lastNum=1;
class keywordView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyWord: [{
                num: lastNum++,
                }],
        };
    }

    handleChange = e => {
        if (
            ["num"].includes(
                e.target.name
            )
        ) {
            let keyWord = [...this.state.keyWord];
            keyWord[e.target.dataset.id][e.target.name] = e.target.value;
        } else {
            this.setState({ [e.target.name]: e.target.value });
        }
    };
    
    handleChangeForSpecificField = (id,field, value) => {
        console.log(value)
        let keyWord = [...this.state.keyWord];
        keyWord[id][field] = value;
    };

    addNewRow = e => {
        this.setState(prevState => ({
            keyWord: [
                ...prevState.keyWord,
                {
                    num: lastNum++
       
                }
            ]
        }));
    };

    deleteRow = index => {
        this.setState({
            keyWord: this.state.keyWord.filter(
                (s, sindex) => index!== sindex
            )
        });
    };

    clickOnDelete(record) {
        this.setState({
            keyWord: this.state.keyWord.filter(r => r !== record)
        });
        lastNum=lastNum-1;
    }
    

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem('user', JSON.stringify(nextState));
    }
    
    render() {
        let { keyWord } = this.state;
        console.log(keyWord)
        return (
            <div className="content">
                <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1" />
                        <div className="col-sm-10">
                            <h2 className="text-center"> Add Keywords</h2>
                           
                            <KeywordList
                                add={this.addNewRow}
                                delete={this.clickOnDelete.bind(this)}
                                keyWord={keyWord}
                                handleChange={this.handleChangeForSpecificField.bind(this)}
                            />

                        </div>
                        <div className="col-sm-1" />
                    </div>
                </form>
            </div>
        );
    }
}
export default keywordView;


