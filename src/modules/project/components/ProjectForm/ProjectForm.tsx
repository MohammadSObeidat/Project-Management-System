import './ProjectForm.css'
import img from '../../../../assets/images/Vector.png'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { axiosInstance, PROJECT_URL } from '../../../../services/Endpoints';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useThemeContext } from '../../../../context/ThemeContext';

interface projectData {
  title: string,
  description: string
}

export default function ProjectForm() {
  const {isDarkMode} = useThemeContext()
  const {projectId} = useParams()
  const isNewProject = projectId === 'new-project'
  const id = Number(projectId)
  const navigate = useNavigate()
  const {
    register,
    formState: { errors, isSubmitting },
    setValue,
    handleSubmit
  } = useForm();

  const onSubmit = async (data: projectData) => {
    try {
      const res = await axiosInstance[isNewProject ? 'post' : 'put'](
        isNewProject ? PROJECT_URL.CREATE_PROJECT : PROJECT_URL.UPDATE_PROJECT(id), data)
      console.log(res);
      navigate('/projects')
      toast.success(isNewProject ? 'Created successfully' : 'Updated successfully');
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message)
    }    
  }

  const getProject = async () => {
    try {
      const res = await axiosInstance.get(PROJECT_URL.GET_PROJECT(id))
      console.log(res);

      // setValue ======================
      setValue('title', res?.data?.title)
      setValue('description', res?.data?.description)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!isNewProject) {
      getProject()
    }
  },[id])

  return (
    <div className='projects-container'>
      <div className={`form-title ${isDarkMode ? 'dark' : 'light'}`}>
        <p><img style={{width: '9px'}} src={img} alt="" /> <Link className='link px-2' to={'/projects'}>View All Projects</Link></p>
        <h1>{isNewProject ? 'Add a New' : 'Edit'} Project</h1>
      </div>
      <div className='form-container'>
        <div className='row min-vh-100 d-flex justify-content-center align-items-center'>
          <div className='col-lg-8'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={`row inputs g-4 p-3 ${isDarkMode ? 'dark' : 'light'}`}>
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
            <hr/>
            <div className='btns d-flex justify-content-between'>
              <Link to={'/projects'} className='btn-cancel'>Cancel</Link>
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
