import React from 'react';
import './Comment.css';


//const colors = [ "yellow", "aqua", "hotpink", "lime", "coral"];
//let index=0;
let coloor="yellow";

class Comment extends React.Component {
  state = {
    comment: ''
  }
  onChangeColor(e) {
        coloor = e.target.value;
        document.getElementById("clr").style.background=e.target.value;}
 
  handleCommentSubmit = (e) => {
    e.preventDefault();

    const {
      updateCommentList,
      toggleCommentBox,
      toggleButtonsGroup

    } = this.props;

    if (this.state.comment) {
      const uniqueId = Date.now();
      let colour = coloor;
      this.wrapSelectedTextWithId(uniqueId,colour);

      updateCommentList({
        creationTimestamp: uniqueId,
        message: this.state.comment,
        color:coloor

      });
      toggleButtonsGroup();
      toggleCommentBox();
      
      this.reset();
      
    }
    else {
      const uniqueId = Date.now();
      let colour = coloor;
      this.wrapSelectedTextWithId(uniqueId,colour);

      toggleButtonsGroup();
      toggleCommentBox();
      
      this.reset();
      
    }
    
  }

  handleCommentChange = (e) => {
    this.setState({ comment: e.target.value });
  }

  reset = () => { this.setState({ comment: '' }); }
  
  

  wrapSelectedTextWithId = (uniqueId,colour) => {
    
    const markWrapper = document.createElement('mark');
    let color = colour;
    //let color = colors[ (index++ )%(colors.length-1)]; 
    // var color = "#"+((1<<24)*Math.random()|0).toString(16)
    markWrapper.style.background = color;
    markWrapper.setAttribute('id', uniqueId);
    console.log(this.props.selectedRange)
    this.props.selectedRange.surroundContents(markWrapper);
    
    
    
  }

   
  render() {
   
    const { hidden} = this.props;

    return (
   
    

      <div id= "comment" hidden={hidden}>
          
        <form
          className="comment-box"
          onSubmit={this.handleCommentSubmit}
          
        >
   
         
          <textarea
            id="commentBox"
            className="comment-box__text-area"
            placeholder="Add your comment or just highlight by clicking submit"
            onChange={this.handleCommentChange}
            value={this.state.comment}
          >
          </textarea>
          <select id = "clr" onChange={this.onChangeColor}>
            
            <option value="hotpink">color</option>
            <option value="yellow">color</option>
            <option value="aqua">color</option>
            <option value="lime">color</option>
            <option value="coral">color</option>
            
          </select>
          <button type="submit" className="comment-box__submit-button">
            submit
          </button> 
         
          
        </form>
      
      </div>
    );
  }
}

export default Comment;
