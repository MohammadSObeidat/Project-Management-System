import './ProjectList.css'
import { useEffect, useState } from 'react'
import { axiosInstance, PROJECT_URL } from '../../../../services/Endpoints'
import { OrbitProgress } from 'react-loading-indicators'
import { Link, useNavigate } from 'react-router-dom'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { toast } from 'react-toastify'
import DeleteConfirmation from '../../../shared/components/DeleteConfirmation/DeleteConfirmation'
import { useThemeContext } from '../../../../context/ThemeContext'
import { createTheme, ThemeProvider } from '@mui/material'
import { useAuthContext } from '../../../../context/AuthContext'

interface projectData {
  id: number,
  title: string,
  description: string,
  task: object[]
}

type PageNumber = number[]

export default function ProjectList() {
  const navigate = useNavigate()
  const {isDarkMode} = useThemeContext()
  const {loginData} = useAuthContext()
  const [projectsList, setProjectsList] = useState([])
  const [projectsEmployeeList, setProjectsEmployeeList] = useState([])
  const [pageNumber, setPageNumber] = useState<PageNumber>([])
  const [load, setLoad] =useState(true)
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [projectId, setProjectId] = useState(0)

  const handleClose = () => setShow(false);
  const handleShow = (id: number) => {
    setShow(true);
    setProjectId(id)
  }

  const getProjects = async (pageSize: number, pageNumber: number , title?: string) => {
    if (projectsList.length > 0) setLoad(false)

    try {
      const res = await axiosInstance.get(PROJECT_URL.GET_PROJECTS, 
        {params: {pageSize: pageSize, pageNumber: pageNumber, title: title}})
      console.log(res);
      setProjectsList(res?.data?.data)
      setLoad(false)
      setPageNumber(Array(res?.data?.totalNumberOfPages).fill().map((_, i) => i+1))  
    } catch (error) {
      console.log(error);
    }
  }

  const getProjectEmployee = async (pageSize: number, pageNumber: number , title?: string) => {
    try {
      const res = await axiosInstance.get(PROJECT_URL.GET_PROJECT_EMPLOYEE,
        {params: {pageSize: pageSize, pageNumber: pageNumber, title: title}}
      )
      console.log(res);
      setProjectsEmployeeList(res?.data?.data)
      setLoad(false)
      setPageNumber(Array(res?.data?.totalNumberOfPages).fill().map((_, i) => i+1))  
    } catch (error) {
      console.log(error);
    }
  }

  const deleteProject = async () => {
    try {
      const res = await axiosInstance.delete(PROJECT_URL.DELETE_PROJECT(projectId))
      console.log(res);
      handleClose()
      getProjects(20, 1)
      toast.success('Deleted Successfully')
    } catch (error) {
      console.log(error);
    }
  }

  const getTitleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    getProjects(20, 1, e.target.value)
  }

  const getTitleValueEmployee = (e: React.ChangeEvent<HTMLInputElement>) => {
    getProjectEmployee(20, 1, e.target.value)
  }

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light', // Enable dark mode
    },
  });

  useEffect(() => {
    getProjects(20, 1)
    getProjectEmployee(20, 1)
  }, [])

  return (
    <>
    <DeleteConfirmation show={show} handleClose={handleClose} deleteItem={'Project'} deleteFun={deleteProject} /> 

    <div className="projects-container" onClick={() => {
        if (activeMenuId) setActiveMenuId(null)
      }}>
      <div className={`project-title d-flex justify-content-between ${isDarkMode ? 'dark' : 'light'}`}>
        <h1>Projects</h1>
        {loginData?.userGroup !== 'Employee' ?
        <button className='btn btn-warning text-white px-3 mx-5 rounded-5' onClick={() => {
          navigate(`/projects/${'new-project'}`)
        }}>
          <i className="fa-solid fa-plus px-2"></i>
          Add New Project
        </button> : "" }
      </div>
      {loginData?.userGroup !== 'Employee' ?
      <div className='projects-list p-5'>
        <div className={`bg-color ${isDarkMode ? 'dark' : 'light'}`}>
          <div className='row filters py-4 px-4'>
            <div className='col-4 filter'>
              <div className='col-12 input'>
                <input type="text"  placeholder='Search By Title ' 
                onChange={getTitleValue}/>
              </div>
              <div className='col-12'>
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>No of Tasks</th>
                <th>Actions</th>
              </tr>
            </thead>
            {load && <td className='py-5 text-center' colSpan={4}><OrbitProgress color="#32cd32" size="medium" text="" textColor="" /></td>}
            
            {load ? '' : projectsList.length > 0 ? <tbody>
              {projectsList.map((project: projectData, index) => {
                return  <tr key={index}>
                          <td>{project?.title}</td>
                          <td>{project?.description}</td>
                          <td>{project?.task.length}</td>
                          <td className='action'>
                              <button onClick={() => setActiveMenuId(prevId => (prevId === project?.id ? null : project?.id))}>
                                <i style={{cursor:"pointer"}} className="fa-solid fa-ellipsis"></i>
                              </button>
                              <ul className={`menu ${activeMenuId === project?.id ? 'show' : ''}`}>
                                <li>
                                  <button>
                                    <i title='View' className="fa-solid fa-eye text-success"></i> View
                                  </button>
                                </li>
                                <Link style={{textDecoration:'none', color:'black'}} to={`/projects/${project?.id}`}>
                                  <li>
                                    <button>
                                      <i title='Edit' className="fa-solid fa-pen-to-square text-success"></i> Edit
                                    </button>
                                  </li>
                                </Link>
                                <li>
                                  <button onClick={() => {
                                    handleShow(project?.id)
                                  }}>
                                    <i title='Delete' className="fa-solid fa-trash text-success"></i> Delete
                                  </button>
                                </li>
                              </ul>
                            </td>
                        </tr>
              })}</tbody> : <tbody>
                              <tr>
                                <td colSpan={4}><h1 className='my-5 text-center'>No Data ....</h1></td>
                              </tr>
                            </tbody>}
            
            
          </table>
          <div className='d-flex justify-content-end py-4 mx-5'>
            <ThemeProvider theme={theme}>
              <Stack spacing={4}>
                <Pagination count={pageNumber.length} variant="outlined" shape="rounded" />
              </Stack>
            </ThemeProvider>
          </div>  
        </div>
      </div> : <div className='projects-list p-5'>
        <div className={`bg-color ${isDarkMode ? 'dark' : 'light'}`}>
          <div className='row filters py-4 px-4'>
            <div className='col-4 filter'>
              <div className='col-12 input'>
                <input type="text"  placeholder='Search By Title ' 
                onChange={getTitleValueEmployee}/>
              </div>
              <div className='col-12'>
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>No of Tasks</th>
                {loginData?.userGroup !== 'Employee' ? 
                <th>Actions</th> : ''}
              </tr>
            </thead>
            {load && <td className='py-5 text-center' colSpan={3}><OrbitProgress color="#32cd32" size="medium" text="" textColor="" /></td>}
            
            {load ? '' : projectsEmployeeList.length > 0 ? <tbody>
              {projectsEmployeeList.map((project: projectData, index) => {
                return  <tr key={index}>
                          <td>{project?.title}</td>
                          <td>{project?.description}</td>
                          <td>{project?.task.length}</td>
                          {loginData?.userGroup !== 'Employee' ? 
                          <td className='action'>
                              <button onClick={() => setActiveMenuId(prevId => (prevId === project?.id ? null : project?.id))}>
                                <i style={{cursor:"pointer"}} className="fa-solid fa-ellipsis"></i>
                              </button>
                              <ul className={`menu ${activeMenuId === project?.id ? 'show' : ''}`}>
                                <li>
                                  <button>
                                    <i title='View' className="fa-solid fa-eye text-success"></i> View
                                  </button>
                                </li>
                                <Link style={{textDecoration:'none', color:'black'}} to={`/projects/${project?.id}`}>
                                  <li>
                                    <button>
                                      <i title='Edit' className="fa-solid fa-pen-to-square text-success"></i> Edit
                                    </button>
                                  </li>
                                </Link>
                                <li>
                                  <button onClick={() => {
                                    handleShow(project?.id)
                                  }}>
                                    <i title='Delete' className="fa-solid fa-trash text-success"></i> Delete
                                  </button>
                                </li>
                              </ul>
                            </td> : ''}
                        </tr>
              })}</tbody> : <tbody>
                              <tr>
                                <td colSpan={3}><h1 className='my-5 text-center'>No Data ....</h1></td>
                              </tr>
                            </tbody>}
            
            
          </table>
          <div className='d-flex justify-content-end py-4 mx-5'>
            <ThemeProvider theme={theme}>
              <Stack spacing={4}>
                <Pagination count={pageNumber.length} variant="outlined" shape="rounded" />
              </Stack>
            </ThemeProvider>
          </div>  
        </div>
      </div>}
    </div>
    </>
  )
}
