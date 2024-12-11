import './Dashboard.css'
// Images
import img1 from '../../assets/images/dashboard-1.png'
import img2 from '../../assets/images/dashboard-2.png'
import img3 from '../../assets/images/dashboard-3.png'
import { useEffect, useState } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import { useThemeContext } from '../../context/ThemeContext'
import PieChartComponent from '../shared/components/Chart/Chart'
import { axiosInstance, TASK_URL, USER_URL } from '../../services/Endpoints'

export default function Dashboard() {
  const {loginData} = useAuthContext()
  const {isDarkMode} = useThemeContext()

  const [countTasks, setCountTasks] = useState(0)
  const [inProgress, setInProgress] = useState(0)
  const [active, setActive] = useState(0)
  const [inActive, setInActive] = useState(0)

  const getCountTasks = async () => {
    try {
      const res = await axiosInstance.get(TASK_URL.COUNT_TASKS)
      console.log(res);
      setCountTasks(res?.data?.toDo)
      setInProgress(res?.data?.inProgress)
      // setCountTasksList(res?.data?.data)
    } catch (error) {
      console.log(error);
    }
  }

  const getCountUsers = async () => {
    try {
      const res = await axiosInstance.get(USER_URL.COUNT_USERS)
      console.log(res);
      setActive(res?.data?.activatedEmployeeCount)
      setInActive(res?.data?.deactivatedEmployeeCount)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCountTasks()
    getCountUsers()
  }, [])

  return (
    <div className='p-5'>
      <header>
        <div className="header-container">
          <div className="header-content">
            <h1>Welcome <span>{loginData?.userName}</span></h1>
            <p>You can add project and assign tasks to your team</p>
          </div>
        </div>
      </header>
      <div className='dashboard-content'>
        <div className='content'>
          <div className='title'>
            <h4>Tasks</h4>
            <p>Lorem ipsum dolor sit amet,consecteture</p>
          </div>
          <div className='boxs'>
            <div className={`box-Progress ${isDarkMode ? 'dark' : 'light'}`}>
              <div className='box-img'>
                <img src={img1} alt="" />
              </div>
              <p>Progress</p>
              <h3>{inProgress}</h3>
            </div>
            <div className={`box-Tasks ${isDarkMode ? 'dark' : 'light'}`}>
              <div className='box-img'>
                <img src={img2} alt="" />
              </div>
              <p>Tasks Number</p>
              <h3>{countTasks}</h3>
            </div>
            <div className={`box-Projects ${isDarkMode ? 'dark' : 'light'}`}>
              <div className='box-img'>
                <img src={img3} alt="" />
              </div>
              <p>Projects Number</p>
              <h3>32</h3>
            </div>
          </div>
            <div className='w-75'>
              <PieChartComponent one={inProgress} tow={countTasks} colorOne={'rgba(54, 162, 235, 0.2)'} colorTow={'rgba(255, 205, 86, 0.2)'}/>
            </div>
        </div>

        {/* ===================== */}
        {loginData?.userGroup !== 'Employee' ? 
        <div className='content'>
          <div className='title'>
            <h4>Users</h4>
            <p>Lorem ipsum dolor sit amet,consecteture</p>
          </div>
          <div className='boxs'>
            <div className={`box-Progress ${isDarkMode ? 'dark' : 'light'}`}>
              <div className='box-img'>
                <img src={img1} alt="" />
              </div>
              <p>active</p>
              <h3>{active}</h3>
            </div>
            <div className={`box-Tasks ${isDarkMode ? 'dark' : 'light'}`}>
              <div className='box-img'>
                <img src={img2} alt="" />
              </div>
              <p>inactive</p>
              <h3>{inActive}</h3>
            </div>
          </div>
          <div className='w-75'>
              <PieChartComponent one={active} tow={inActive} colorOne={'rgba(54, 162, 235, 0.2)'} colorTow={'rgba(255, 205, 86, 0.2)'}/>
            </div>
        </div> : '' }
      </div>
    </div>
  )
}
