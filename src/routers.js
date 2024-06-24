import React from "react";
import { useRoutes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CategoryList from "./pages/Category/CategoryList";
import CreateProduct from "./pages/Product/components/CreateProduct";
import SizeList from "./pages/Size/SizeList";
import ColorList from "./pages/Color/ColorList";
import ProductDetailList from "./pages/ProductDetail/ProductDetailList";
import CreateCategory from "./pages/Category/components/CreateCategory";
import CreateSize from "./pages/Size/components/CreateSize";
import CreateColor from "./pages/Color/components/CreateColor";
import ProductList from "./pages/Product/ProductList";
import UpdateCategory from "./pages/Category/components/UpdateCategory";
import UpdateColor from "./pages/Color/components/UpdateColor";
import UpdateSize from "./pages/Size/components/UpdateSize";
import UpdateProduct from "./pages/Product/components/UpdateProduct/UpdateProduct";
import Login from "./pages/Login";
import AuthLayout from "./layouts/AuthLayout";
import Account from "./pages/Login/Account";
import UserList from "./pages/User/UserList";
import CreateUser from "./pages/User/components/CreateUser";
import UpdateUser from "./pages/User/components/UpdateUser/UpdateUser";

export default function useRouterElement() {
  return useRoutes([
    {
      path: "/",
      element: (
        <AuthLayout>
          <Login />
        </AuthLayout>
      ),
    },
    {
      path: "/products",
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      ),
    },
    {
      path: "/products/create",
      element: (
        <MainLayout>
          <CreateProduct />
        </MainLayout>
      ),
    },
    {
      path: "/products/:id",
      element: (
        <MainLayout>
          <UpdateProduct />
        </MainLayout>
      ),
    },
    {
      path: "/categories",
      element: (
        <MainLayout>
          <CategoryList />
        </MainLayout>
      ),
    },
    {
      path: "/categories/create",
      element: (
        <MainLayout>
          <CreateCategory />
        </MainLayout>
      ),
    },
    {
      path: "/categories/:id",
      element: (
        <MainLayout>
          <UpdateCategory />
        </MainLayout>
      ),
    },
    {
      path: "/sizes",
      element: (
        <MainLayout>
          <SizeList />
        </MainLayout>
      ),
    },
    {
      path: "/sizes/create",
      element: (
        <MainLayout>
          <CreateSize />
        </MainLayout>
      ),
    },
    {
      path: "/sizes/:id",
      element: (
        <MainLayout>
          <UpdateSize />
        </MainLayout>
      ),
    },
    {
      path: "/colors",
      element: (
        <MainLayout>
          <ColorList />
        </MainLayout>
      ),
    },
    {
      path: "/colors/create",
      element: (
        <MainLayout>
          <CreateColor />
        </MainLayout>
      ),
    },
    {
      path: "/colors/:id",
      element: (
        <MainLayout>
          <UpdateColor />
        </MainLayout>
      ),
    },
    {
      path: "/productDetails",
      element: (
        <MainLayout>
          <ProductDetailList />
        </MainLayout>
      ),
    },
    {
      path: "/productDetails/product/:id",
      element: (
        <MainLayout>
          <ProductDetailList />
        </MainLayout>
      ),
    },
    {
      path: "/mainLayout",
      element: <MainLayout />,
    },
    {
      path: "/account",
      element: (
        <MainLayout>
          <Account />
        </MainLayout>
      ),
    },
    {
      path: "/users",
      element: (
        <MainLayout>
          <UserList />
        </MainLayout>
      ),
    },
    {
      path: "/users/create",
      element: (
        <MainLayout>
          <CreateUser />
        </MainLayout>
      ),
    },
    {
      path: "/users/:id",
      element: (
        <MainLayout>
          <UpdateUser />
        </MainLayout>
      ),
    },
  ]);
}
