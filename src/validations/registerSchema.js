import * as yup from "yup";

const hasFiveConsecutiveDigits = (value) => {
  if (!value) return false;
  return /(.)\1{4}/.test(value);
};

export const registerSchema = yup.object().shape({
  fullname: yup.string().required("Họ tên là bắt buộc"),
  phone_number: yup
    .string()
    .matches(
      /^(?!02|01|00)\d{10}$/,
      "Số điện thoại phải có 10 ký tự và không được bắt đầu bằng '02' ,'01' hoặc '00'"
    )
    .test(
      "no-five-consecutive-digits",
      "Số điện thoại không được có 5 số trùng lặp liên tục",
      (value) => !hasFiveConsecutiveDigits(value)
    )
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
