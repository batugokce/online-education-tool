import React from 'react';
import Button from "react-bootstrap/Button";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import PostAddIcon from '@material-ui/icons/PostAdd';
import IconButton from "@material-ui/core/IconButton";
import '../../../ScrollPanel.css';
import axios from "axios";
import authHeader from "../../../../service/authHeader";
import {InputTextarea} from "primereact/inputtextarea";
import Modal from "react-bootstrap/Modal";
import {Toast} from "primereact/toast";
import Table from "react-bootstrap/Table";

export default class CommentsList extends React.Component{
    constructor() {
        super();
        this.state = {
            comment: undefined,
            show:false,
            oldComment: undefined,
            newComment: undefined,
            showEdit:false,
            commentList:[]
        };

    }
    componentDidMount() {
        this.retrieveAllComments();
    }

    retrieveAllComments = () => {
        let username =  localStorage.getItem("username");
        axios.get("/api/v1/comment/get/"+ this.props.articleId+ "/"+username,{headers: authHeader()})
            .then(response =>{
                //console.log(response.data)
                this.setState({
                    commentList:response.data.data
                })
            })
            .catch(e => {
                console.log(e);});
    }

    updateCommentList = (newComment) => {
       // console.log(newComment)
        let username =  localStorage.getItem("username");
        axios.post("/api/v1/comment/save/"+ this.props.articleId+ "/"+username, newComment,{headers: authHeader()})
            .then(response =>{
                //console.log(response.data)
                this.retrieveAllComments();
                this.toast.show({severity:'success', summary: 'Success Message', detail:"Your comment has successfully created below!", life: 3000});
            })
            .catch(e => {
                console.log(e);
            });
    }

    addComment = () => {
        let commentObject = {};
        commentObject.message = this.state.comment;
        commentObject.color = "black";
        commentObject.creationTimestamp = Date.now();
        //console.log(commentObject);
        let username =  localStorage.getItem("username");
        axios.post("/api/v1/comment/save/"+ this.props.articleId+ "/"+username, commentObject, {headers: authHeader()})
            .then(response =>{
                //console.log(response.data)
                this.setState({
                    comment:undefined
                })
                this.retrieveAllComments();
                this.toast.show({severity:'success', summary: 'Success Message', detail:"Your comment has successfully created below!", life: 3000});
            })
            .catch(e => {
                console.log(e);
            });


    }

    deleteComment = (comment) => {
        let username =  localStorage.getItem("username");
        axios.delete("/api/v1/comment/delete/"+ comment.creationTimestamp+ "/"+ this.props.articleId+ "/"+username, {headers: authHeader()})
            .then(response =>{
                console.log(response.data)
                this.retrieveAllComments();
                this.toast.show({severity:response.data.type, summary: 'Success Message', detail:response.data.message, life: 3000});
            })
            .catch(e => {
                console.log(e);
            });
    }

     updateComment= () => {
        if( this.state.oldComment) {
            this.state.oldComment.message = this.state.newComment;
        }
        let username =  localStorage.getItem("username");
        axios.post("/api/v1/comment/update/"+ this.props.articleId+ "/"+username, this.state.oldComment ,{headers: authHeader()})
            .then(response =>{
                console.log(response.data)
                this.retrieveAllComments();
                this.toast.show({severity:response.data.type, summary: 'Success Message', detail:response.data.message, life: 3000});
            })
            .catch(e => {
                console.log(e);
            });
        this.setState({
            newComment:undefined,
            oldComment:undefined,
            oldCommentMessage:undefined
        })
    }

    saveComment=(comment)=> {
        this.setState({
            comment:comment
        })
    }
    saveCommentEdit=(newComment)=> {
        this.setState({
            newComment:newComment
        })
        //console.log(this.state.newComment)
    }

    handleClose = () => {
        this.setState({
            show:false,
            comment:undefined
        })
    }
    handleCloseEdit = () => {
        this.setState({
            showEdit:false,
            newComment:undefined,
            oldComment:undefined,
            oldCommentMessage:undefined
        })
    }

    handleShow = () => {
        this.setState({
            show:true
        })
    }
    handleShowEdit = (oldComment) => {
        this.setState({
            showEdit:true,
            oldComment:oldComment,
            oldCommentMessage:oldComment.message
        })
    }

    handleCloseAndSubmit = () =>{
        this.setState({
            show:false,
        })
        this.addComment();
    }

    handleCloseAndSubmitEdit = () =>{
        this.setState({
            showEdit:false,
        })
        this.updateComment();
    }


    render(){
        return(
            <div  className="card my-3">
                <div className="top">
                    <h4 style={{margin: 15}} > My Notes </h4>
                    <IconButton color={"primary"} onClick={()=>this.handleShow()}  ><PostAddIcon /></IconButton>
                </div>
                <Table responsive="sm">
                    <tbody>
                    {this.state.commentList.length>0 && this.state.commentList.map(comment=>(

                        <tr key={comment.id}>
                            <td style={{width:"5%"}}>  <ul><li  style={{color:comment.color}} key={comment.creationTimestamp}/>  </ul></td>
                            <td style={{width:"85%"}}><p style={{width:"75%"}}>{comment.message}</p></td>
                            <td style={{width:"5%" }}> <IconButton  style={{ marginLeft: "auto" }}  color={"primary"}  onClick={()=>this.handleShowEdit(comment)}><CreateIcon /></IconButton></td>
                            <td style={{width:"5%" }}> <IconButton   color={"secondary"} onClick={()=>this.deleteComment(comment)} ><DeleteIcon /></IconButton></td>

                        </tr>

                    ))}
                    </tbody>
                </Table>


                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add a note</Modal.Title>
                    </Modal.Header>
                    <Modal.Body> <InputTextarea  value={this.state.comment} onChange={(e) => this.saveComment( e.target.value)} rows={3} cols={50} autoResize /></Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleCloseAndSubmit}>
                            Add
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showEdit} onHide={this.handleCloseEdit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit the note</Modal.Title>
                    </Modal.Header>
                    <Modal.Body> <InputTextarea defaultValue={this.state.oldCommentMessage} value={this.state.newComment} onChange={(e) => this.saveCommentEdit( e.target.value)} rows={3} cols={50} autoResize /></Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleCloseAndSubmitEdit}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Toast ref={(el) => this.toast = el} />
        </div>);
    }
}