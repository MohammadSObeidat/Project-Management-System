import './TaskForm.css'
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { axiosInstance, PROJECT_URL, TASK_URL, USER_URL } from "../../../../services/Endpoints";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import img from '../../../../assets/images/Vector.png'
import { useThemeContext } from '../../../../context/ThemeContext';

interface taskData {
  title: string,
  description: string,
  employeeId: number,
  projectId: number
}

interface projectData {
  id: number,
  title: string
}

interface userData {
  id: number,
  userName: string
}

export default function TaskForm() {
  const {isDarkMode} = useThemeContext()
  const [projectsList, setProjectsList] = useState([])
  const [usersList, setUsersList] = useState([])
  const {taskId} = useParams()
  const isNewTask = taskId === 'new-task'
  const id = Number(taskId)
  const navigate = useNavigate()
  const {
    register,
    formState: { errors, isSubmitting },
    setValue,
    handleSubmit
  } = useForm();

  const onSubmit = async (data: taskData) => {
    try {
      const res = await axiosInstance[isNewTask ? 'post' : 'put'](
        isNewTask ? TASK_URL.CREATE_TASK : TASK_URL.UPDATE_TASK(id), data)
      console.log(res);
      navigate('/tasks')
      toast.success(isNewTask ? 'Created successfully' : 'Updated successfully');
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message)
    }    
  }

  const getTask = async () => {
    try {
      const res = await axiosInstance.get(TASK_URL.GET_TASK(id))
      console.log(res);

      // setValue ========
      setValue('title', res?.data?.title)
      setValue('description', res?.data?.description)
      setValue('employeeId', res?.data?.employee?.id)
      setValue('projectId', res?.data?.project?.id)
    } catch (error) {
      console.log(error);
    }
  }

  const getProjects = async () => {
    try {
      const res = await axiosInstance.get(PROJECT_URL.GET_PROJECTS)
      console.log(res);
      setProjectsList(res?.data?.data)
    } catch (error) {
      console.log(error);
    }
  }

  const getUsers = async (pageSize: number, pageNumber: number) => {
    try {
      const res = await axiosInstance.get(USER_URL.GET_USERS_ADD_TASK,
        {params: {pageSize: pageSize, pageNumber: pageNumber }}
      )
      console.log(res);
      setUsersList(res?.data?.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getProjects()
    getUsers(30, 1)
    getTask()
  }, [])

  return (
    <div className='tasks-container'>
      <div className={`form-title ${isDarkMode ? 'dark' : 'light'}`}>
        <p><img style={{width: '9px'}} src={img} alt="" /> <Link className='link px-2' to={'/tasks'}>View All Tasks</Link></p>
        <h1>{isNewTask ? 'Add a New' : 'Edit'} Task</h1>
      </div>
      <div className='form-container'>
        <div className='row min-vh-100 d-flex justify-content-center align-items-center'>
          <div className='col-lg-10'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={`row inputs g-3 p-3 ${isDarkMode ? 'dark' : 'light'}`}>
            <div className='col-lg-12 col-md-12 col-sm-12 input'>
              <label className='py-2' htmlFor='title'>Title</label>
              <input type="text" id='title' placeholder='Name'
              {...register('title', { 
                required: 'Title is required' })}/>
              {errors.title && <p className='text-danger mt-1 mb-0'>{String(errors.title.message)}</p>}
            </div> 
            <div className='col-lg-12 col-md-12 col-sm-12 input'>
              <label className='py-2' htmlFor='description'>Description</label>
              <textarea id="description" placeholder='Description'
              {...register('description', { 
                required: 'Description is required' })}></textarea>
              {errors.description && <p className='text-danger mt-1 mb-0'>{String(errors.description.message)}</p>}
            </div>
            <div className='col-lg-12 col-md-12 col-sm-12 input'>
              {isNewTask ?
              <div className='row'>
                <div className='col-6'>
                  <label className='py-2'>User</label>
                  <select {...register('employeeId', { 
                      required: 'Employee is required' })}>
                    <option value="" key="">Select Employee ...</option>
                    {usersList.map((user: userData, index) => {
                      return <option value={user?.id} key={index}>{user?.userName}</option>
                    })}
                  </select>
                  {errors.employeeId && <p className='text-danger mt-1 mb-0'>{String(errors.employeeId.message)}</p>}
                </div>
                <div className='col-6'>
                  <label className='py-2'>Project</label>
                  <select {...register('projectId', { 
                      required: 'Project is required' })}>
                    <option value="" key="">Select Project ...</option>
                    {projectsList.map((project: projectData, index) => {
                      return <option value={project?.id} key={index}>{project?.title}</option>
                    })}
                  </select>
                  {errors.projectId && <p className='text-danger mt-1 mb-0'>{String(errors.projectId.message)}</p>}
                </div>
              </div> : <><label className='py-2'>User</label>
                  <select {...register('employeeId', { 
                      required: 'Employee is required' })}>
                    <option value="" key="">Select Employee ...</option>
                    {usersList.map((user: userData, index) => {
                      return <option value={user?.id} key={index}>{user?.userName}</option>
                    })}
                  </select>
                  {errors.employeeId && <p className='text-danger mt-1 mb-0'>{String(errors.employeeId.message)}</p>}
                  </>
                }
            </div>
            <hr/>
            <div className='btns d-flex justify-content-between'>
              <Link to={'/tasks'} className='btn-cancel'>Cancel</Link>
              <button className='btn btn-warning rounded-5 text-white px-4' disabled={isSubmitting}>
                {isSubmitting && <span className="spinner-border spinner-border-sm mx-1"></span>}
                Save
              </button>
            </div>
          </div>      
        </form>
        </div>
        </div>
      </div>
    </div>
  )
}
