import './SideBar.css'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import leftIcon from '../../../../assets/images/chevron-left.png'
import rightIcon from '../../../../assets/images/chevron-right.png'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeContext } from '../../../../context/ThemeContext';
import { useAuthContext } from '../../../../context/AuthContext';

export default function SideBar() {
  const {isDarkMode} = useThemeContext()
  const {loginData} = useAuthContext()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('home');  // Store the active item
  
  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName); // Update active item on click
  };

  const toggle = () => {
    setIsCollapsed(prev => !prev)
  }

  return (
    <div className={`sidebar-container ${isDarkMode ? 'dark' : 'light'}`}>
      <Sidebar collapsed={isCollapsed}>
        <Menu>
          <div onClick={toggle} className={`icon-left ${isCollapsed ? 'icon-right' : ''}`}>
            {isCollapsed ? <img src={rightIcon} alt="" /> : <img src={leftIcon} alt="" />}
          </div>
          <MenuItem component={<Link to="/dashboard" />} title='home' icon={<i className='fa fa-home'></i>} 
          active={activeItem === 'home'}  // Conditional active state
          onClick={() => handleItemClick('home')}  // Set active item on click
          > Home </MenuItem>
          {loginData?.userGroup !== 'Employee' ? 
          <MenuItem component={<Link to="/users" />} title='users' icon={<i className="fa-sharp fa-solid fa-users"></i>}
          active={activeItem === 'users'}  
          onClick={() => handleItemClick('users')}  
          > Users </MenuItem> : ''}
          <MenuItem component={<Link to="/projects" />} title='projects' icon={<i className="fa-solid fa-chart-column"></i>} 
          active={activeItem === 'projects'}  
          onClick={() => handleItemClick('projects')}  
          > Projects </MenuItem>
          <MenuItem component={<Link to="/tasks" />} title='tasks' icon={<i className="fa fa-list-check"></i>} 
          active={activeItem === 'tasks'} 
          onClick={() => handleItemClick('tasks')}
          > Tasks </MenuItem>
          <MenuItem component={<Link to="/login" />} title='logout' icon={<i className="fa-solid fa-right-from-bracket"></i>} 
          active={activeItem === 'logout'} 
          onClick={() => {
            handleItemClick('logout')
            localStorage.removeItem('token')
          }}
          > Log out </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  )
}
