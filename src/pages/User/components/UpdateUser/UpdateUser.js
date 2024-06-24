import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import usersApi from "../../../../apis/usersApi";

export default function UpdateUser() {
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const [user, setUser] = useState({});
  const [messageError, setMessageError] = useState("");

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    usersApi.getUserById(userId).then((response) => {
      console.log(response.data);
      setUser(response.data.data);
    });
  }, [userId]);

  useEffect(() => {
    setValue("fullName", user.full_name || "");
    setValue("phoneNumber", user.phone_number || "");
    setValue("status", user.status);
  }, [user, setValue]);

  const onSubmit = handleSubmit(() => {
    usersApi
      .unlockUser(userId)
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
            <h2 className="mb-4">Mở khóa tài khoản</h2>
            {messageError && (
              <div className="alert alert-danger" role="alert">
                {messageError}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Tên
              </label>
              <input
                {...register("fullName")}
                type="text"
                className={`form-control ${
                  errors.fullName ? "is-invalid" : ""
                }`}
              />
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
            </div>
            <div className="mb-3">
              <label htmlFor="status" className="form-label">
                Trạng thái
              </label>
              <input
                {...register("status")}
                type="text"
                className={`form-control ${errors.status ? "is-invalid" : ""}`}
              />
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
                Mở khóa
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
