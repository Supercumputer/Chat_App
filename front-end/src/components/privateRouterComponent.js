import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingComponent from "./loadingComponent.js";
import { useSelector, useDispatch } from "react-redux";
import { userOnline, newMess } from "../redux/socket.js";
import { io } from "socket.io-client";
import { apiGetAcount } from "apis/service.js";
import { login } from "../redux/auth.js";


const PrivateRouterComponent = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (auth?.user) {
      const socket = io("http://localhost:3001", {
        query: {
          userId: auth.user._id,
        },
      });

      socket.on("getOnlineUsers", (users) => {
        dispatch(userOnline(users));
      });

      socket.on("newMessage", (message) => {
        message.shouldShake = true;
        dispatch(newMess(message));
      });

      return () => socket.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.user]);

  useEffect(() => {
    callApi();
  }, []);

  const callApi = async () => {
    try {
      setLoading(true);
      const res = await apiGetAcount();

      if (res && res.status) {
        dispatch(login(res.userData));
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <LoadingComponent type="spin" color="#357EDD" />
  ) : auth.isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRouterComponent;
