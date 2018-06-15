import axios from "axios";

let infoUrl = process.env.REACT_APP_WEB_API_DOMAIN || "";

export const postInfo = infoData => {
  let url = infoUrl + "/api/infoStatements";
  const config = {
    method: "POST",
    withCredentials: true,
    data: infoData
  };
  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

export const getAll = () => {
  let url = infoUrl + "/api/infoStatements";
  const config = {
    cache: false,
    method: "GET",
    withCredentials: true
  };
  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

export const getSOIById = id => {
  let url = infoUrl + "/api/infoStatements/" + id;
  const config = {
    method: "GET",
    withCredentials: true
  };
  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

export const update = soi => {
  let url = infoUrl + "/api/infoStatements/" + soi.id;
  const config = {
    method: "PUT",
    withCredentials: true,
    data: soi
  };
  return axios(url, config);
};
export const escrowIdMatchPeopleId = id => {
  let url = infoUrl + "/api/infoStatements/escrows/" + id;
  console.log("made it here");
  const config = {
    method: "GET",
    withCredentials: true
  };
  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

const responseSuccessHandler = response => {
  return response.data;
};

const responseErrorHandler = error => {
  console.log(error);
  return Promise.reject(error);
};
