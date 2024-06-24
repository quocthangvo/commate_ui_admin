import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import "../../css/MainLayout.css";

export default function MainLayout({ children }) {
  return (
    <div className="app-container">
      <div className="left-sidebar">
        <Sidebar />
      </div>
      <div className="main-content">
        <Header />
        <div className="container">{children}</div>
      </div>
    </div>
  );
}
