import React from "react"
import DuplicateIcon from "../components/fundamentals/icons/duplicate-icon"
import PlusIcon from "../components/fundamentals/icons/plus-icon"
import TrashIcon from "../components/fundamentals/icons/trash-icon"
import BodyCard from "../components/organisms/body-card"
import Layout from "../components/templates/layout"

const Test = () => {
  return (
    <Layout>
      <div className="flex items-center justify-between h-full">
        <BodyCard
          title={"Regions"}
          subtitle={"Manage your Store's regions"}
          actionables={[
            {
              icon: <DuplicateIcon />,
              text: "Duplicate",
              onClick: () => console.log("Dedup"),
            },
            {
              icon: <TrashIcon />,
              text: "Delete",
              onClick: () => console.log("Deleted!"),
              style: "danger",
            },
            {
              icon: <PlusIcon />,
              text: "Add",
              onClick: () => console.log("Added!"),
            },
          ]}
        >
          <div className="flex-grow min-h-screen">eyo</div>
        </BodyCard>
        <div className="w-large" />
        <BodyCard
          title={"Regions"}
          subtitle={"Manage your Store's regions"}
          actionables={[
            {
              icon: <DuplicateIcon />,
              text: "Duplicate",
              onClick: () => console.log("Dedup"),
            },
            {
              icon: <TrashIcon />,
              text: "Delete",
              onClick: () => console.log("Deleted!"),
              style: "danger",
            },
            {
              icon: <PlusIcon />,
              text: "Add",
              onClick: () => console.log("Added!"),
            },
          ]}
          events={[{ text: "Save" }, { text: "Cancel Changes" }]}
        >
          <div className="flex-grow min-h-screen">eyo</div>
        </BodyCard>
      </div>
    </Layout>
  )
}

export default Test
