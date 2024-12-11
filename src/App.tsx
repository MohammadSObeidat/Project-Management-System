import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthLayout from './modules/shared/components/AuthLayout/AuthLayout'
import Login from './modules/authentication/components/Login/Login'
import Register from './modules/authentication/components/Register/Register'
import ForgetPassword from './modules/authentication/components/ForgetPassword/ForgetPassword'
import ResetPassword from './modules/authentication/components/ResetPassword/ResetPassword'
import ChangePassword from './modules/authentication/components/ChangePassword/ChangePassword'
import VerifyAccount from './modules/authentication/components/VerifyAccount/VerifyAccount'
import NotFound from './modules/shared/components/NotFound/NotFound'
import MasterLayout from './modules/shared/components/MasterLayout/MasterLayout'
import Dashboard from './modules/dashboard/Dashboard'
import ProjectList from './modules/project/components/ProjectList/ProjectList'
import ProjectForm from './modules/project/components/ProjectForm/ProjectForm'
import TaskList from './modules/task/components/TaskList/TaskList'
import TaskForm from './modules/task/components/TaskForm/TaskForm'
import UserList from './modules/user/components/UserList/UserList'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './modules/shared/components/ProtectedRoute/ProtectedRoute'

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <AuthLayout/>,
      errorElement: <NotFound/>,
      children: [
        {index: true, element: <Login/>},
        {path: 'login', element: <Login/>},
        {path: 'register', element: <Register/>},
        {path: 'forget-password', element: <ForgetPassword/>},
        {path: 'reset-password', element: <ResetPassword/>},
        {path: 'change-password', element: <ChangePassword/>},
        {path: 'verify-account', element: <VerifyAccount/>},
      ]
    },
    {
      path: '/',
      element: <ProtectedRoute>
                <MasterLayout/>
              </ProtectedRoute>,
      errorElement: <NotFound/>,
      children: [
        {index: true, element: <Dashboard/>},
        {path: 'dashboard', element: <Dashboard/>},
        {path: 'projects', element: <ProjectList/>},
        {path: 'projects/:projectId', element: <ProjectForm/>},
        {path: 'tasks', element: <TaskList/>},
        {path: 'tasks/:taskId', element: <TaskForm/>},
        {path: 'users', element: <UserList/>}
      ]
    }
  ])
  return (
    <div>
      <ToastContainer />
      <RouterProvider router={router}></RouterProvider>
    </div>
  )
}

export default App
