import PropTypes from "prop-types";

function ContactItem({ contact }) {
  const { id, name, mobile, email } = contact;
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{mobile}</td>
      <td>{email}</td>
      <td>
        <button type="button">Editar</button>
        <button type="button">Excluir</button>
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
