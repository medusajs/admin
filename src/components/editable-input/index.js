import React, { useState, useEffect } from "react"
import { Text, Box } from "rebass"
import { ReactComponent as Edit } from "../../assets/svg/edit.svg"

const EditableInput = ({
  text,
  type,
  placeholder,
  childRef,
  children,
  onBlur,
  ...props
}) => {
  const [isEditing, setEditing] = useState(false)

  const onKeyDown = event => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === "Enter") {
      event.preventDefault()
      event.stopPropagation()
      setEditing(false)
      onBlur()
    }
  }

  const handleClickOutside = event => {
    if (
      childRef.current &&
      !childRef.current.contains(event.target) &&
      isEditing
    ) {
      setEditing(false)
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  })

  return (
    <section {...props}>
      {isEditing ? (
        <div
          onBlur={() => {
            onBlur()
            setEditing(false)
          }}
          onKeyDown={e => onKeyDown(e, type)}
        >
          {children}
        </div>
      ) : (
        <Box
          p={3}
          onClick={() => setEditing(true)}
          display="flex"
          flexDirection="row"
          verticalAlign="middle"
          alignItems="center"
        >
          <Text mr={1} fontWeight="bold">
            {text}
          </Text>
          <Edit />
        </Box>
      )}
    </section>
  )
}

export default EditableInput
