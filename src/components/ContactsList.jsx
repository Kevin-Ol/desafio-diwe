import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ContactItem from "./ContactItem";

function ContactsList({ contacts }) {
  return (
    <section className="contacts-section">
      <h2>Listagem de contatos</h2>
      <Link to="/contacts/create">Adicionar novo contato</Link>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Celular</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <ContactItem key={contact.id} contact={contact} />
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ContactsList;

ContactsList.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      mobile: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    })
  ).isRequired,
};
