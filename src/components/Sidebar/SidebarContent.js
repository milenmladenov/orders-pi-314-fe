import React, { useState } from 'react';
import routes from "../../routes/sidebar";
import adminRoutes from "../../adminRoutes/sidebar";
import { NavLink, Route } from "react-router-dom";
import * as Icons from "../../icons";
import SidebarSubmenu from "./SidebarSubmenu";
import { Button } from "@windmill/react-ui";
import LogoutModal from "../LogoutModal";
import { useAuth } from '../context/AuthContext';
import Logo from '../../assets/img/pi314-logo.png'


function Icon({ icon, ...props }) {
  const Icon = Icons[icon];
  return <Icon {...props} />;
}

function SidebarContent() {

  const [showCustomLogoutModal, setShowCustomLogoutModal] = useState(false);

  const handleCustomLogoutClick = () => {
    setShowCustomLogoutModal(true);
  };

  const { userLogout } = useAuth();
  
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = loggedUser?.data.role === '[ADMIN]';

  const handleLogout = () => {
    userLogout();
  };

  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
       <a
        className="ml-6 flex items-center text-lg font-bold text-gray-800 dark:text-gray-200"
        href="#"
      >
        <img
          src={Logo}  // Replace with the actual logo filename
          alt="Logo"
          className="w-40 h-30 center"  // Adjust the size and spacing as needed
        />
      </a>
      <ul className="mt-6">
        {(isAdmin ? adminRoutes : routes).slice(0, -3).map((route) =>
          route.routes ? (
            <SidebarSubmenu route={route} key={route.name} />
          ) : (
            <li className="relative px-6 py-3" key={route.name}>
              <NavLink
                exact
                to={route.path}
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                activeClassName="text-gray-800 dark:text-gray-100"
              >
                <Route path={route.path} exact={route.exact}>
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                </Route>
                <Icon
                  className="w-5 h-5"
                  aria-hidden="true"
                  icon={route.icon}
                />
                <span className="ml-4">{route.name}</span>
              </NavLink>
            </li>
          )
        )}


        {(isAdmin ? adminRoutes : routes).slice(-3).map((route) => (
          <li className="relative px-6 py-3" key={route.name}>
            <NavLink
              exact
              to={route.path}
              className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
              activeClassName="text-gray-800 dark:text-gray-100"
            >
              <Route path={route.path} exact={route.exact}>
                <span
                  className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                  aria-hidden="true"
                ></span>
              </Route>
              <Icon className="w-5 h-5" aria-hidden="true" icon={route.icon} />
              <span className="ml-4">{route.name}</span>
            </NavLink>

          </li>
        ))}
        <li className="relative px-6 py-3" > <NavLink className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
          to="#" onClick={handleCustomLogoutClick}>
          <span
            className="absolute inset-y-0 left-0 w-1  rounded-tr-lg rounded-br-lg"
            aria-hidden="true"
          ></span>

          <Icon className="w-5 h-5" aria-hidden="true" icon={"OutlineLogoutIcon"} />
          <span className="ml-4">Изход</span>
        </NavLink>
        </li>
      </ul>

     
      <LogoutModal onConfirm={handleLogout} isOpen={showCustomLogoutModal} onClose={() => setShowCustomLogoutModal(false)} />

    </div>
  );
}

export default SidebarContent;
