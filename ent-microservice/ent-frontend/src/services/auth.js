import { jwtDecode } from "jwt-decode";

const KEYCLOAK_SERVER_URL = process.env.REACT_APP_KEYCLOAK_SERVER_URL || "http://localhost:8080";
const KEYCLOAK_REALM = process.env.REACT_APP_KEYCLOAK_REALM || "ent-realm";
const KEYCLOAK_CLIENT_ID = process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "ent-client";

export const auth = {
  async login() {
    // Redirect to Keycloak login
    window.location.href = 
      `${KEYCLOAK_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth?` +
      `client_id=${KEYCLOAK_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(window.location.origin + '/callback')}&` +
      `response_type=code&` +
      `scope=openid profile email`;
  },

  async handleCallback() {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) return null;

    try {
      const response = await fetch('/api/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });

      if (!response.ok) throw new Error('Authentication failed');

      const tokens = await response.json();
      this.setTokens(tokens);
      return this.getUserInfo(tokens.access_token);
    } catch (error) {
      console.error('Authentication error:', error);
      this.logout();
      return null;
    }
  },

  async getUserInfo(accessToken) {
    try {
      const response = await fetch('/api/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      return null;
    }
  },

  setTokens({ access_token, refresh_token, id_token }) {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('id_token', id_token);
  },

  getAccessToken() {
    return localStorage.getItem('access_token');
  },

  isAuthenticated() {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const { exp } = jwtDecode(token);
      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id_token');
    window.location.href = '/';
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const tokens = await response.json();
      this.setTokens(tokens);
      return tokens.access_token;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return null;
    }
  },
  
  initialize() {
    // Check if user is authenticated after refresh
    if (this.isAuthenticated()) {
      const accessToken = this.getAccessToken();
      // Optionally, you can fetch user info to update the UI with user data
      this.getUserInfo(accessToken);
    }
  }
};