import React, { useContext } from "react";
import AuthContext from "../../../../contexts/Auth/AuthContext";

export default function InfoAccount() {
  const { handleLogout, user } = useContext(AuthContext);
  const handleProfile = () => {
    window.location.href = `/profile/${user?.id}`;
  };

  return (
    <div className="w-full h-full  px-5 pt-3 pb-5 bg-white ">
      <div className=" h-[250px] px-3 pt-2 shadow-2xl rounded-2xl ">
        <div
          className="flex text-black items-center justify-start cursor-pointer border-b-2 pb-2 hover:bg-gray-100"
          onClick={handleProfile}
        >
          <span className="font-bold px-3 py-2  rounded-2xl">
            <img
              className="w-10 h-10 object-cover rounded-3xl"
              src={
                import.meta.env.VITE_API_BACKEND + "/" + user?.avatar ||
                "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"
              }
              alt="Profile"
            />
          </span>
          <span className="font-bold px-3 py-2 rounded-2xl ">
            {user?.username || "Loi"}
          </span>
        </div>
        <div className="mt-3">
          <div
            className="flex text-black items-center justify-start cursor-pointer hover:bg-gray-100"
            onClick={handleLogout}
          >
            <span className="font-bold px-3 py-2  rounded-2xl">
              <img
                className="w-6 object-contain rounded-3xl"
                src={`${
                  import.meta.env.VITE_API_FRONTEND
                }/src/assets/icons/right-from-bracket-solid.svg`}
                alt="Profile"
              />
            </span>
            <span className="font-bold px-3 py-2 rounded-2xl ">Đăng Xuất</span>
          </div>
        </div>
      </div>
    </div>
  );
}
