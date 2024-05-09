import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputComponent } from "components";
import { useState, useEffect } from "react";
import { apiRegister } from "apis/service";
import { toast } from "react-toastify";
import urls from "ultils/urlPage";
import { isEmail, isPassWord, isPhoneNumber } from "ultils/regex";
import { useSelector } from "react-redux";

const Register = () => {
  const obj = {
    fullName: "",
    email: "",
    phone: "",
    passWord: "",
    accuracy: "",
  };

  const valid = {
    isValidFullName: false,
    isValidEmail: false,
    isValidPassWord: false,
    isValidPhone: false,
    isValidAccuracy: false,
  };

  const [validation, setValidation] = useState(valid);

  const [value, setValue] = useState(obj);
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (auth) {
      navigate(`/${urls.messagers}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const callApiRegistter = async () => {
    try {
      const { accuracy, ...data } = value;
      const res = await apiRegister({ ...data });
      if (res && res.status) {
        toast.success(res.message);
        navigate(`/${urls.login}`);
      } else {
        toast.success(res.message);
      }
    } catch (error) {
      toast.success(error);
    }
  };

  const handlerRegister = () => {
    setValidation(valid);

    if (value.fullName.trim() === "") {
      setValidation((vali) => ({ ...vali, isValidFullName: true }));
      return;
    }

    if (value.email.trim() === "") {
      setValidation((vali) => ({ ...vali, isValidEmail: true }));
      return;
    } else if (!isEmail(value.email)) {
      setValidation((vali) => ({ ...vali, isValidEmail: true }));
      return;
    }

    if (value.passWord.trim() === "") {
      setValidation((vali) => ({ ...vali, isValidPassWord: true }));
      return;
    } else if (!isPassWord(value.passWord)) {
      setValidation((vali) => ({ ...vali, isValidPassWord: true }));
      return;
    }

    if (value.accuracy.trim() === "") {
      setValidation((vali) => ({ ...vali, isValidAccuracy: true }));
      return;
    } else if (value.accuracy !== value.passWord) {
      setValidation((vali) => ({ ...vali, isValidAccuracy: true }));
      return;
    }

    if (value.phone === "") {
      setValidation((vali) => ({ ...vali, isValidPhone: true }));
      return;
    } else if (!isPhoneNumber(value.phone)) {
      setValidation((vali) => ({ ...vali, isValidPhone: true }));
      return;
    }

    callApiRegistter();
  };

  return (
    <div>
      <form className="bg-white p-6 w-96 rounded-md shadow-md">
        <p className="mb-4 text-center text-blue-500 font-bold text-xl">
          Register
        </p>
        {/* <div className="flex gap-2">
          <InputComponent
            value={value.firstName}
            placeholder="Frist name"
            setValue={setValue}
            nameKey="firstName"
          />

          <InputComponent
            value={value.lastName}
            placeholder="Last Name"
            setValue={setValue}
            nameKey="lastName"
          />
        </div> */}

        <InputComponent
          value={value.fullName}
          placeholder="Full name"
          setValue={setValue}
          nameKey="fullName"
          error={validation.isValidFullName}
        />

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
          error={validation.isValidPassWord}
        />

        <InputComponent
          value={value.accuracy}
          placeholder="Xác thực password"
          setValue={setValue}
          nameKey="accuracy"
          error={validation.isValidAccuracy}
        />

        <InputComponent
          value={value.phone}
          placeholder="Phone"
          setValue={setValue}
          nameKey="phone"
          error={validation.isValidPhone}
        />

        <button
          type="button"
          onClick={handlerRegister}
          className="bg-blue-500 w-full py-2 rounded-md text-[#fff] mt-2"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
