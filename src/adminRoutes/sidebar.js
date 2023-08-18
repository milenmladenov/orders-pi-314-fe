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
    name: "Контролен панел", // name that appear in Sidebar
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
    name: "Всички поръчки",
    path: "/app/orders"
  },
  {
    path: "/app/all-products",
    icon: "AssetIcon",
    name: "Склад",
  },
  {
    path: "/app/customers",
    icon: "GroupIcon",
    name: "Клиенти",
  },
  

  {
    path: "/app/manage-profile",
    icon: "UserIcon",
    name: "Профил",
  },
  {
    path: "/app/settings",
    icon: "OutlineCogIcon",
    name: "Настройки",
  }
];

export default adminRoutes;
