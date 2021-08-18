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
import {LockOpenOutlined} from "@material-ui/icons";


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
            username: '',
            password: '',
            unsuccessful: '',
            successful: '',
            inLogin: true,
            imageRandom: Math.floor(Math.random() * 3),
            imageStyleText: 'classes.image1',
            goToForget:''
        }
        this.changeWindow = this.changeWindow.bind(this);
    }

    componentDidMount() {
        document.body.style.background = "white";
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


    changeValue(e) {
        let id = e.target.id;
        let value = e.target.value;
        if (id === 'username') {
            this.setState({
                username: value
            })
        } else {
            this.setState({
                password: value
            })
        }
    }

    reset() {
        this.setState({
            username: '',
            password: '',
        })
    }

    submit(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.state.username || !this.state.password) {
            this.reset();
            this.showToast("error", 'Fields cannot be left blank.');
        } else {
            axios.post("/api/v1/login", {
                username: this.state.username,
                password: this.state.password

            })
                .then(response => {
                    let dataBody = response.data.data;
                    if (response.data.type !== "success") {
                        this.showToast(response.data.type, response.data.message)
                    } else {
                        localStorage.setItem("jwt", dataBody.jwt);
                        localStorage.setItem("type", dataBody.type);
                        localStorage.setItem("username", this.state.username)
                        if (dataBody.type === "STUDENT") {
                            this.setState({
                                successful: <Redirect to='/student/home'/>
                            })
                        } else if (dataBody.type === "INSTRUCTOR") {
                            this.setState({
                                successful: <Redirect to='/instructor/home'/>
                            })
                        } else if (dataBody.type === "ADMIN") {
                            this.setState({
                                successful: <Redirect to='/admin/home'/>
                            })
                        }
                    }
                })
                .catch(error => {
                    this.showToast("error", "Unknown Error");
                })
        }
    }

    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
    }

    forgetPassword(e) {
        this.setState({
            unsuccessful: <Redirect to='/forget-password'/>
        });
    }


    changeWindow(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            successful: <Redirect to='/forget-password'/>
        })
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
            <Grid container component="main" className={classes.root}>
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
                <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
                    <div className={classes.paper}>
                        <p  style={styleObj}> <br/> Online Education Tool</p>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Form className={classes.form} noValidate>
                            <Form.Item>
                                <label>Username</label>
                                <input type="text"
                                       className="form-control"
                                       id="username"
                                       name="username"
                                       value={this.state.username}
                                       onChange={(e) => this.changeValue(e)}/>
                            </Form.Item>
                            <Form.Item>
                                <label>Password</label>
                                <input type="password"
                                       className="form-control"
                                       id="password"
                                       name="password"
                                       value={this.state.password}
                                       onChange={(e) => this.changeValue(e)}/>
                            </Form.Item>
                            <Button fullWidth color="primary" variant="contained"
                                    color="primary"
                                    className={classes.submit} onClick={(e) => this.submit(e)}
                                    className="btn btn-primary"> Log In </Button>
                            &nbsp;
                            <Grid container justify="space-between">
                                <Grid item>
                                    {<Link href="/accounts.html" className="ml-0 mr-auto" variant="body2" style={{color:"#ca3120"}}>
                                        Click here for an account
                                    </Link>}
                                </Grid>
                                <Grid item>

                                    {<Link href="#" onClick={(e) => this.changeWindow(e)} variant="body2" style={{color:"#ca3120"}}>
                                        Forgot Password?
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
                </Grid>

            </Grid>

            //will direct to home page if username and password found in the database

        )
    }
}

export default withStyles(styles, {withTheme: true})(LogInForm);