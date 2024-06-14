// src/config.js
// Load environment variables in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const config = {
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_AUTH0_DOMAIN:
    process.env.NODE_ENV === "production"
      ? "${{REACT_APP_AUTH0_DOMAIN}}"
      : process.env.REACT_APP_AUTH0_DOMAIN,
  REACT_APP_AUTH0_CLIENT_ID:
    process.env.NODE_ENV === "production"
      ? "${{REACT_APP_AUTH0_CLIENT_ID}}"
      : process.env.REACT_APP_AUTH0_CLIENT_ID,
  REACT_APP_AUTH0_AUDIENCE:
    process.env.NODE_ENV === "production"
      ? "${{REACT_APP_AUTH0_AUDIENCE}}"
      : process.env.REACT_APP_AUTH0_AUDIENCE,
  REACT_APP_AUTH0_SCOPE:
    process.env.NODE_ENV === "production"
      ? "${{REACT_APP_AUTH0_SCOPE}}"
      : process.env.REACT_APP_AUTH0_SCOPE,
  REACT_APP_API_BASE_URL:
    process.env.NODE_ENV === "production"
      ? "${{REACT_APP_API_BASE_URL}}"
      : process.env.REACT_APP_API_BASE_URL,
  REACT_APP_AZURE_FUNCTION_URL:
    process.env.NODE_ENV === "production"
      ? "${{REACT_APP_AZURE_FUNCTION_URL}}"
      : process.env.REACT_APP_AZURE_FUNCTION_URL,
  REACT_APP_AZURE_FUNCTION_CODE:
    process.env.NODE_ENV === "production"
      ? "${{REACT_APP_AZURE_FUNCTION_CODE}}"
      : process.env.REACT_APP_AZURE_FUNCTION_CODE,
};

export default config;
