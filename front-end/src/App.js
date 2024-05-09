import { Fragment, useEffect, useState } from "react";
import { publicRouter, privateRouter } from "./routes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PrivateRouterComponent, ModelGroup } from "./components";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import amthanh from "./assets/sounds/notification.mp3";
import { apiGetAcount } from "apis/service";
import { login } from "./redux/auth";

function App() {
  const messages = useSelector((state) => state.socket.messNew); // Lấy danh sách tin nhắn mới từ Redux state
  const [hasInteracted, setHasInteracted] = useState(false);
  const client = useSelector((state) => state.client);
  const dispatch = useDispatch();

  useEffect(() => {
    if (hasInteracted) {
      const sound = new Audio(amthanh);
      sound.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    callApi();
  }, []);

  const callApi = async () => {
    try {
      const res = await apiGetAcount();

      if (res && res.status) {
        dispatch(login(res.userData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App" onClick={() => setHasInteracted(true)}>
      <BrowserRouter>
        <Routes>
          {publicRouter.map((item) => {
            let Layout;
            const Component = item.component;
            if (item.layout) {
              Layout = item.layout;
            } else {
              Layout = Fragment;
            }
            return (
              <Route
                key={uuidv4()}
                path={item.path}
                element={
                  <Layout>
                    <Component />
                  </Layout>
                }
              />
            );
          })}

          <Route path="/" element={<PrivateRouterComponent />}>
            {privateRouter.map((item, index) => {
              let Layout;
              const Component = item.component;
              if (item.layout) {
                Layout = item.layout;
              } else {
                Layout = Fragment;
              }
              return (
                <Route
                  key={uuidv4()}
                  path={item.path}
                  element={
                    <Layout>
                      <Component />
                    </Layout>
                  }
                />
              );
            })}
          </Route>
        </Routes>
        {client.hidden && <ModelGroup />}
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
