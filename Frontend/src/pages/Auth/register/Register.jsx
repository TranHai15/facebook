import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <>
      <div className="w-full  flex justify-center items-center h-screen">
        <div className=" min-w-[20rem] w-full  max-w-[32rem] p-6  bg-white  rounded-sm shadow-2xl">
          <h1 className="text-center font-extrabold ">REGISTER</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="">
            <div className="mt-7 mb-5">
              <label htmlFor="fullname" className="block font-medium mb-1">
                Họ Và Tên
              </label>
              <input
                className="w-full  px-3 py-3  rounded-[10px] shadow outline-none "
                type="text"
                id="fullname"
                {...register("fullname", {
                  required: "Vui lòng nhập name",
                  minLength: {
                    value: 4,
                    message: "Vui lòng nhập name dài hơn 4 ký tự"
                  }
                })}
                placeholder="Vui Lòng nhập name"
              />
              {errors.fullname && (
                <p className="text-red-600 pl-2 text-[12px] mt-2">
                  {errors.fullname.message}
                </p>
              )}
            </div>
            <div className="mt-7 mb-5">
              <label htmlFor="email" className="block font-medium mb-1">
                Email
              </label>
              <input
                className="w-full  px-3 py-3  rounded-[10px] shadow outline-none "
                type="text"
                id="email"
                {...register("email", {
                  required: "Vui lòng nhập email",
                  parent: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" }
                })}
                placeholder="Vui Lòng nhập email"
              />
              {errors.email && (
                <p className="text-red-600 pl-2 text-[12px] mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mt-5 mb-7">
              <label htmlFor="password" className="block font-medium mb-1">
                Password
              </label>
              <input
                className="w-full  px-3 rounded-[10px] shadow outline-none py-3 "
                id="password"
                type="text"
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu",
                  minLength: {
                    value: 5,
                    message: "vui lòng nhập mật khẩu dài hơn 5 ký tư"
                  }
                })}
                placeholder="Vui Lòng Nhập Mật Khẩu"
              />
              {errors.password && (
                <p className="text-red-600 pl-2 text-[12px] mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="w-full flex justify-center mt-14">
              <button
                type="submit"
                className="min-w-[10rem] w-full  max-w-[15rem] font-bold cursor-pointer  items-center p-3 bg-green-500 rounded-2xl"
              >
                Đăng Ký
              </button>
            </div>
            <div>
              <Link
                className="text-amber-300 font-bold ml-3 mt-5 block"
                to={"/login"}
              >
                Đã có tài khoản ?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
