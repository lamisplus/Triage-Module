export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";

export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzUzMjM3ODY2fQ.gumuqzx36stPwtPyeEFvpYM6RIPuHntdwGGT3p9RVy0K-vOxEmgAQqhkKsPtsfYrwqquLzabhhr5Be9EEDskZQ"
    : new URLSearchParams(window.location.search).get("jwt");
