import ContactsList from "../components/ContactsList";
import Header from "../components/Header";
import { useContacts } from "../context/ContactsContext";

function AllContacts() {
  const { contacts, loading } = useContacts();

  return (
    <main className="all-contacts-page">
      <Header link="/" />
      {!loading && <ContactsList contacts={contacts} />}
    </main>
  );
}

export default AllContacts;
