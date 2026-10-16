export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";

export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluLFVzZXIsUkRFIiwiZXhwIjoxNzkyMTcwMjQwLCJuYW1lIjoiR3Vlc3QgR3Vlc3QifQ.ojtif-lwPUvQN7SyRziLMz60xH7gPC_W6T8AFNJKOtfh3nyYm0HIUbSsrMj1dCs51LlPEyfDcO7YMvz5BRFwdw"
    : new URLSearchParams(window.location.search).get("jwt");
