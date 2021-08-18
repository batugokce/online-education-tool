import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {Card} from "primereact/card";
import { ScrollPanel } from 'primereact/scrollpanel';
import sanitizeHtml from "sanitize-html";
import {getSanitizerOptions} from "../../service/sanitizerOptions";
import '../../student/ScrollPanel.css';
import PreviewMC from "./PreviewMC";
import PreviewOrdering from "./PreviewOrdering";
import PreviewTF from "./PreviewTF";
import PreviewWritten from "./PreviewWritten";
import PreviewGapFilling from "./PreviewGapFlling";
import PreviewMatching from "./PreviewMatching";

class Preview extends Component {
    constructor(props) {
        super(props);

    }


    render() {
        const sanitizationOptions = {
            allowedTags: [ 'p','br','h2','h1','strong','span','em','u','ol','ul','li','img', 'iframe'],
            allowedAttributes: {
                'span': [ 'class','style' ],
                'img': ['src', 'width'],
                'iframe': ['src', 'allowfullscreen', 'width', 'height']
            },
            allowedSchemes: [
                'data', 'http', 'https',
            ],

            allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
            allowIframeRelativeUrls: true
        }

        let cleanHtml = "<p>No article found</p>";

        console.log(this.props.article)

        if (this.props.article !== null && this.props.article.text !== null) {
            cleanHtml = sanitizeHtml(this.props.article.text.text, sanitizationOptions);
        }

        return (
            <Container fluid className={"mx-0 px-0"} >
                {
                    this.props.article !== null && this.props.article.text !== null ?
                        <Row className={"mx-0 px-0"} >
                            <Col span={6} >
                                <div className="scrollpanel px-1">
                                    <Card className={"my-3 mx-1 px-1"} >
                                        <ScrollPanel style={{height: '80vh'}} className="custombar1"  >
                                            <Row className={"justify-content-center"}>
                                                <h3>{this.props.article.text.title}</h3>
                                            </Row>
                                            <Row className={"px-4"} >
                                                <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
                                            </Row>
                                        </ScrollPanel>
                                    </Card>
                                </div>

                            </Col>
                            <Col span={6} >
                                <Row className={"scrollpanel"}>
                                    <Card style={{width: '90%'}} className={"my-3"} >
                                        <ScrollPanel style={{width: '100%', height: '80vh'}} className="custombar1"  >
            {
                this.props.article.sections.map((section, idx) => {
                    if (section.multipleChoices !== null && section.multipleChoices.length > 0) {
                        return <PreviewMC section={section} idx={idx} key={idx} />;
                    } else if (section.orderings !== null && section.orderings.length > 0) {
                        return <PreviewOrdering section={section} idx={idx} key={idx} />
                    } else if (section.trueFalses !== null && section.trueFalses.length > 0) {
                        return <PreviewTF section={section} idx={idx} key={idx} />
                    } else if (section.matchings !== null && section.matchings.length > 0) {
                        return <PreviewMatching section={section} idx={idx} key={idx} />
                    } else if (section.gapFillingMain !== null) {
                        return <PreviewGapFilling section={section} idx={idx} key={idx} />
                    } else if (section.writtenQuestion !== null) {
                        return <PreviewWritten section={section} idx={idx} key={idx} />
                    }
                })
            }
                                        </ScrollPanel>
                                    </Card>
                                </Row>
                            </Col>
                        </Row>
                        : <div/>
                }
            </Container>
        );
    }
}

export default Preview;