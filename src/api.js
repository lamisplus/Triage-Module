export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";

export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluLFVzZXIsUkRFIiwiZXhwIjoxNzkxNzc4MDYwLCJuYW1lIjoiR3Vlc3QgR3Vlc3QifQ.L5CAI7z2j8XH5ZmoQiZjiwpKhGaoQTTZ-ouunX3n08h6idFIHL890H8tAtEDDa6xr8sRVehbk5BHYy_SNP0p7w"
    : new URLSearchParams(window.location.search).get("jwt");
