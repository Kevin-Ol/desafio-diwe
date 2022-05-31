import React from "react";
import axios from "axios";
import "@testing-library/jest-dom";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import renderWithRouter from "./renderWithRouter";

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

const newContactElements = () => {
  const nameInput = screen.getByLabelText("Nome Completo");
  const emailInput = screen.getByLabelText("Email");
  const mobileInput = screen.getByLabelText("Celular");
  const submitBtn = screen.getByRole("button", { name: "Cadastrar contato" });
  const sucessMessage = screen.queryByText("Contato cadastrado com sucesso!");
  const failureMessage = screen.queryByText(
    "Erro no sistema, tente novamente mais tarde"
  );

  return {
    nameInput,
    emailInput,
    mobileInput,
    submitBtn,
    sucessMessage,
    failureMessage,
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

describe("Redireciona para tela de listagem", () => {
  beforeEach(() => {
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: { token: "token" } })
    );

    axios.get
      .mockImplementationOnce(() => Promise.resolve({ data: contacts }))
      .mockImplementationOnce(() => Promise.resolve({ data: contacts }));
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

      const addContactBtn = screen.queryByRole("link", {
        name: "Adicionar novo contato",
      });
      expect(addContactBtn).toBeInTheDocument();
      userEvent.click(addContactBtn);

      const { pathname: newContactPath } = history.location;
      expect(newContactPath).toBe("/contacts/create");

      expect(
        screen.queryByText("Cadastre um novo contato")
      ).toBeInTheDocument();
      const backBtn = screen.queryByRole("link", {
        name: /Voltar/,
      });
      expect(backBtn).toBeInTheDocument();
      userEvent.click(backBtn);
    });

    await waitFor(() => {
      const addContactBtn = screen.queryByRole("link", {
        name: "Adicionar novo contato",
      });
      expect(addContactBtn).toBeInTheDocument();

      const { pathname: listPath } = history.location;
      expect(listPath).toBe("/contacts/list");
    });
  });
});

describe("Quando o token correto não é enviado", () => {
  beforeEach(() => {
    axios.post
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { token: "token" } })
      )
      .mockImplementationOnce(() =>
        Promise.reject({ response: { status: 401 } })
      );

    axios.get.mockImplementationOnce(() => Promise.resolve({ data: contacts }));

    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.alert.mockClear();
  });

  it("Redireciona para a tela de login", async () => {
    const { history } = renderWithRouter(<App />);

    const {
      emailInput: loginEmail,
      passwordInput,
      submitBtn: loginBtn,
    } = formElements();

    userEvent.type(loginEmail, "email@email.com");
    userEvent.type(passwordInput, "123456");
    userEvent.click(loginBtn);

    await waitFor(() => {
      const addContactBtn = screen.queryByRole("link", {
        name: "Adicionar novo contato",
      });
      userEvent.click(addContactBtn);

      expect(
        screen.queryByText("Cadastre um novo contato")
      ).toBeInTheDocument();
    });

    const { nameInput, emailInput, mobileInput, submitBtn } =
      newContactElements();

    userEvent.type(nameInput, "Kevin Oliveira");
    userEvent.type(emailInput, "email@email.com");
    userEvent.type(mobileInput, "33333333333");
    userEvent.click(submitBtn);

    await waitFor(() => {
      const { pathname: loginPath } = history.location;
      expect(loginPath).toBe("/");
    });
  });
});

describe("Quando há erro no sistema", () => {
  beforeEach(async () => {
    axios.post
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { token: "token" } })
      )
      .mockImplementationOnce(() =>
        Promise.reject({ response: { status: 500 } })
      );

    axios.get.mockImplementationOnce(() => Promise.resolve({ data: contacts }));

    renderWithRouter(<App />);

    const { emailInput, passwordInput, submitBtn } = formElements();

    userEvent.type(emailInput, "email@email.com");
    userEvent.type(passwordInput, "123456");
    userEvent.click(submitBtn);

    await waitFor(() => {
      const addContactBtn = screen.queryByRole("link", {
        name: "Adicionar novo contato",
      });
      userEvent.click(addContactBtn);

      expect(
        screen.queryByText("Cadastre um novo contato")
      ).toBeInTheDocument();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Exibe mensagem "Erro no sistema, tente novamente mais tarde"', async () => {
    const { nameInput, emailInput, mobileInput, submitBtn } =
      newContactElements();

    userEvent.type(nameInput, "Kevin Oliveira");
    userEvent.type(emailInput, "email@email.com");
    userEvent.type(mobileInput, "33333333333");
    userEvent.click(submitBtn);

    await waitFor(() => {
      const { failureMessage } = newContactElements();
      expect(failureMessage).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(axios.post).toHaveBeenCalledWith("contacts", {
      name: "Kevin Oliveira",
      email: "email@email.com",
      mobile: "33333333333",
    });
  });
});

describe("Cria contato com sucesso", () => {
  beforeEach(async () => {
    axios.post
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { token: "token" } })
      )
      .mockImplementationOnce(() => Promise.resolve());

    axios.get.mockImplementationOnce(() => Promise.resolve({ data: contacts }));

    renderWithRouter(<App />);

    const { emailInput, passwordInput, submitBtn } = formElements();

    userEvent.type(emailInput, "email@email.com");
    userEvent.type(passwordInput, "123456");
    userEvent.click(submitBtn);

    await waitFor(() => {
      const addContactBtn = screen.queryByRole("link", {
        name: "Adicionar novo contato",
      });
      userEvent.click(addContactBtn);

      expect(
        screen.queryByText("Cadastre um novo contato")
      ).toBeInTheDocument();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Faz requisição corretamente ao criar contato", async () => {
    const { nameInput, emailInput, mobileInput, submitBtn } =
      newContactElements();

    userEvent.type(nameInput, "Kevin Oliveira");
    userEvent.type(emailInput, "email@email.com");
    userEvent.type(mobileInput, "33333333333");
    userEvent.click(submitBtn);

    await waitFor(() => {
      const { sucessMessage } = newContactElements();
      expect(sucessMessage).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(axios.post).toHaveBeenCalledWith("contacts", {
      name: "Kevin Oliveira",
      email: "email@email.com",
      mobile: "33333333333",
    });
  });
});
