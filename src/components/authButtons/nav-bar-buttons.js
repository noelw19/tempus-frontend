import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { LoginButton } from "./login-button";
import { LogoutButton } from "./logout-button";
import { SignupButton } from "./signup-button";

export const NavBarButtons = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="nav-bar__button">
      {!isAuthenticated && (
        <>
          <LoginButton />
        </>
      )}
      {isAuthenticated && (
        <>
          <LogoutButton />
        </>
      )}
    </div>
  );
};