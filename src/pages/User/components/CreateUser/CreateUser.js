import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import "../../../../css/CreateProduct.css";
import "../../../../css/User.css";
import usersApi from "../../../../apis/usersApi";
import { registerSchema } from "../../../../validations/registerSchema";

export default function CreateUser() {
  const navigate = useNavigate();

  const [messageError, setMessageError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowRetypePassword = () => setShowRetypePassword((prev) => !prev);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      role_id: "1", // Set default value for role here
    },
  });

  const onSubmit = handleSubmit((data) => {
    usersApi
      .createUser(data)
      .then((response) => {
        if (response.status === 200) {
          toast(response.data.message);
          navigate(-1);
        }
      })
      .catch((error) => {
        setMessageError(error.response.data.message);
      });
  });

  console.log(errors);

  return (
    <div>
      <Link className="btn btn-link" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} className="icon-size" />
      </Link>
      <form className="form-container" onSubmit={onSubmit}>
        <h2 className="form-header">Thêm tài khoản</h2>
        {messageError && (
          <div className="alert alert-danger" role="alert">
            {messageError}
          </div>
        )}
        <div className="form-group">
          <label className="form-label" htmlFor="fullname">
            Họ tên :
          </label>
          <input
            {...register("fullname")}
            className={`form-input ${errors.fullname ? "is-invalid" : ""}`}
            type="text"
            placeholder="Nhập họ tên"
            required
          />
          <div className="invalid-feedback">{errors.fullname?.message}</div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="phone_number">
            Số điện thoại :
          </label>
          <input
            {...register("phone_number")}
            className={`form-input ${errors.phone_number ? "is-invalid" : ""}`}
            type="tel"
            placeholder="Nhập số điện thoại"
            required
          />
          <div className="invalid-feedback">{errors.phone_number?.message}</div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Mật khẩu :
          </label>
          <div className="password-input-container">
            <input
              {...register("password")}
              className={`form-input ${errors.password ? "is-invalid" : ""}`}
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={toggleShowPassword}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
            <div className="invalid-feedback">{errors.password?.message}</div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="retype_password">
            Nhập lại mật khẩu :
          </label>
          <div className="password-input-container">
            <input
              {...register("retype_password", {
                required: "Vui lòng nhập lại mật khẩu",
                validate: (value) =>
                  value === watch("password") || "Mật khẩu không khớp",
              })}
              className={`form-input ${
                errors.retype_password ? "is-invalid" : ""
              }`}
              type={showRetypePassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={toggleShowRetypePassword}
            >
              <FontAwesomeIcon icon={showRetypePassword ? faEyeSlash : faEye} />
            </button>
            <div className="invalid-feedback">
              {errors.retype_password?.message}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="role_id">
            Vai trò:
          </label>
          <select
            {...register("role_id")}
            className={`form-select ${errors.role_id ? "is-invalid" : ""}`}
            id="role_id"
            defaultValue="1"
          >
            <option value="1">User</option>
          </select>
          <div className="invalid-feedback">{errors.role_id?.message}</div>
        </div>

        <div className="text-end mt-5">
          <button
            type="button"
            className="btn btn-secondary px-4 me-2"
            onClick={() => navigate(-1)}
          >
            Hủy
          </button>
          <button type="submit" className="btn btn-primary px-4">
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
