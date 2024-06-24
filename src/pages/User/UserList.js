import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Table, Alert } from "react-bootstrap";
import ConfirmModal from "../../components/ConfirmModal";
import usersApi from "../../apis/usersApi";
import { toast } from "react-toastify";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModalLock, setShowConfirmModalLock] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    usersApi
      .getAllUsers() // API call
      .then((response) => {
        setUsers(response.data.users); // Update state
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = () => {
    usersApi
      .deleteUser(userId)
      .then((response) => {
        if (response.status === 200) {
          fetchUsers();
          toast(response.data.message);
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
          fetchUsers();
          toast.success(response.data.message);
        } else {
          showErrorMessage("Không thể khóa ");
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      })
      .finally(() => {
        setShowConfirmModalLock(false);
        setUserId(null);
      });
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrorMessage("");
    }, 3000); // 3 giây
  };

  const handleRefresh = () => {
    window.location.reload();
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
              to="/users/create" // chuyền đén
              role="button"
            >
              Thêm người dùng
            </Link>
            <Button variant="outline-primary" onClick={handleRefresh}>
              Refresh
            </Button>
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
      </div>
    </div>
  );
}
