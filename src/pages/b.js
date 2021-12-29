import React from "react"

const Test = () => {
  return (
    <div className="p-4xlarge">
      <h3 className="mb-2">Primary</h3>
      <div>
        <button className="btn-primary-large">Action</button>
        <button className="btn-primary-large mx-4" disabled={true}>
          Action
        </button>
      </div>
      <div className="my-4">
        <button className="btn-primary-medium">Action</button>
        <button className="btn-primary-medium mx-4" disabled={true}>
          Action
        </button>
      </div>
      <div className="mb-8">
        <button className="btn-primary-small">Action</button>
        <button className="btn-primary-small mx-4" disabled={true}>
          Action
        </button>
      </div>
      <h3 className="mb-2">Secondary</h3>
      <div>
        <button className="btn-secondary-large">Action</button>
        <button className="btn-secondary-large mx-4" disabled={true}>
          Action
        </button>
      </div>
      <div className="my-4">
        <button className="btn-secondary-medium">Action</button>
        <button className="btn-secondary-medium mx-4" disabled={true}>
          Action
        </button>
      </div>
      <div className="mb-8">
        <button className="btn-secondary-small">Action</button>
        <button className="btn-secondary-small mx-4" disabled={true}>
          Action
        </button>
      </div>
      <h3 className="mb-2">Ghost</h3>
      <div>
        <button className="btn-ghost-large">Action</button>
        <button className="btn-ghost-large mx-4" disabled={true}>
          Action
        </button>
      </div>
      <div className="my-4">
        <button className="btn-ghost-medium">Action</button>
        <button className="btn-ghost-medium mx-4" disabled={true}>
          Action
        </button>
      </div>
      <div>
        <button className="btn-ghost-small">Action</button>
        <button className="btn-ghost-small mx-4" disabled={true}>
          Action
        </button>
      </div>
    </div>
  )
}

export default Test
