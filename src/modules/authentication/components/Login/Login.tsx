// Images
import { useState } from 'react'
import authLogo from '../../../../assets/images/logo-pms.png'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { AUTH_URL, axiosInstanceURL } from '../../../../services/Endpoints';
import { Link, useNavigate } from 'react-router-dom';
import { EmailValidation } from '../../../../services/Validations';
import { useAuthContext } from '../../../../context/AuthContext';

interface LoginData {
  email: string,
  password: string
}

export default function Login() {
  const [type, setType] = useState('password')
  const {saveLoginData} = useAuthContext()
  const navigate = useNavigate()

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await axiosInstanceURL.post(AUTH_URL.LOGIN, data)
      console.log(res);
      const token = res?.data?.token
      localStorage.setItem('token', token)
      navigate('/dashboard')
      toast.success('Success Login !')
      saveLoginData()
    } catch (error: any) {
      toast.error(error?.response?.data?.message)      
    }    
  }

  const typeChange = () => {
    if (type === 'password')  setType('text') 
    else setType('password') 
  }

  return (
    <div className='col-lg-4 col-md-8 col-sm-12'>
      <div className="col-12 auth-logo text-center pb-2">
        <img className='w-50' src={authLogo} alt="" />
      </div>
      <div className="col-12 auth-bg p-5">
        <p>welcome to PMS</p>
        <h4>Login</h4>
        <span></span>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='row inputs mt-4 g-4'>
            <div className='col-12 input'>
              <label htmlFor='email'>E-mail</label>
              <br/>
              <input type="email" id='email' placeholder='Enter your E-mail'
              {...register('email', EmailValidation)}/>
            </div>
            {errors?.email && <p className='text-danger mt-2'>{String(errors?.email?.message)}</p>}
            <div className='col-12 input'>
              <div className='password'>
                <label htmlFor='password'>Password</label>
                <br/>
                <input type={type} id='password' placeholder='Enter your password'
                {...register('password', {
                  required: 'Password is required'
                })}/>
                {type === 'password' ? <button type='button' onClick={typeChange}>
                  <i className="fa-solid fa-eye-slash"></i>
                </button> : <button type='button' onClick={typeChange}><i className="fa-solid fa-eye"></i></button>}
              </div>
            </div>
            {errors?.password && <p className='text-danger mt-2'>{String(errors?.password?.message)}</p>}
            <div className='col-12 d-flex justify-content-between'>
              <Link className='link' to={'/register'}>Register Now ?</Link>
              <Link className='link' to={'/forget-password'}>Forget Password ?</Link>
            </div>
            <div className='col-12 btn'>
              <button disabled={isSubmitting}>
                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1 mx-1"></span>}
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
