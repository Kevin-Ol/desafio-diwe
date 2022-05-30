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
  const systemError = screen.queryByText(
    "Erro no sistema, tente novamente mais tarde"
  );
  const credentialsError = screen.queryByText("Usuário ou senha incorretos");

  return {
    emailInput,
    passwordInput,
    submitBtn,
    systemError,
    credentialsError,
  };
};

describe("Exibe mensagem de erro caso haja problemas no login", () => {
  beforeEach(async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.reject({ response: { status: 500 } })
    );

    renderWithRouter(<App />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Exibe mensagem "Erro no sistema, tente novamente mais tarde"', async () => {
    const { emailInput, passwordInput, submitBtn } = formElements();

    userEvent.type(emailInput, "email@email.com");
    userEvent.type(passwordInput, "123456");
    userEvent.click(submitBtn);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith("auth/login", {
      email: "email@email.com",
      password: "123456",
    });

    await waitFor(() => {
      const { systemError } = formElements();
      expect(systemError).toBeInTheDocument();
    });
  });
});

describe("Exibe mensagem de erro caso sejam enviadas credenciais inválidas", () => {
  beforeEach(async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.reject({ response: { status: 400 } })
    );

    renderWithRouter(<App />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Exibe mensagem "Usuário ou senha incorretos"', async () => {
    const { emailInput, passwordInput, submitBtn } = formElements();

    userEvent.type(emailInput, "email@email.com");
    userEvent.type(passwordInput, "123456");
    userEvent.click(submitBtn);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith("auth/login", {
      email: "email@email.com",
      password: "123456",
    });

    await waitFor(() => {
      const { credentialsError } = formElements();
      expect(credentialsError).toBeInTheDocument();
    });
  });
});

describe("Faz login com sucesso", () => {
  beforeEach(async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: { token: "token" } })
    );
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: [] }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Redireciona para a página "/contacts/list"', async () => {
    const { history } = renderWithRouter(<App />);
    const { emailInput, passwordInput, submitBtn } = formElements();

    userEvent.type(emailInput, "email@email.com");
    userEvent.type(passwordInput, "123456");
    userEvent.click(submitBtn);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith("auth/login", {
      email: "email@email.com",
      password: "123456",
    });

    await waitFor(() => {
      const { pathname } = history.location;
      expect(pathname).toBe("/contacts/list");
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith("contacts");
    });
  });
});
