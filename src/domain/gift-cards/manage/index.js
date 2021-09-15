import React, { useState } from "react"
import styled from "@emotion/styled"
import { useForm, useFieldArray } from "react-hook-form"
import { Text, Flex, Box } from "rebass"
import { navigate } from "gatsby"

import Button from "../../../components/button"
import Input from "../../../components/input"
import ImageUpload from "../../../components/image-upload"
import TextArea from "../../../components/textarea"
import Spinner from "../../../components/spinner"

import Medusa from "../../../services/api"
import useMedusa from "../../../hooks/use-medusa"

import GiftCardDetail from "./detail"
import { persistedPrice } from "../../../utils/prices"

const Cross = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 5px;
  cursor: pointer;
`

const ImageCardWrapper = styled(Box)`
  position: relative;
  display: inline-block;
  height: 200px;
  width: 200px;
`

const StyledImageCard = styled(Box)`
  height: 200px;
  width: 200px;

  border: ${props => (props.selected ? "1px solid #53725D" : "none")};

  object-fit: contain;

  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.08) 0px 3px 9px 0px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;

  border-radius: 3px;
`

const StyledImageBox = styled(Flex)`
  flex-wrap: wrap;
  .img-container {
    border: 1px solid black;
    background-color: ${props => props.theme.colors.light};
    height: 50px;
    width: 50px;

    &:first-of-type {
      height: 230px;
      width: 100%;
      object-fit: contain;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
`

const NewGiftCard = ({}) => {
  const [images, setImages] = useState([])
  const { store } = useMedusa("store")
  const { control, register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      title: "Gift Card",
      denominations: [10, 50, 100],
    },
  })
  const { fields, append, remove } = useFieldArray({
    name: "denominations",
    control,
  })

  const parseProduct = data => {
    return {
      images,
      title: data.title,
      description: data.description,
      options: [{ title: "Denominations" }],
      is_giftcard: true,
      variants: data.denominations.map((v, index) => ({
        title: `${index + 1}`,
        prices: [
          {
            currency_code: store.default_currency_code,
            amount: v,
          },
        ],
        options: [{ value: v }],
      })),
    }
  }

  const submit = data => {
    const product = parseProduct(data)

    product.variants.forEach(variant => {
      variant.prices.forEach(
        price =>
          (price.amount = persistedPrice(price.currency_code, price.amount))
      )
    })

    Medusa.products.create(product).then(({ data }) => {
      navigate(`/a/products/${data.product.id}`)
    })
  }

  const onImageChange = e => {
    Medusa.uploads.create(e.target.files).then(({ data }) => {
      const uploaded = data.uploads.map(({ url }) => url)
      setImages(images.concat(uploaded))
    })
  }

  const handleImageDelete = url => {
    Medusa.uploads.delete(url[0]).then(() => {
      setImages(images.filter(im => im !== url))
    })
  }

  return (
    <Flex
      as="form"
      flexDirection="column"
      pb={6}
      pt={5}
      onSubmit={handleSubmit(submit)}
    >
      <Text mb={4}>Gift card product details</Text>
      <Flex mb={5}>
        <Box width={4 / 7}>
          <Input mb={4} label="Name" name="title" ref={register} />
          <TextArea label="Description" name="description" ref={register} />
        </Box>
      </Flex>
      <Flex mb={3}>
        <ImageUpload onChange={onImageChange} name="files" label="Images" />
      </Flex>
      <Flex mb={5}>
        <StyledImageBox>
          {images.map((url, i) => (
            <ImageCardWrapper key={i} mr={3}>
              <StyledImageCard key={i} as="img" src={url} sx={{}} />
              <Cross onClick={() => handleImageDelete(url)}>&#x2715;</Cross>
            </ImageCardWrapper>
          ))}
        </StyledImageBox>
      </Flex>
      <Text mb={4}>Denominations</Text>
      <Flex mb={5} flexDirection="column">
        {fields.map((d, index) => (
          <Flex mb={3} key={d.id}>
            <Input
              type="number"
              name={`denominations.${index}`}
              label="Value (Default Currency)"
              ref={register}
            />
          </Flex>
        ))}
        <Flex>
          <Button onClick={append} variant="primary">
            + Add denomination
          </Button>
        </Flex>
      </Flex>
      <Flex>
        <Button variant={"cta"} type="submit">
          Save
        </Button>
      </Flex>
    </Flex>
  )
}

const Manage = () => {
  const { products, isLoading } = useMedusa("products", {
    search: {
      is_giftcard: true,
    },
  })

  if (isLoading) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  if (products.length > 0) {
    return <GiftCardDetail id={products[0].id} />
  }

  return <NewGiftCard />
}

export default Manage
