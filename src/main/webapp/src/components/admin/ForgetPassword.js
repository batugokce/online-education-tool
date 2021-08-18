import React, {Component} from "react";
import {Toast} from "primereact/toast";
import {Card, Form} from "antd";
import axios from 'axios';
import {Redirect} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Image1 from "./LoginPagePhotos/photo1.jpg";
import Image2 from "./LoginPagePhotos/photo2.jpg";
import Image3 from "./LoginPagePhotos/photo3.jpg";
import withStyles from "@material-ui/core/styles/withStyles";
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

class ForgetPassword extends Component{
    constructor(props) {
        super(props);
        this.state={
            text:'',
            successful:'',
            notsend:true
        }
    }

    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
    }
    changeValue(e){
        this.setState({text:e.target.value});
    }
    submit(e) {
        if (!this.state.text) {
            this.reset();
            this.showToast("error", 'Field cannot be left blank.');
        } else {
            let type = '';
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(this.state.text))
                type = 'email';
            else
                type = 'username';
            console.log("")
            axios.post("/forgot-password", {type: type, text: this.state.text})
                .then(response => {
                    if (response.data.type != "success") {
                        this.showToast(response.data.type, response.data.message);
                    } else {
                        this.setState({
                            notsend: false
                        })
                    }
                })

        }
    }
    returnfunc(e){
        this.setState({
            successful: <Redirect to= '/' />
        })
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
            <Grid container component="main" className={classes.root}>
                <Toast ref={(el) => this.toast = el}/>

                <CssBaseline/>
                {this.state.successful}
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
                        <Typography component="h1" variant="h5" style={{color:"#ca3120"}}>
                            Forgot Password?
                        </Typography>
                        <br/>
                        {this.state.notsend ? <Form className={classes.form} noValidate>
                            <Form.Item>
                                <label>Please enter either username or e-mail address.</label>
                                <input type="text"
                                       className="form-control"
                                       id="text"
                                       name="text"
                                       value={this.state.text}
                                       onChange={(e) => this.changeValue(e)}/>
                            </Form.Item>

                            <Button fullWidth variant="contained"
                                    color="primary"
                                    className={classes.submit} onClick={(e) => this.submit(e)}
                                    className="btn btn-primary"> Send </Button>
                            &nbsp;
                            <Grid container justify="flex-end">
                                <Grid item>
                                    {<Link href="#" onClick={(e) => this.changeWindow(e)} variant="body2">
                                        Go Back To Login Page
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
                        </Form>:
                            <div>
                                &nbsp;&nbsp;&nbsp;
                                An e-mail send to your mail.
                                <Button fullWidth variant="contained"
                                        color="primary"
                                        className={classes.submit} onClick={(e) => this.changeWindow(e)}
                                        className="btn btn-primary"> Go back to Login Page </Button>
                            </div>}
                    </div>
                </Grid>

            </Grid>

            //will direct to home page if username and password found in the database

        )
    }


}
export default withStyles(styles, {withTheme: true})(ForgetPassword);