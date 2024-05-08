
import Dashboard from "views/Dashboard.js";
import ScreenHome from "views/ScreenHome";
import Logout from "views/Logout";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import { useState } from "react";
const token = Cookies.get("access_token");
const decoded = token ? jwtDecode(token) : "";
 const nm = Cookies.get("Name");
const Name = nm ? nm : "Dashbord";




var routes = [
 
];
if (decoded.Role=== "admin") {
  routes.push(
    
    {
    path: "/users",
    name: "users",
    icon: "nc-icon nc-bank",
    component: <ScreenHome/>,
    layout: "/admin",
  },
  {
    path: `/Dashboard`,
    name: "Salim",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/admin",
  },
    {
    path: "/logout",
    name: "Déconnecter",
    icon: "nc-icon nc-button-power",
    component: <Logout/>,
    layout: "/admin",
  });

}
if (decoded.Role=== "store") {
  routes.push(
    {
      path: `/${Name}`,
      name: "Statistique",
      icon: "nc-icon nc-bank",
      component: <Dashboard />,
      layout: "/admin",
    },
    {
    path: "/logout",
    name: "Déconnecter",
    icon: "nc-icon nc-button-power",
    component: <Logout/>,
    layout: "/admin",
  });
}
export default routes;
