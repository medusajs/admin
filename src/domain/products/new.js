import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Flex, Box } from "rebass"

import Input from "../../components/input"

const NewProduct = ({}) => {
  const { register } = useForm()

  return (
    <form>
      <Flex>
        <Box width={4 / 7}>
          <Input name="title" register={register} />
        </Box>
          <Box width={3 / 7}>
            Images
            </Box>
      </Flex>
    </form>
  )
}

export default NewProduct
