import { DefaultLayout, LogRegisterLayout, ZoomLayout } from "../layouts";
import {
  Login,
  Register,
  Home,
  PageNotFound,
  VideoCall,
  Room,
  Zoom,
} from "../pages";
import urls from "ultils/urlPage";

const publicRouter = [
  {
    path: urls.login,
    component: Login,
    layout: LogRegisterLayout,
  },
  {
    path: urls.register,
    component: Register,
    layout: LogRegisterLayout,
  },
];

const privateRouter = [
  {
    path: `/${urls.home}*`,
    component: PageNotFound,
  },
  {
    path: `/${urls.home}`,
    component: PageNotFound,
  },

  {
    path: `/${urls.messagers}`,
    component: Home,
    layout: DefaultLayout,
  },
  {
    path: `/${urls.messagers}/:id`,
    component: Home,
    layout: DefaultLayout,
  },
  {
    path: `/${urls.groupMessager}`,
    component: Home,
    layout: DefaultLayout,
  },
  {
    path: `/${urls.groupMessager}/:id`,
    component: Home,
    layout: DefaultLayout,
  },
  {
    path: `/${urls.videoCall}`,
    component: VideoCall,
  },
  {
    path: `/${urls.zoom}`,
    component: Room,
    layout: ZoomLayout,
  },
  {
    path: `/${urls.zoom}/:id`,
    component: Zoom,
    layout: ZoomLayout,
  },
];

export { publicRouter, privateRouter };
