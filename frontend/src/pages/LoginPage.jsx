import { useState } from "react";
import { Button } from "@/components/ui/button";
import loginTitle from "@/assets/images/loginTitle.png";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("auth/jwt/create/", formData);
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      // axiosInstance.defaults.headers.common[
      //   "Authorization"
      // ] = `JWT ${response.data.access}`;

      const userResponse = await axiosInstance.get("/auth/users/me");
      const userData = userResponse.data;

      dispatch({
        type: "USER_LOGIN",
        payload: {
          id: userData.id,
          username: userData.username,
        },
      });

      navigate("/");
    } catch (err) {
      console.log(err);
      setMessage("password atau username salah");
    }
  };

  return (
    <main className="min-h-screen bg-[#D1F2EB] flex justify-center items-center">
      <div className="bg-white border rounded-lg shadow-lg p-8 flex flex-col sm:flex-row max-w-4xl w-full mx-5 gap-8">
        <div className="flex justify-center items-center mb-10 sm:mb-0">
          <img
            src={loginTitle}
            alt="Login Illustration"
            className="w-4/6 h-auto rounded-lg object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#1ABC9C] text-white hover:bg-[#1ABC9C] hover:opacity-60"
            >
              Login
            </Button>
            {message && (
              <p className="text-red-500 text-center mt-2">{message}</p>
            )}
            <Link to={"/register"}>
              <p className="mt-4 text-sky-600">Belum punya akun?</p>
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
