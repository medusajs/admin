import React from "react"
import IconProps from "../types/icon-type"
import { default as SidedMouthFaceIconOriginal } from "./sided-mouth-face"

const SidedMouthFaceIcon: React.FC<IconProps> = ({
  size = "24px",
  color = "currentColor",
  ...attributes
}) => {
  return <SidedMouthFaceIconOriginal
    size={size}
    color={color}
    {...attributes}
  />
}

export default SidedMouthFaceIcon
