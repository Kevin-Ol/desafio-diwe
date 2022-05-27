import { useState } from "react";
import PropTypes from "prop-types";
import DeleteContactModal from "./DeleteContactModal";
import UpdateContactModal from "./UpdateContactModal";

function ContactItem({ contact }) {
  const { id, name, mobile, email } = contact;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);

  const handleDeleteModal = () => setDeleteModalIsOpen((oldState) => !oldState);
  const handleUpdateModal = () => setUpdateModalIsOpen((oldState) => !oldState);

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{mobile}</td>
      <td>{email}</td>
      <td>
        <button type="button" onClick={handleUpdateModal}>
          Editar
        </button>
        <UpdateContactModal
          modalIsOpen={updateModalIsOpen}
          handleModal={handleUpdateModal}
          contact={contact}
        />
        <button type="button" onClick={handleDeleteModal}>
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
