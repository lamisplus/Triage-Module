export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";

export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE2MjAzMTA3fQ.Ti1g_J5qdF_xtBLWC-38Tf2FFluBuxWR48xrXWNlMgbzhDNQQXXMbdRHji93gkTGGSH2_zmV0N7cf_2UaZ34dw"
    : new URLSearchParams(window.location.search).get("jwt");
