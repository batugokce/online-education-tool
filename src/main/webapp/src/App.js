import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import UserCreateForm from "./components/admin/UserCreateForm";
import LogInForm from "./components/admin/LogInForm";
import HomePage from "./components/admin/HomePage";
import ClassCreateForm from "./components/admin/ClassCreateForm";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import AssignmentPage from "./components/student/AssignmentPage";
import Grades from "./components/student/Grades";
import Preferences from "./components/student/Preferences";
import StudentHomePage from "./components/student/StudentHomePage";
import InstructorHomePage from "./components/instructor/InstructorHomePage";
import NewAssignment from "./components/instructor/NewAssignment";
import ClassroomList from "./components/admin/ClassroomList";
import ClassInfo from "./components/admin/ClassInfo";
import ClassList from "./components/instructor/ClassList";
import classListDetail from "./components/instructor/ClassListDetail";
import WrittenAssignmentFeedback from "./components/instructor/feedback/WrittenAssignmentFeedback";
import WrittenAssignmentList from "./components/instructor/feedback/WrittenAssignmentList";
import ForgetPassword from "./components/admin/ForgetPassword";
import ChangePassword from "./components/admin/ChangePassword";
import StudentList from "./components/admin/student-list/StudentList";
import InstructorList from "./components/admin/instructor-list/InstructorList";
import AssignmentList from "./components/instructor/feedback/AssignmentList";
import AssignmentFeedback from "./components/instructor/feedback/AssignmentFeedback";
import ProfileMain from "./components/profile/ProfileMain";
import AllAssignments from "./components/instructor/AllAssignments";
import PreviewPage from "./components/instructor/preview/PreviewPage";
import InstructorProfile from "./components/profile/InstructorProfile";
import EditProfile from "./components/profile/EditProfile";
import InstructorNotification from "./components/instructor/notification/InstructorNotification";
import StudentNotification from "./components/student/notification/StudentNotification";
import StudentProfile from "./components/profile/StudentProfile";
import './styles/DarkMode.css';
import EditAssignment from "./components/instructor/editAssignment/EditAssignment";

class App extends Component {

    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route path={"/"} component={LogInForm} exact/>
                        <Route path={"/admin/new-account"} component={UserCreateForm}/>
                        <Route path={"/admin/new-class"} component={ClassCreateForm}/>
                        <Route path={"/admin/home"} component={HomePage}/>
                        <Route path={"/admin/classes"} component={ClassroomList}/>
                        <Route path={"/admin/class/:classID"} component={ClassInfo}/>
                        <Route path={"/admin/students"} component={StudentList}/>
                        <Route path={"/admin/instructors"} component={InstructorList}/>
                        <Route path={"/student/home"} component={StudentHomePage}/>
                        <Route path={"/student/assignment/:assignmentID"} component={AssignmentPage}/>
                        <Route path={"/student/grades"} component={Grades}/>
                        <Route path={"/student/preferences"} component={Preferences}/>
                        <Route path={"/student/profile"} component={StudentProfile}/>
                        <Route path={"/student/notification"} component={StudentNotification}/>
                        <Route path={"/instructor/home"} component={InstructorHomePage}/>
                        <Route path={"/instructor/new-assignment"} component={NewAssignment}/>
                        <Route path={"/instructor/edit-assignment/:assignmentId"} component={EditAssignment}/>
                        <Route path={"/instructor/class-list"} component={ClassList}/>
                        <Route path={"/instructor/assignments"} component={WrittenAssignmentList}/>
                        <Route path={"/instructor/all-assignments"} component={AllAssignments}/>
                        <Route path={"/instructor/preview/:assignmentId"} component={PreviewPage} />
                        <Route path={"/instructor/feedback/:articleId/:username"}
                               component={WrittenAssignmentFeedback}/>
                        <Route path={"/instructor/editProfile"} component={EditProfile}/>
                        <Route path={"/instructor/class-detail/:classID"} component={classListDetail}/>
                        <Route path={"/instructor/profile"} component={InstructorProfile}/>
                        <Route path={"/forget-password"} component={ForgetPassword}/>
                        <Route path={"/change-password/:token"} component={ChangePassword}/>
                        <Route path={"/instructor/class-detail-student-review/:userName/:assignmentID"}
                               component={AssignmentPage}/>
                        <Route path={"/instructor/class-detail-student/:userName"} component={ProfileMain}/>
                        <Route path={"/instructor/class-assignment-list"} component={AssignmentList}/>
                        <Route path={"/instructor/studentReview/:assignmentID/:userName"} component={AssignmentFeedback}/>
                        <Route path={"/instructor/notification"} component={InstructorNotification}/>
                        <Route component={LogInForm}/>
                    </Switch>
                </div>
            </Router>
        );

    }
}

export default App;
