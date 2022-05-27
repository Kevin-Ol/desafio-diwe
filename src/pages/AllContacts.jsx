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
        const { status } = error.response;
        if (status === 401) {
          global.alert("Usuário não autenticado");
        } else {
          global.alert("Erro no sistema, tente novamente mais tarde");
        }
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
