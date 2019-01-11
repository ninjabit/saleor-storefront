import "./scss/index.scss";

import * as React from "react";

import { Button, Form, TextField } from "..";
import { maybe } from "../../core/utils";
import { UserContext } from "../User/context";
import { TypedTokenAuthMutation } from "../User/queries";
import { TokenAuth } from "../User/types/TokenAuth";

const performLogin = (login: (data: TokenAuth) => void, data: TokenAuth) => {
  const successfull = maybe(() => !data.tokenCreate.errors.length, true);
  if (successfull) {
    login(data);
  }
};

const LoginForm: React.SFC = () => {
  return (
    <div className="login-form">
      <UserContext.Consumer>
        {({ login }) => (
          <TypedTokenAuthMutation
            onCompleted={data => performLogin(login, data)}
          >
            {(tokenCreate, { data, loading }) => {
              return (
                <Form
                  errors={maybe(() => data.tokenCreate.errors, [])}
                  onSubmit={(evt, { email, password }) => {
                    evt.preventDefault();
                    tokenCreate({ variables: { email, password } });
                  }}
                >
                  <TextField
                    name="email"
                    autoComplete="email"
                    label="Email Address"
                    type="email"
                    required
                  />
                  <TextField
                    name="password"
                    autoComplete="password"
                    label="Password"
                    type="password"
                    required
                  />
                  <div className="login-form__button">
                    <Button type="submit" {...loading && { disabled: true }}>
                      {loading ? "Loading" : "Sign in"}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </TypedTokenAuthMutation>
        )}
      </UserContext.Consumer>
    </div>
  );
};

export default LoginForm;
