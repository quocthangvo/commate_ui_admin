import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../../../../css/Header.css";
import "../../../../css/AuthLayout.css";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xử lý logic đăng xuất ở đây
    // Ví dụ: xóa token, cookies hoặc clear session
    // Sau khi xử lý xong, chuyển hướng về trang đăng nhập
    // Ví dụ sử dụng local storage:
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/mainLayout">Coolmate</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="">
            <form className="form-inline my-2 my-lg-1">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control border-1"
                  placeholder="Tìm kiếm..."
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button">
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
              </div>
            </form>
          </Nav>
        </Navbar.Collapse>
        <Nav className="right-nav">
          <NavDropdown title="ADMIN" id="basic-nav-dropdown">
            <NavDropdown.Item href="/account">Cài đặt</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>
              Đăng xuất
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
