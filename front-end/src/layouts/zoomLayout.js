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

const ZoomLayout = ({ children }) => {
  const [keyword, setKeyword] = useState("");
  const [listUserKey, setListUserKey] = useState([]);
  const [listUser, setListUser] = useState([]);
  const navigate = useNavigate();
  const [hidden, setHiden] = useState(false);
  const delayKeySearch = Debounce(keyword, 1000);
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth.user._id);
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
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default ZoomLayout;
