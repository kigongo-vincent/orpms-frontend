import { Box, Container, Paper, Skeleton, Typography, colors } from "@mui/material"
import UserNavigation from "../../components/UserNavigation"
import { CloudUploadRounded, Group, Publish } from "@material-ui/icons"
import { FaChalkboardTeacher, FaGraduationCap, FaProjectDiagram } from "react-icons/fa"
import { PieChart } from '@mui/x-charts/PieChart';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAuthInformation } from "../../../src/model/slices/AuthReducer";
import { Navigate } from "react-router-dom";

const Index = () => {
    const user = useSelector(getAuthInformation)
    const pieParams = { height: 510, width: 220, margin: { right: 5 } }
    const [stats, setStats] = useState({
        groups: 0,
        lecturers: 0,
        published: 0,
        ongoing: 0,
        free_students: 0,
        students: 0,
        uploads: 0,
        delayed: 0,
    })
    const [loading, setLoading] = useState(true)

    const getStats = async () => {
        setLoading(true)
        const response = await fetch(`https://kigongovincent.pythonanywhere.com/results`, {
            headers: {
                'Authorization': `Bearer ${user.tokens.access}`
            }
        })
        if (response.status == 200) {
            const data = await response.json()
            setStats(data)
            setLoading(false)
        } else {
            setLoading(false)
        }
    }

    useEffect(() => {
        getStats()
    }, [])
    return (
        <>
            {
                user.userType == "librarian" || user?.userType == "cordinator"
                    ?
                    <Box>
                        <UserNavigation />
                        <Container sx={{ mt: 12 }}>
                            {
                                loading
                                    ?
                                    <>
                                        <Skeleton height={"50vh"} />
                                        <Skeleton height={"10vh"} />
                                    </>
                                    :
                                    <>
                                        <Paper className="px-5 py-4 mb-4" elevation={0}>
                                            <Typography variant="h4" fontWeight={"bold"} lineHeight={1.8}>
                                                hello, {user.username}
                                            </Typography>
                                            <Typography>
                                                Welcome to your dashboard
                                            </Typography>
                                        </Paper>
                                        <Typography sx={{ my: 2 }}>
                                            Report Analysis
                                        </Typography>


                                        {

                                            user.userType == "cordinator"

                                                ?

                                                <Box display={"flex"} flexWrap={"wrap"} justifyContent={"space-between"} alignItems={"center"}>

                                                    <Box className="bg-success text-light px-4 py-2 rounded w-xs-100 mb-2 mb-lg-0" bgcolor={"white"} >
                                                        <Typography variant="h5">
                                                            {stats.uploads}
                                                        </Typography>
                                                        <div className="d-flex align-items-center">
                                                            <CloudUploadRounded />
                                                            &nbsp;
                                                            <Typography>report(s) uploaded</Typography>
                                                        </div>
                                                    </Box>

                                                    <Box className="px-4 py-2 bg-success text-light rounded w-xs-100 mb-2 mb-lg-0" bgcolor={"white"}>
                                                        <Typography variant="h5">
                                                            {stats.published}
                                                        </Typography>
                                                        <div className="d-flex align-items-center">
                                                            <Publish />
                                                            &nbsp;
                                                            <Typography>report(s) published</Typography>
                                                        </div>
                                                    </Box>

                                                    <Box className=" px-4 py-2 bg-success text-light rounded w-xs-100 mb-2 mb-lg-0" bgcolor={"white"}>
                                                        <Typography variant="h5">
                                                            {stats.ongoing}
                                                        </Typography>
                                                        <div className="d-flex align-items-center">
                                                            <FaProjectDiagram />
                                                            &nbsp;
                                                            <Typography>Ongoing project(s)</Typography>
                                                        </div>
                                                    </Box>

                                                    <Box bgcolor={"white"} className="px-4 bg-success text-light py-2 rounded w-xs-100 mb-2 mb-lg-0"  >
                                                        <Typography variant="h5">
                                                            {stats.groups}
                                                        </Typography>
                                                        <div className="d-flex align-items-center">
                                                            <Group />
                                                            &nbsp;
                                                            <Typography>Registered group(s)</Typography>
                                                        </div>
                                                    </Box>

                                                    <Box bgcolor={"white"} className=" px-4 bg-success text-light py-2 rounded w-xs-100 mb-2 mb-lg-0"  >
                                                        <Typography variant="h5">
                                                            {stats.students}
                                                        </Typography>
                                                        <div className="d-flex align-items-center">
                                                            <FaGraduationCap />
                                                            &nbsp;
                                                            <Typography>Student account(s)</Typography>
                                                        </div>
                                                    </Box>

                                                    <Box bgcolor={"white"} className="bg-success text-light px-4 py-2 rounded w-xs-100 mb-2 mb-lg-0"  >
                                                        <Typography variant="h5">
                                                            {stats.lecturers}
                                                        </Typography>
                                                        <div className="d-flex align-items-center">
                                                            <FaChalkboardTeacher />
                                                            &nbsp;
                                                            <Typography>Lecturer account(s)</Typography>
                                                        </div>
                                                    </Box>

                                                </Box>
                                                :

                                                <Box display={"flex"} flexWrap={"wrap"} alignItems={"center"}>

                                                    <Box className="bg-success text-light px-4 py-2 rounded w-xs-100 mb-2 mb-lg-0" bgcolor={"white"} >
                                                        <Typography variant="h5">
                                                            {stats.uploads}
                                                        </Typography>
                                                        <div className="d-flex align-items-center">
                                                            <CloudUploadRounded />
                                                            &nbsp;
                                                            <Typography>report(s) uploaded</Typography>
                                                        </div>
                                                    </Box>

                                                    <Box className="px-4 py-2 bg-success text-light rounded mx-3 w-xs-100 mb-2 mb-lg-0" bgcolor={"white"}>
                                                        <Typography variant="h5">
                                                            {stats.published}
                                                        </Typography>
                                                        <div className="d-flex align-items-center">
                                                            <Publish />
                                                            &nbsp;
                                                            <Typography>report(s) published</Typography>
                                                        </div>
                                                    </Box>

                                                    <Box className=" px-4 py-2 bg-success text-light rounded w-xs-100 mb-2 mb-lg-0" bgcolor={"white"}>
                                                        <Typography variant="h5">
                                                            {stats.ongoing}
                                                        </Typography>
                                                        <div className="d-flex align-items-center">
                                                            <FaProjectDiagram />
                                                            &nbsp;
                                                            <Typography>Ongoing project(s)</Typography>
                                                        </div>
                                                    </Box>





                                                </Box>

                                        }

                                        {

                                            user.userType == "cordinator"

                                                ?

                                                <Box display={"flex"} flexWrap={"wrap"} alignItems={"stretch"} justifyContent={"space-between"} sx={{ mb: 5, mt: 3 }}>
                                                    <Paper elevation={0} sx={{ p: 3, my: 3 }} className="w-xs-100 ">
                                                        <Typography textAlign={"center"} sx={{ my: 2 }}>Graph illustrating user distribution</Typography>
                                                        <PieChart
                                                            series={[
                                                                {
                                                                    innerRadius: 9,
                                                                    outerRadius: 100,
                                                                    paddingAngle: 5,
                                                                    cornerRadius: 5,
                                                                    startAngle: -60,
                                                                    endAngle: 180,
                                                                    cx: 100,
                                                                    cy: 100,
                                                                    data: [{ label: "lecturers", color: "#0f4d68", value: stats.lecturers }, { label: "students", color: "#08a3df", value: stats.students }]
                                                                },
                                                            ]}
                                                            {...pieParams}
                                                        />
                                                    </Paper>
                                                    <Paper elevation={0} sx={{ p: 3, my: 3 }} className="w-xs-100 mx-0">
                                                        <Typography textAlign={"center"} sx={{ my: 2 }}>Graph illustrating report statistics</Typography>
                                                        <PieChart
                                                            series={[
                                                                {
                                                                    innerRadius: 9,
                                                                    outerRadius: 100,
                                                                    paddingAngle: 5,
                                                                    cornerRadius: 5,
                                                                    startAngle: -135,
                                                                    endAngle: 180,
                                                                    cx: 100,
                                                                    cy: 100,
                                                                    data: [{ value: stats.ongoing, color: "#cecece", label: "pending" }, { label: "published reports", color: "#CAE9F7", value: stats.published }]
                                                                },
                                                            ]}
                                                            {...pieParams}
                                                        />
                                                    </Paper>
                                                    <Paper elevation={0} sx={{ p: 3, my: 3 }} className="w-xs-100 mx-0">
                                                        <Typography textAlign={"center"} sx={{ my: 2 }}>Graph illustrating Group allocation</Typography>
                                                        <PieChart
                                                            series={[
                                                                {
                                                                    innerRadius: 9,
                                                                    outerRadius: 100,
                                                                    paddingAngle: 5,
                                                                    cornerRadius: 5,
                                                                    startAngle: -90,
                                                                    endAngle: 180,
                                                                    cx: 100,
                                                                    cy: 100,
                                                                    data: [{ value: stats.students - stats.free_students, color: "#FFA443", label: "students with groups" }, { label: "students without groups", color: colors.blueGrey[100], value: stats.free_students }]
                                                                },
                                                            ]}
                                                            {...pieParams}
                                                        />
                                                    </Paper>

                                                    <Paper elevation={0} sx={{ p: 3, my: 3 }} className="w-xs-100 mx-0">
                                                        <Typography textAlign={"center"} sx={{ my: 2 }}>Report publishment Timeliness</Typography>
                                                        <PieChart
                                                            series={[
                                                                {
                                                                    innerRadius: 9,
                                                                    outerRadius: 100,
                                                                    paddingAngle: 5,
                                                                    cornerRadius: 5,
                                                                    startAngle: -90,
                                                                    endAngle: 180,
                                                                    cx: 100,
                                                                    cy: 100,
                                                                    data: [{ value: stats.published - stats.delayed, color: "#F34342", label: "Reports published in-time" }, { label: "reports published after deadline", color: colors.blueGrey[100], value: stats.delayed }]
                                                                },
                                                            ]}
                                                            {...pieParams}
                                                        />
                                                    </Paper>

                                                </Box>
                                                :

                                                <Box display={"flex"} flexWrap={"wrap"} alignItems={"stretch"} sx={{ mb: 5, mt: 3 }}>

                                                    <Paper elevation={0} sx={{ p: 3, my: 3 }} className="w-xs-100 mx-0">
                                                        <Typography textAlign={"center"} sx={{ my: 2 }}>Graph illustrating report statistics</Typography>
                                                        <PieChart
                                                            series={[
                                                                {
                                                                    innerRadius: 9,
                                                                    outerRadius: 100,
                                                                    paddingAngle: 5,
                                                                    cornerRadius: 5,
                                                                    startAngle: -135,
                                                                    endAngle: 180,
                                                                    cx: 100,
                                                                    cy: 100,
                                                                    data: [{ value: stats.ongoing, color: "#cecece", label: "pending" }, { label: "published reports", color: "#CAE9F7", value: stats.published }]
                                                                },
                                                            ]}
                                                            {...pieParams}
                                                        />
                                                    </Paper>


                                                    <Paper elevation={0} sx={{ p: 3, my: 3 }} className="w-xs-100 mx-0">
                                                        <Typography textAlign={"center"} sx={{ my: 2 }}>Report publishment Timeliness</Typography>
                                                        <PieChart
                                                            series={[
                                                                {
                                                                    innerRadius: 9,
                                                                    outerRadius: 100,
                                                                    paddingAngle: 5,
                                                                    cornerRadius: 5,
                                                                    startAngle: -90,
                                                                    endAngle: 180,
                                                                    cx: 100,
                                                                    cy: 100,
                                                                    data: [{ value: stats.published - stats.delayed, color: "#F34342", label: "Reports published in-time" }, { label: "reports published after deadline", color: colors.blueGrey[100], value: stats.delayed }]
                                                                },
                                                            ]}
                                                            {...pieParams}
                                                        />
                                                    </Paper>

                                                </Box>

                                        }
                                    </>
                            }
                        </Container>
                    </Box>
                    :
                    <Navigate to={"/"} />
            }
        </>
    )
}
export default Index