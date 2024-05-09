import React from "react";
import Tippy from "@tippyjs/react/headless"; // different import path!
import "tippy.js/dist/tippy.css";
import { StringContent } from "components";
import { apiDeleteMess } from "apis/service";
import { useDispatch } from "react-redux";
import { messNew2 } from "../redux/socket";

const HeadlessTippy = ({ children, vitri, data, auth }) => {
  const dispatch = useDispatch()
  const handerDeleteMess = async () => {
    try {
      const res = await apiDeleteMess(data);
      if(res){
        dispatch(messNew2(res));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Tippy
      interactive={true}
      placement={vitri === "left" ? "right" : "left"}
      render={(attrs) => (
        <div className="box" tabIndex="-1" {...attrs}>
          <div className={`bg-[#F0F0F0] py-1 px-2 rounded-md text-gray-700 flex gap-1 items-center ${(data.deleted === true ||  auth !== data?.senderId?._id) && 'hidden'}`}>
            <StringContent title={"Bày tỏ cảm xúc"}>
              <i className="fa-solid fa-face-smile hover:text-blue-700"></i>
            </StringContent>

            <StringContent title={"Trả lời"}>
              <i className="fa-solid fa-reply-all p-1 hover:text-blue-700"></i>
            </StringContent>

            <StringContent title={"Xóa"}>
              <i
                className="fa-solid fa-trash p-1 hover:text-blue-700"
                onClick={handerDeleteMess}
              ></i>
            </StringContent>
          </div>
        </div>
      )}
    >
      <span>{children}</span>
    </Tippy>
  );
};

export default HeadlessTippy;
