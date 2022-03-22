import React from "react"
import clsx from "clsx"

import MoreHorizontalIcon from "../../fundamentals/icons/more-horizontal-icon"
import MinusIcon from "../../fundamentals/icons/minus-icon"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import Button from "../../fundamentals/button"
import Actionables, { ActionType } from "../actionables"

type CollabsibleTreeProps = {
  className?: string
  children: React.ReactNode[]
}

type CollabsibleTreeParentProps = {
  actions?: ActionType[]
  open?: boolean
  setOpen?: (v: boolean) => void
  className?: string
  children: React.ReactNode[]
  __TYPE?: string
}

type CollabsibleTreeLeafProps = {
  actions?: ActionType[]
  className?: string
  children: React.ReactNode[]
  __TYPE?: string
}


type CollabsibleTreeType = React.FC<CollabsibleTreeProps> & {
  Parent: React.FC<CollabsibleTreeParentProps>
  Leaf: React.FC<CollabsibleTreeLeafProps>
}

export const CollabsibleTree: CollabsibleTreeType = ({
  children,
  className
}) => {
  const [open, setOpen] = React.useState(false)

  const trigger = React.Children.toArray(children).find((child) => {
    if (typeof child === "object" && "props" in child) {
      return child.props.__TYPE === "CollabsibleTreeParent"
    }
    return false
  })

  const leaves = React.Children.toArray(children).filter((child) => {
    if (typeof child === "object" && "props" in child) {
      return child.props.__TYPE === "CollabsibleTreeLeaf"
    }
    return false
  })

  if (!React.isValidElement(trigger)) {
    throw Error("CollabsibleTree must have a CollabsibleTree.Parent child")
  }

  return (
    <div className={className}>
      {React.cloneElement(trigger, { open, setOpen })}
      <div
        className={clsx("pl-5 mt-xsmall", {
          hidden: !open,
          "animate-fade-in-top": open,
        })}
      >
        {leaves}
      </div>
    </div>
  )
}


const CollabsibleTreeParent: React.FC<CollabsibleTreeParentProps> = ({
  actions,
  className,
  children,
  open,
  setOpen
}) => {
  return (
    <div>
      <Container className={className}>
        <div className="flex items-center justify-between">
          <div className="gap-x-small flex items-center">{children}</div>
          <div className="flex items-center gap-x-xsmall">
            <Actionables customTrigger={Trigger()} actions={actions} />
            <div className="h-5 w-px rounded-circle bg-grey-20" />
            <Button
              variant="ghost"
              size="small"
              className="p-[6px] text-grey-50"
              onClick={() => setOpen && setOpen(!open)}
            >
              {open ? <MinusIcon size={20} /> : <PlusIcon size={20} />}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

CollabsibleTree.Parent = CollabsibleTreeParent

const CollabsibleTreeLeaf: React.FC<CollabsibleTreeLeafProps> = ({
  className,
  children,
  actions
}) => {
  return (
    <div
      className={clsx(
        "group flex items-center relative pb-xsmall last:pb-0",
        className
      )}
    >
      <div className="absolute top-0 left-0 bottom-0">
        <div className="border-l border-dashed border-grey-20 h-1/2 w-px" />
        <div className="h-1/2 border-l border-dashed border-grey-20 w-px group-last:border-none"></div>
      </div>
      <div className="w-[13px] h-px border-t border-grey-20 border-dashed mr-xsmall" />
      <Container className="w-full flex items-center justify-between inter-small-regular">
        {children}
        {actions && <Actionables customTrigger={Trigger()} actions={actions} />}
      </Container>
    </div>
  )
}

CollabsibleTree.Leaf = CollabsibleTreeLeaf

const Container: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        "rounded-rounded border border-grey-20 py-2xsmall px-small",
        className
      )}
    >
      {children}
    </div>
  )
}

const Trigger = () => {
  return (
    <Button variant="ghost" size="small" className="p-[6px] text-grey-50">
      <MoreHorizontalIcon size={20} />
    </Button>
  )
}

CollabsibleTreeParent.defaultProps = {
  __TYPE: "CollabsibleTreeParent",
}

CollabsibleTreeLeaf.defaultProps = {
  __TYPE: "CollabsibleTreeLeaf",
}
