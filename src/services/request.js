import axios from "axios"

const STORE_URL =
  process.env.NODE_ENV === "development"
    ? "something"
    : process.env.GATSBY_STORE_URL

const client = axios.create({
  baseURL: STORE_URL,
})

export default function medusaRequest(method, path = "", payload = {}) {
  const options = {
    method,
    url: path,
    data: {
      data: payload,
    },
    json: true,
  }

  return client(options)
}
