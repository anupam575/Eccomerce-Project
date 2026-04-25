import {
  Inventory2,
  Category,
  People,
  ShoppingCart,
  AddBox,
  ListAlt,
  BarChart,
  Update,
  BrandingWatermark,
} from "@mui/icons-material";

export const adminMenu = [
  {
    name: "Products",
    icon: <Inventory2 fontSize="small" />,
    children: [
      {
        name: "Create Product",
        link: "/admin/create-product",
        icon: <AddBox fontSize="small" />,
      },
      {
        name: "All Products",
        link: "/admin/products",
        icon: <ListAlt fontSize="small" />,
      },
    ],
  },

  {
    name: "Categories",
    icon: <Category fontSize="small" />,
    children: [
      {
        name: "Create Category",
        link: "/admin/create-category",
        icon: <AddBox fontSize="small" />,
      },
     
    ],
  },
  
  {
    name: "Roles",
    icon: <Category fontSize="small" />,
    children: [
      {
        name: "Create Role",
        link: "/admin/role",
        icon: <AddBox fontSize="small" />,
      },
     
    ],
  },

  {
    name: "Users",
    icon: <People fontSize="small" />,
    children: [
      {
        name: "All Users",
        link: "/admin/alluser",
        icon: <ListAlt fontSize="small" />,
      },
      {
        name: "User Charts",
        link: "/admin/alluser/charts",
        icon: <BarChart fontSize="small" />,
      },
    ],
  },

  {
    name: "Orders",
    icon: <ShoppingCart fontSize="small" />,
    children: [
      {
        name: "All Orders",
        link: "/admin/all-orders",
        icon: <ListAlt fontSize="small" />,
      },
      {
        name: "Orders Chart",
        link: "/admin/all-orders/charts",
        icon: <BarChart fontSize="small" />,
      },
    ],
  },

  {
    name: "Order Update",
    icon: <Update fontSize="small" />,
    link: "/admin/update",
  },

  {
    name: "Brands",
    icon: <BrandingWatermark fontSize="small" />,
    link: "/admin/brands",
  },
];