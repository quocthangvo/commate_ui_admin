import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Alert } from "react-bootstrap";

import { toast } from "react-toastify";
import productsApi from "../../../../apis/productsApi";

export default function UploadImage() {
  const { id } = useParams(); // Get product id from URL
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    try {
      const response = await productsApi.uploadImage(id, formData);
      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        showErrorMessage("Failed to upload images");
      }
    } catch (error) {
      showErrorMessage(error.response.data.message);
    }
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrorMessage("");
    }, 3000); // 3 seconds
  };

  return (
    <div>
      {showError && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFileMultiple" className="mb-3">
          <Form.Label>Chọn hình ảnh (max: 5 ảnh)</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Upload
        </Button>
      </Form>
    </div>
  );
}
