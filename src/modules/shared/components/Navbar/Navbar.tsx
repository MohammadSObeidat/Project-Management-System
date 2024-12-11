import './Navbar.css'
import logo from '../../../../assets/images/navbar-logo.png'
import imgProfile from '../../../../assets/images/Ellipse 18.png'
import { useAuthContext } from '../../../../context/AuthContext'
import { useThemeContext } from '../../../../context/ThemeContext'


export default function Navbar() {
  const {isDarkMode, toggleTheme} = useThemeContext()
  const {loginData} = useAuthContext()
  // console.log(loginData);
  
  return (
    <div className='navbar-container w-100'>
      <div className={`navbar-content d-flex justify-content-between align-items-center ${isDarkMode ? 'dark' : 'light'}`}>
        <div className='img mx-3'>
          <img src={logo} alt="" />
        </div>
        <div className='user-info mx-5 d-flex align-items-center'>
          <div className='px-3'>
            <img src={imgProfile} alt="" />
          </div>
          <div className='d-flex'>
            <div>
              <p className='m-0'>{loginData?.userName}</p>
              <p className={`m-0 email ${isDarkMode ? '' : 'text-muted'}`}>{loginData?.userEmail}</p>
            </div> 
            {isDarkMode ? <button title='light mode' style={{background: 'transparent', border: 'none', outline: 'none', fontSize: '25px'}} 
            onClick={() => toggleTheme()}>
              <i className="fa-solid fa-sun text-warning px-3"></i>
            </button> : <button title='dark mode' style={{background: 'transparent', border: 'none', outline: 'none', fontSize: '25px'}}
            onClick={() => toggleTheme()}>
              <i className="fa-solid fa-moon px-3"></i>
            </button>}
            {/* {isActive ? <button style={{background: 'transparent', border: 'none', outline: 'none'}} onClick={() => {
              setIsActive((prev) => !prev)
            }}>
              <i className="fa-solid fa-chevron-up mt-2 px-2"></i>
            </button> : <button style={{background: 'transparent', border: 'none', outline: 'none'}} onClick={() => {
              setIsActive((prev) => !prev)
            }}>
              <i className="fa-solid fa-chevron-down mt-2 px-2"></i>
            </button>} */}
            
          </div>
          {/* <div className={`drop-down ${isActive ? 'active' : ''}`}>
            <ul>
              <li>
                <button type="button">
                  <i className="fa-solid fa-key"></i>
                  Change Password
                </button>
              </li>
              <li>
                <button type="button" >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  Log out
                </button>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  )
}
