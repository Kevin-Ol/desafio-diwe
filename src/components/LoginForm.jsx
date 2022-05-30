import { useState } from "react";
import PropTypes from "prop-types";

function LoginForm({ handleLogin, errorMessage, loading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);

  const handleEmail = ({ target }) => setEmail(target.value);
  const handlePassword = ({ target }) => setPassword(target.value);
  const handleRevealPassord = ({ target }) => setRevealPassword(target.checked);

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin({ email, password });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1>Bem-vindo!</h1>
      <p>Faça login para acessar nossa plataforma</p>
      <label htmlFor="email">
        Email
        <input
          name="email"
          type="email"
          id="email"
          required
          placeholder="Digite seu email"
          value={email}
          onChange={handleEmail}
        />
      </label>
      <label htmlFor="password">
        Senha
        <input
          name="password"
          type={revealPassword ? "text" : "password"}
          id="password"
          required
          placeholder="Digite sua senha"
          value={password}
          onChange={handlePassword}
        />
      </label>
      <label htmlFor="reveal-password">
        <input
          name="reveal-password"
          type="checkbox"
          id="reveal-password"
          value={revealPassword}
          onChange={handleRevealPassord}
        />
        Mostrar senha
      </label>
      <p className="error-message">{errorMessage}</p>
      <button type="submit" disabled={loading}>
        Fazer login
      </button>
    </form>
  );
}

export default LoginForm;

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};
