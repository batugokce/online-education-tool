import React, {Component} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";


export default class Keyword extends Component {

    userData;

    constructor(props) {
        super(props);
        this.state = {
           x: -1
        };
        this.plus = this.plus.bind(this);
        this.minus = this.minus.bind(this);


    }
    plus(){
         this.setState({
            x: this.state.x + 1 
        });
    }
    minus(){
        this.setState({
            x: this.state.x - 1 
        });
    }

    render() {
        let idx = this.props.idx;
        let val = this.props.val;
        let num = `num-${idx}`;
            return (
                <div>
                <div key={val.index}>
                    
                <div className="col p-4">
                    {idx === 0 ? (
                            <div>  
                            <button
                                onClick={() =>{ this.props.add() ;   this.plus();}}
                                
                                type="button" 
                                className="btn btn-primary text-center"
                            >
                                <i className="pi pi-plus-circle "/>
                            </button>
                           
                            &nbsp;&nbsp;
                            {this.state.x < 0 ? (
                            <button
                                onClick={() => this.props.delete(val)}
                                type="button" disabled
                                className="btn btn-primary text-center"
                            >
                                <i className="pi pi-minus-circle"/>
                            </button> 
                            ) : (
                            <button
                                onClick={() => {this.props.delete(val); this.minus();} }
                                
                                type="button" 
                                className="btn btn-primary text-center"
                            >
                                <i className="pi pi-minus-circle"/>
                            </button> 
                            
                            )}
                            </div>
                             
                    ) :  (
                            
                            <div></div>                 
                            
                    )}
                        
                     
                </div>

                    <Row className="my-4 pt-0 align-items-center">
                        <Col sm={2}>
                            <div style={{"fontSize": "17px"}}>Word:</div>
                        </Col>
                        <Col sm={6}> 
                        <form>
                        <div className="form-group">
                             <textarea name="text" style={{width: '550px', height: '50px'}} className = "form-control" />                
                        </div>
                        </form>
                        </Col>
                    </Row>
                    <Row className="my-4 pt-0 align-items-center">
                        <Col sm={2}>
                            <div style={{"fontSize": "17px"}}>Meaning:</div>
                        </Col>
                        <Col sm={6}> 
                        <form>
                        <div className="form-group">
                             <textarea name="text" style={{width: '550px', height: '100px'}} className = "form-control"  />                
                        </div>
                        </form>
                        </Col>
                    </Row>   
                </div>
                </div>
            );
    }

};
