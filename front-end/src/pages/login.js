import { Link, useNavigate } from "react-router-dom";
import { InputComponent } from "components";
import { useEffect, useState } from "react";
import urls from "ultils/urlPage";
import { apiLogin } from "apis/service.js";
import { toast } from "react-toastify";
import { isEmail, isPassWord } from "ultils/regex";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/auth";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (auth) {
      navigate(`/${urls.messagers}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const obj = {
    email: "",
    passWord: "",
  };

  const valid = {
    isValidEmail: false,
    isValidPass: false,
  };

  const [value, setValue] = useState(obj);
  const [validation, setValidation] = useState(valid);

  const callApiLogin = async () => {
    try {
      const res = await apiLogin(value);
      if (res && res.status) {
        dispatch(login(res.userData));
        localStorage.setItem("jwt", res.accessToken);
        toast.success(res.message);
        navigate(`/${urls.messagers}`);
      } else {
        toast.warn(res.message);
      }
    } catch (error) {
      toast.warn(error);
    }
  };

  const handlerLogin = () => {
    setValidation(valid);

    if (!value.email && !value.passWord) {
      setValidation((pre) => ({
        ...pre,
        isValidEmail: true,
        isValidPass: true,
      }));
    } else if (!isEmail(value.email)) {
      setValidation((pre) => ({ ...pre, isValidEmail: true }));
    } else if (!isPassWord(value.passWord)) {
      setValidation((pre) => ({ ...pre, isValidPass: true }));
    } else {
      callApiLogin();
    }
  };

  return (
    <div>
      <form className="bg-white p-6 w-96 rounded-md shadow-md">
        <p className="mb-4 text-center text-blue-500 font-bold text-lg">
          Messenger
        </p>
        <InputComponent
          value={value.email}
          placeholder="Email"
          setValue={setValue}
          nameKey="email"
          error={validation.isValidEmail}
        />
        <InputComponent
          value={value.passWord}
          placeholder="Password"
          setValue={setValue}
          nameKey="passWord"
          error={validation.isValidPass}
        />

        <button
          type="button"
          className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-bold w-full my-2"
          onClick={handlerLogin}
        >
          Log In
        </button>
        <Link href="#" className="block text-center text-blue-500 text-sm pt-2">
          Forgot Password ?
        </Link>
        <hr className="bg-gray-200 my-2" />
        <Link
          to={`/${urls.register}`}
          className="bg-green-500 block text-center text-white py-2 px-4 rounded-md text-sm font-bold w-full mt-2"
        >
          Create New Account
        </Link>
      </form>
    </div>
  );
};

export default Login;
