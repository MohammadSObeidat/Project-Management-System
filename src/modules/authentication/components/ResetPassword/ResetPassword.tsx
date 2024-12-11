import { useState } from "react";
import { useForm } from "react-hook-form";
import authLogo from '../../../../assets/images/logo-pms.png'
import { toast } from "react-toastify";
import { AUTH_URL, axiosInstanceURL } from "../../../../services/Endpoints";
import { useLocation, useNavigate } from "react-router-dom";
import { EmailValidation } from "../../../../services/Validations";

interface ResetData {
  email: string,
  seed: string,
  password: string,
  confirmPassword: string
}

export default function ResetPassword() {
  const [typePassword, setTypePassword] = useState('password')
  const [typeConfirmPassword, setTypeConfirmPassword] = useState('password')
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch
  } = useForm({defaultValues: location.state});

  const onSubmit = async (data: ResetData) => {
    try {
      const res = await axiosInstanceURL.post(AUTH_URL.RESET_PASSWORD, data)
      console.log(res);
      navigate('/login')
      toast.success(res?.data?.message)
    } catch (error: any) {
      toast.error(error?.response?.data?.message)      
    }    
  }

  const typeChangePassword = () => {
    if (typePassword === 'password')  setTypePassword('text') 
    else setTypePassword('password') 
  }

  const typeChangeConfirmPassword = () => {
    if (typeConfirmPassword === 'password')  setTypeConfirmPassword('text') 
    else setTypeConfirmPassword('password') 
  }

  return (
    <div className='col-lg-4 col-md-8 col-sm-12'>
      <div className="col-12 auth-logo text-center pb-2">
        <img className='w-50' src={authLogo} alt="" />
      </div>
      <div className="col-12 auth-bg p-5">
        <p>welcome to PMS</p>
        <h4>Reset Password</h4>
        <span></span>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='row inputs mt-4 g-3'>
            <div className='col-12 input'>
              <label htmlFor='email'>E-mail</label>
              <br/>
              <input type="email" id='email' placeholder='Enter your E-mail' disabled={true}
              {...register('email', EmailValidation)}/>
            </div>
            {errors?.email && <p className='text-danger mt-2'>{String(errors?.email?.message)}</p>}
            <div className='col-12 input'>
              <label htmlFor='OTP'>OTP Verification</label>
              <br/>
              <input type="text" id='OTP' placeholder='Enter Verification'
              {...register('seed', {
                required: 'OTP is required',
              })}/>
            </div>
            {errors?.seed && <p className='text-danger mt-2'>{String(errors?.seed?.message)}</p>}
            <div className='col-12 input'>
              <div className='password'>
                <label htmlFor='password'>New Password</label>
                <br/>
                <input type={typePassword} id='password' placeholder='Enter your New Password'
                {...register('password', {
                  required: 'New password is required'
                })}/>
                {typePassword === 'password' ? <button type='button' onClick={typeChangePassword}>
                  <i className="fa-solid fa-eye-slash"></i>
                </button> : <button type='button' onClick={typeChangePassword}><i className="fa-solid fa-eye"></i></button>}
              </div>
            </div>
            {errors?.password && <p className='text-danger mt-2'>{String(errors?.password?.message)}</p>}
            <div className='col-12 input'>
              <div className='password'>
                <label htmlFor='confirmpassword'>Confirm Password</label>
                <br/>
                <input type={typeConfirmPassword} id='confirmpassword' placeholder='Confirm New Password'
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: (confirmPassword) =>
                    confirmPassword === watch('password') || "Password do not match",
                })}/>
                {typeConfirmPassword === 'password' ? <button type='button' onClick={typeChangeConfirmPassword}>
                  <i className="fa-solid fa-eye-slash"></i>
                </button> : <button type='button' onClick={typeChangeConfirmPassword}><i className="fa-solid fa-eye"></i></button>}
              </div>
            </div>
            {errors?.confirmPassword && <p className='text-danger mt-2'>{String(errors?.confirmPassword?.message)}</p>}
            <div className='col-12 btn'>
              <button disabled={isSubmitting}>
                {isSubmitting && <span className="spinner-border spinner-border-sm mx-1"></span>}
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
