export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8380/api/v1/"
    : "/api/v1/";

export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJudXJzZSIsImF1dGgiOiJUcmlhZ2UgTnVyc2UiLCJuYW1lIjoibnVyc2UgbnVyc2UiLCJleHAiOjE3MjIyODUzNDF9.6xD2rGIiy3jP7RFRZiqqWnP-wnsTPXkyPgIJa3TMsyEDzOo1zd048qcdSUMvth4RmJmj1-AebBVYAo3bshHiNA"
    : new URLSearchParams(window.location.search).get("jwt");
