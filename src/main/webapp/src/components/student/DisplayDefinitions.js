import React, {Component} from 'react';
import Button from "react-bootstrap/Button";
import { Dialog } from 'primereact/dialog';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class DisplayDefinitions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        }
    }

    toggleShow = () => {
        this.setState({
            show: !this.state.show
        })
    }

    render() {
        return (
            <div >
                <Button variant="info" style={{width: "100%"}} onClick={() => this.setState({show:true})}>
                    Dictionary#1
                </Button>
                <Dialog header="Word & Definitions" visible={this.state.show} style={{ width: '50vw' }}
                        onHide={() => this.setState({show:false})} modal={false} position={"top"} >
                    <Container className={"mt-3"} style={{"maxWidth": "1600px"}} >
                        <Col>
                            {
                                this.props.definitions.length > 0 ?

                                    this.props.definitions.map((item, idx) =>
                                        <Row key={idx} className="mt-3" sm={12} >
                                            <b>{item.word}:</b> <div className={"ml-2"} >{item.definition}</div>

                                        </Row>
                                    ) : <div>Unfortunately, instructor did not add any definition to dictionary for this assignment.</div>
                            }
                        </Col>
                    </Container>
                </Dialog>
            </div>
        );
    }
}

export default DisplayDefinitions;