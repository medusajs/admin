import { Route, Routes } from "react-router-dom"

import Index from "./pages"

const PublishableApiKeysRoute = () => {
  return (
    <Routes>
      <Route index element={<Index />} />
      {/*<Route path="/:id" element={} />*/}
    </Routes>
  )
}

export default PublishableApiKeysRoute
