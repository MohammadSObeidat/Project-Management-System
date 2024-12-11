import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import SideBar from "../SideBar/SideBar";
import { useEffect, useState } from "react";
import { useThemeContext } from "../../../../context/ThemeContext";

export default function MasterLayout() {
  const navigate = useNavigate()
  const {isDarkMode} = useThemeContext()
  const [isAuth, setIsAuth] = useState(() => {
    const token = localStorage.getItem('token')
    if (token) return true
    else return false
  })
  
  useEffect(() => {
    if (!isAuth) {
      navigate('/login')
    }
  }, [])

  return (
    <>
      { isAuth && <div className={`master-container min-vh-100 ${isDarkMode ? 'dark' : 'light'}`}>
                    <div className="navbar p-0">
                      <Navbar/>
                    </div>
                    <div className="content-container min-vh-100 d-flex">
                      <div className="sidebar min-vh-100">
                        <SideBar/>
                      </div>
                      <div className="content w-100">
                        <Outlet/>
                      </div>
                    </div>
                  </div>}
    </>
  )
}
