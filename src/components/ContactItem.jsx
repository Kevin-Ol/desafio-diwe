import { useState } from "react";
import PropTypes from "prop-types";
import DeleteContactModal from "./DeleteContactModal";
import UpdateContactModal from "./UpdateContactModal";
import Edit from "../assets/edit.svg";
import Trash from "../assets/trash.svg";

function ContactItem({ contact }) {
  const { id, name, mobile, email } = contact;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);

  const handleDeleteModal = () => setDeleteModalIsOpen((oldState) => !oldState);
  const handleUpdateModal = () => setUpdateModalIsOpen((oldState) => !oldState);

  const formatMobile = (number) =>
    number.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{formatMobile(mobile)}</td>
      <td>{email}</td>
      <td>
        <button type="button" onClick={handleUpdateModal}>
          <img
            src={Edit}
            data-testid={`edit-btn-${contact.id}`}
            alt="Ícone representando edição"
          />
          Editar
        </button>
        <UpdateContactModal
          modalIsOpen={updateModalIsOpen}
          handleModal={handleUpdateModal}
          contact={contact}
        />
        <button
          type="button"
          data-testid={`delete-btn-${contact.id}`}
          onClick={handleDeleteModal}
        >
          <img src={Trash} alt="Ícone representando exclusão" />
          Excluir
        </button>
        <DeleteContactModal
          modalIsOpen={deleteModalIsOpen}
          handleModal={handleDeleteModal}
          id={id}
        />
      </td>
    </tr>
  );
}

export default ContactItem;

ContactItem.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};
