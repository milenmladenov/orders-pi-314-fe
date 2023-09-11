import { lazy } from "react";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Orders = lazy(() => import("../pages/Orders"));
const ProductsAll = lazy(() => import("../pages/ProductsAll"));
const SingleProduct = lazy(() => import("../pages/SingleProduct"));
const AddProduct = lazy(() => import("../pages/AddProduct"));
const Customers = lazy(() => import("../pages/Customers"));
const Chats = lazy(() => import("../pages/Chats"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Settings"));
const Page404 = lazy(() => import("../pages/404"));
const Blank = lazy(() => import("../pages/Blank"));
const NewOrderForm = lazy(() => import("../pages/newOrderForm"))
const NewExcelOrderForm = lazy(() => import("../pages/newExcelOrderForm"))
const loggedUser = JSON.parse(localStorage.getItem("user"));
const SingleOrder = lazy(() => import("../pages/SingleOrder"));
const EditOrder = lazy(() => import("../pages/EditOrder"));



console.log(loggedUser)

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */

const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard,
},
  {
    path: "/insert-by-hand",
    component: NewOrderForm
  }, {
    path: "/orders",
    component: Orders,
  },
  {
    path: "/orders/:id",
    component: SingleOrder,
  },
  {
    path: "edit/orders/:id",
    component: EditOrder,
  },

  {
    path: "/manage-profile",
    component: Profile,
  }
]
export default routes;
