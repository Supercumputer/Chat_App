import { ImageComponent, Debounce } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { setHidden } from "../redux/client";
import { useEffect, useState } from "react";
import { apiSearchUser, apiGetAllUser, apiCreateGroupChat } from "apis/service";
import { group } from "assets/images";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import urls from "ultils/urlPage";
import { setConversation } from "../redux/client";

const ModelGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dataState = {
    keyword: "",
    nameGroup: "",
    listUser: [],
    listUserGroup: [],
    selectedUsers: new Set(),
    avatarFile: {},
  };

  const [obj, setObj] = useState(dataState);

  const delayKeySearch = Debounce(obj.keyword, 1000);

  const auth = useSelector((state) => state.auth.user._id);
  const online = useSelector((state) => state.socket);

  const handlerClick = () => {
    dispatch(setHidden());
  };

  useEffect(() => {
    if (delayKeySearch.trim() === "") {
      callApiGetUser();
    } else {
      callApiSearch(delayKeySearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delayKeySearch, online.messNew]);

  useEffect(() => {
    return () => obj.avatarFile && URL.revokeObjectURL(obj.avatarFile.preview);
    // eslint-disable-next-line no-use-before-define
  }, [obj.avatarFile]);

  const callApiSearch = async (delayKeySearch) => {
    try {
      const res = await apiSearchUser(delayKeySearch);
      if (res && res.status) {
        setObj({ ...obj, listUser: res.newData });
      }
    } catch (error) {
      console.log("loi");
    }
  };

  const callApiGetUser = async () => {
    try {
      const res = await apiGetAllUser(auth, "private");
      if (res && res.status) {
        const newData = res.conversations.reduce((acc, item) => {
          const filteredParticipants = item.participants.filter(
            (ite) => ite._id !== auth
          );

          return [...acc, ...filteredParticipants];
        }, []);

        setObj({ ...obj, listUser: newData });
      }
    } catch (error) {
      console.log("loi");
    }
  };

  const handlerCheck = (item) => {
    setObj((pre) => {
      const newSelectedUsers = new Set(pre.selectedUsers);

      if (newSelectedUsers.has(item._id)) {
        newSelectedUsers.delete(item._id);
        const listNewData = obj.listUserGroup.filter(
          (ite) => ite._id !== item._id
        );

        return {
          ...pre,
          listUserGroup: listNewData,
          selectedUsers: newSelectedUsers,
        };
      } else {
        newSelectedUsers.add(item._id);
        return {
          ...pre,
          listUserGroup: [...pre.listUserGroup, item],
          selectedUsers: newSelectedUsers,
        };
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    file.preview = URL.createObjectURL(file);
    setObj((pre) => ({ ...pre, avatarFile: file }));
  };

  const handlerCreateGroup = () => {
    if (
      obj.nameGroup.trim().length > 5 &&
      Array.from(obj.selectedUsers).length >= 2
    ) {
      const formData = new FormData();
      formData.append("name", obj.nameGroup);
      formData.append("userId", Array.from(obj.selectedUsers));
      formData.append("image", obj.avatarFile);

      callApiCreateGroup(formData);
    }
  };

  const callApiCreateGroup = async (data) => {
    try {
      const res = await apiCreateGroupChat(data);
      if (res) {
        toast.success("Tạo nhóm thành công.");
        handlerClick();
        dispatch(setConversation(res));
        navigate(
          `/${
            window.location.pathname.split("/")[1] === "messagers"
              ? urls.messagers
              : urls.groupMessager
          }/${res._id}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
      <div
        className="absolute bg-[#ccc] bg-opacity-50 top-0 left-0 right-0 bottom-0"
        onClick={handlerClick}
      ></div>
      <div className="shadow-md rounded-md w-96 bg-[#fff] z-10">
        <h1 className="border-b px-3 py-2 font-bold text-[18px]">Tạo nhóm</h1>
        <div className="p-3 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div>
              <input
                accept="image/*"
                type="file"
                id="avatar"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="avatar">
                <ImageComponent
                  src={obj.avatarFile.preview || group}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2"
                />
              </label>
            </div>
            <input
              className="flex-1 p-2 bg-transparent outline-none border-b"
              placeholder={"Đặt tên cho nhóm"}
              value={obj.nameGroup}
              onChange={(e) => setObj({ ...obj, nameGroup: e.target.value })}
            />
          </div>

          <div className="rounded-2xl border flex items-center">
            <i className="fa-solid fa-magnifying-glass px-1"></i>
            <input
              type="text"
              className="bg-transparent w-full p-1 outline-none"
              placeholder="Nhập vào tên thành viên cần tìm"
              value={obj.keyword}
              onChange={(e) => setObj({ ...obj, keyword: e.target.value })}
            />
          </div>

          {obj.listUserGroup.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {obj.listUserGroup.map((item) => {
                return (
                  <div className="flex bg-blue-200 items-center p-1 rounded-full justify-between gap-2">
                    <div className="flex gap-2 items-center">
                      <ImageComponent
                        src={item.avatar}
                        className="w-7 h-7 object-cover rounded-full flex-shrink-0 border-2 border-blue-500"
                      />
                      <span className="text-blue-700 font-normal title">
                        {item.fullName}
                      </span>
                    </div>
                    <i
                      class="fa-solid fa-circle-xmark text-blue-700"
                      onClick={() => handlerCheck(item)}
                    ></i>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t">
            <p className="py-2 font-semibold">
              {obj.keyword ? "Kết quả tìm kiếm" : "Trò Chuyện gần đây"}
            </p>
            <div className="h-56 overflow-y-auto">
              {obj.listUser.map((item) => {
                return (
                  <label className="flex items-center gap-2 p-2 hover:bg-blue-500 rounded-md hover:text-[#fff]">
                    <input
                      type="checkbox"
                      checked={obj.selectedUsers.has(item._id)}
                      onChange={() => handlerCheck(item)}
                    />
                    <div className="flex items-center gap-2">
                      <ImageComponent
                        src={item.avatar}
                        className="w-10 h-10 object-cover rounded-full flex-shrink-0"
                      />
                      <p>{item.fullName}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-2 p-2 justify-end border-t">
          <button
            className="py-2 px-4 bg-[#F0F2F5] font-semibold text-[#000] rounded-md"
            onClick={handlerClick}
          >
            Hủy
          </button>
          <button
            className={`py-2 px-4 text-[#fff] rounded-md bg-blue-500 ${
              obj.nameGroup.trim().length > 5 &&
              Array.from(obj.selectedUsers).length >= 2
                ? ""
                : "opacity-50"
            }`}
            onClick={handlerCreateGroup}
          >
            Tạo nhóm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelGroup;
