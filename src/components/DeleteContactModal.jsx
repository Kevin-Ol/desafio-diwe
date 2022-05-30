import { useState } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import api from "../services/api";
import { useContacts } from "../context/ContactsContext";
import "../styles/DeleteContactModal.scss";

Modal.setAppElement("#root");

function DeleteContactModal({ modalIsOpen, handleModal, id }) {
  const [loading, setLoading] = useState(false);
  const { deleteContact } = useContacts();

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`contacts/${id}`);
      deleteContact(id);
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
      contentLabel="Delete contact modal"
      className="delete-contact-modal"
      overlayClassName="delete-contact-modal-overlay"
    >
      <section>
        <h1>Tem certeza que deseja excluir este contato?</h1>
        <p>Após excluir, não será possível recuperar o contato.</p>
        <div>
          <button type="button" onClick={handleDelete} disabled={loading}>
            Excluir contato
          </button>
          <button type="button" onClick={handleModal}>
            Não excluir
          </button>
        </div>
      </section>
    </Modal>
  );
}

export default DeleteContactModal;

DeleteContactModal.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};
