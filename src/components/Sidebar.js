import React, {useState} from 'react'
import {
    FaCashRegister,
       FaRegChartBar, FaShoppingBag,
     FaUserAlt, FaBars
} from 'react-icons/fa'
import { Link, NavLink } from 'react-router-dom';

export const Sidebar = () =>{
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    }
    const menuItems = [
        {
            path: "/claims",
            name: "Claims",
            icon: <FaCashRegister />
        },

        {
            path: "/employeeManagement",
            name: "Employee Management",
            icon: <FaUserAlt />
        },
        {
            path: "/leaveManagement",
            name: "Leave Management",
            icon: <FaRegChartBar />
        },
        {
            path: "/admin",
            name: "Admin",
            icon: <FaShoppingBag />
        }
    ]
  return (
      <div style={{ width: isOpen ? "300px" : "50px" }} className="sidebar">
          <div className='top_selection'>
              <h1 style={{ display: "none" }} className='logo'></h1>
              <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
                  <FaBars onClick={toggle} />
              </div>
              {
                  menuItems.map((item, index) => (
                      <NavLink to={item.path} key={index} className="link" activeClassName="active">
                          <div className='icon'>{item.icon}</div>
                          <div style={{ display: isOpen ? "block" : "none" }} className='link_text'>{item.name}</div>
                      </NavLink>
                  ))
              }

          </div>
      </div>
  )
};
