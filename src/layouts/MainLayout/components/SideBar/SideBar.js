import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../../../css/SideBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faBoxOpen,
  // faPalette,
  // faRuler,
  // faTags,
  faClipboardList,
  faTruck,
  faWarehouse,
  faUser,
  faClipboard,
  faMoneyBill,
  faList,
} from "@fortawesome/free-solid-svg-icons";

export default function SideBar() {
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toggleProductDropdown = () => {
    setIsProductDropdownOpen(!isProductDropdownOpen);
  };

  const toggleOrderDropdown = () => {
    setIsOrderDropdownOpen(!isOrderDropdownOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const userDropdownItems = [
    { to: "/users", label: "Tài khoản", icon: faUser },
    { to: "/orders", label: "Đơn hàng", icon: faClipboard },
  ];

  const productDropdownItems = [
    // { to: "/colors", label: "Màu sắc", icon: faPalette },
    // { to: "/sizes", label: "Thuộc tinh", icon: faRuler },
    // { to: "/categories", label: "Danh mục", icon: faTags },
    { to: "/properties", label: "Thuộc tính", icon: faList },
    { to: "/products", label: "Sản phẩm", icon: faBoxOpen },
  ];

  const orderDropdownItems = [
    { to: "/suppliers", label: "Nhà cung cấp", icon: faTruck },
    { to: "/purchaseOrders", label: "Đơn đặt hàng", icon: faClipboardList },
    { to: "/inventories", label: "Kho", icon: faWarehouse },
    { to: "/prices", label: "Giá", icon: faMoneyBill },
  ];

  return (
    <div>
      <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion">
        {/* Sidebar - Brand */}

        <Link
          className="align-items-center sidebar-heading navbar-nav"
          to="/mainLayout"
        >
          Coolmate
        </Link>

        <hr className="sidebar-divider" />

        <div className="dropdown-section">
          <div className="sidebar-heading" onClick={toggleProductDropdown}>
            Thông tin sản phẩm
            <FontAwesomeIcon icon={faCaretDown} className="font-icon" />
          </div>
          {isProductDropdownOpen && (
            <div className="dropdown-menu">
              {productDropdownItems.map((item, index) => (
                <Link
                  key={index}
                  className="nav-link dropdown-item"
                  to={item.to}
                >
                  <FontAwesomeIcon icon={item.icon} className="margin-icon" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <hr className="sidebar-divider" />

        {/* Dropdown đơn hàng */}
        <div className="dropdown-section">
          <div className="sidebar-heading" onClick={toggleOrderDropdown}>
            Đơn hàng
            <FontAwesomeIcon icon={faCaretDown} className="font-icon" />
          </div>
          {isOrderDropdownOpen && (
            <div className="dropdown-menu">
              {orderDropdownItems.map((item, index) => (
                <Link
                  key={index}
                  className="nav-link dropdown-item"
                  to={item.to}
                >
                  <FontAwesomeIcon icon={item.icon} className="margin-icon" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <hr className="sidebar-divider" />

        {/* Heading Người dùng */}
        <div className="dropdown-section">
          <div className="sidebar-heading" onClick={toggleUserDropdown}>
            Người dùng
            <FontAwesomeIcon icon={faCaretDown} className="font-icon" />
          </div>
          {isUserDropdownOpen && (
            <div className="dropdown-menu">
              {userDropdownItems.map((item, index) => (
                <Link
                  key={index}
                  className="nav-link dropdown-item"
                  to={item.to}
                >
                  <FontAwesomeIcon icon={item.icon} className="margin-icon" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <hr className="sidebar-divider d-none d-md-block" />
      </ul>
    </div>
  );
}
