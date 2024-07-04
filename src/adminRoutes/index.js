import { lazy } from "react";
import LogoutModal from "../components/LogoutModal";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Orders = lazy(() => import("../pages/Orders"));
const ProductsAll = lazy(() => import("../pages/ProductsAll"));
const SingleProduct = lazy(() => import("../pages/SingleProduct"));
const AddProduct = lazy(() => import("../pages/AddProduct"));
const Customers = lazy(() => import("../pages/Customers"));
const Chats = lazy(() => import("../pages/Chats"));
const Profile = lazy(() => import("../pages/ProfilePage"));
const Settings = lazy(() => import("../pages/Settings"));
const Page404 = lazy(() => import("../pages/404"));
const Blank = lazy(() => import("../pages/Blank"));
const NewOrderForm = lazy(() => import("../pages/newOrderForm"))
const NewExcelOrderForm = lazy(() => import("../pages/newExcelOrderForm"))
const SingleOrder = lazy(() => import("../pages/SingleOrder"))
const SingleCustomer = lazy(() => import("../pages/SingleCustomer"))
const EditOrder = lazy(() => import("../pages/EditOrder"))
const SuccesRegistration = lazy(() => import("../pages/SuccessRegistration"))
const ActivateUser = lazy(() => import("../pages/ActivateUser"))

// const LogoutModal = lazy(() => import("../components/LogoutModal"))

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


 const adminRoutes = [
    {
        path: "/dashboard", // the url
        component: Dashboard,
    },
    {
        path: "/orders",
        component: Orders,
    },
    {
        path: "/orders/:id",
        component: SingleOrder,
    },
    {
        path: "/orders/edit/:id",
        component: EditOrder,
    },
    {
        path: "/insert-by-excel",
        component: NewExcelOrderForm,
    },
    {
        path: "/insert-by-hand",
        component: NewOrderForm
    },
    {
        path: "/all-products",
        component: ProductsAll,
    },
    {
        path: "/add-product",
        component: AddProduct,
    },
    {
        path: "/product/:id",
        component: SingleProduct,
    },
    {
        path: "/customers",
        component: Customers,
    },
    {
        path: "/customers/:id",
        component: SingleCustomer,
    },
    {
        path: "/chats",
        component: Chats,
    },
    {
        path: "/profile",
        component: Profile,
    },
    {
        path: "/settings",
        component: Settings,
    },
    {
        path: "/success-registration",
        component: SuccesRegistration,
    },
    {
        path: "/404",
        component: Page404,
    },
    {
        path: "/activate-user/:id",
        component: ActivateUser,
    },
    {
        path: "/blank",
        component: Blank,
    }
    // {
    //     path: "/logout",
    //     component: LogoutModal,
    // }
]



export default adminRoutes;
