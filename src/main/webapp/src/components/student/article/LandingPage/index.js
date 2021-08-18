import React from 'react';

import Article from './components/Article';
import Comment from './components/Comment';
import Highlight from './components/Highlight';
import CommentsList from './components/CommentsList';

import { saveSelection, restoreSelection } from './selection-utils';
import axios from "axios";
import authHeader from "../../../service/authHeader";
import {Toast} from "primereact/toast";

class LandingPage extends React.Component {

  constructor() {
    super();
    this.state = {
      hiddenCommentBox: true,
      hiddenButtonGroup: true,
      highlightBtnsGroupLayout: {
        position: 'absolute',
        left: '0',
        top: '0',
        heightInPixel: 28,
        widthInPixel: 70
      },
      selectedRange: null,
    }
  }



  // seleted region reactangle [left, top, width, hieght]
  sethighlightBtnsGroupPosition = ({ left, top, width, height }) => {
    const { heightInPixel, widthInPixel } = this.state.highlightBtnsGroupLayout;
    const computedLeft = left + (width / 2) - (widthInPixel / 2);
    const computedTop = window.scrollY + top - heightInPixel;

    this.setState({
      highlightBtnsGroupLayout: Object.assign(
        this.state.highlightBtnsGroupLayout, {
          left: computedLeft,
          top: computedTop
        }
      )
    });
  }

  showButtonsGroup = () => {
    this.setState({ hiddenButtonGroup: false });
  }

  closeButtonsGroup = () => {
    this.setState({ hiddenButtonGroup: true });
  }

  saveAndRestoreSelection = () => {
    const savedSelection = saveSelection();
    this.setState({ selectedRange: savedSelection });
    console.log(savedSelection)
    this.toggleCommentBox();
    restoreSelection(savedSelection);
  }

  // Taking advantage of es6 object computed property
  toggleState = (updateState) => {
    this.setState({ [updateState]: !this.state[updateState] });
  }

  toggleCommentBox = () => {
    this.toggleState('hiddenCommentBox');
  }

  // Could be used outside click of HighlightButtonsGroup
  toggleButtonsGroup = () => {
    this.toggleState('hiddenButtonGroup');
  }

  updateCommentList = (newComment) => {
   this.child.updateCommentList(newComment);
  }


  render() {
    const {
      hiddenCommentBox,
      hiddenButtonGroup,
      highlightBtnsGroupLayout,
      comments,
      selectedRange,
    } = this.state;
    return (
      <div>
        <Article
          setBtnsGroupPosition={this.sethighlightBtnsGroupPosition}
          showButtonsGroup={this.showButtonsGroup}
          closeButtonsGroup={this.closeButtonsGroup}
          article={this.props.article}
          title={this.props.title}
        />
        <Highlight
          layout={highlightBtnsGroupLayout}
          hidden={hiddenButtonGroup}
          saveAndRestoreSelection={this.saveAndRestoreSelection}
        />
        <Comment
          hidden={hiddenCommentBox}
          selectedRange={selectedRange}
          updateCommentList={this.updateCommentList}
          toggleCommentBox={this.toggleCommentBox}
          toggleButtonsGroup={this.toggleButtonsGroup}
        />
        <CommentsList
            ref={instance => { this.child = instance; }}
          articleId={this.props.articleId}
        />
        <Toast ref={(el) => this.toast = el} />
      </div>
    );
  }
}

export default LandingPage;
