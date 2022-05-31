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
  delete: jest.fn(() => Promise.resolve()),
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

    axios.delete.mockImplementationOnce(() => Promise.resolve());

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

  it("Faz requisição corretamente e altera a lista ao remover contato", async () => {
    const formatMobile = (number) =>
      number.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
    const { id, name, email, mobile } = contacts[0];

    const delBtn = screen.queryByTestId(`delete-btn-${id}`);

    await waitFor(() => {
      expect(screen.queryByText(id)).toBeInTheDocument();
      expect(screen.queryByText(name)).toBeInTheDocument();
      expect(screen.queryByText(email)).toBeInTheDocument();
      expect(screen.queryByText(formatMobile(mobile))).toBeInTheDocument();
      expect(screen.queryByTestId(`edit-btn-${id}`)).toBeInTheDocument();
      expect(delBtn).toBeInTheDocument();
    });

    userEvent.click(delBtn);

    const confirmDel = screen.getByRole("button", { name: "Excluir contato" });

    userEvent.click(confirmDel);

    await waitFor(() => {
      expect(screen.queryByText(id)).not.toBeInTheDocument();
      expect(screen.queryByText(name)).not.toBeInTheDocument();
      expect(screen.queryByText(email)).not.toBeInTheDocument();
      expect(screen.queryByText(formatMobile(mobile))).not.toBeInTheDocument();
      expect(screen.queryByTestId(`edit-btn-${id}`)).not.toBeInTheDocument();
      expect(delBtn).not.toBeInTheDocument();
    });

    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete).toHaveBeenCalledWith(`contacts/${id}`);
  });
});
