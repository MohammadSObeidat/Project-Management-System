import axios from "axios"

const baseURL = 'https://upskilling-egypt.com:3003/api/v1'
export const imageBaseURL = 'https://upskilling-egypt.com:3003'

// Public URL
export const axiosInstanceURL = axios.create({baseURL: baseURL})
// Privet URL
export const axiosInstance = axios.create({baseURL: baseURL})

axiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = localStorage.getItem("token");
  
    return config;
});

// Auth Endpoints
export const AUTH_URL = {
    LOGIN: `/Users/Login`,
    FORGET_PASSWORD: `/Users/Reset/Request`,
    RESET_PASSWORD: `/Users/Reset`,
    CHANGE_PASSWORD: `/Users/ChangePassword`,
    REGISTER: `/Users/Register`,
    VERIFY_ACCOUNT: `/Users/verify`
}

// User Endpoints
export const USER_URL = {
    GET_USERS: `/Users/Manager`,
    GET_USERS_ADD_TASK: `/Users/`,
    TOGGEL_USER: (id: number) => `/Users/${id}`,
    COUNT_USERS: `/Users/count`
}

// Project Endpoints
export const PROJECT_URL = {
    GET_PROJECTS: `/Project/manager`,
    GET_PROJECT: (id: number) => `/Project/${id}`,
    DELETE_PROJECT: (id: number) => `/Project/${id}`,
    CREATE_PROJECT: `/Project`,
    UPDATE_PROJECT: (id: number) => `/Project/${id}`,
    GET_PROJECT_EMPLOYEE: `/Project/employee`
}

// Task Endpoints
export const TASK_URL = {
    GET_TASKS: `/Task/manager`,
    GET_TASK: (id: number) => `/Task/${id}`,
    DELETE_TASK: (id: number) => `/Task/${id}`,
    CREATE_TASK: `/Task`,
    UPDATE_TASK: (id: number) => `/Task/${id}`,
    COUNT_TASKS: `/Task/count`,
    GET_TASK_EMPLOYEE: `/Task`,
    CHENGE_STATUS: (id: number) => `/Task/${id}/change-status`
}
