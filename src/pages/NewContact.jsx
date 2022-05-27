import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NewContactForm from "../components/NewContactForm";
import api from "../services/api";
import Header from "../components/Header";

function NewContact() {
  const navigate = useNavigate();

  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContact = useCallback(async (contactInfo) => {
    try {
      setLoading(true);
      setStatusMessage("");
      await api.post("/contacts", contactInfo);
      setStatusMessage("Contato cadastrado com sucesso!");
    } catch (error) {
      const { status } = error.response;
      if (status === 401) {
        global.alert("Usuário não autenticado");
        navigate("/");
      } else {
        setStatusMessage("Erro no sistema, tente novamente mais tarde");
      }
    }
    setLoading(false);
  }, []);

  return (
    <main className="new-contact-page">
      <Header link="/contacts/list" />
      <NewContactForm
        handleContact={handleContact}
        statusMessage={statusMessage}
        loading={loading}
      />
    </main>
  );
}

export default NewContact;
