import Nestable from "react-nestable"
import clsx from "clsx"

import FolderOpenIcon from "../../components/fundamentals/icons/folder-open-icon"
import DotsSixIcon from "../../components/fundamentals/icons/dots-six-icon"
import TagIcon from "../../components/fundamentals/icons/tag-icon"
import TriangleRightMiniIcon from "../../components/fundamentals/icons/triangle-right-mini-icon"
import TriangleDownMiniIcon from "../../components/fundamentals/icons/triangle-down-mini-icon"

import "../../../src/assets/styles/nestable.css"

export const Draggable = (props) => {
  const { items } = props

  const Handler = () => (
    <DotsSixIcon className="inline-block" size={26} />
  )

  const CollapseComponent = (obj) => {
    if (obj.isCollapsed) {
      return <TriangleRightMiniIcon className="inline-block collapsable" size={20} color={"#889096"} />
    } else {
      return <TriangleDownMiniIcon className="inline-block collapsable" size={20} color={"#889096"} />
    }
  }

  const renderItem = ({ item, handler, collapseIcon }) => {
    const withChildren = (item.category_children || []).length > 0
    const isRootNode = !!!item.parent_category_id

    return (
      <div className={
        clsx(
          "nested-draggable-display relative",
          {
            "with-nesting": withChildren,
            "root-node": isRootNode,
          },
        )
      }>
        {handler}
        {collapseIcon}
        {(withChildren || isRootNode) ? <FolderOpenIcon className="inline-block" size={20} /> : <TagIcon className="inline-block" size={20} />}
        <span className="item-text">{item.name}</span>
      </div>
    )
  }

  return (
    <Nestable
      items={items}
      renderItem={renderItem}
      childrenProp={"category_children"}
      handler={<Handler />}
      renderCollapseIcon={CollapseComponent}
    />
  )
}

export default Draggable
