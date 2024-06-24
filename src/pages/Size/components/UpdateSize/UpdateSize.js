import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { createNameSchema } from "../../../../validations/nameSchema";
import { useForm } from "react-hook-form";
import sizesApi from "../../../../apis/sizesApi";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

export default function UpdateSize() {
  const navigate = useNavigate();
  const { id: sizeId } = useParams();
  const [size, setSize] = useState({});
  const [messageError, setMessageError] = useState("");

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createNameSchema),
  });

  useEffect(() => {
    sizesApi.getSizeById(sizeId).then((response) => {
      setSize(response.data.data);
    });
  }, [sizeId]);

  useEffect(() => {
    setValue("name", size.name || ""); // Handle undefined category.name gracefully
  }, [size, setValue]);

  const onSubmit = handleSubmit((data) => {
    sizesApi
      .updateSize(sizeId, data)
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate(-1);
        }
      })
      .catch((error) => {
        setMessageError(error.response.data.message);
      });
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={onSubmit} className="card p-4">
            <h2 className="mb-4">Cập nhật kích thước</h2>
            {messageError && (
              <div className="alert alert-danger" role="alert">
                {messageError}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Kích thước
              </label>
              <input
                {...register("name")}
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                id="name"
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-secondary px-4 me-2"
                onClick={() => navigate(-1)}
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-primary px-5">
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
