import React, {Component} from 'react';
import { connect } from "react-redux";
import Preview from "./Preview";
import TrueFalse from "../question/TrueFalse";
import OrderingQuestion from "../question/OrderingQuestion";
import Matching from "../question/Matching";
import Written from "../question/Written";
import GapFilling from "../question/GapFilling";
import MultipleChoice from "../question/MultipleChoice";

class PreviewAdapter extends Component {

    adaptSections = (sectionArray) => {
        return sectionArray.map(section => {
            switch (section.type) {
                case 'tf':
                    section.gapFillingMain = null;
                    section.writtenQuestion = null;
                    section.matchings = [];
                    section.multipleChoices = [];
                    section.orderings = [];
                    break;
                case 'ordering':
                    section.gapFillingMain = null;
                    section.writtenQuestion = null;
                    section.matchings = [];
                    section.multipleChoices = [];
                    section.trueFalses = [];
                    break;
                case 'matching':
                    section.gapFillingMain = null;
                    section.writtenQuestion = null;
                    section.multipleChoices = [];
                    section.orderings = [];
                    section.trueFalses = [];
                    break;
                case 'written':
                    section.gapFillingMain = null;
                    section.matchings = [];
                    section.multipleChoices = [];
                    section.orderings = [];
                    section.trueFalses = [];
                    break;
                case 'fill':
                    section.writtenQuestion = null;
                    section.matchings = [];
                    section.multipleChoices = [];
                    section.orderings = [];
                    section.trueFalses = [];
                    break;
                case 'mc':
                    section.gapFillingMain = null;
                    section.writtenQuestion = null;
                    section.matchings = [];
                    section.orderings = [];
                    section.trueFalses = [];
                    break;
            }
            return section;
        })
    }


    render() {
        let article = {
            text: {
                text: this.props.text,
                title: this.props.title
            },
            sections: this.adaptSections(this.props.sections)
        };

        console.log(this.props.sections)

        return (
            <div style={{width: '100%'}}>
                <Preview article={article} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        sections: state.sections
    };
};

export default connect(mapStateToProps)(PreviewAdapter);
