import {
  Inventory2,
  Category,
  People,
  Add,
} from "@mui/icons-material";

export const menuItems = [
  {
    name: "Products",
    icon: <Inventory2 fontSize="small" />,
    children: [
      { name: "Create Product", link: "/admin/create-product" },
      { name: "All Products", link: "/admin/products" },
    ],
  },
  {
    name: "Categories",
    icon: <Category fontSize="small" />,
    children: [
      { name: "Create Category", link: "/admin/create-category" },
      { name: "All Categories", link: "/admin/category" },
    ],
  },
  {
    name: "Users",
    icon: <People fontSize="small" />,
    children: [
      { name: "All Users", link: "/admin/alluser" },
      { name: "User Charts", link: "/admin/alluser/charts" },
    ],
  },
  {
    name: "Orders",
    icon: <Add fontSize="small" />,
    children: [
      { name: "All Orders", link: "/admin/all-orders" },
      { name: "Orders Chart", link: "/admin/all-orders/charts" },
    ],
  },

  // ✅ WITHOUT DROPDOWN ITEM
  {
    name: "Brands",
    icon: <Add fontSize="small" />,
    link: "/admin/brands", // 👈 direct link
  },
];