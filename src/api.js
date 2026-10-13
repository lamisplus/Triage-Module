export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";

export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluLFVzZXIsUkRFIiwiZXhwIjoxNzkxOTEzMTE0LCJuYW1lIjoiR3Vlc3QgR3Vlc3QifQ.3LRFJkF070RiU5WaUYmHWnc0KUHf7YnosIKZ4rQb6cxacn0mwz9jZPPUAR1cqQUpjLK9s0KO37fs1iii-udE2g"
    : new URLSearchParams(window.location.search).get("jwt");
