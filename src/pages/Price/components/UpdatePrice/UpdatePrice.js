import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import pricesApi from "../../../../apis/pricesApi";

export default function UpdatePrice() {
  const navigate = useNavigate();
  const { id: priceId } = useParams();
  const [price, setPrice] = useState({});
  const [messageError, setMessageError] = useState("");

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    pricesApi.getPriceById(priceId).then((response) => {
      setPrice(response.data.data);
    });
  }, [priceId]);

  useEffect(() => {
    if (price) {
      setValue("price_selling", price.price_selling || "");
      setValue("promotion_price", price.promotion_price || "");
    }
  }, [price, setValue]);

  const onSubmit = handleSubmit((data) => {
    const updatedData = {
      price_selling: data.price_selling || undefined,
      promotion_price: data.promotion_price || undefined,
    };

    pricesApi
      .updatePrice(priceId, updatedData)
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate(-1);
        }
      })
      .catch((error) => {
        setMessageError(error.response?.data?.message || "Có lỗi xảy ra!");
      });
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={onSubmit} className="card p-4">
            <h2 className="mb-4">Cập nhật giá</h2>
            {messageError && (
              <div className="alert alert-danger" role="alert">
                {messageError}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="price_selling" className="form-label">
                Giá bán
              </label>
              <input
                {...register("price_selling")}
                type="number"
                className={`form-control ${
                  errors.price_selling ? "is-invalid" : ""
                }`}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="promotion_price" className="form-label">
                Giá khuyến mãi
              </label>
              <input
                {...register("promotion_price")}
                type="number"
                className={`form-control ${
                  errors.promotion_price ? "is-invalid" : ""
                }`}
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
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
