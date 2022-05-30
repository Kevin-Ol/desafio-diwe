import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ContactItem from "./ContactItem";
import TableHeader from "./TableHeader";

function ContactsList({ contacts }) {
  const headers = [
    { field: "#", name: "id" },
    { field: "Nome", name: "name" },
    { field: "Celular", name: "mobile" },
    { field: "Email", name: "email" },
  ];

  return (
    <section className="contacts-section">
      <div>
        <h2>Listagem de contatos</h2>
        <Link to="/contacts/create">Adicionar novo contato</Link>
      </div>
      <table role="grid">
        <TableHeader headers={headers} />
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
