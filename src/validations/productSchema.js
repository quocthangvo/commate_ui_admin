import * as yup from "yup";
export const createProductSchema = yup.object({
  name: yup.string().required("Tên sản phẩm là bắt buộc"),
  category_id: yup.string().required("Danh mục là bắt buộc"),
  sizes: yup.string().required("Kích thước là bắt buộc"),
  colors: yup.string().required("Màu sắc là bắt buộc"),
});
