import { ImageComponent } from "components";
import { useEffect, useRef, useState } from "react";
function VideoCall() {
  const localVideoRef = useRef(null);
  const localVideoRef1 = useRef(null);
  const [mic, setMic] = useState(true);
  const [video, setVideo] = useState(true);
  
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: video, audio: mic })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        localVideoRef1.current.srcObject = stream;
      })
      .catch((error) =>
        console.error("Error accessing media devices: ", error)
      );
  }, [video, mic]);
  return (
    <div className="relative w-screen h-screen bg-blue-500">
      <video
        ref={localVideoRef1}
        className="absolute w-full h-full bg-black rounded-md"
        autoPlay
        muted
      ></video>
      <div className="absolute top-5 left-5 flex gap-2 items-center text-nowrap">
        <ImageComponent
          src={""}
          alt=""
          className="w-10 h-10 border-2 object-cover rounded-full flex-shrink-0"
        />
        <div className="flex flex-col">
          <h2 className="font-bold text-[#fff]">Ho Van Nam</h2>
          <span className="text-xs text-[#fff]">Hoạt động 12 phút trước</span>
        </div>
      </div>
      <div className="absolute right-5 bottom-5">
        <video
          ref={localVideoRef}
          className="w-96 h-56 bg-black rounded-md"
          autoPlay
          muted
        ></video>
      </div>
      <div className="flex gap-2 absolute bottom-5 left-[50%] translate-x-[-50%]">
        <div
          className="w-12 h-12 flex rounded-full bg-[#f0f0f0]"
          onClick={() => setMic(!mic)}
        >
          {mic ? (
            <i className="fa-solid fa-microphone text-[22px] m-auto text-blue-500"></i>
          ) : (
            <i class="fa-solid fa-microphone-slash text-[22px] m-auto "></i>
          )}
        </div>
        <div
          className="w-12 h-12 flex rounded-full bg-[#f0f0f0]"
          onClick={() => setVideo(!video)}
        >
          {video ? (
            <i className="fa-solid fa-video text-[22px] m-auto text-blue-500"></i>
          ) : (
            <i class="fa-solid fa-video-slash text-[22px] m-auto "></i>
          )}
        </div>
        <div className="w-12 h-12 flex rounded-full bg-[#f0f0f0]">
          <i className="fa-solid fa-square-up-right text-[22px] m-auto"></i>
        </div>
      </div>
    </div>
  );
}

export default VideoCall;
