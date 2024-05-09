import {
  apiGetAllUser,
  apiSearchUser,
  apiCreateChat,
  apiLogout,
} from "apis/service";
import {
  ButtonIconComponent,
  ButtonMessComponent,
  ButtonMessSearchComponent,
  Debounce,
} from "components";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/auth";
import { setHidden } from "../redux/client";
import urls from "ultils/urlPage";

const DefaultLayout = ({ children }) => {
  const [keyword, setKeyword] = useState("");
  const [listUserKey, setListUserKey] = useState([]);
  const [listUser, setListUser] = useState([]);
  const navigate = useNavigate();
  const [hidden, setHiden] = useState(false);
  const delayKeySearch = Debounce(keyword, 1000);
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth?.user?._id);
  const online = useSelector((state) => state.socket);
  const client = useSelector((state) => state.client);

  const path = window.location.pathname.split("/")[1];

  useEffect(() => {
    if (delayKeySearch.trim() === "") {
      callApiGetUser(auth, path);
    } else {
      callApiSearch(delayKeySearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    delayKeySearch,
    online.messNew,
    client.dataNew,
    path,
    client.dataConversation,
    online.messNew2,
  ]);

  const callApiSearch = async (delayKeySearch) => {
    try {
      const res = await apiSearchUser(delayKeySearch);
      if (res && res.status) {
        setListUserKey(res.newData);
      }
    } catch (error) {
      console.log("loi");
    }
  };

  const callApiGetUser = async (id, type) => {
    try {
      const res = await apiGetAllUser(id, type);
      if (res && res.status) {
        setListUser(res.conversations);
      }
    } catch (error) {
      console.log("loi");
    }
  };

  const handlerClick = async (to) => {
    try {
      const res = await apiCreateChat({ to });
      if (res) {
        navigate(`/${urls.messagers}/${res._id}`);
        setKeyword("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlerLogout = async () => {
    try {
      const res = await apiLogout();
      if (res) {
        localStorage.removeItem("jwt");
        dispatch(logout());
        navigate(`/${urls.login}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <div className="hidden sm:block">
        <div className="flex flex-shrink-0 sticky top-0">
          <div className="w-14 bg-white h-screen flex flex-col items-center shadow flex-shrink-0 sticky top-0">
            <div
              className="w-8 h-8 flex mt-2 rounded-md"
              onClick={() => setHiden(!hidden)}
            >
              <i className="fa-solid fa-bars m-auto"></i>
            </div>

            <ButtonIconComponent
              to={urls.messagers}
              icon={"fa-regular fa-comment-dots"}
            />
            <ButtonIconComponent
              to={urls.groupMessager}
              icon={"fa-solid fa-user-group"}
            />
            <ButtonIconComponent to={urls.zoom} icon={"fa-solid fa-video"} />
            <ButtonIconComponent
              to={urls.logout}
              icon={"fa-solid fa-right-from-bracket"}
              onclick={handlerLogout}
            />
          </div>

          <div
            className={`flex-shrink-0 border-r-[1px] overflow-hidden transition-all duration-[.2s] ease-linear ${
              hidden ? "w-0" : "w-64"
            }`}
          >
            <div className="flex justify-between items-center p-3">
              <h2 className="text-md font-bold text-nowrap">Chat app</h2>
              <i
                class="fa-solid fa-user-plus"
                onClick={() => dispatch(setHidden())}
              ></i>
            </div>
            <div className="rounded-2xl border p-1 flex items-center mx-2">
              <i className="fa-solid fa-magnifying-glass px-1"></i>
              <input
                value={keyword}
                type="text"
                className="bg-transparent w-full p-1 outline-none"
                placeholder="search here ..."
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <hr className="mt-2 mb-0 ml-2 mr-2" />
            <div className="h-[630px] overflow-y-auto">
              {keyword
                ? listUserKey.map((item) => (
                    <ButtonMessSearchComponent
                      to={item._id}
                      name={item.fullName}
                      avatar={item.avatar}
                      online={online.userOnline.includes(item._id)}
                      onclick={() => handlerClick(item._id)}
                    />
                  ))
                : listUser.map((item, index) => {
                    return (
                      <ButtonMessComponent
                        key={index}
                        item={item}
                        user={auth}
                        online={online}
                        path={path}
                      />
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default DefaultLayout;
