import axios from 'axios';
import jwtDecode from 'jwt-decode'; // Add jwt-decode dependency

// Keycloak configuration from environment variables
const KEYCLOAK_BASE_URL = process.env.REACT_APP_KEYCLOAK_BASE_URL || 'http://localhost:8080';
const REALM = process.env.REACT_APP_KEYCLOAK_REALM || 'ent_est-realm';
const CLIENT_ID = process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'ent_est-client';
const CLIENT_SECRET = process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET || 'gZA4j6vLFk6YQcWIme7KvThJBJCPCYwC';
const TOKEN_URL = process.env.REACT_APP_KEYCLOAK_TOKEN_URL || `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/token`;
const AUTH_URL = process.env.REACT_APP_KEYCLOAK_AUTH_URL || `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/auth`;
const LOGOUT_URL = `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/logout`;
const ACCOUNT_SETUP_URL = process.env.REACT_APP_KEYCLOAK_ACCOUNT_URL || `${KEYCLOAK_BASE_URL}/realms/${REALM}/account`;
const REQUIRED_ACTION_URL = process.env.REACT_APP_KEYCLOAK_REQUIRED_ACTION_URL || `${KEYCLOAK_BASE_URL}/realms/${REALM}/login-actions/required-action`;

// Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
  withCredentials: false,
});

// Clear cookies function
const clearCookies = () => {
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
};

// --- AUTH FUNCTIONS ---

export const login = async (username, password) => {
  try {
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);

    const response = await axios.post(TOKEN_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token, refresh_token, expires_in } = response.data;

    const expiration = Date.now() + expires_in * 1000;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('token_expires_at', expiration);

    // Debug: Decode JWT to inspect payload
    const decodedToken = jwtDecode(access_token);
    console.log('Decoded access_token:', decodedToken);

    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    if (
      error.response?.status === 400 &&
      error.response?.data?.error === 'invalid_grant' &&
      error.response?.data?.error_description === 'Account is not fully set up'
    ) {
      const redirectUri = encodeURIComponent(window.location.origin + '/login');
      const state = Math.random().toString(36).substring(2);
      window.location.href = `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&scope=openid&redirect_uri=${redirectUri}&state=${state}`;
      throw new Error('Redirecting to Keycloak authentication to complete required action (e.g., update password)');
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    const refresh_token = localStorage.getItem('refresh_token');
    if (refresh_token) {
      const params = new URLSearchParams();
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('refresh_token', refresh_token);
      params.append('post_logout_redirect_uri', encodeURIComponent(window.location.origin + '/login'));

      console.log('Calling Keycloak logout:', LOGOUT_URL);
      const response = await axios.post(LOGOUT_URL, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      console.log('Keycloak logout response:', response.status);
    } else {
      console.warn('No refresh_token found for logout');
    }
  } catch (error) {
    console.error('Keycloak logout failed:', error.response?.data || error.message);
  } finally {
    localStorage.clear();
    clearCookies();
    const loginUrl = `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/auth?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(window.location.origin + '/login')}&scope=openid`;
    console.log('Redirecting to login:', loginUrl);
    window.location.assign(loginUrl);
  }
};

export const refreshToken = async () => {
  try {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) throw new Error('No refresh token found.');

    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refresh_token);

    const response = await axios.post(TOKEN_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token, refresh_token: newRefreshToken, expires_in } = response.data;
    const expiration = Date.now() + expires_in * 1000;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', newRefreshToken);
    localStorage.setItem('token_expires_at', expiration);

    return access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    await logout();
    throw error;
  }
};

const isTokenExpired = () => {
  const expiresAt = localStorage.getItem('token_expires_at');
  return !expiresAt || Date.now() > parseInt(expiresAt);
};

api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('access_token');

    if (token && isTokenExpired()) {
      try {
        token = await refreshToken();
      } catch {
        await logout();
        throw new Error('Token refresh failed.');
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Merge existing params with cache-busting _t
    config.params = { ...config.params, _t: Date.now() };

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const newToken = await refreshToken();
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api(error.config);
      } catch {
        await logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const getCurrentUser = async () => {
  try {
    const res = await api.get('/users/me');
    const userData = res.data;
    console.log('Backend user data:', userData); // Debug

    // Decode access_token to ensure email is available
    const accessToken = localStorage.getItem('access_token');
    let email = userData.email;
    if (!email && accessToken) {
      const decodedToken = jwtDecode(accessToken);
      email = decodedToken.email || decodedToken.preferred_username;
      console.log('Email from decoded token:', email); // Debug
    }

    const role = userData.roles?.includes('etudiant') ? 'etudiant' : userData.roles?.includes('enseignant') ? 'enseignant' : null;
    console.log('Mapped role:', role); // Debug

    return {
      ...userData,
      email: email || userData.email, // Ensure email is included
      role
    };
  } catch (err) {
    console.error('Failed to fetch user:', err);
    return null;
  }
};

export default api;