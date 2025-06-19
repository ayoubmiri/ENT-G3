import { useState, useEffect } from 'react';
import Keycloak from 'keycloak-js';

export const useKeycloak = () => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initKeycloak = async () => {
      const keycloakConfig = {
        url: process.env.REACT_APP_KEYCLOAK_URL,
        realm: process.env.REACT_APP_KEYCLOAK_REALM,
        clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID
      };

      const keycloakInstance = new Keycloak(keycloakConfig);

      try {
        const auth = await keycloakInstance.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256'
        });

        setKeycloak(keycloakInstance);
        setAuthenticated(auth);

        if (auth) {
          const userProfile = await keycloakInstance.loadUserProfile();
          setUser({
            ...userProfile,
            roles: keycloakInstance.tokenParsed?.realm_access?.roles || []
          });
        }
      } catch (error) {
        console.error('Keycloak initialization error:', error);
      }
    };

    initKeycloak();
  }, []);

  const login = () => {
    if (keycloak) {
      keycloak.login();
    }
  };

  const logout = () => {
    if (keycloak) {
      keycloak.logout({ redirectUri: window.location.origin });
    }
  };

  const getToken = async () => {
    if (keycloak) {
      try {
        await keycloak.updateToken(30);
        return keycloak.token;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
      }
    }
    return null;
  };

  return { keycloak, authenticated, user, login, logout, getToken };
};