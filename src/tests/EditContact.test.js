import React from "react";
import axios from "axios";
import "@testing-library/jest-dom";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import renderWithRouter from "./renderWithRouter";
import ReactModal from "react-modal";

ReactModal.setAppElement(document.createElement("div"));

jest.mock("axios", () => ({
  create: jest.fn().mockReturnThis(),
  get: jest.fn(() => Promise.resolve()),
  post: jest.fn(() => Promise.resolve()),
  put: jest.fn(() => Promise.resolve()),
  defaults: {
    headers: {
      common: {
        authorization: "",
      },
    },
  },
}));

const formElements = () => {
  const emailInput = screen.getByLabelText("Email");
  const passwordInput = screen.getByLabelText("Senha");
  const submitBtn = screen.getByRole("button", { name: "Fazer login" });

  return {
    emailInput,
    passwordInput,
    submitBtn,
  };
};

const editElements = () => {
  const nameInput = screen.getByLabelText("Nome Completo");
  const emailInput = screen.getByLabelText("Email");
  const mobileInput = screen.getByLabelText("Celular");
  const submitBtn = screen.getByRole("button", { name: "Salvar alterações" });

  return {
    nameInput,
    emailInput,
    mobileInput,
    submitBtn,
  };
};

const contacts = [
  {
    id: 1,
    name: "contato1",
    email: "contato.1@email.com",
    mobile: "11111111111",
  },
  {
    id: 2,
    name: "contato2",
    email: "contato.2@email.com",
    mobile: "22222222222",
  },
];

describe("Edita contato com sucesso", () => {
  beforeEach(async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: { token: "token" } })
    );

    axios.get.mockImplementationOnce(() => Promise.resolve({ data: contacts }));

    axios.put.mockImplementationOnce(() => Promise.resolve());

    renderWithRouter(<App />);

    const { emailInput, passwordInput, submitBtn } = formElements();

    userEvent.type(emailInput, "email@email.com");
    userEvent.type(passwordInput, "123456");
    userEvent.click(submitBtn);

    await waitFor(() => {
      const addContactBtn = screen.queryByRole("link", {
        name: "Adicionar novo contato",
      });
      expect(addContactBtn).toBeInTheDocument();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Faz requisição corretamente e altera a lista ao editar contato", async () => {
    const editedContact = {
      name: "Nome editado",
      email: "editado@email.com",
      mobile: "00000000000",
    };

    const formatMobile = (number) =>
      number.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
    const { id, name, email, mobile } = contacts[0];

    const editBtn = screen.queryByTestId(`edit-btn-${id}`);

    await waitFor(() => {
      expect(screen.queryByText(id)).toBeInTheDocument();
      expect(screen.queryByText(name)).toBeInTheDocument();
      expect(screen.queryByText(email)).toBeInTheDocument();
      expect(screen.queryByText(formatMobile(mobile))).toBeInTheDocument();
      expect(editBtn).toBeInTheDocument();
      expect(screen.queryByTestId(`delete-btn-${id}`)).toBeInTheDocument();
    });

    userEvent.click(editBtn);

    const { nameInput, emailInput, mobileInput, submitBtn } = editElements();
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue(name);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveValue(email);
    expect(mobileInput).toBeInTheDocument();
    expect(mobileInput).toHaveValue(formatMobile(mobile));

    userEvent.clear(nameInput);
    userEvent.clear(emailInput);
    userEvent.clear(mobileInput);
    userEvent.type(nameInput, editedContact.name);
    userEvent.type(emailInput, editedContact.email);
    userEvent.type(mobileInput, editedContact.mobile);
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByText(name)).not.toBeInTheDocument();
      expect(screen.queryByText(email)).not.toBeInTheDocument();
      expect(screen.queryByText(formatMobile(mobile))).not.toBeInTheDocument();

      expect(screen.queryByText(id)).toBeInTheDocument();
      expect(screen.queryByText(editedContact.name)).toBeInTheDocument();
      expect(screen.queryByText(editedContact.email)).toBeInTheDocument();
      expect(
        screen.queryByText(formatMobile(editedContact.mobile))
      ).toBeInTheDocument();
      expect(editBtn).toBeInTheDocument();
      expect(screen.queryByTestId(`delete-btn-${id}`)).toBeInTheDocument();
    });

    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(`contacts/${id}`, editedContact);
  });
});
