import { gql } from "@apollo/client";
import { graphqlClient } from "./client";

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const { data } = await graphqlClient.mutate({
    mutation: LOGIN_MUTATION,
    variables: {
      input: {
        email: normalizedEmail,
        password
      }
    }
  });

  return data.login;
}

export async function registerUser({ username, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const { data } = await graphqlClient.mutate({
    mutation: REGISTER_MUTATION,
    variables: {
      input: {
        username: username.trim(),
        email: normalizedEmail,
        password
      }
    }
  });

  return data.register;
}
