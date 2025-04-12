import React from "react";

export default function Search({ item, handleClose }) {
  return (
    <div className="w-full h-full my-1">
      <div className="p-3 flex gap-1 items-center justify-between">
        <div className="Image__Search flex-[1]">
          <img
            className=" w-10 rounded-4xl"
            src="https://media.istockphoto.com/id/507452169/vi/vec-to/bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-th%E1%BB%9Di-gian.jpg?s=2048x2048&w=is&k=20&c=ZlDYYG_2tGAlpxRPwDGNZ94_XHXD_qr1hrwmw8GdKzk="
            alt="Message"
          />
        </div>
        <div className="Title flex-[4] text-black">
          <p>{item.title}</p>
        </div>
        <div
          className="Coles flex-[1] text-black py-2 text-center cursor-pointer hover:bg-gray-200 rounded-2xl"
          onClick={() => handleClose(item.id)}
        >
          x
        </div>
      </div>
    </div>
  );
}
