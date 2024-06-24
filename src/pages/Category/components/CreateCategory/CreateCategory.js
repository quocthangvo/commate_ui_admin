import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import categoriesApi from "../../../../apis/categoriesApi";
import { createNameSchema } from "../../../../validations/nameSchema";
import "../../../../css/CreateProduct.css";

export default function CreateCategory() {
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
    categoriesApi
      .createCategory(data)
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
      <Link className="btn btn-link " onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} className="icon-size " />
      </Link>
      <form className="form-container" onSubmit={onSubmit}>
        <h2 className="form-header">Thêm danh mục</h2>
        {messageError && (
          <div className="alert alert-danger" role="alert">
            {messageError}
          </div>
        )}
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Tên danh mục:
          </label>
          <input
            {...register("name")}
            className="form-input"
            type="text"
            id="name"
            placeholder="Nhập tên sản phẩm"
            required
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>
        <div className="text-end mt-5">
          <button
            type="button"
            className="btn btn-secondary px-4 me-2"
            onClick={() => navigate(-1)}
          >
            Hủy
          </button>
          <button type="submit" className="btn btn-primary  px-5">
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
