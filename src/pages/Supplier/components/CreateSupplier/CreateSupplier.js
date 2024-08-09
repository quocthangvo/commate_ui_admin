import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import "../../../../css/Create.css";
import { createNameSchema } from "../../../../validations/nameSchema";
import suppliersApi from "../../../../apis/suppliersApi";

export default function CreateSize() {
  const navigate = useNavigate();

  const [messageError, setMessageError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createNameSchema),
  });

  const onSubmit = handleSubmit((data) => {
    suppliersApi
      .createSupplier(data)
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
  useEffect(() => {
    if (messageError) {
      const timer = setTimeout(() => {
        setMessageError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messageError]);

  return (
    <div>
      <Link className="btn btn-link " onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} className="icon-size " />
      </Link>
      <form className="form-container" onSubmit={onSubmit}>
        <h2 className="form-header">Thêm nhà cung cấp</h2>
        {messageError && (
          <div className="alert alert-danger" role="alert">
            {messageError}
          </div>
        )}
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Nhà cung cấp:
          </label>
          <input
            {...register("name")}
            className="form-input"
            type="text"
            placeholder="Nhập nhà cung cấp"
            required
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="address">
            Địa chỉ:
          </label>
          <input
            {...register("address")}
            className="form-input"
            type="text"
            placeholder="Địa chỉ"
            required
          />
          <div className="invalid-feedback">{errors.address?.message}</div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="phone_number">
            Số điện thoại:
          </label>
          <input
            {...register("phone_number")}
            className="form-input"
            type="text"
            placeholder="Nhập số điện thoại"
            required
          />
          <div className="invalid-feedback">{errors.phone_number?.message}</div>
        </div>

        <div className="text-end mt-5">
          <button
            type="button"
            className="btn btn-secondary px-4 me-2"
            onClick={() => navigate(-1)}
          >
            Hủy
          </button>
          <button type="submit" className="btn btn-primary px-5">
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
