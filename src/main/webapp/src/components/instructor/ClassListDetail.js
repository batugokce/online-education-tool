import React, {Component} from "react";
import {ProgressSpinner} from "primereact/progressspinner";
import InstructorNavbar from "./InstructorNavbar";
import axios from "axios";
import authHeader from "../service/authHeader";
import {DataTable} from "primereact/datatable";
import {Link} from "react-router-dom";
import {Col, Checkbox} from "antd";
import {Container, Tab, Tabs} from "react-bootstrap";
import "./ClassListDetail.scss";
import Chart from "react-google-charts";
import Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";
import bellCurve from "highcharts/modules/histogram-bellcurve";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BarChartIcon from '@material-ui/icons/BarChart';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Card from "react-bootstrap/Card";
import {
    Box,
    Collapse,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer, TablePagination,
    TableRow,
    Typography
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import IconButton from '@material-ui/core/IconButton';
import TableHead from "@material-ui/core/TableHead";
bellCurve(Highcharts);





class Row extends Component{
    constructor(props) {
        super(props);
        this.state={
            open:false,
            averages:null,
            assignmentWithAllAverages:null,
            assignmentWithCompletedAverages:null,
            isLoading:true,
            checked:false,
            completedSum:0

        }
        this.handleChange=this.handleChange.bind(this);
    }
    handleChange(e){
        this.setState({
            checked:!this.state.checked
        })

    }
    getAverages(){
        axios.get("/api/v1/classroom/assignmentAverageOfClass/"+this.props.classId+"/"+this.props.row.id,{headers:authHeader()})
            .then(response=>{
                this.setState({
                    averages:response.data.data,
                    isLoading:false,
                    assignmentWithAllAverages:response.data.data.allSet.map(average=>([average.name,parseFloat(average.point)])),
                    assignmentWithCompletedAverages:response.data.data.completedSet.map(average=>([average.name,parseFloat(average.point)])),
                    assignmentbellCurveCompleted:response.data.data.completedSet.map(average=>(parseFloat(average.point))),
                    assignmentbellCurveAll:response.data.data.allSet.map(average=>(parseFloat(average.point))),
                    completedSum:response.data.data.completedSet.length
                })
                this.state.assignmentWithAllAverages.unshift(['Assignment','Averages']);
                this.state.assignmentWithCompletedAverages.unshift(['Assignment','Averages']);
            })
    }
    openBox(){
        if(this.state.averages===null){
            this.getAverages();
        }
        this.setState({
            open:!this.state.open
        })

    }
    render(){
        const { row } = this.props;


        return (
            <React.Fragment>
                <TableRow style={{borderBottom: "none"}}>
                    <TableCell align="center">
                        <IconButton aria-label="expand row" size="small" onClick={() => this.openBox()}>
                            {this.state.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} {row.title}
                        </IconButton>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                            {this.state.isLoading?<div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                                <ProgressSpinner className="p-d-block p-mx-auto"  style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                            </div> : <Box margin={1}>
                                <Typography align="center" variant="h6" gutterBottom component="div">
                                    <h4>Performance</h4>
                                    <Checkbox value={this.state.checked} onClick={(e)=>this.handleChange(e)}>Do not include unfinished assignments</Checkbox>
                                    <Chart   width={'500px'}
                                             height={'300px'}
                                             chartType="Histogram"
                                             loader={<div>Loading Chart</div>}
                                             data={ this.state.checked ? this.state.assignmentWithCompletedAverages : this.state.assignmentWithAllAverages }
                                             options={{
                                                 title: 'Assignment Histogram',
                                                 legend: { position: 'none' },
                                                 colors: ['#4285F4'],
                                                 chartArea: { width: 401 },
                                                 hAxis: {
                                                     ticks: [0,10,20,30,40,50,60,70,80,90,100],
                                                 },
                                                 bar: { gap: 0 },
                                                 histogram: {
                                                     bucketSize: 10,
                                                     maxNumBuckets: 200,
                                                     minValue: 0,
                                                     maxValue: 100,
                                                 },
                                             }}/>
                                    <p align="left">{this.state.completedSum} student finished this assignment</p>
                                </Typography>
                            </Box>}
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }
}
export default class classListDetail extends Component {


    constructor() {
        super();
        this.state = {
            isLoading: true,
            studentList: [],
            assignments: [],
            tableHeader: null,
            tableHeaderFixed: false,
            studentAverages:[],
            studentWithCompletedAverages:[],
            tableLoading:true,
            checked:false,
            useAll:true,
            studentWithAllAverages:[],
            bellCurveCompleted:[],
            bellCurveAll:[],
            tab:'Students',
            page:0,
            rowsPerPage:5
        };
        this.handleChange=this.handleChange.bind(this);
        this.handleChangePage=this.handleChangePage.bind(this);

    }
    handleChangePage=(event,newPage)=>{
        this.setState({
            page:newPage
        })
    }
    handleChangeRowsPerPage=(event)=>{
        this.setState({
            rowsPerPage:event.target.value,
            page:0
        })
    }
    componentDidMount() {
        this.retrieveStudentAverages();
        this.retrieveStudents();
        this.retrieveAssignments();
        window.addEventListener('scroll', this.handleScroll.bind(this));

    }

    retrieveStudents() {
        axios.get("/api/v1/classroom/studentList/" + this.props.match.params.classID, {headers: authHeader()})
            .then(response => {
                this.setState({
                    studentList: response.data.data,
                    isLoading: false,
                })
            });
    }

    retrieveStudentAverages(){
        let studentWithCompletedAverages=[]

        axios.get("/api/v1/classroom/averagesOfClass/" + this.props.match.params.classID, {headers: authHeader()})
            .then(response => {
                this.setState({
                    studentAverages: response.data.data,
                    isLoading: false,
                    studentWithAllAverages:response.data.data.map(average=>([average.name,parseFloat(average.totalAverage)])),
                    studentWithCompletedAverages:response.data.data.map(average=>([average.name,parseFloat(average.averages)])),
                    bellCurveCompleted:response.data.data.map(average=>(parseFloat(average.averages))),
                    bellCurveAll:response.data.data.map(average=>(parseFloat(average.totalAverage))),
                });
                this.state.studentWithAllAverages.unshift(['Student','Averages']);
                this.state.studentWithCompletedAverages.unshift(['Student','Averages']);
                this.setState({
                    tableLoading:false,
                })
                console.log(this.state.bellCurveCompleted);

            });
    }

    retrieveAssignments(){
        axios.get("/api/v1/classroom/asssignmentList/"+this.props.match.params.classID,{headers:authHeader()})
            .then(response=>{
                this.setState({
                    assignments:response.data.data.sort((a,b)=>(a.id>b.id)?1:-1)
                })
            })
    }
    handleScroll(e) {
        // console.log(e);
        let scrollTop = e.srcElement.body.scrollTop;
    }
    handleChange(e){
        this.setState({
            checked:!this.state.checked
        })

    }
    setKey(k){
        this.setState({
            tab:k
        })
    }

    generateButton= (rowData) =>{
        return(
            <Link to={"/instructor/class-detail-student/" + rowData.username} className="nav-link">
                <Button type="button" icon="pi pi-eye" className="p-button-info mx-1"/>
            </Link>
        )
    }
    render() {
        const options={
            title: {
                text: 'Bell curve'
            },

            xAxis: [{
                title: {
                    text: 'Data'
                },
                alignTicks: false
            }, {
                title: {
                    text: 'Bell curve'
                },
                alignTicks: false,
                opposite: true
            }],

            yAxis: [{
                title: { text: 'Data' }
            }, {
                title: { text: 'Bell curve' },
                opposite: true
            }],

            series: [{
                name: 'Bell curve',
                type: 'bellcurve',
                xAxis: 1,
                yAxis: 1,
                baseSeries: 1,
                zIndex: -1
            }, {
                name: 'Data',
                type: 'scatter',
                data: this.state.checked ? this.state.bellCurveCompleted : this.state.bellCurveAll,
                accessibility: {
                    exposeAsGroupOnly: true
                },
                visible:false,
                marker: {
                    radius: 1.5
                }
            }]
        }
        const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
        const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;
        return (
            this.state.isLoading ?
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <ProgressSpinner className="p-d-block p-mx-auto" style={{width: '50px', height: '50px'}}
                                     strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                </div> :
                <div>
                    <InstructorNavbar/>
                    <Container>
                        &nbsp;&nbsp;
                        <Tabs activeKey={this.state.tab} onSelect={(k)=>this.setKey(k)}>
                            <Tab eventKey="Students" title={<span><PeopleIcon/>   Students</span>}>
                                <div>
                                    &nbsp;
                                    <h1 align="center">Student List</h1>
                                    &nbsp;
                                    <Card>
                                    <DataTable value={this.state.studentList} rowHover
                                               emptyMessage="No student exists in this class."
                                               paginator
                                               paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={5} rowsPerPageOptions={[5,10,15]}
                                               paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                                        <Column field="studentNumber" header="Student Number" sortable />
                                        <Column field="name" header="Name"  />
                                        <Column field="surname" header="Surname"/>
                                        <Column field="emailAddress" header="Email Address"/>
                                        <Column header="Go to Details" body={this.generateButton} headerStyle={{width:'10em', textAlign: 'center'}}
                                                bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                                    </DataTable>
                                    </Card>
                                </div>
                            </Tab>
                            <Tab eventKey="Assignments" title={<span><AssignmentIcon/> Assignments</span>}>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                {this.state.assignments.length===0 ? <div> <p>From below,you can select each assignment and see related performance for that assignment</p>
                                    <Checkbox value={this.state.checked} onClick={(e)=>this.handleChange(e)}>Do not include unfinished assignments</Checkbox>
                                    <h3 align="center">Assignments of this classrom</h3>
                                <h5>Unfortunately,no assignment is entered for this classroom</h5></div>:
                                    <div>

                                        <p>From below,you can select each assignment and see related performance for that assignment</p>
                                        <Checkbox value={this.state.checked} onClick={(e)=>this.handleChange(e)}>Do not include unfinished assignments</Checkbox>
                                        <h3 align="center">Assignments of this classrom</h3>
                                        <hr/>
                                        <TableContainer component={Paper}>
                                            <Table aria-label="collapsible table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="center">Assignment Name</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.assignments.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row)=>(<Row key={row.title} row={row} classId={this.props.match.params.classID}/>))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            component="div"
                                            count={this.state.assignments.length}
                                            rowsPerPage={this.state.rowsPerPage}
                                            page={this.state.page}
                                            onChangePage={this.handleChangePage}
                                            onChangeRowsPerPage={this.handleChangeRowsPerPage}/>
                                    </div>}
                            </Tab>
                            <Tab eventKey="Graphs" title={<span><BarChartIcon/> Performance</span>}>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <div className="card">
                                    {this.state.tableLoading ? <div> </div> :
                                        <div>
                                            <Checkbox
                                                checked={this.state.checked}
                                                onChange={this.handleChange}
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                            >Do not include unfinished assignments</Checkbox>
                                            <div align="center"><h3>Histogram Chart</h3><Chart   width={'800px'}
                                                                                                 height={'300px'}
                                                                                                 chartType="Histogram"
                                                                                                 loader={<div>Loading Chart</div>}
                                                                                                 data={this.state.checked ? this.state.studentWithAllAverages : this.state.studentWithCompletedAverages}
                                                                                                 options={{
                                                                                                     title: 'Distribution',
                                                                                                     legend: { position: 'none' },
                                                                                                     colors: ['#4285F4'],
                                                                                                     chartArea: { width: 401 },
                                                                                                     hAxis: {
                                                                                                         ticks: [0,10,20,30,40,50,60,70,80,90,100],
                                                                                                     },
                                                                                                     bar: { gap: 0 },
                                                                                                     histogram: {
                                                                                                         bucketSize: 10,
                                                                                                         maxNumBuckets: 200,
                                                                                                         minValue: 0,
                                                                                                         maxValue: 100,
                                                                                                     },
                                                                                                 }}/></div>
                                            <HighchartsReact
                                                constructorType={"chart"}
                                                ref={this.chartComponent}
                                                highcharts={Highcharts}
                                                options={options}
                                            />
                                        </div>}
                                </div>
                            </Tab>
                        </Tabs>
                    </Container>

                </div>

        )
    }
}