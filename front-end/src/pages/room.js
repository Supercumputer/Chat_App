import { InputComponent } from "components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import urls from "ultils/urlPage";

function Room() {
  const [room, setRoom] = useState({room: ''});
  const navigate = useNavigate()

  const handlerCreateRoom = () => {
    navigate(`/${urls.zoom}/${room.room}`)
  }

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="p-3 shadow">
        <h1 className="text-center text-xl text-blue-500 font-semibold">
          Room
        </h1>
        <InputComponent
          value={room.room}
          placeholder={"Nhập room id mà bạn muốn tạo."}
          setValue={setRoom}
          nameKey={'room'}
        />
        <button className="px-3 py-1 bg-blue-500 text-white rounded-sm w-full" onClick={handlerCreateRoom}>
          Join Room
        </button>
      </div>
    </div>
  );
}

export default Room;
