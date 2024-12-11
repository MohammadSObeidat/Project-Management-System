import './TaskList.css'
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance, TASK_URL } from "../../../../services/Endpoints";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { toast } from "react-toastify";
import { OrbitProgress } from "react-loading-indicators";
import DeleteConfirmation from '../../../shared/components/DeleteConfirmation/DeleteConfirmation';
import { useThemeContext } from '../../../../context/ThemeContext';
import { createTheme, ThemeProvider } from '@mui/material';
import { useAuthContext } from '../../../../context/AuthContext';
import { motion } from 'framer-motion'

interface employeeName {
  userName: string
}

interface projectTitle {
  title: string
}

interface taskData {
  id: number,
  title: string,
  status: string,
  employee: employeeName,
  project: projectTitle,
  creationDate: string
}

type Status = 'ToDo' | 'InProgress' | 'Done'
interface Task {
  id: number,
  title: string, 
  description: string,
  status: Status
}

type PageNumber = number[]

export default function TaskList() {
  const navigate = useNavigate()
  const {isDarkMode} = useThemeContext()
  const {loginData} = useAuthContext()
  const [tasksList, setTasksList] = useState([])
  const [pageNumber, setPageNumber] = useState<PageNumber>([])
  const [load, setLoad] =useState(true)
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [taskId, settaskId] = useState(0)
  const [tasks, setTasks] = useState<Task[]>([])



  const taskToDo = tasks.filter(({status}) => status === 'ToDo')
  const taskInProgress = tasks.filter(({status}) => status === 'InProgress')
  const taskDone = tasks.filter(({status}) => status === 'Done')  

  const handleClose = () => setShow(false);
  const handleShow = (id: number) => {
    setShow(true);
    settaskId(id)
  }

  const getTasks = async (pageSize: number, pageNumber?: number, title?: string) => {
    if (tasksList.length > 0) setLoad(false)

    try {
      const res = await axiosInstance.get(TASK_URL.GET_TASKS, 
        {params: {pageSize, pageNumber, title}}
      )
      console.log(res);
      setTasksList(res?.data?.data)
      setLoad(false)
      setPageNumber(Array(res?.data?.totalNumberOfPages).fill().map((_, i) => i+1))  
    } catch (error) {
      console.log(error);
    }
  }

  const getTaskByEmployee = async (pageSize?: number, pageNumber?: number) => {
    try {
      const res = await axiosInstance.get(TASK_URL.GET_TASK_EMPLOYEE,
        {params: {pageSize, pageNumber}}
      )
      console.log(res);
      setTasks(res?.data?.data)
    } catch (error) {
      console.log(error);
    }
  }

  const deleteTask = async () => {
    try {
      const res = await axiosInstance.delete(TASK_URL.DELETE_TASK(taskId))
      console.log(res);
      handleClose()
      getTasks(20)
      toast.success('Deleted Successfully')
    } catch (error) {
      console.log(error);
    }
  }

  const getTitleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    getTasks(20, 1, e.target.value)
  }

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light', // Enable dark mode
    },
  });

  useEffect(() => {
    getTasks(20, 1)
    getTaskByEmployee(50, 1)
  }, [])

  return (
    <>
      <DeleteConfirmation show={show} handleClose={handleClose} deleteItem={'Task'} deleteFun={deleteTask} /> 
      {loginData?.userGroup !== 'Employee' ? 
      <div className="tasks-container" onClick={() => {
        if (activeMenuId) setActiveMenuId(null)
      }}>
      <div className={`task-title d-flex justify-content-between ${isDarkMode ? 'dark' : 'light'}`}>
        <h1>Tasks</h1>
        <button className='btn btn-warning text-white px-3 mx-5 rounded-5' onClick={() => {
          navigate(`/tasks/${'new-task'}`)
        }}>
          <i className="fa-solid fa-plus px-2"></i>
          Add New Task
        </button>
      </div>
      <div className='tasks-list p-5'>
        <div className={`bg-color ${isDarkMode ? 'dark' : 'light'}`}>
          <div className='row filters py-4 px-4'>
            <div className='col-4 filter'>
              <div className='col-12 input'>
                <input type="text"  placeholder='Search By Title ' 
                onChange={getTitleValue}
                />
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
                <th>Status</th>
                <th>User</th>
                <th>Project</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            {load && <td className='py-5 text-center' colSpan={6}><OrbitProgress color="#32cd32" size="medium" text="" textColor="" /></td>}
            
            {load ? '' : tasksList.length > 0 ? <tbody>
              {tasksList.map((task: taskData, index) => {
              return  <tr key={index}>
                          <td>{task?.title}</td>
                          <td>{task?.status}</td>
                          <td>{task?.employee?.userName}</td>
                          <td>{task?.project?.title}</td>
                          <td>{new Date(task?.creationDate).toISOString().split('T')[0]}</td>
                          <td className='action'>
                              <button onClick={() => setActiveMenuId(prevId => (prevId === task?.id ? null : task?.id))}>
                                <i style={{cursor:"pointer"}} className="fa-solid fa-ellipsis"></i>
                              </button>
                              <ul className={`menu ${activeMenuId === task?.id ? 'show' : ''}`}>
                                <li>
                                  <button>
                                    <i title='View' className="fa-solid fa-eye text-success"></i> View
                                  </button>
                                </li>
                                <Link style={{textDecoration:'none', color:'black'}} to={`/tasks/${task?.id}`}>
                                  <li>
                                    <button>
                                      <i title='Edit' className="fa-solid fa-pen-to-square text-success"></i> Edit
                                    </button>
                                  </li>
                                </Link>
                                <li>
                                  <button onClick={() => {
                                    handleShow(task?.id)
                                  }}>
                                    <i title='Delete' className="fa-solid fa-trash text-success"></i> Delete
                                  </button>
                                </li>
                              </ul>
                            </td>
                        </tr>
              })}</tbody> : <tbody>
                              <tr>
                                <td colSpan={6}><h1 className='my-5 text-center'>No Data ....</h1></td>
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
      </div>
    </div>  
    :
    <div className="tasks-container" onClick={() => {
        if (activeMenuId) setActiveMenuId(null)
      }}>
      <div className={`task-title d-flex justify-content-between ${isDarkMode ? 'dark' : 'light'}`}>
        {loginData?.userGroup !== 'Employee' ? <h1>Tasks</h1> : <h1>Task Board</h1>}
      </div>
      <div className='tasks-list p-5'>
        <div className={`boxs ${isDarkMode ? 'dark' : 'light'}`}>
          <Box title={'ToDo'} taskToDo={taskToDo} getTaskByEmployee={getTaskByEmployee} setTasks={setTasks}/>
          <Box title={'InProgress'} taskToDo={taskInProgress} getTaskByEmployee={getTaskByEmployee} setTasks={setTasks}/>
          <Box title={'Done'} taskToDo={taskDone} getTaskByEmployee={getTaskByEmployee} setTasks={setTasks}/>
        </div>
      </div>
    </div> }
  </>
  )
}


function Box({title, taskToDo, getTaskByEmployee, setTasks} : 
  {title: Status, taskToDo: Task[], getTaskByEmployee: () => Promise<void>, setTasks: React.Dispatch<React.SetStateAction<Task[]>>}) {
  const changeStatus = async (id: number, status: string) => {
    try {
      const res = await axiosInstance.put(TASK_URL.CHENGE_STATUS(id), 
        {status: status})
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='box'>
      <h3>{title}</h3>
      <motion.div className='box-container'
        layout= {true}
        layoutId= {title}
        key= {title}
        onDrop={ async (e) => {
          e.preventDefault()
          const id = Number(e.dataTransfer.getData('taskId'))
          const prevStatus = e.dataTransfer.getData('prevStatus')
          if (prevStatus !== title) {
            setTasks((prevTasks) => {
              const newTasks = prevTasks.map((task) => {
                if (task.id == id) {
                  task.status = title
                  return task
                } else {
                  return task
                }
              })
              return newTasks
            })
            await changeStatus(id, title)
            await getTaskByEmployee()
          }
          console.log(title, e.dataTransfer.getData('taskId'));
        }}
        onDragOver={(e) => {
          e.preventDefault()
        }}
      >
        {taskToDo.map((task) => {
          return (
            <motion.div className='title' 
              layout= {true}
              layoutId= {String(task?.id)}
              key={task?.id}
              draggable={true}
              onDragStart={(e) => {
                console.log('drag start');
                e.dataTransfer.setData('taskId', String(task.id))
                e.dataTransfer.setData('prevStatus', title)
              }} onDragEnd={() => {
                console.log('drag end');
              }}>{task.title}
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
