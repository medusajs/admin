import React from "react"
import Card from "./card"

const NotFound = () => {
  return (
    <Card>
      <Card.Body px={3} height="200px">
        <div className="flex items-center justify-center">
          <div mb={3}>
            <div mt="auto">Sorry, something went wrong</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default NotFound
