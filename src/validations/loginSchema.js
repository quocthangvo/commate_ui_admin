import * as yup from "yup";

export const loginSchema = yup.object().shape({
  phone_number: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ"), // Định dạng số điện thoại có thể thay đổi tùy theo yêu cầu của bạn
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"), // Thay đổi theo độ dài mật khẩu yêu cầu
});
