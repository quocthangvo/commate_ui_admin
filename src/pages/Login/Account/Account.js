import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

const Account = () => {
  const [phoneNumber, setPhoneNumber] = useState(""); // State to hold phone number
  const [password, setPassword] = useState(""); // State to hold password

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Phone Number:", phoneNumber);
    console.log("Password:", password);

    setPhoneNumber("");
    setPassword("");
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <h2>Cài đặt</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formPhone">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Nhập số điện thoại mới"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Mật khẩu cũ</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formNewPassword">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Lưu thay đổi
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Account;
