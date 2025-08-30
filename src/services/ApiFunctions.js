// src/services/ApiFunctions.js
import axios from "axios";

const BASE_URL = "https://myappapi.fikriti.com/api/v1/";

export default class ApiFunctions {
  constructor(endpoint) {
    this.fullUrl = BASE_URL + endpoint;
  }

  getToken() {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.token || null;
    } catch (e) {
      console.error("Error parsing user data:", e);
      return null;
    }
  }

  // headers builder
  getHeaders({
    withAuth = true,
    useCredentials = false,
    isFormData = false,
  } = {}) {
    const headers = {
      Accept: "application/json",
    };

    // لا نضيف Content-Type لو البيانات FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (withAuth) {
      const token = this.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return {
      headers,
      withCredentials: useCredentials,
    };
  }

  // GET
  get = async ({ withAuth = true, useCredentials = false } = {}) => {
    return axios.get(
      this.fullUrl,
      this.getHeaders({ withAuth, useCredentials })
    );
  };

  // GET by ID
  getById = async (id, { withAuth = true, useCredentials = false } = {}) => {
    return axios.get(
      `${this.fullUrl}/${id}`,
      this.getHeaders({ withAuth, useCredentials })
    );
  };

  // GET for edit
  edit = async (id, { withAuth = true, useCredentials = false } = {}) => {
    return axios.get(
      `${this.fullUrl}/${id}`,
      this.getHeaders({ withAuth, useCredentials })
    );
  };

  // POST
  post = async (data, { withAuth = true, useCredentials = false } = {}) => {
    const isFormData = data instanceof FormData;
    return axios.post(
      this.fullUrl,
      data,
      this.getHeaders({ withAuth, useCredentials, isFormData })
    );
  };

  // PATCH (post-style update)
  patch = async (
    id,
    data,
    { withAuth = true, useCredentials = false } = {}
  ) => {
    const isFormData = data instanceof FormData;
    return axios.patch(
      `${this.fullUrl}/${id}`,
      data,
      this.getHeaders({ withAuth, useCredentials, isFormData })
    );
  };
  // داخل ApiFunctions.js
  patchPOST = async (
    id,
    data,
    { withAuth = true, useCredentials = false } = {}
  ) => {
    const isFormData = data instanceof FormData;

    if (isFormData) {
      return axios.post(
        `${this.fullUrl}/${id}`,
        data,
        this.getHeaders({ withAuth, useCredentials, isFormData })
      );
    }

    return axios.patch(
      `${this.fullUrl}/${id}`,
      data,
      this.getHeaders({ withAuth, useCredentials, isFormData })
    );
  };

  // DELETE
  delete = async (id, { withAuth = true, useCredentials = false } = {}) => {
    return axios.delete(
      `${this.fullUrl}/${id}`,
      this.getHeaders({ withAuth, useCredentials })
    );
  };

  // GET with pagination and optional search
  getWithPagination = async (
    pageNumber,
    searchTerm = "",
    { withAuth = true, useCredentials = false } = {}
  ) => {
    let url = `${this.fullUrl}?page=${pageNumber}`;
    if (searchTerm.trim() !== "") {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    return axios.get(url, this.getHeaders({ withAuth, useCredentials }));
  };
}
