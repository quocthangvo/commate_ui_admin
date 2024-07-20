import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import usersApi from "../../apis/usersApi";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../validations/loginSchema";

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await usersApi.login(data.phone_number, data.password);

      // Xử lý kết quả từ API
      if (response.status === 200) {
        const { roles, token } = response.data.data;

        // Lưu token vào localStorage (nếu có)
        localStorage.setItem("accessToken", token);

        // Hiển thị thông báo thành công
        toast.success(response.data.message);

        // Điều hướng đến trang dựa trên vai trò của người dùng
        if (roles.name === "ADMIN") {
          navigate("/mainLayout");
        } else {
          navigate("/userDashboard");
        }
      } else {
        // Hiển thị thông báo lỗi từ API
        toast.error(response.data.message);
      }
    } catch (error) {
      // Xử lý lỗi nếu có lỗi từ API hoặc mạng
      console.error("Đăng nhập lỗi:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại sau.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="">
      <h1 className="d-flex justify-content-center m-5 wel">Đăng nhập</h1>
      <Row
        className="justify-content-center align-items-center "
        style={{ minHeight: "50vh" }}
      >
        <Col md={7} className="">
          <Form
            className="border p-4 d-flex flex-wrap shadow justify-content-between"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <img
                src="https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg?size=338&ext=jpg&ga=GA1.1.1788614524.1717977600&semt=ais_user"
                alt="Image"
                height="300"
                width="300"
                className="m-1"
              />
            </div>
            <div className="w-50">
              <Form.Group controlId="formBasicPhone" className="form-group">
                <Form.Label className="form-label">Số điện thoại</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Số điện thoại"
                  {...register("phone_number")}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="form-group">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Mật khẩu"
                  {...register("password")}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox" className="form-group">
                <Form.Check type="checkbox" label="Lưu tài khoản" />
              </Form.Group>
              <div className="d-grid">
                <Button variant="primary" type="submit" className="form-group">
                  Đăng nhập
                </Button>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
