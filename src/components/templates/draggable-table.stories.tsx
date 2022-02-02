import { ComponentMeta, ComponentStory, storiesOf } from "@storybook/react"
import React, { useState } from "react"
import DraggableTable from "./draggable-table"

// export default {
//   title: "Organisms/DraggableTable",
//   component: DraggableTable,
// } as ComponentMeta<typeof DraggableTable>

// const Template: ComponentStory<typeof DraggableTable> = (args) => (
//   <div className="h-large w-large">
//     <DraggableTable {...args} />
//   </div>
// )

// const [entities, setEntities] = useState([
//   {
//     id: "1",
//     role: "member",
//   },
//   {
//     id: "2",
//     role: "member",
//   },
//   {
//     id: "3",
//     role: "member",
//   },
//   {
//     id: "4",
//     role: "member",
//   },
//   {
//     id: "5",
//     role: "member",
//   },
//   {
//     id: "6",
//     role: "member",
//   },
//   {
//     id: "7",
//     role: "member",
//   },
// ])

const columns = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Role",
    accessor: "role",
  },
]

storiesOf("Templates/DraggableTable", module).add("DraggableTable", () => {
  const [entities, setEntities] = useState([
    {
      id: "1",
      role: "member",
    },
    {
      id: "2",
      role: "member",
    },
    {
      id: "3",
      role: "member",
    },
    {
      id: "4",
      role: "member",
    },
    {
      id: "5",
      role: "member",
    },
    {
      id: "6",
      role: "member",
    },
    {
      id: "7",
      role: "member",
    },
  ])
  return (
    <DraggableTable
      entities={entities}
      setEntities={setEntities}
      columns={columns}
    />
  )
})

const Template: ComponentStory<typeof DraggableTable> = (args) => (
  <div className="h-large w-large">
    <DraggableTable {...args} />
  </div>
)

export const Default = Template.bind({})
DraggableTable.args = {
  // entities: entities,
  // setEntities: setEntities,
  columns: columns,
}

// <DraggableTable
//   entities={entities}
//   setEntities={setEntities}
//   columns={columns}
// />
