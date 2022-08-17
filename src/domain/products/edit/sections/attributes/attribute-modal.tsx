import { Product } from "@medusajs/medusa"
import React, { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import InputField from "../../../../../components/molecules/input"
import Modal from "../../../../../components/molecules/modal"
import Select from "../../../../../components/molecules/select"
import { Option } from "../../../../../types/shared"
import { countries } from "../../../../../utils/countries"
import FormValidator from "../../../../../utils/form-validator"
import useEditProductActions from "../../hooks/use-edit-product-actions"

type Props = {
  product: Product
  open: boolean
  onClose: () => void
}

type AttributesForm = {
  width: number | null
  height: number | null
  length: number | null
  weight: number | null
  mid_code: string | null
  hs_code: string | null
  origin_country: Option | null
}

const AttributeModal = ({ product, open, onClose }: Props) => {
  const { onUpdate, updating } = useEditProductActions(product.id)
  const {
    register,
    control,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
  } = useForm<AttributesForm>({
    defaultValues: getDefaultValues(product),
  })

  useEffect(() => {
    reset(getDefaultValues(product))
  }, [product])

  const onReset = () => {
    reset(getDefaultValues(product))
    onClose()
  }

  const onSubmit = handleSubmit((data) => {
    onUpdate(
      {
        // @ts-ignore
        weight: data.weight,
        // @ts-ignore
        width: data.width,
        // @ts-ignore
        height: data.height,
        // @ts-ignore
        length: data.length,
        // @ts-ignore
        mid_code: data.mid_code,
        // @ts-ignore
        hs_code: data.hs_code,
        // @ts-ignore
        origin_country: data.origin_country,
      },
      onReset
    )
  })

  const countryOptions = countries.map((c) => ({
    label: c.name,
    value: c.alpha2,
  }))

  return (
    <Modal open={open} handleClose={onReset} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">Edit Attributes</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="mb-xlarge">
              <h2 className="inter-large-semibold mb-2xsmall">Dimensions</h2>
              <p className="inter-base-regular text-grey-50 mb-large">
                Configure to calculate the most accurate shipping rates
              </p>
              <div className="grid grid-cols-4 gap-x-large">
                <InputField
                  label="Width"
                  placeholder="100"
                  type="number"
                  {...register("width", {
                    min: FormValidator.nonNegativeNumberRule("Width"),
                    valueAsNumber: true,
                  })}
                  errors={errors}
                />
                <InputField
                  label="Length"
                  placeholder="100"
                  type="number"
                  {...register("length", {
                    min: FormValidator.nonNegativeNumberRule("Length"),
                    valueAsNumber: true,
                  })}
                  errors={errors}
                />
                <InputField
                  label="Height"
                  placeholder="100"
                  type="number"
                  {...register("height", {
                    min: FormValidator.nonNegativeNumberRule("Height"),
                    valueAsNumber: true,
                  })}
                  errors={errors}
                />
                <InputField
                  label="Weight"
                  placeholder="100"
                  type="number"
                  {...register("weight", {
                    min: FormValidator.nonNegativeNumberRule("Weight"),
                    valueAsNumber: true,
                  })}
                  errors={errors}
                />
              </div>
            </div>
            <div>
              <h2 className="inter-large-semibold mb-2xsmall">Customs</h2>
              <p className="inter-base-regular text-grey-50 mb-large">
                Configure to calculate the most accurate shipping rates
              </p>
              <div className="grid grid-cols-2 gap-large">
                <InputField
                  label="MID Code"
                  placeholder="XDSKLAD9999"
                  {...register("mid_code", {
                    pattern: FormValidator.whiteSpaceRule("MID Code"),
                  })}
                  errors={errors}
                />
                <InputField
                  label="HS Code"
                  placeholder="BDJSK39277W"
                  {...register("hs_code", {
                    pattern: FormValidator.whiteSpaceRule("HS Code"),
                  })}
                  errors={errors}
                />
                <Controller
                  name="origin_country"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        label="Country of origin"
                        options={countryOptions}
                        {...field}
                      />
                    )
                  }}
                />
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex gap-x-2 justify-end w-full">
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={onReset}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                disabled={!isDirty}
                loading={updating}
              >
                Save
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (product: Product): AttributesForm => {
  const country = countries.find(
    (country) => country.alpha2 === product.origin_country
  )
  const countryOption = country
    ? { label: country.name, value: country.alpha2 }
    : null

  return {
    weight: product.weight,
    width: product.width,
    height: product.height,
    length: product.length,
    mid_code: product.mid_code,
    hs_code: product.hs_code,
    origin_country: countryOption,
  }
}

export default AttributeModal
