import React, { useState, useEffect } from "react"
import styled from "@emotion/styled"
import { useForm } from "react-hook-form"
import { Text, Flex, Box } from "rebass"
import { navigate } from "gatsby"
import Typography from "../../../components/typography"

import Button from "../../../components/button"
import Pill from "../../../components/pill"
import Input from "../../../components/input"
import Spinner from "../../../components/spinner"
import CurrencyInput from "../../../components/currency-input"
import TagInput from "../../../components/tag-input"
import ImageUpload from "../../../components/image-upload"
import TextArea from "../../../components/textarea"
import VariantGrid from "../../../components/variant-grid"

import Medusa from "../../../services/api"
import useMedusa from "../../../hooks/use-medusa"

import { getCombinations } from "./utils/get-combinations"

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

const RequiredLabel = styled.div`
  ${Typography.Base}
  ${props =>
    props.inline
      ? `
  text-align: right;
  padding-right: 15px;
  `
      : `
  padding-bottom: 10px;
  `}

  &:after {
    color: rgba(255, 0, 0, 0.5);
    content: " *";
  }
`

const NewProduct = ({}) => {
  const [hasVariants, setHasVariants] = useState(true)
  const [variants, setVariants] = useState([])
  const [options, setOptions] = useState([])
  const [images, setImages] = useState([])
  const [prices, setPrices] = useState([])
  const [currencyOptions, setCurrencyOptions] = useState([])
  const { store, isLoading, toaster } = useMedusa("store")
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    errors,
    clearErrors,
  } = useForm()

  /**
   * Will be called everytime an option has changed. It will then recalculate
   * the combinations of variants that may exist.
   */
  useEffect(() => {
    const os = [...options]
    const combinations = getCombinations(os)

    const newVariants = combinations.map(optionValues => {
      if (!optionValues) {
        return null
      }

      const existing = variants.find(v =>
        v.options.every((value, index) => optionValues[index] === value)
      ) || { prices: [] }

      existing.options = optionValues.filter(v => v !== "")

      return existing
    })

    setVariants(newVariants.filter(v => !!v))
  }, [options])

  const getCurrencyOptions = () => {
    return ((store && store.currencies) || [])
      .map(v => ({
        value: v,
      }))
      .filter(o => !prices.find(p => !p.edit && p.currency_code === o.value))
  }

  /**
   * Determines the currency options.
   */
  useEffect(() => {
    // Add the default currency
    if (store && prices.length === 0) {
      setPrices([
        {
          currency_code: store.default_currency,
          amount: "",
          edit: false,
        },
      ])
    }
    setCurrencyOptions(getCurrencyOptions())
  }, [store, isLoading, prices])

  const handlePriceChange = (index, e) => {
    const element = e.target
    const value = element.value

    const newPrices = [...prices]
    newPrices[index] = {
      ...newPrices[index],
      amount: value,
    }

    setPrices(newPrices)
  }

  const onSave = () => {
    onChange(prices)
    setShow(false)
  }

  const removePrice = index => {
    const newPrices = [...prices]
    newPrices.splice(index, 1)
    setPrices(newPrices)
  }

  const addPrice = () => {
    const newPrices = [
      ...prices,
      {
        edit: true,
        region: "",
        currency_code: currencyOptions[0].value,
        amount: "",
      },
    ]

    setPrices(newPrices)
  }

  const handleCurrencySelected = (index, currency) => {
    const newPrices = [...prices]
    newPrices[index] = {
      ...newPrices[index],
      currency_code: currency,
    }

    setPrices(newPrices)
  }

  /**
   * Updates one of the values in a option.
   */
  const updateOptionValue = (index, values) => {
    const newOptions = [...options]
    newOptions[index] = {
      ...newOptions[index],
      values,
    }

    setValue(`options[${index}].values`, values)
    setOptions(newOptions)
  }

  const updateOptionName = (e, index) => {
    const element = e.target
    const newOptions = [...options]
    newOptions[index] = {
      ...newOptions[index],
      name: element.value,
    }

    setValue(`options[${index}].name`, element.value)
    setOptions(newOptions)
  }

  const handleRemoveOption = index => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
  }

  const handleAddOption = e => {
    setOptions([
      ...options,
      {
        name: "",
        values: [],
      },
    ])
  }

  const parseProduct = data => {
    let parseOptions = [
      {
        name: "Default Option",
      },
    ]

    let parseVariants = [
      {
        title: data.title,
        sku: data.sku,
        ean: data.ean,
        inventory_quantity: data.inventory_quantity,
        prices: prices.map(({ currency_code, amount }) => ({
          currency_code,
          amount,
        })),
        options: [{ value: "Default Variant" }],
      },
    ]

    if (hasVariants) {
      parseOptions = options
      parseVariants = variants.map(v => ({
        title: v.title,
        sku: v.sku,
        ean: v.ean,
        inventory_quantity: v.inventory_quantity,
        prices: v.prices.map(({ currency_code, amount }) => ({
          currency_code,
          amount,
        })),
        options: v.options.map(o => ({ value: o })),
      }))
    }

    return {
      images,
      title: data.title,
      description: data.description,
      options: parseOptions.map(o => ({ title: o.name })),
      variants: parseVariants,
    }
  }

  const onAddMore = data => {
    const product = parseProduct(data)
    Medusa.products.create(product).then(({ data }) => {
      reset()
      setPrices([])
      setVariants([])
      setOptions([])
    })
  }

  const submit = async data => {
    const product = parseProduct(data)

    if (!variants.length) {
      toaster(
        `Missing variants. Consider using the simple product, if only one variant should exists`,
        "error"
      )
      return
    }

    try {
      const { data } = await Medusa.products.create(product)
      navigate(`/a/products/${data.product._id}`)
    } catch (error) {
      console.log(error.response)
      const errorData = error.response.data.message
      toaster(`${errorData[0].message}`, "error")
    }
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

  useEffect(() => {
    if (Object.keys(errors).length) {
      const requiredErrors = Object.keys(errors).map(err => {
        if (errors[err].type === "required") {
          return err
        }
      })

      toaster(`Missing info: ${requiredErrors.join(", ")}`, "error")
    }
  }, [errors])

  return (
    <Flex as="form" pb={6} onSubmit={handleSubmit(submit)} pt={5}>
      <Flex mx="auto" width="100%" maxWidth="750px" flexDirection="column">
        <Text mb={4}>Product Details</Text>
        <Flex mb={5}>
          <Box width={4 / 7}>
            <Input
              required={true}
              mb={4}
              label="Name"
              placeholder="Jacket, sunglasses, etc."
              name="title"
              ref={register({ required: "Title is required" })}
            />
            <TextArea
              required={true}
              label="Description"
              placeholder="Short description of the product"
              name="description"
              ref={register({ required: "Description is required" })}
            />
            <Flex mt={4} alignItems="center">
              <Pill
                onClick={() => {
                  clearErrors()
                  setHasVariants(false)
                }}
                active={!hasVariants}
                mr={4}
              >
                Simple Product
              </Pill>
              <Pill
                onClick={() => {
                  setHasVariants(true)
                  clearErrors()
                }}
                active={hasVariants}
              >
                Product with Variants
              </Pill>
            </Flex>
          </Box>
        </Flex>
        <hr />
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
        <hr />
        {hasVariants ? (
          <>
            <Text fontSize={2} mb={3}>
              Options
            </Text>
            <Flex mb={5} flexDirection="column">
              {options.map((o, index) => (
                <Flex mb={4} key={index} alignItems="flex-end">
                  <Box>
                    <Input
                      name={`options[${index}].name`}
                      onChange={e => updateOptionName(e, index)}
                      label="Option Name"
                      required={true}
                      value={o.name}
                    />
                  </Box>
                  <Box mx={3} flexGrow="1">
                    <TagInput
                      values={o.values}
                      onChange={values => updateOptionValue(index, values)}
                    />
                  </Box>
                  <Box>
                    <Text
                      fontSize={4}
                      onClick={() => handleRemoveOption(index)}
                      sx={{ cursor: "pointer", height: "28px" }}
                    >
                      &times;
                    </Text>
                  </Box>
                </Flex>
              ))}
              <Button onClick={handleAddOption} variant="primary">
                + Add an option
              </Button>
            </Flex>
            {variants && variants.length > 0 && (
              <>
                <Text mb={4}>Variants</Text>
                <Flex flexDirection="column" flexGrow="1">
                  <VariantGrid
                    variants={variants}
                    onChange={vs => setVariants(vs)}
                  />
                </Flex>
              </>
            )}
          </>
        ) : (
          <>
            <Text mb={5}>Additional Options</Text>
            <Flex mb={5}>
              {isLoading ? (
                <Spinner />
              ) : (
                <Flex flexDirection="column">
                  {prices.map((p, index) => (
                    <Flex mb={3} key={`${p.currency_code}${index}`}>
                      <Box>
                        <CurrencyInput
                          edit={p.edit}
                          inline
                          required={true}
                          width="600px"
                          currency={p.currency_code}
                          currencyOptions={currencyOptions}
                          value={p.amount}
                          onCurrencySelected={currency =>
                            handleCurrencySelected(index, currency)
                          }
                          onChange={e => handlePriceChange(index, e)}
                          label={index === 0 ? "Price" : " "}
                          removable={index !== 0}
                          onRemove={() => removePrice(index)}
                        />
                      </Box>
                    </Flex>
                  ))}
                  <Flex>
                    <Box flex={"30% 0 0"} />
                    <Button
                      flex={"0 0 auto"}
                      onClick={addPrice}
                      variant="primary"
                    >
                      + Add more prices
                    </Button>
                  </Flex>
                  <Input
                    inline
                    mt={4}
                    required={true}
                    placeholder={"SUN-G, JK1234, etc."}
                    name={`sku`}
                    label="Stock Keeping Unit (SKU)"
                    ref={register({ required: true })}
                  />
                  <Input
                    inline
                    mt={4}
                    required={true}
                    placeholder={"1231231231234, etc."}
                    name={`ean`}
                    label="Barcode (EAN)"
                    ref={register({ required: true })}
                  />
                  <Input
                    inline
                    mt={4}
                    required={true}
                    type="number"
                    placeholder={"0-∞"}
                    name={`inventory_quantity`}
                    label="Quantity in stock"
                    ref={register({ required: true })}
                  />
                </Flex>
              )}
            </Flex>
          </>
        )}

        <Flex pt={5}>
          <Box ml="auto" />
          <Button mr={2} onClick={handleSubmit(onAddMore)} variant={"primary"}>
            Save and add more
          </Button>
          <Button variant={"cta"} type="submit">
            Save
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default NewProduct
