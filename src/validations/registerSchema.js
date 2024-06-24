import * as yup from "yup";

export const registerSchema = yup.object().shape({
  fullname: yup.string().required("Họ tên là bắt buộc"),
  phone_number: yup
    .string()
    .length(10, "Số điện thoại phải có 10 ký tự")
    .required("Số điện thoại là bắt buộc"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu là bắt buộc"),
  retype_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Mật khẩu không khớp")
    .required("Vui lòng nhập lại mật khẩu"),
  role_id: yup.string().required(),
});
