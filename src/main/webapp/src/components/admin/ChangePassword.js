import React, {Component} from "react";
import {Redirect} from 'react-router-dom'
import {Card, Form, Image} from "antd";
import {Toast} from 'primereact/toast';
import axios from 'axios';
import "./styles/login.css";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import withStyles from "@material-ui/core/styles/withStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Image1 from "./LoginPagePhotos/photo1.jpg";
import Image2 from "./LoginPagePhotos/photo2.jpg";
import Image3 from "./LoginPagePhotos/photo3.jpg";
import {LockOpenOutlined, Visibility, VisibilityOff} from "@material-ui/icons";
import {IconButton, Input, InputAdornment} from "@material-ui/core";
import {ProgressSpinner} from "primereact/progressspinner";


const styles = theme => ({
    root: {
        height: '100vh',
    },
    image1: {
        backgroundImage: `url(${Image1})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    image2: {
        backgroundImage: `url(${Image2})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    image3: {
        backgroundImage: `url(${Image3})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class LogInForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageRandom: Math.floor(Math.random() * 3),
            imageStyleText: 'classes.image1',
            showPassword1:false,
            showPassword2:false,
            password1:"",
            password2:"",
            validate:false,
            isLoading:true
        }
        this.changeWindow = this.changeWindow.bind(this);
    }

    componentDidMount() {
        document.body.style.background = "white";
        this.validate();
        setInterval(() => {
            if (this.state.imageRandom == 0) {
                this.setState({
                    imageStyleText: 'classes.image1'
                })
            } else if (this.state.imageRandom == 1) {
                this.setState({
                    imageStyleText: 'classes.image2'
                })
            } else {
                this.setState({
                    imageStyleText: 'classes.image3'
                })
            }
            this.setState({
                imageRandom: (this.state.imageRandom + 1) % 3
            })
        }, 5000);
    }

    validate(){

        axios.post("/forgot-password/validate",{token:this.props.match.params.token,password:''})
            .then(response => {
                if(response.data.type=="error"){
                    this.setState({
                        validate:false,
                        isLoading:false
                    });
                }
                else{
                    this.setState({
                        isLoading:false,
                        validate:true
                    })
                }
            })
    }

    changeValue(e) {
        let id = e.target.id;
        let value = e.target.value;
        if (id === 'password1') {
            this.setState({
                password1: value
            })
        } else {
            this.setState({
                password2: value
            })
        }
    }

    reset() {
        this.setState({
            username: '',
            password: '',
        })
    }



    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
    }

    forgetPassword(e) {
        this.setState({
            unsuccessful: <Redirect to='/'/>
        });
    }

    submit(e){
        if(!this.state.password1 || !this.state.password2){
            this.showToast("error","Both fields should not be left blank")
        }
        else if(this.state.password1!=this.state.password2){
            this.showToast("error","Passwords dont match.")
        }
        else if(this.state.password.length<8){
            this.showToast("error", 'Password should be longer than 8 characters');
        }
        else if(!(/[A-Z]/.test(this.state.password)) || !(/[a-z]/.test(this.state.password)) || !(/[0-9]/.test(this.state.password))){
            this.showToast("error", 'Password should contain at least one uppercase,one lowercase and a numeric character');
        }
        else{
            axios.post("/forgot-password/change",{token:this.props.match.params.token,password:this.state.password})
                .then(response=>{
                    if(response.data.type=="success"){
                        this.setState({
                            changing:false
                        })
                        this.showToast("success", response.data.message);
                    }
                    else{
                        this.showToast("error", response.data.message);
                    }
                })

        }


    }
    changeWindow(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.history.push("/");
    }

    render() {
        const {classes} = this.props;
        const styleObj = {
            fontSize: 30,
            color: "#4a54f1",
            textAlign: "center",
            paddingTop: "5px",
            fontFamily: "Arial"

        }
        return (
                this.state.isLoading ?
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                        <ProgressSpinner className="p-d-block p-mx-auto" style={{width: '50px', height: '50px'}}
                                         strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                    </div> :<Grid container component="main" className={classes.root}>
                <Toast ref={(el) => this.toast = el}/>
                {this.state.successful}
                <CssBaseline/>
                {this.state.imageRandom == 0 ? <Grid item xs={false} sm={4} md={8} className={classes.image1}>
                    </Grid>
                    :
                    this.state.imageRandom == 1 ? <Grid item xs={false} sm={4} md={8} className={classes.image2}>
                        </Grid>
                        :
                        <Grid item xs={false} sm={4} md={8} className={classes.image3}>
                        </Grid>}
                {this.state.validate ? <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
                    <div className={classes.paper}>
                        <p style={styleObj}> <br/> Online
                            Education Tool</p>
                        <Typography component="h1" variant="h5">
                            Change Password
                        </Typography>
                        <Form className={classes.form} noValidate>
                            <Form.Item>
                                <label>New Password</label>
                                <Input type={this.state.showPassword1 ? "text" : "password"}
                                       onChange={(e) => this.changeValue(e)}
                                       value={this.state.password}
                                       endAdornment={<InputAdornment position="end">
                                           <IconButton
                                               onClick={(e) => this.setState({showPassword1: !this.state.showPassword1})}
                                               onMouseDown={this.handleMouseDownPassword}>
                                               {this.state.showPassword1 ? <Visibility/> : <VisibilityOff/>}
                                           </IconButton>
                                       </InputAdornment>}>
                                </Input>
                            </Form.Item>
                            <Form.Item>
                                <label>Confirm Password </label>
                                <Input type={this.state.showPassword2 ? "text" : "password"}
                                       onChange={(e) => this.changeValue(e)}
                                       value={this.state.password}
                                       endAdornment={<InputAdornment position="end">
                                           <IconButton
                                               onClick={(e) => this.setState({showPassword2: !this.state.showPassword2})}
                                               onMouseDown={this.handleMouseDownPassword}>
                                               {this.state.showPassword2 ? <Visibility/> : <VisibilityOff/>}
                                           </IconButton>
                                       </InputAdornment>}>
                                </Input>
                            </Form.Item>
                            <Button fullWidth color="primary" variant="contained"
                                    color="primary"
                                    className={classes.submit} onClick={(e) => this.submit(e)}
                                    className="btn btn-primary"> Change Password </Button>
                            &nbsp;
                            <Grid container justify="flex-end">
                                <Grid item>
                                    {<Link href="#" onClick={(e) => this.changeWindow(e)} variant="body2"
                                           style={{color: "#ca3120"}}>
                                        Go to Login page
                                    </Link>}
                                </Grid>
                            </Grid>
                            <Box mt={5}>
                                <Typography variant="body2" color="textSecondary" align="center">
                                    {'Copyright © '}
                                        OET
                                    {' '}
                                    {new Date().getFullYear()}
                                    {'.'}
                                </Typography>
                            </Box>
                        </Form>
                    </div>

                </Grid>: <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
                    <div className={classes.paper}>
                        <p style={styleObj}><br/> Online
                            Education Tool</p>
                        <Typography component="h1" variant="h5">
                            Change Password
                        </Typography>
                        <Box mt={10}>
                            <p style={{fontSize:'15px' , fontWeight: "bold"}}>Invalid token or token expired.Please send the request again</p>
                        </Box>
                        <Box mt={10}></Box>
                        <Button fullWidth color="primary" variant="contained"
                                color="primary"
                                className={classes.submit} onClick={(e) => this.submit(e)}
                                className="btn btn-primary"> Change Password </Button>
                        &nbsp;
                        <Grid container justify="flex-end">
                            <Grid item>
                                {<Link href="#" onClick={(e) => this.changeWindow(e)} variant="body2"
                                       style={{color: "#ca3120"}}>
                                    Go to Login page
                                </Link>}
                            </Grid>
                        </Grid>
                        <Box mt={5}>
                            <Typography variant="body2" color="textSecondary" align="center">
                                {'Copyright © '}

                                    OET
                                {' '}
                                {new Date().getFullYear()}
                                {'.'}
                            </Typography>
                        </Box>
                    </div>

                </Grid>
                }

            </Grid>


        )
    }
}

export default withStyles(styles, {withTheme: true})(LogInForm);