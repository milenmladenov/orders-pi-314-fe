/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: "/app/dashboard", // the url
    icon: "HomeIcon", // the component being exported from icons/index.js
    name: "Начало", // name that appear in Sidebar
  },
  
  {
    path: "/app/insert-by-hand",
    icon: "AssetIcon",
    name: "Нова поръчка",
  },
  {
    icon: "AssetIcon",
    name: "Моите поръчки",
    path: "/app/orders"
  },
  {
    path: "/app/manage-profile",
    icon: "UserIcon",
    name: "Профил",
  }
];

export default routes;
