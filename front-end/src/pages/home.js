import {
  apiDeleteConversion,
  apiGetChatById,
  apiGetMessageId,
  apiSendMess,
} from "apis/service";
import {
  ImageComponent,
  MessengerComponent,
  LoadingComponent,
} from "components";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messDataNew } from "../redux/client";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { group } from "assets/images";
import urls from "ultils/urlPage";
import { messNew2 } from "../redux/socket";

const Home = () => {
  const [hiden, setHiden] = useState(true);
  const [chatText, setChatText] = useState([]);
  const [dataGr, setDataGr] = useState({});
  const [contens, setContens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [content, setContent] = useState("");
  const [first, setFirst] = useState(true);
  const messageEndRef = useRef(null);

  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth?.user?._id);
  const mess = useSelector((state) => state.socket.messNew);
  const mess2 = useSelector((state) => state.socket.messNew2);

  const { id = "" } = useParams();

  const itemInput = useRef();

  useEffect(() => {
    callApiChat(id);
    callApiChatMess(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (mess && mess[0]?.conversationId && mess[0]?.conversationId === id) {
      setContens(mess);
    }
    if (mess2 && mess2[0]?.conversationId && mess2[0]?.conversationId === id) {
      setContens(mess2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mess, mess2]);

  useEffect(() => {
    if (first) {
      setFirst(false);
    }

    scrollToBottom();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contens]);

  useEffect(() => {
    // Giải phóng các URL của các đối tượng tệp khi component unmount
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const callApiChat = async (chat) => {
    setLoading(true);
    try {
      const res = await apiGetChatById(chat);
      if (res) {
        const newData = res.conversation.participants.filter(
          (item) => item._id !== auth
        );
        setDataGr(res.conversation);
        setChatText(newData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const callApiChatMess = async (chat) => {
    try {
      setLoading(true);
      const res = await apiGetMessageId(chat);

      if (res) {
        setContens(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const callApiCreateMess = async (data) => {
    setSending(true);
    try {
      const res = await apiSendMess(data);

      if (res) {
        setContens(res);
        dispatch(messDataNew(res));
        // toast.success("Tin nhắn đã được gửi đi thành công.");
        setContent("");
        setFiles([]);
        itemInput.current.focus();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const handlerSendMess = () => {
    if (files.length > 0) {
      const formData = new FormData();
      formData.append("conversationId", id);
      formData.append("senderId", auth);
      formData.append("content", content);
      formData.append("type", "image");

      // Thêm các tệp vào formData
      files.forEach((file, index) => {
        formData.append(`images`, file);
      });

      // console.log(formData);
      callApiCreateMess(formData);
    } else {
      if (!content) {
        toast.warning("Bạn chưa nhập nội dung tin nhắn.");
        return;
      } else {
        const obj = {
          conversationId: id,
          senderId: auth,
          content,
        };
        callApiCreateMess(obj);
      }
    }
  };

  const handlerHiden = () => {
    setHiden(!hiden);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView(first ? { behavior: "smooth" } : {});
  };

  const handlerSendMessEnter = (e) => {
    if (e.key === "Enter") {
      // Gửi request khi nhấn phím Enter
      handlerSendMess();
    }
  };

  const handlerChangeFiles = (e) => {
    const newFiles = e.target.files;
    // Kiểm tra nếu không có tệp được chọn
    if (!newFiles || newFiles.length === 0) return;

    // Lọc ra các tệp mới không trùng lặp với các tệp đã có
    const uniqueFiles = Array.from(newFiles).filter((file) => {
      return !files.some((existingFile) => {
        return (
          existingFile.name === file.name && existingFile.size === file.size
        );
      });
    });

    // Tạo một mảng mới với trường 'preview' được thêm vào mỗi đối tượng tệp không trùng lặp
    const filesWithPreview = uniqueFiles.map((file) => {
      file.preview = URL.createObjectURL(file);
      return file;
    });

    // Thêm các tệp không trùng lặp vào mảng files
    setFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
  };

  const handlerRemoverFile = (data) => {
    URL.revokeObjectURL(data.preview);
    const newImg = files.filter((file) => file.name !== data.name);
    setFiles(newImg);
  };

  const handlerCallVideo = () => {
    navigate(`/${urls.videoCall}`);
  };

  const handlerDeleteConver = async () => {
    try {
      const res = await apiDeleteConversion(dataGr._id);
      if (res) {
        dispatch(messNew2([]));
        navigate(`/${urls.messagers}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <LoadingComponent />
  ) : id !== "" && Object.keys(dataGr).length > 0 ? (
    <div className="flex relative">
      <div className="w-full h-screen flex flex-col">
        <div className="flex justify-between shadow-md items-center bg-[#fff] p-2 sticky top-0">
          <div className="flex items-center">
            <i class="fa-solid fa-angle-left text-[20px] p-2 sm:hidden block"></i>
            <div className="flex gap-2 items-center text-nowrap">
              <img
                src={
                  dataGr.type === "group"
                    ? dataGr.avatar || group
                    : chatText[0]?.avatar
                }
                alt=""
                className="w-10 h-10 border-2 object-cover rounded-full flex-shrink-0"
              />
              <div className="flex flex-col">
                <h2 className="font-bold">
                  {dataGr.type === "group"
                    ? dataGr.name
                    : chatText[0]?.fullName}
                </h2>
                <span className="text-xs">Hoạt động 12 phút trước</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-center text-blue-500 pr-2">
            <i
              className="fa-solid fa-video p-2 text-[18px]"
              onClick={handlerCallVideo}
            ></i>
            <i className="fa-solid fa-phone p-2 text-[18px]"></i>
            <div onClick={handlerHiden}>
              <i className="fa-solid fa-circle-info p-2 text-[18px]"></i>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2 mt-3">
            <div className="flex flex-col items-center mb-5">
              <ImageComponent
                src={
                  dataGr.type === "group"
                    ? dataGr.avatar || group
                    : chatText[0]?.avatar
                }
                className="w-20 h-20 object-cover rounded-full border-2"
              />
              <h1 className="font-semibold text-[18px]">
                {dataGr.type === "group" ? dataGr.name : chatText[0]?.fullName}
              </h1>
              <span className="text-sm text-gray-600">Facebook</span>
              <span className="text-sm text-gray-600">
                Các bạn là bạn bè trên Facebook
              </span>
            </div>

            {Array.isArray(contens) &&
              contens.map((item) => {
                return (
                  <MessengerComponent key={item._id} data={item} auth={auth} />
                );
              })}
            <div ref={messageEndRef} />
          </div>
        </div>

        <div className="sticky bottom-0 border-t-[1px] p-3 bg-[#fff]">
          {files.length > 0 && (
            <div className="flex items-center gap-2 pb-3">
              {files.map((item) => {
                return (
                  <div className="w-24 relative">
                    <i
                      className="fa-solid fa-circle-xmark absolute right-[-5px] top-[-5px] text-blue-500"
                      onClick={() => handlerRemoverFile(item)}
                    ></i>
                    <img
                      src={item.preview}
                      alt=""
                      className="object-cover rounded-md border-2"
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex items-center gap-3">
            <input
              type="file"
              multiple
              id="files"
              className="hidden"
              onChange={handlerChangeFiles}
            />
            <label htmlFor="files">
              <i class="fa-solid fa-image text-[20px] text-blue-500 cursor-pointer"></i>
            </label>
            <div className="flex items-center bg-[#F0F2F5] rounded-xl px-2 py-1 w-full">
              <input
                ref={itemInput}
                type="text"
                className="outline-none pr-2 w-full bg-transparent"
                placeholder="Nhập nội dung tin nhắn ở đây ..."
                onChange={(e) => setContent(e.target.value)}
                value={content}
                onKeyDown={handlerSendMessEnter}
              />
              <i class="fa-solid fa-face-smile text-[20px] text-blue-500 cursor-pointer"></i>
            </div>
            {sending ? (
              <i className="fa-solid fa-spinner animate-spin transform rotate-[360] transition duration-1000"></i>
            ) : (
              <i
                class="fa-solid fa-paper-plane text-[20px] text-blue-500 cursor-pointer"
                onClick={handlerSendMess}
              ></i>
            )}
          </div>
        </div>
      </div>

      <div
        className={`h-screen shadow-md bg-[#fff] flex-shrink-0 overflow-hidden lg:sticky absolute top-0 right-0 transition-all text-nowrap duration-[.2s] ease-linear ${
          hiden ? "w-0" : "sm:w-80 w-full"
        }`}
      >
        <div className="flex items-center justify-between py-4 px-3">
          <h2 className="text-md font-bold">Contact infor</h2>
          <i
            class="fa-solid fa-xmark lg:hidden block"
            onClick={() => setHiden(!hiden)}
          ></i>
        </div>
        <hr className="mb-2" />
        <div className="box_avatar p-2">
          <ImageComponent
            src={
              dataGr.type === "group"
                ? dataGr.avatar || group
                : chatText[0]?.avatar
            }
            className="w-20 h-20 object-cover rounded-full border-2 mx-auto mb-2"
          />
          <h2 className="text-md text-center font-bold">
            {dataGr.type === "group" ? dataGr.name : chatText[0]?.fullName}
          </h2>
          <span className="text-xs text-center block">
            Hoạt động 12 phút trước
          </span>
          <div className="flex gap-4 justify-center items-center text-blue-500 p-2">
            <i className="fa-solid fa-video p-2 text-18px]"></i>
            <i className="fa-solid fa-phone p-2 text-18px]"></i>
          </div>
          <hr />
        </div>

        <div className="box_history px-2">
          <div className="flex items-center justify-between">
            <b>Media, link, Doc</b>
            <i className="fa-solid fa-chevron-right"></i>
          </div>
          <div className="flex gap-2 my-1">
            
            <ImageComponent
              src={""}
              className="w-20 h-14 object-cover rounded-sm"
            />
            <ImageComponent
              src={""}
              className="w-20 h-14 object-cover rounded-sm"
            />
            <ImageComponent
              src={""}
              className="w-20 h-14 object-cover rounded-sm"
            />
          </div>
          <hr className="my-2" />
        </div>

        <div className="box_bell px-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold">
              <i className="fa-regular fa-bell pr-2"></i>Tắt thông báo
            </p>
            <i className="fa-solid fa-chevron-right"></i>
          </div>
          <hr className="my-2" />
        </div>

        <div className="flex px-2 justify-center gap-2 text-blue-600">
          <div className="flex items-center border-2 border-blue-600 px-2 py-1 gap-2 rounded-md cursor-pointer">
            <i className="fa-solid fa-ban"></i>
            <span className="font-semibold">Block</span>
          </div>

          <div
            className="flex items-center border-2 border-blue-500 px-2 py-1 gap-2 hover:bg-blue-500 hover:text-white rounded-md cursor-pointer"
            onClick={handlerDeleteConver}
          >
            <i class="fa-solid fa-trash"></i>
            <span className="font-semibold">Delete</span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen flex-col">
      <i className="fa-regular fa-comment-dots text-[60px]"></i>
      <p className="text-[20px]">Chưa chọn đoạn chat nào</p>
    </div>
  );
};

export default Home;
