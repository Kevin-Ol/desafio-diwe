import { useState, useCallback } from "react";
import LoginForm from "../components/LoginForm";
import api from "../services/api";
import LoginImage from "../assets/login.png";

function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setErrorMessage("");
      const { data } = await api.post("auth/login", credentials);
      api.defaults.headers.common.authorization = `Bearer ${data.token}`;
      setLoading(false);
    } catch (error) {
      const { status } = error.response;
      if (status === 400) {
        setErrorMessage("Usuário ou senha incorretos");
      } else {
        setErrorMessage("Erro no sistema, tente novamente mais tarde");
      }
      setLoading(false);
    }
  }, []);

  return (
    <main className="login-page">
      <img src={LoginImage} alt="Usuário fazendo login" />
      <LoginForm
        handleLogin={handleLogin}
        errorMessage={errorMessage}
        loading={loading}
      />
    </main>
  );
}

export default Login;
