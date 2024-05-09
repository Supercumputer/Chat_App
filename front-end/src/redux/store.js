import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth";
import socketReducer from "./socket";
import clientReducer from "./client";

const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
    client: clientReducer,
  },
});

export default store;
