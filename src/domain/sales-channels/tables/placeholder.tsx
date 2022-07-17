import React from "react"

import Button from "../../../components/fundamentals/button"

function Placeholder({ showAddModal }) {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M36.7279 11.2721C43.7573 18.3015 43.7573 29.6985 36.7279 36.7279C29.6984 43.7573 18.3015 43.7573 11.2721 36.7279C4.24264 29.6984 4.24264 18.3015 11.2721 11.2721C18.3015 4.24264 29.6985 4.24264 36.7279 11.2721"
          stroke="#6B7280"
          strokeWidth="2.5"
        />
        <path
          d="M24 33.6639C20.592 33.6799 17.128 31.7839 16 28.2959"
          stroke="#6B7280"
          strokeWidth="2.5"
        />
        <path
          d="M34 18.4805C33.21 19.4505 32.13 20.0005 31 20.0005C29.87 20.0005 28.82 19.4505 28 18.4805"
          stroke="#6B7280"
          strokeWidth="2.5"
        />
        <path
          d="M20 18.4805C19.21 19.4505 18.13 20.0005 17 20.0005C15.87 20.0005 14.82 19.4505 14 18.4805"
          stroke="#6B7280"
          strokeWidth="2.5"
        />
      </svg>

      <h3 className="font-semibold text-large text-gray-90 mt-6">
        Start building your channels setup...
      </h3>
      <p className="mt-2 mb-8 text-grey-50 w-[358px] text-center">
        You haven’t added any products to this channels yet, but once you do
        they will live here.
      </p>

      <Button onClick={showAddModal} variant="primary" size="small">
        Add products
      </Button>
    </div>
  )
}

export default Placeholder
