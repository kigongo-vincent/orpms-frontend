import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const URL = "https://kigongovincent.pythonanywhere.com"
const initialState = {
    projects: [],
    topics: [],
    courses: [],
    years: [],
    supervisors: [],
    loading: true,
    error: null,
    comments: [],
    loading_projects: false
}
export const getTopics = createAsyncThunk("projects/getTopics", async () => {
    const response = await fetch(`${URL}/topics`)
    return await response.json()
})

export const getCourses = createAsyncThunk("projects/getCourses", async () => {
    const response = await fetch(`${URL}/courses`)
    return await response.json()
})

export const getSupervisorsAndYears = createAsyncThunk("projects/getSupervisorsAndYears", async () => {
    const response = await fetch(`${URL}/years_and_supervisors`)
    return await response.json()
})

export const getProjects = createAsyncThunk("projects/getProjects", async (path) => {
    const response = await fetch(`${URL}/projects${path}`)
    return await response.json()
})

export const ProjectsReducer = createSlice({
    name: "projects slice",
    initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder.addCase(getTopics.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getTopics.fulfilled, (state, action) => {
            state.topics = action.payload
            state.loading = false
        })
        builder.addCase(getCourses.fulfilled, (state, action) => {
            state.courses = action.payload
        })
        builder.addCase(getTopics.rejected, (state) => {
            state.loading = false
            state.error = "something went wrong"
        })

        // ======================projects===========================
        builder.addCase(getProjects.pending, (state) => {
            state.loading_projects = true
        })
        builder.addCase(getProjects.fulfilled, (state, action) => {
            state.projects = action.payload.length == 0 ? action.payload : action.payload.filter(p => p.status == "approved" && p.approved)
            state.loading_projects = false
        })
        builder.addCase(getProjects.rejected, (state) => {
            state.loading_projects = false
        })


        builder.addCase(getSupervisorsAndYears.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getSupervisorsAndYears.fulfilled, (state, action) => {
            state.supervisors = action.payload.supervisors
            state.years = action.payload.years
            state.loading = false
        })
        builder.addCase(getSupervisorsAndYears.rejected, (state) => {
            state.loading = false
        })
    }
})

export const getAllProjects = (state) => state.projects.projects
export const getAllTopics = (state) => state.projects.topics
export const getAllCourses = (state) => state.projects.courses
export const getAllYears = (state) => state.projects.years
export const getAllSupervisors = (state) => state.projects.supervisors
export const getAllComments = (state) => state.projects.comments
export const isLoading = (state) => state.projects.loading
export const loading_projects = (state) => state.projects.loading_projects
export default ProjectsReducer.reducer