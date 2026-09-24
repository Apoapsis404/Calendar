import { useState } from "react";
import type { LoginUserData } from "../../../api/services/auth";
import { useLoginUser } from "../hooks/loginUser";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginUserData, setLoginUserData] = useState<LoginUserData | null>(
    null,
  );
  const { loginUser, loading, error } = useLoginUser(loginUserData);
  if (loading) return <div>Loading</div>;
  if (error) return <div>Error: {error.message}</div>;

  function handleLogin(e: React.SyntheticEvent) {
    e.preventDefault();
    const tmpLoginUser: LoginUserData = {
      username,
      password,
    };
    setLoginUserData(tmpLoginUser);
    console.log(loginUser);
    navigate("/calendar", {
      state: { from: "login", flash: "Calendar" },
    });
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
