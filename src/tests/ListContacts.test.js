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

describe("Renderiza contatos com sucesso", () => {
  beforeEach(async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: { token: "token" } })
    );

    axios.get.mockImplementationOnce(() => Promise.resolve({ data: contacts }));

    const { history } = renderWithRouter(<App />);
    const { emailInput, passwordInput, submitBtn } = formElements();

    userEvent.type(emailInput, "email@email.com");
    userEvent.type(passwordInput, "123456");
    userEvent.click(submitBtn);

    await waitFor(() => {
      const { pathname } = history.location;
      expect(pathname).toBe("/contacts/list");
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Renderiza todas as informações dos contatos", async () => {
    const formatMobile = (number) =>
      number.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");

    for (let index = 0; index < contacts.length; index += 1) {
      await waitFor(() => {
        const { id, name, email, mobile } = contacts[index];
        expect(screen.queryByText(id)).toBeInTheDocument();
        expect(screen.queryByText(name)).toBeInTheDocument();
        expect(screen.queryByText(email)).toBeInTheDocument();
        expect(screen.queryByText(formatMobile(mobile))).toBeInTheDocument();
        expect(screen.queryByTestId(`edit-btn-${id}`)).toBeInTheDocument();
        expect(screen.queryByTestId(`delete-btn-${id}`)).toBeInTheDocument();
      });
    }
  });
});

describe("Redireciona para página de criar contato", () => {
  beforeEach(() => {
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: { token: "token" } })
    );

    axios.get.mockImplementationOnce(() => Promise.resolve({ data: contacts }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Redireciona corretamente ao clicar em "Adicionar novo contato"', async () => {
    const { history } = renderWithRouter(<App />);
    const { emailInput, passwordInput, submitBtn } = formElements();

    userEvent.type(emailInput, "email@email.com");
    userEvent.type(passwordInput, "123456");
    userEvent.click(submitBtn);

    await waitFor(() => {
      const { pathname: listPath } = history.location;
      expect(listPath).toBe("/contacts/list");

      const addContactBtn = screen.queryByRole("link", {
        name: "Adicionar novo contato",
      });
      expect(addContactBtn).toBeInTheDocument();
      userEvent.click(addContactBtn);

      const { pathname: newContactPath } = history.location;
      expect(newContactPath).toBe("/contacts/create");
    });
  });
});

describe("Redireciona para tela inicial", () => {
  beforeEach(() => {
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: { token: "token" } })
    );

    axios.get.mockImplementationOnce(() => Promise.resolve({ data: contacts }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Redireciona corretamente ao clicar em "Voltar"', async () => {
    const { history } = renderWithRouter(<App />);
    const { emailInput, passwordInput, submitBtn } = formElements();

    userEvent.type(emailInput, "email@email.com");
    userEvent.type(passwordInput, "123456");
    userEvent.click(submitBtn);

    await waitFor(() => {
      const { pathname: listPath } = history.location;
      expect(listPath).toBe("/contacts/list");

      const backBtn = screen.queryByRole("link", {
        name: /Voltar/,
      });
      expect(backBtn).toBeInTheDocument();
      userEvent.click(backBtn);

      const { pathname: loginPath } = history.location;
      expect(loginPath).toBe("/");
    });
  });
});
