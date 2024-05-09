import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function Room() {
  const { id } = useParams();
  const auth = useSelector(state => state.auth?.user?.fullName)

  const myMeeting = async (element) => {
    const appId = 1757958631;
    const serverSecret = "474cae50897160fe21416980174fe248";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      id,
      Date.now().toString(),
      auth
    );
    
    const zc = ZegoUIKitPrebuilt.create(kitToken);

    zc.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Copy Link",
          url: `http://localhost:3000/zoom/${id}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: true,
    });
  };

  return (
    <div className="h-screen w-full">
      <div ref={myMeeting} className="w-full h-full"></div>
    </div>
  );
}

export default Room;
