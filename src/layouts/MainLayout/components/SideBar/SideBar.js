import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../../../css/SideBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const dropdownItems = [
    // { to: "/productDetails", label: "Chi tiết sản phẩm" },
    { to: "/products", label: "Sản phẩm" },
    { to: "/colors", label: "Màu sắc" },
    { to: "/sizes", label: "Kích thước" },
    { to: "/categories", label: "Danh mục" },
  ];
  return (
    <div>
      <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion">
        {/* Sidebar - Brand */}
        <Link
          className="d-flex align-items-center justify-content-center sidebar-heading navbar-nav"
          to="/mainLayout"
        >
          Trang chủ
        </Link>
        <hr className="sidebar-divider" />
        {/* Mảng chứa các mục trong dropdown */}

        <div className="product-info-dropdown">
          <div className="sidebar-heading" onClick={toggleDropdown}>
            Thông tin sản phẩm
            <FontAwesomeIcon icon={faCaretDown} className="font-icon" />
          </div>
          {isOpen && (
            <div className="dropdown-menu">
              {dropdownItems.map((item, index) => (
                <Link
                  key={index}
                  className="nav-link dropdown-item"
                  to={item.to}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* Divider */}
        <hr className="sidebar-divider" />
        {/* Heading */}
        <div className="sidebar-heading">Người dùng</div>

        <li className="nav-item active">
          <Link className="nav-link m-3" to="/users">
            <span>Tài khoản người dùng</span>
          </Link>
          <div
            id="collapsePages"
            className="collapse show"
            aria-labelledby="headingPages"
            data-parent="#accordionSidebar"
          ></div>
        </li>

        <hr className="sidebar-divider d-none d-md-block" />

        <div className="sidebar-heading">Đơn hàng</div>

        <li className="nav-item active">
          <Link className="nav-link m-3" to="/orders">
            <span>Đơn đặt hàng</span>
          </Link>
          <div
            id="collapsePages"
            className="collapse show"
            aria-labelledby="headingPages"
            data-parent="#accordionSidebar"
          ></div>
        </li>
      </ul>
    </div>
  );
}
