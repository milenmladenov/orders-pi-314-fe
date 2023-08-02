/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
 const adminRoutes = [
    {
      path: "/app/dashboard", // the url
      icon: "HomeIcon", // the component being exported from icons/index.js
      name: "Dashboard", // name that appear in Sidebar
    },
    {
      path: "/app/logout",
      icon: "OutlineLogoutIcon",
      name: "Logout",
    },
    {
      icon: "AssetIcon",
      name: "Нова поръчка",
      routes: [
        {
          path: "/app/insert-by-hand",
          name: "Ръчно въвеждане",
        },
        {
          path: "/app/insert-by-excel",
          name: "Импортиране от ексел",
        },
      ],
    },
    {
      icon: "AssetIcon",
      name: "Assets",
      routes: [
        {
          path: "/app/all-products",
          name: "All Assets",
        },
        {
          path: "/app/add-product",
          name: "Add Asset",
        },
      ],
    },
    {
      path: "/app/customers",
      icon: "GroupIcon",
      name: "Customers",
    },
    {
      path: "/app/chats",
      icon: "ChatIcon",
      name: "Chats",
    },
    {
      path: "/app/manage-profile",
      icon: "UserIcon",
      name: "Profile",
    },
    {
      path: "/app/settings",
      icon: "OutlineCogIcon",
      name: "Settings",
    },
    {
      path: "/app/logout",
      icon: "OutlineLogoutIcon",
      name: "Logout",
    },
  ];
  
  export default adminRoutes;
  