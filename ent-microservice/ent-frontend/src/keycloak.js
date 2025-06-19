import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "ent_est-realm",
  clientId: "ent_est-client",
});

export default keycloak;
