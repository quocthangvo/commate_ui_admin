import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Table, Alert } from "react-bootstrap";
import colorsApi from "../../apis/colorsApi";
import ConfirmModal from "../../components/ConfirmModal";
import { toast } from "react-toastify";

export default function ColorList() {
  const [colors, setColors] = useState([]);
  const [colorId, setColorId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const fetchColors = () => {
    colorsApi
      .getAllColors()
      .then((response) => {
        setColors(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleDelete = () => {
    colorsApi
      .deleteColor(colorId)
      .then((response) => {
        if (response.status === 200) {
          toast(response.data.message);
          fetchColors();
        } else {
          showErrorMessage("Không thể xóa");
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      })
      .finally(() => {
        setShowConfirmModal(false);
        setColorId(null);
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
        <h2 className="text-center mb-4">Màu sắc</h2>
        {showError && <Alert variant="danger">{errorMessage}</Alert>}
        <div className="row mb-3">
          <div className="col">
            <Link
              className="btn btn-primary me-1"
              to="/colors/create"
              role="button"
            >
              Thêm màu
            </Link>
            <Button variant="outline-primary" onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
        </div>
        <Table bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Màu</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {colors &&
              colors.length > 0 &&
              colors.map((color, index) => (
                <tr key={color.id}>
                  <td>{index + 1}</td>
                  <td>{color.name}</td>
                  <td style={{ width: 1, whiteSpace: "nowrap" }}>
                    <Link
                      className="btn btn-success btn-sm me-1"
                      to={`/colors/${color.id}`}
                    >
                      Chỉnh sửa
                    </Link>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => {
                        setColorId(color.id);
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
