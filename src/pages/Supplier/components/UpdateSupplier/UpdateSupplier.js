import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import suppliersApi from "../../../../apis/suppliersApi";

export default function UpdateSize() {
  const navigate = useNavigate();
  const { id: supplierId } = useParams();
  const [supplier, setSupplier] = useState({});
  const [messageError, setMessageError] = useState("");

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    suppliersApi.getSupplierById(supplierId).then((response) => {
      setSupplier(response.data.data);
    });
  }, [supplierId]);

  useEffect(() => {
    setValue("name", supplier?.name || "");
    setValue("phoneNumber", supplier?.phoneNumber || "");
    setValue("address", supplier?.address || ""); // Handle undefined category.name gracefully
  }, [supplier, setValue]);

  const onSubmit = handleSubmit((data) => {
    suppliersApi
      .updateSupplier(supplierId, data)
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
            <h2 className="mb-4">Cập nhật nhà cung cấp</h2>
            {messageError && (
              <div className="alert alert-danger" role="alert">
                {messageError}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nhà cung cấp
              </label>
              <input
                {...register("name")}
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Số điện thoại
              </label>
              <input
                {...register("phoneNumber")}
                type="text"
                className={`form-control ${
                  errors.phoneNumber ? "is-invalid" : ""
                }`}
              />
              {errors.name && (
                <div className="invalid-feedback">
                  {errors.phone_number.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Địa chỉ
              </label>
              <input
                {...register("address")}
                type="text"
                className={`form-control ${errors.address ? "is-invalid" : ""}`}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.address.message}</div>
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
