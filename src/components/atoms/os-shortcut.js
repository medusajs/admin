import PropTypes from "prop-types"
import React from "react"

const OSShortcut = ({ winModifiers, macModifiers, keys }) => {
  const isMac = navigator?.platform?.toUpperCase().indexOf("MAC") >= 0 ?? true

  let modifiers

  if (isMac) {
    if (Array.isArray(macModifiers)) {
      modifiers = macModifiers.join("")
    } else {
      modifiers = macModifiers
    }
  } else {
    if (Array.isArray(winModifiers)) {
      modifiers = winModifiers.join(" + ")
    } else {
      modifiers = winModifiers
    }
  }

  let input

  if (Array.isArray(keys)) {
    input = keys.join(" + ")
  } else {
    input = keys
  }

  return (
    <div className="flex items-center text-grey-40">
      <p className="m-0 inter-base-semibold">
        <span className="inter-base-regular">{modifiers}</span>
        {input}
      </p>
    </div>
  )
}

OSShortcut.propTypes = {
  winModifiers: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  macModifiers: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  keys: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
}

export default OSShortcut
