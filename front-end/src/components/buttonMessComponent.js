import { NavLink } from "react-router-dom";
import urls from "ultils/urlPage";
import { group } from "assets/images";

const ButtonMessComponent = ({ online, item, user, path }) => {
  
  const newUser = item.participants.filter((ite) => ite._id !== user);

  const onlines = newUser.some((it) => online.userOnline.includes(it._id));

  return (
    <NavLink
      to={`/${path === "messagers" ? urls.messagers : urls.groupMessager}/${
        item._id
      }`}
      className={({ isActive }) =>
        `flex gap-2 items-center m-2 rounded-md p-1 ${
          isActive
            ? "bg-blue-500 text-[#fff]"
            : "text-[#353434] hover:bg-blue-500 hover:text-[#fff]"
        }`
      }
    >
      <div
        className={`relative flex-shrink-0 ${
          onlines
            ? "before:content-[''] before:block before:p-1 before:bg-[#31A24C] before:absolute before:bottom-0 before:right-1 before:border-2 before:rounded-full"
            : ""
        }`}
      >
        <img
          src={
            item?.type === "private" ? newUser[0].avatar : item.avatar || group
          }
          alt=""
          className="w-10 h-10 border-2 object-cover rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <h2 className="font-semibold text-nowrap">
          {item?.type === "private" ? newUser[0].fullName : item.name}
        </h2>
        <span className="text-xs title">
          {item?.lastMessage?.type === "image"
            ? item.lastMessage.content.split(",")[0] !== ""
              ? item.lastMessage.content.split(",")[0]
              : `${
                  item.lastMessage.content.split(",").slice(1).length
                } file ảnh`
            : item?.lastMessage?.content || "Chờ bạn kết nối"}
        </span>
      </div>
    </NavLink>
  );
};

export default ButtonMessComponent;
