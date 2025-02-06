import {jwtDecode as jwt_decode} from "jwt-decode";
import { useAuth0 } from '@auth0/auth0-react';

export async function getUserRoles(getAccessTokenSilently) {
    let jwtToken = await getAccessTokenSilently();
    const decoded = jwt_decode(jwtToken);
    return decoded.permissions
}


export const PERMISSION = {
    SUBSCRIBER : "create:bookings",
    BOOKEE : "view:bookings"
}