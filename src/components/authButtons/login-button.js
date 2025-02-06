import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button } from "../button/button";

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/profile",
      },
    });
  };

  return (
    <Button text="Log In" cb={handleLogin} />
  );
};