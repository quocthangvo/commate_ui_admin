import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import "../../../../css/Create.css";
import { createNameSchema } from "../../../../validations/nameSchema";
import sizesApi from "../../../../apis/sizesApi";

export default function CreateSize({ fetchSizes }) {
  const [messageError, setMessageError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createNameSchema),
  });

  const onSubmit = handleSubmit((data) => {
    sizesApi
      .createSize(data)
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          fetchSizes();
          reset();
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
      {/* <Link className="btn btn-link " onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} className="icon-size " />
      </Link> */}
      <form className="form-container" onSubmit={onSubmit}>
        <h2 className="form-header">Thêm kích thước</h2>
        {messageError && (
          <div className="alert alert-danger" role="alert">
            {messageError}
          </div>
        )}
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Tên kích thước:
          </label>
          <input
            {...register("name")}
            className="form-input"
            type="text"
            id="name"
            placeholder="Nhập kích thước"
            required
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>
        <div className="text-end mt-5">
          {/* <button
            type="button"
            className="btn btn-secondary px-4 me-2"
            onClick={() => navigate(-1)}
          >
            Hủy
          </button> */}
          <button type="submit" className="btn btn-primary px-5">
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
