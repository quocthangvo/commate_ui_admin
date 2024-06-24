import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import categoriesApi from "../../apis/categoriesApi";
import ConfirmModal from "../../components/ConfirmModal";
import { toast } from "react-toastify";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    categoriesApi
      .getAllCategories()
      .then((response) => {
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDelete = () => {
    categoriesApi
      .deleteCategory(categoryId)
      .then((response) => {
        if (response.status === 200) {
          toast(response.data.message);
        } else {
          showErrorMessage("Không thể xóa");
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      })
      .finally(() => {
        setShowConfirmModal(false);
        setCategoryId(null);
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
      <div className="container my-4">
        <h2 className="text-center mb-4">Danh mục</h2>
        {showError && <Alert variant="danger">{errorMessage}</Alert>}
        <div className="row mb-3">
          <div className="col">
            <Link
              className="btn btn-primary me-1"
              to="/categories/create"
              role="button"
            >
              Thêm danh mục
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
              <th>Tên danh mục</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories &&
              categories.length > 0 &&
              categories.map((category, index) => (
                <tr key={category.id}>
                  <td>{index + 1}</td>
                  <td>{category.name}</td>
                  <td style={{ width: 1, whiteSpace: "nowrap" }}>
                    <Link
                      className="btn btn-success btn-sm me-1"
                      to={`/categories/${category.id}`}
                    >
                      Chỉnh sửa
                    </Link>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => {
                        setCategoryId(category.id);
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
