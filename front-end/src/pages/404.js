import { pagenotfound } from "assets/images";

function PageNotFound() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <img
        src={pagenotfound}
        className="w-full h-full object-cover"
        alt=""
      />
    </div>
  );
}

export default PageNotFound;
