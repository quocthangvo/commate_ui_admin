import * as Yup from "yup";

export const createPriceSchema = Yup.object().shape({
  // productDetailId: Yup.number().required("ID chi tiết sản phẩm là bắt buộc"),
  //   priceSelling: Yup.number()
  //     .required("Giá bán là bắt buộc")
  //     .positive("Giá bán phải là số dương"),
  //     promotionPrice: Yup.number()
  //       .required("Giá khuyến mãi là bắt buộc")
  //       .positive("Giá khuyến mãi phải là số dương"),
  //   startDate: Yup.date().required("Ngày bắt đầu là bắt buộc"),
  //   endDate: Yup.date()
  //     .required("Ngày kết thúc là bắt buộc")
  //     .min(Yup.ref("startDate"), "Ngày kết thúc phải sau ngày bắt đầu"),
});
