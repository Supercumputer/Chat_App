import { TippyHeadless } from "components";
import ImageComponent from "./imageComponent";
import moment from "moment";

const MessengerComponent = ({ data, auth }) => {
  const timeDifference = moment().diff(moment(data.createdAt), "minutes");
  let timeAgo = "";

  if (timeDifference < 60) {
    timeAgo = `${timeDifference} phút trước`;
  } else if (timeDifference < 1440) {
    timeAgo = `${Math.floor(timeDifference / 60)} giờ trước`;
  } else {
    timeAgo = `${Math.floor(timeDifference / 1440)} ngày trước`;
  }

  return (
    <div
      className={`flex gap-2 mb-2 ${
        auth !== data?.senderId?._id ? "justify-start" : "justify-end"
      }`}
    >
      {auth !== data?.senderId?._id && (
        <ImageComponent
          src={data?.senderId?.avatar}
          className="w-10 h-10 border-2 object-cover rounded-full"
        />
      )}
      <TippyHeadless
        vitri={auth !== data?.senderId?._id ? "left" : "right"}
        data={data}
        auth={auth}
      >
        <div className="flex flex-col">
          {data.deleted === true ? (
            <span
              className={
                "rounded-md max-w-[400px] p-2 text-[#050505] border-2"
              }
            >
              Tin nhắn đã được thu hồi
            </span>
          ) : data.type === "text" ? (
            <span
              className={`rounded-md max-w-[400px] p-2 ${
                auth !== data?.senderId?._id
                  ? "bg-[#F0F0F0] text-[#050505]"
                  : "bg-blue-500 text-[#fff]"
              }`}
            >
              {data.content}
            </span>
          ) : (
            <div
              className={`rounded-md max-w-[400px] p-2 ${
                auth !== data?.senderId?._id
                  ? "bg-[#F0F0F0] text-[#050505]"
                  : "bg-blue-500 text-[#fff]"
              }`}
            >
              {data.content.split(",")[0] !== "" && (
                <span className="mb-2 block">{data.content.split(",")[0]}</span>
              )}

              <div className={"grid grid-cols-auto-fit-100 gap-1"}>
                {data.content
                  .split(",")
                  .slice(1)
                  .map((item) => {
                    return (
                      <div
                        className={`${
                          data.content.split(",").slice(1).length > 1
                            ? "max-h-[200px]"
                            : "max-h-[400px]"
                        } overflow-hidden`}
                      >
                        <img src={item} alt="" className="object-cover" />
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          {/* {data.type === "text" ? (
            <span
              className={`rounded-md max-w-[400px] p-2 ${
                auth !== data?.senderId?._id
                  ? "bg-[#F0F0F0] text-[#050505]"
                  : "bg-blue-500 text-[#fff]"
              }`}
            >
              {data.content}
            </span>
          ) : (
            <div
              className={`rounded-md max-w-[400px] p-2 ${
                auth !== data?.senderId?._id
                  ? "bg-[#F0F0F0] text-[#050505]"
                  : "bg-blue-500 text-[#fff]"
              }`}
            >
              {data.content.split(",")[0] !== "" && (
                <span className="mb-2 block">{data.content.split(",")[0]}</span>
              )}

              <div className={"grid grid-cols-auto-fit-100 gap-1"}>
                {data.content
                  .split(",")
                  .slice(1)
                  .map((item) => {
                    return (
                      <div
                        className={`${
                          data.content.split(",").slice(1).length > 1
                            ? "max-h-[200px]"
                            : "max-h-[400px]"
                        } overflow-hidden`}
                      >
                        <img src={item} alt="" className="object-cover" />
                      </div>
                    );
                  })}
              </div>
            </div>
          )} */}
          <span className="text-xs text-gray-500">
            {timeDifference > 0 ? timeAgo : ""}
          </span>
        </div>
      </TippyHeadless>
    </div>
  );
};

export default MessengerComponent;
