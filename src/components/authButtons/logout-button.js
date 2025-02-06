import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

import { Button } from "../button/button";

export const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <Button text="Log Out" cb={handleLogout}/>
  );
};