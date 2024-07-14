import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './slices/AuthReducer'
import ProjectsReducer from "./slices/ProjectsReducer";
import GroupReducer from "./slices/GroupReducer";

export const store = configureStore({
    reducer:{
        auth: AuthReducer,
        projects: ProjectsReducer,
        group: GroupReducer
    }
})