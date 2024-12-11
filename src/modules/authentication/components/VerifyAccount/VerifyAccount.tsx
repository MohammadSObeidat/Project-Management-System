import { useLocation, useNavigate } from 'react-router-dom';
import authLogo from '../../../../assets/images/logo-pms.png'
import { useForm } from 'react-hook-form';
import { AUTH_URL, axiosInstanceURL } from '../../../../services/Endpoints';
import { toast } from 'react-toastify';
import { EmailValidation } from '../../../../services/Validations';

interface VerifyData {
  email: string,
  code: string
}

export default function VerifyAccount() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({defaultValues: location.state});

  const onSubmit = async (data: VerifyData) => {
    try {
      const res = await axiosInstanceURL.put(AUTH_URL.VERIFY_ACCOUNT, data)
      console.log(res);
      navigate('/login')
      toast.success(res?.data?.message)
    } catch (error: any) {
      toast.error(error?.response?.data?.message)      
    }    
  }

  return (
    <div className='col-lg-4 col-md-8 col-sm-12'>
      <div className="col-12 auth-logo text-center pb-2">
        <img className='w-50' src={authLogo} alt="" />
      </div>
      <div className="col-12 auth-bg p-5">
        <p>welcome to PMS</p>
        <h4>Verify Account</h4>
        <span></span>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='row inputs mt-4 g-4'>
            <div className='col-12 input'>
              <label htmlFor='email'>E-mail</label>
              <br/>
              <input type="email" id='email' placeholder='Enter your E-mail' disabled={true}
              {...register('email', EmailValidation)}/>
            </div>
            {errors?.email && <p className='text-danger mt-2'>{String(errors?.email?.message)}</p>}
            <div className='col-12 input'>
              <div className='password'>
                <label htmlFor='otp'>OTP Verification</label>
                <br/>
                <input type='text' id='otp' placeholder='Enter Verification'
                {...register('code', {
                  required: 'OTP verification is required'
                })}/>
              </div>
            </div>
            {errors?.code && <p className='text-danger mt-2'>{String(errors?.code?.message)}</p>}
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
