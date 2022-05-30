import { useState } from "react";
import PropTypes from "prop-types";
import InputMask from "react-input-mask";

function NewContactForm({ handleContact, statusMessage, loading }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const handleName = ({ target }) => setName(target.value);
  const handleEmail = ({ target }) => setEmail(target.value);
  const handleMobile = ({ target }) => setMobile(target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const onlyNumbers = (text) => text.replace(/[^0-9]/g, "");

    await handleContact({ name, email, mobile: onlyNumbers(mobile) });
    setName("");
    setEmail("");
    setMobile("");
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h1>Cadastre um novo contato</h1>
      <p>Preencha as informações para cadastrar um novo contato</p>
      <label htmlFor="name">
        Nome Completo
        <input
          name="name"
          type="text"
          id="name"
          required
          placeholder="Digite o nome do contato"
          value={name}
          onChange={handleName}
        />
      </label>
      <div>
        <label htmlFor="email">
          Email
          <input
            name="email"
            type="email"
            id="email"
            required
            placeholder="Digite o email"
            value={email}
            onChange={handleEmail}
          />
        </label>
        <label htmlFor="mobile">
          Celular
          <InputMask
            mask="(99) 99999-9999"
            name="mobile"
            type="tel"
            id="mobile"
            required
            placeholder="Digite o celular"
            value={mobile}
            onChange={handleMobile}
          />
        </label>
      </div>
      <p className="status-message">{statusMessage}</p>
      <button type="submit" disabled={loading}>
        Cadastrar contato
      </button>
    </form>
  );
}

export default NewContactForm;

NewContactForm.propTypes = {
  handleContact: PropTypes.func.isRequired,
  statusMessage: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};
