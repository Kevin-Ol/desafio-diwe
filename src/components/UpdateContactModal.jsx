import { useState } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import InputMask from "react-input-mask";
import api from "../services/api";
import { useContacts } from "../context/ContactsContext";

Modal.setAppElement("#root");

function UpdateContactModal({ modalIsOpen, handleModal, contact }) {
  const { updateContact } = useContacts();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(contact.name);
  const [email, setEmail] = useState(contact.email);
  const [mobile, setMobile] = useState(contact.mobile);

  const handleName = ({ target }) => setName(target.value);
  const handleEmail = ({ target }) => setEmail(target.value);
  const handleMobile = ({ target }) => setMobile(target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const updateInfo = { name, email, mobile };
      await api.put(`contacts/${contact.id}`, updateInfo);
      updateContact(contact.id, updateInfo);
    } catch (error) {
      const { status } = error.response;
      if (status === 401) {
        global.alert("Usuário não autenticado");
      } else {
        global.alert("Erro no sistema, tente novamente mais tarde");
      }
    }
    setLoading(false);
    handleModal();
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={handleModal}
      contentLabel="Update contact modal"
      className="update-contact-modal"
    >
      <form className="update-contact-form" onSubmit={handleSubmit}>
        <h1>Atualizar contato</h1>
        <p>Faça as alterações necessárias e ao terminar salve seu contato</p>
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
        <div>
          <button type="submit" disabled={loading}>
            Salvar alterações
          </button>
          <button type="button" onClick={handleModal}>
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default UpdateContactModal;

UpdateContactModal.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func.isRequired,
  contact: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};
