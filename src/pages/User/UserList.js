import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Table, Alert, Pagination } from "react-bootstrap";
import ConfirmModal from "../../components/ConfirmModal";
import usersApi from "../../apis/usersApi";
import { toast } from "react-toastify";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModalLock, setShowConfirmModalLock] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback((page = 1, limit = 5) => {
    usersApi
      .getAllUsers(page, limit)
      .then((response) => {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPage);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [fetchUsers, currentPage]);

  const handleDelete = () => {
    usersApi
      .deleteUser(userId)
      .then((response) => {
        if (response.status === 200) {
          fetchUsers(currentPage);
          toast.success(response.data.message);
        } else {
          showErrorMessage("Không thể xóa");
        }
      })
      .catch((error) => {
        showErrorMessage("Không thể xóa");
      })
      .finally(() => {
        setShowConfirmModal(false);
        setUserId(null);
      });
  };

  const handleLock = () => {
    usersApi
      .lockUser(userId)
      .then((response) => {
        if (response.status === 200) {
          fetchUsers(currentPage);
          toast.success(response.data.message);
        } else {
          showErrorMessage("Không thể khóa");
        }
      })
      .catch((error) => {
        showErrorMessage("Không thể khóa");
      })
      .finally(() => {
        setShowConfirmModalLock(false);
        setUserId(null);
      });
  };

  const searchFullName = (fullName) => {
    const params = new URLSearchParams();
    params.append("search", fullName);
    window.history.replaceState(null, null, `?${params.toString()}`);
    usersApi
      .searchFullName(fullName)
      .then((response) => {
        if (response.status === 200) {
          setUsers(response.data.data);
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      });
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrorMessage("");
    }, 3000);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchFullName(searchValue);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const clearFilter = () => {
    setSearchValue("");
    const params = new URLSearchParams();
    window.history.replaceState(null, null, `?${params.toString()}`);
    fetchUsers(); // Fetch all users again
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const generatePageItems = () => {
    const pages = [];
    const maxPagesToShow = 5; // Number of pages to show at once

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer pages than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    } else {
      // Show pages with ellipses
      if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
        // Show pages from the beginning
        for (let i = 1; i <= maxPagesToShow - 1; i++) {
          pages.push(
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
        pages.push(<Pagination.Ellipsis key="ellipsis-start" />);
        pages.push(
          <Pagination.Item
            key={totalPages}
            active={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Pagination.Item>
        );
      } else if (currentPage >= totalPages - Math.floor(maxPagesToShow / 2)) {
        // Show pages from the end
        pages.push(
          <Pagination.Item
            key={1}
            active={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </Pagination.Item>
        );
        pages.push(<Pagination.Ellipsis key="ellipsis-end" />);
        for (let i = totalPages - (maxPagesToShow - 2); i <= totalPages; i++) {
          pages.push(
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
      } else {
        // Show a range of pages around the current page
        pages.push(
          <Pagination.Item
            key={1}
            active={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </Pagination.Item>
        );
        pages.push(<Pagination.Ellipsis key="ellipsis-start" />);
        for (
          let i = currentPage - Math.floor(maxPagesToShow / 2);
          i <= currentPage + Math.floor(maxPagesToShow / 2);
          i++
        ) {
          pages.push(
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
        pages.push(<Pagination.Ellipsis key="ellipsis-end" />);
        pages.push(
          <Pagination.Item
            key={totalPages}
            active={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Pagination.Item>
        );
      }
    }

    return pages;
  };

  return (
    <div>
      <ConfirmModal
        title="Confirm Delete"
        content="Bạn có muốn xóa không?"
        onClick={handleDelete}
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
      />
      <ConfirmModal
        title="Confirm Lock User"
        content="Bạn có muốn khóa không?"
        onClick={handleLock}
        show={showConfirmModalLock}
        onClose={() => setShowConfirmModalLock(false)}
      />
      <div className="container my-4">
        <h2 className="text-center mb-4">Người dùng</h2>
        {showError && <Alert variant="danger">{errorMessage}</Alert>}
        <div className="row mb-3">
          <div className="col">
            <Link
              className="btn btn-primary me-1"
              to="/users/create"
              role="button"
            >
              Thêm người dùng
            </Link>
            <Button variant="outline-primary" onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
        </div>
        <div className="d-flex mb-3">
          <div className="input-gr search-input-container me-2">
            <input
              type="text"
              className="form-control border-1 search-input"
              placeholder="Tìm kiếm..."
              value={searchValue}
              onKeyPress={handleKeyPress}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-label="Search"
              aria-describedby="basic-addon2"
            />
            <button
              className="btn search-btn"
              type="button"
              onClick={() => searchFullName(searchValue)}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <div className="form-gr">
            <button
              className="btn border-black"
              type="button"
              onClick={clearFilter}
            >
              <FontAwesomeIcon icon={faFilter} /> Xóa bộ lọc
            </button>
          </div>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên người dùng</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.length > 0 &&
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.full_name}</td>
                  <td>{user.phone_number}</td>
                  <td>{user.status}</td>
                  <td style={{ width: 1, whiteSpace: "nowrap" }}>
                    <Link
                      className="btn btn-success btn-sm me-1"
                      to={`/users/${user.id}`}
                    >
                      Mở khóa
                    </Link>
                    <button
                      className="btn btn-light"
                      onClick={() => {
                        setUserId(user.id);
                        setShowConfirmModalLock(true);
                      }}
                    >
                      Khóa
                    </button>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => {
                        setUserId(user.id);
                        setShowConfirmModal(true);
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <Pagination>
          <Pagination.Prev
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {generatePageItems()}
          <Pagination.Next
            onClick={() =>
              currentPage < totalPages && handlePageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </div>
  );
}
