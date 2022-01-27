import React from "react"

const style = {
  display: "grid",
  gridTemplateAreas:
    '"a a timeline" "b b timeline" "c c timeline" "d d timeline" "e e timeline" "f f timeline"',
}

const B = () => {
  return (
    <div className="flex gap-xlarge">
      <div className="flex flex-col gap-y-large w-2/3">
        <div className="bg-emerald-50 h-14">card 1</div>
        <div className="bg-emerald-50 h-16">card 2</div>
        <div className="bg-emerald-50 h-8">card 3</div>
        <div className="bg-emerald-50">card 4</div>
        <div className="bg-emerald-50">card 5</div>
      </div>
      <div className="h-screen bg-red-50 w-1/3">timeline</div>
    </div>
  )
}

export default B
