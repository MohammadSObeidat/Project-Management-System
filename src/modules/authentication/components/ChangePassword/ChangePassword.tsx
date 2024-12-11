import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AUTH_URL, axiosInstanceURL } from "../../../../services/Endpoints";
import { toast } from "react-toastify";
import authLogo from '../../../../assets/images/logo-pms.png'

interface ChangeData {
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string
}

export default function ChangePassword() {
  const [type, setType] = useState('password')
  const [typePassword, setTypePassword] = useState('password')
  const [typeConfirmPassword, setTypeConfirmPassword] = useState('password')
  const navigate = useNavigate()
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch
  } = useForm();

  const onSubmit = async (data: ChangeData) => {
    try {
      const res = await axiosInstanceURL.put(AUTH_URL.CHANGE_PASSWORD, data)
      console.log(res);
      navigate('/login')
      toast.success(res?.data?.message)
    } catch (error: any) {
      toast.error(error?.response?.data?.message)      
    }    
  }

  const typeChangeOldPassword = () => {
    if (type === 'password')  setType('text') 
    else setType('password') 
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
        <h4>Change Password</h4>
        <span></span>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='row inputs mt-4 g-3'>
            <div className='col-12 input'>
              <div className='password'>
                <label htmlFor='oldpassword'>Old Password</label>
                <br/>
                <input type={type} id='oldpassword' placeholder='Enter your New Password'
                {...register('oldPassword', {
                  required: 'Old password is required'
                })}/>
                {type === 'password' ? <button type='button' onClick={typeChangeOldPassword}>
                  <i className="fa-solid fa-eye-slash"></i>
                </button> : <button type='button' onClick={typeChangeOldPassword}><i className="fa-solid fa-eye"></i></button>}
              </div>
            </div>
            {errors?.oldPassword && <p className='text-danger mt-2'>{String(errors?.oldPassword?.message)}</p>}
            <div className='col-12 input'>
              <div className='password'>
                <label htmlFor='newpassword'>New Password</label>
                <br/>
                <input type={typePassword} id='newpassword' placeholder='Enter your New Password'
                {...register('newPassword', {
                  required: 'New password is required'
                })}/>
                {typePassword === 'password' ? <button type='button' onClick={typeChangePassword}>
                  <i className="fa-solid fa-eye-slash"></i>
                </button> : <button type='button' onClick={typeChangePassword}><i className="fa-solid fa-eye"></i></button>}
              </div>
            </div>
            {errors?.newPassword && <p className='text-danger mt-2'>{String(errors?.newPassword?.message)}</p>}
            <div className='col-12 input'>
              <div className='password'>
                <label htmlFor='confirmpassword'>Confirm New Password</label>
                <br/>
                <input type={typeConfirmPassword} id='confirmpassword' placeholder='Confirm New Password'
                {...register('confirmNewPassword', {
                  required: 'Confirm password is required',
                  validate: (confirmNewPassword) =>
                    confirmNewPassword === watch('newPassword') || "Password do not match",
                })}/>
                {typeConfirmPassword === 'password' ? <button type='button' onClick={typeChangeConfirmPassword}>
                  <i className="fa-solid fa-eye-slash"></i>
                </button> : <button type='button' onClick={typeChangeConfirmPassword}><i className="fa-solid fa-eye"></i></button>}
              </div>
            </div>
            {errors?.confirmNewPassword && <p className='text-danger mt-2'>{String(errors?.confirmNewPassword?.message)}</p>}
            <div className='col-12 btn mt-5'>
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
