import axios from "axios"

const STORE_URL = process.env.GATSBY_STORE_URL || "http://localhost:9000"

const client = axios.create({
  baseURL: STORE_URL,
})

export default function medusaRequest(method, path = "", payload = {}) {
  const options = {
    method,
    withCredentials: true,
    url: path,
    data: payload,
    json: true,
  }
  return client(options)
}

export const multipartRequest = (path, payload) => {
  const options = {
    withCredentials: true,
    headers: {
      "content-type": "multipart/form-data",
    },
  }

  return client.post(path, payload, options)
}
