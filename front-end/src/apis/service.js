import instance from "./axios";

export const apiLogin = (data) => {
  return instance.post("/api/users/login", data);
};

export const apiLogout = () => {
  return instance.post("/api/users/logout");
};

export const apiRegister = (data) => {
  return instance.post("/api/users/createuser", data);
};

export const apiGetAcount = () => {
  return instance.get("/api/users/getacount");
};

export const apiSearchUser = (key) => {
  return instance.get(`/api/users/searchuser?key=${key}`);
};

export const apiGetAllUser = (id, type) => {
  return instance.get(
    `/api/conversations/getallconversation?id=${id}&type=${type}`
  );
};

export const apiCreateChat = (data) => {
  return instance.post("/api/conversations/createconversation", data);
};

export const apiDeleteConversion = (id) => {
  return instance.delete(`/api/conversations/deleteconversation/${id}`);
};

export const apiDeleteMess = (idData) => {
  return instance.delete(
    `/api/messenges/deletemessage?id=${idData._id}&conversionid=${idData.conversationId}`
  );
};

export const apiCreateGroupChat = (data) => {
  return instance.post("/api/conversations/creategroupconversation", data);
};

export const apiGetChatById = (id) => {
  return instance.get(`/api/conversations/getconversation/${id}`);
};

export const apiGetMessageId = (id) => {
  return instance.get(`/api/messenges/getmess/${id}`);
};

export const apiSendMess = (data) => {
  return instance.post("/api/messenges/createmessage/", data);
};

export const apiRefreshToken = () => {
  return instance.get(`/api/user/refreshtoken`);
};
