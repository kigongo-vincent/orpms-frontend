// import { Paper } from '@mui/material'
import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ThemeProvider, colors, createTheme } from '@mui/material'

import Login from '../app/pages/Login'
import Signup from '../app/pages/Signup'
import UserDashboard from '../app/pages/user/Index'
import Topic from '../app/pages/user/Topic'
import Project from '../app/pages/user/Project'
import Performance from '../app/pages/student/Performance'
import Messages from '../app/pages/student/Messages'
import AddProject from '../app/pages/student/AddProject'
import AddReport from '../app/pages/student/AddReport'
import Lecturer from '../app/pages/lecturer/Index'
import PublishedReports from '../app/pages/lecturer/PublishedReports'
import Groups from '../app/pages/lecturer/Groups'
import Report from '../app/pages/student/Report'
import NotFound from '../app/pages/404'
import Publish from '../app/pages/student/Publish'
import { Home } from '@material-ui/icons'
import Grade from '../app/pages/lecturer/Grade'
import Index from '../app/pages/librarian/Index'
import Deadlines from '../app/pages/librarian/Deadlines'
import Topics from '../app/pages/librarian/Topics'
import Courses from '../app/pages/librarian/Courses'
import Cordinator from '../app/pages/Cordinator/Index'
import GroupsSupervised from '../app/pages/Cordinator/Groups'
import Reset from '../app/pages/Reset'
import OTP from '../app/pages/OTP'
import Verify from '../app/pages/Verify'
import ViewProjects from '../app/pages/Cordinator/ViewProjects'
import BroadCastMessages from '../app/pages/Cordinator/Messages'
const theme = createTheme({
    palette: {
        primary: {
            main: colors.grey[900]
        },
        secondary: {
            main: "#44b467",
            contrastText: "aliceblue"
        },
    }
})


const App = () => {

    const getDeadlines = async () => {
        const res = await fetch(`https://kigongovincent.pythonanywhere.com/deadlines`)
        if (res.status == 200) {
            const data = await res.json()
            localStorage.setItem("deadlines", JSON.stringify(data))
        }
        else {
            localStorage.setItem("deadlines", JSON.stringify([]))
        }
    }

    useEffect(() => {
        getDeadlines()
    }, [])
    return (
        <ThemeProvider theme={theme}>

            <Routes>
                <Route path="/login" Component={Login} />
                <Route path="/publish/:id" Component={Publish} />
                <Route path="*" Component={NotFound} />
                <Route path="/signup" Component={Signup} />
                <Route path="/deadlines" Component={Deadlines} />
                <Route path="/" Component={UserDashboard} />
                <Route path="/:category/:id" Component={Topic} />
                <Route path="/project/:id" Component={Project} />
                <Route path="/group/:id" Component={Messages} />
                <Route path="/librarian" Component={Index} />
                <Route path="/addgroup/:id" Component={AddProject} />
                <Route path="/add_topic" Component={Topics} />
                <Route path="/addreport/:id" Component={AddReport} />
                <Route path="/lecturer" Component={Lecturer} />
                <Route path="/published" Component={PublishedReports} />
                <Route path="/groups" Component={Groups} />
                <Route path="/report/:id" Component={Report} />
                <Route path="/grades/:id" Component={Grade} />
                <Route path="/courses" Component={Courses} />
                <Route path="/Cordinator" Component={Cordinator} />
                <Route path="/Cordinator/groups/:id" Component={GroupsSupervised} />
                <Route path="/OTP" Component={OTP} />
                <Route path="/verify" Component={Verify} />
                <Route path="/reset_password/:id" Component={Reset} />
                <Route path="/view_projects" Component={ViewProjects} />
                <Route path="/broadcast" Component={BroadCastMessages} />
            </Routes>


        </ThemeProvider>
    )
}

export default App