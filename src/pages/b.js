import React from "react"
import DuplicateIcon from "../components/fundamentals/icons/duplicate-icon"
import PlusIcon from "../components/fundamentals/icons/plus-icon"
import TrashIcon from "../components/fundamentals/icons/trash-icon"
import BodyCard from "../components/organisms/body-card"
import Layout from "../components/templates/layout"
import TwoSplitPane from "../components/templates/two-split-pane"

const Test = () => {
  return (
    <Layout>
      <TwoSplitPane>
        <BodyCard
          title={"Regions"}
          subtitle={"Manage your Store's regions"}
          actionables={[
            {
              icon: <DuplicateIcon />,
              label: "Duplicate",
              onClick: () => console.log("Dedup"),
            },
            {
              icon: <PlusIcon />,
              label: "Add",
              onClick: () => console.log("Added!"),
            },
            {
              icon: <TrashIcon />,
              label: "Delete",
              onClick: () => console.log("Deleted!"),
              style: "danger",
            },
          ]}
        >
          <div className="flex-grow min-h-screen">eyo</div>
        </BodyCard>
        <BodyCard
          title={"Regions"}
          subtitle={"Manage your Store's regions"}
          actionables={[
            {
              icon: <DuplicateIcon />,
              label: "Duplicate",
              onClick: () => console.log("Dedup"),
            },
            {
              icon: <PlusIcon />,
              label: "Add",
              onClick: () => console.log("Added!"),
            },
            {
              icon: <TrashIcon />,
              label: "Delete",
              onClick: () => console.log("Deleted!"),
              style: "danger",
            },
          ]}
          events={[{ label: "Save" }, { label: "Cancel Changes" }]}
        >
          <div className="flex-grow min-h-screen">eyo</div>
        </BodyCard>
      </TwoSplitPane>
    </Layout>
  )
}

export default Test
