import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContactsList from "../components/ContactsList";
import Header from "../components/Header";
import api from "../services/api";

function AllContacts() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("contacts");
        setContacts(data);
      } catch (error) {
        global.alert("Usuário não autenticado");
        navigate("/");
      }
      setLoading(false);
    };

    fetchContacts();
  }, []);

  return (
    <main className="all-contacts-page">
      <Header link="/" />
      {!loading && <ContactsList contacts={contacts} />}
    </main>
  );
}

export default AllContacts;
