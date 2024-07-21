export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8380/api/v1/"
    : "/api/v1/";

export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzIxNTk4NTI3fQ.i5Vm7-T4_fjS_3uq745Q2QfYGQaltN-A6EzzCalBrPhyIZy4lv4WhpWn3E5e6uFYE8kubZv9Yeh5WB_g5moWEw"
    : new URLSearchParams(window.location.search).get("jwt");
