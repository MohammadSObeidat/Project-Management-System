import authLogo from '../../../../assets/images/logo-pms.png'
import imageProfile from '../../../../assets/images/register-image.png'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AUTH_URL, axiosInstanceURL } from "../../../../services/Endpoints";
import { toast } from "react-toastify";
import { EmailValidation } from '../../../../services/Validations';

interface RegisterData {
  userName: string,
  email: string,
  country: string,
  phoneNumber: string,
  profileImage: string,
  password: string,
  confirmPassword: string 
}

export default function Register() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [typePassword, setTypePassword] = useState('password')
  const [typeConfirmPassword, setTypeConfirmPassword] = useState('password')
  const navigate = useNavigate()
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
    setValue
  } = useForm();

  const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('profileImage', file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data: RegisterData) => {
    const formData = new FormData()
    formData.append('userName', data.userName)
    formData.append('email', data.email)
    formData.append('country', data.country)
    formData.append('phoneNumber', data.phoneNumber)
    formData.append('profileImage', data.profileImage[0])
    formData.append('password', data.password)
    formData.append('confirmPassword', data.confirmPassword)

    try {
      const res = await axiosInstanceURL.post(AUTH_URL.REGISTER, formData)
      console.log(res);
      navigate('/verify-account', {state: {email: data.email}})
      toast.success(res?.data?.message)
    } catch (error: any) {
      toast.error(error?.response?.data?.message) 
      const errors = error?.response?.data?.additionalInfo?.errors
      for (const key in errors) {
        toast.error(errors[key][0])
      }     
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
    <div className='col-lg-7 col-md-7 col-sm-12'>
      <div className="col-12 auth-logo text-center pb-2">
        <img className='w-25' src={authLogo} alt="" />
      </div>
      <div className="col-12 auth-bg p-5">
        <p>welcome to PMS</p>
        <h4>Create New Account</h4>
        <span></span>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='imageProfile text-center'>
            <label htmlFor='image' style={{cursor:'pointer'}}>
              <img src={imagePreview ? imagePreview : imageProfile} alt="" />
            </label>
            <input type="file" id='image' style={{display: 'none'}}
            {...register('profileImage')}
            onChange={changeImage}/>
            {/* <img src={imagePreview ? imagePreview : imageProfile} alt="" /> */}
          </div>
          <div className='row inputs mt-2 g-3'>
            <div className='col-lg-6 col-md-6 col-sm-12 input'>
              <div>
                <label htmlFor='userName'>User Name</label>
                <br/>
                <input type="text" id='userName' placeholder='Enter your name'
                {...register('userName', {
                  required: 'User name is required',
                })}/>
              </div>
              {errors?.userName && <p className='text-danger mt-2'>{String(errors?.userName?.message)}</p>}
            </div>
            <div className='col-lg-6 col-md-6 col-sm-12 input'>
              <div>
                <label htmlFor='email'>E-mail</label>
                <br/>
                <input type="email" id='email' placeholder='Enter your E-mail'
                {...register('email', EmailValidation)}/>
              </div>
              {errors?.email && <p className='text-danger mt-2'>{String(errors?.email?.message)}</p>}
            </div>
            <div className='col-lg-6 col-md-6 col-sm-12 input'>
              <div>
                <label htmlFor='country'>Country</label>
                <br/>
                <input type="text" id='country' placeholder='Enter your country'
                {...register('country', {
                  required: 'Country is required',
                })}/>
              </div>
              {errors?.country && <p className='text-danger mt-2'>{String(errors?.country?.message)}</p>}
            </div>
            <div className='col-lg-6 col-md-6 col-sm-12 input'>
              <div>
                <label htmlFor='phonenumber'>Phone Number</label>
                <br/>
                <input type="number" id='phonenumber' placeholder='Enter your phone number'
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                })}/>
              </div>
              {errors?.phoneNumber && <p className='text-danger mt-2'>{String(errors?.phoneNumber?.message)}</p>}
            </div>
            <div className='col-lg-6 col-md-6 col-sm-12 input'>
              <div className='password'>
                <label htmlFor='password'>Password</label>
                <br/>
                <input type={typePassword} id='password' placeholder='Enter your password'
                {...register('password', {
                  required: 'Password is required'
                })}/>
                {typePassword === 'password' ? <button type='button' onClick={typeChangePassword}>
                  <i className="fa-solid fa-eye-slash"></i>
                </button> : <button type='button' onClick={typeChangePassword}><i className="fa-solid fa-eye"></i></button>}
              </div>
              {errors?.password && <p className='text-danger mt-2'>{String(errors?.password?.message)}</p>}
            </div>
            <div className='col-lg-6 col-md-6 col-sm-12 input'>
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
              {errors?.confirmPassword && <p className='text-danger mt-2'>{String(errors?.confirmPassword?.message)}</p>}
            </div>
            <div className='col-12 btn pt-3'>
              <button disabled={isSubmitting} className='w-75'>
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
