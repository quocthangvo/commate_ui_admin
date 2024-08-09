import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Table,
  Card,
  Container,
  Button,
  Row,
  Col,
} from "react-bootstrap";

import { toast } from "react-toastify";
import sizesApi from "../../apis/sizesApi";
import colorsApi from "../../apis/colorsApi";
import categoriesApi from "../../apis/categoriesApi";
import ConfirmModal from "../../components/ConfirmModal";
import "../../css/CreateProduct.css";
import CreateSize from "../Size/components/CreateSize";
import CreateColor from "../Color/components/CreateColor";
import CreateCategory from "../Category/components/CreateCategory";

// Định nghĩa AttributesList như hiện tại

const PropertiesList = () => {
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [itemId, setItemId] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    fetchSizes();
    fetchColors();
    fetchCategories();
  }, []);

  const fetchSizes = () => {
    sizesApi
      .getAllSizes()
      .then((response) => setSizes(response.data.data))
      .catch(console.log);
  };

  const fetchColors = () => {
    colorsApi
      .getAllColors()
      .then((response) => setColors(response.data.data))
      .catch(console.log);
  };

  const fetchCategories = () => {
    categoriesApi
      .getAllCategories()
      .then((response) => setCategories(response.data.data))
      .catch(console.log);
  };

  const handleDelete = () => {
    if (itemType === "size") {
      sizesApi
        .deleteSize(itemId)
        .then((response) => {
          if (response.status === 200) {
            toast(response.data.message);
            fetchSizes();
          } else {
            showErrorMessage("Không thể xóa kích thước");
          }
        })
        .catch((error) => {
          showErrorMessage(error.response.data.message);
        });
    } else if (itemType === "color") {
      colorsApi
        .deleteColor(itemId)
        .then((response) => {
          if (response.status === 200) {
            toast(response.data.message);
            fetchColors();
          } else {
            showErrorMessage("Không thể xóa màu sắc");
          }
        })
        .catch((error) => {
          showErrorMessage(error.response.data.message);
        });
    } else if (itemType === "category") {
      categoriesApi
        .deleteCategory(itemId)
        .then((response) => {
          if (response.status === 200) {
            toast(response.data.message);
            fetchCategories();
          } else {
            showErrorMessage("Không thể xóa danh mục");
          }
        })
        .catch((error) => {
          showErrorMessage(error.response.data.message);
        });
    }

    setShowConfirmModal(false);
    setItemId(null);
    setItemType(null);
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrorMessage("");
    }, 3000);
  };

  const handleDeleteClick = (id, type) => {
    setItemId(id);
    setItemType(type);
    setShowConfirmModal(true);
  };

  return (
    <Container>
      <ConfirmModal
        title="Xác nhận xóa"
        content="Bạn có muốn xóa không?"
        onClick={handleDelete}
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
      />
      <h2 className="text-center my-4">Quản lý thuộc tính</h2>
      {showError && <Alert variant="danger">{errorMessage}</Alert>}
      <Row className="mb-5">
        <Col>
          <CreateSize fetchSizes={fetchSizes} />
        </Col>
        <Col>
          <CreateColor fetchColors={fetchColors} />
        </Col>
        <Col>
          <CreateCategory fetchCategories={fetchCategories} />
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <AttributesList
            title="Danh sách kích thước"
            items={sizes}
            editLink="/sizes"
            onDelete={(id) => handleDeleteClick(id, "size")}
          />
        </Col>
        <Col md={4}>
          <AttributesList
            title="Danh sách màu sắc"
            items={colors}
            editLink="/colors"
            onDelete={(id) => handleDeleteClick(id, "color")}
          />
        </Col>
        <Col md={4}>
          <AttributesList
            title="Danh sách danh mục"
            items={categories}
            editLink="/categories"
            onDelete={(id) => handleDeleteClick(id, "category")}
          />
        </Col>
      </Row>
    </Container>
  );
};
export default PropertiesList;
const AttributesList = ({ title, items, editLink, onDelete }) => (
  <Card className="mb-4">
    <Card.Header as="h3">{title}</Card.Header>
    <Card.Body>
      <Table bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <Link
                    className="btn btn-success btn-sm me-2"
                    to={`${editLink}/${item.id}`}
                  >
                    Chỉnh sửa
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
);
