// import { Routes } from "react-router-dom";
import "./css/App.css";
import { login, type LoginData } from "./api/services/auth";

function App() {
  function onLoginClick() {
    const loginData: LoginData = {
      username: "test user",
      password: "testpass",
    };

    login(loginData)
      .then((response) => {
        console.log("Login successful:", response);
        localStorage.setItem("token", response.refreshToken);
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  }

  return (
    <div>
      <button onClick={onLoginClick}>Login</button>
    </div>
  );
}

export default App;
