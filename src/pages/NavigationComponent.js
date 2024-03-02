import React from 'react'
import { useAuth } from '../components/Auth';
import { NavLink, useNavigate } from 'react-router-dom';

export const NavigationComponent = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleMenuSelection = (data) => {
    auth.menuSelected(data);
    navigate("/login");
  }
  const handleLogout = () => {
    auth.logout();
    navigate("/");
  }
  return (
    <ul>
      <li></li>
      <li className='left'><a href='#'><img src={require('../logo.svg').default} alt='logo'></img></a></li>
      {
        auth.userName !== null ?
          <>
            <li className='center'> {auth.menu}</li>
            <li className='right'>
              <NavLink onClick={handleLogout} to={'/'}>Logout</NavLink></li>
            <li className='right'>
              <a href='#'>&nbsp;</a>
            </li>
            <li className='right'>
              <a href='#'>Welcome {auth.userName}
              </a>
            </li>
          </> : null
      }
    </ul>
  )
}
