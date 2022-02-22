import { useAdminCreateTaxRate } from "medusa-react"
import React, { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import Actionables from "../../../components/molecules/actionables"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import Input from "../../../components/molecules/input"
import Badge from "../../../components/fundamentals/badge"
import Modal from "../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../components/molecules/modal/layered-modal"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import TaxRuleSelector from "./tax-rule-selector"
import { TaxRuleItem } from "./tax-rule-item"

const NewTaxRate = ({ regionId, onDismiss }) => {
  const createTaxRate = useAdminCreateTaxRate()
  const { register, setValue, handleSubmit, watch } = useForm({
    defaultValues: {
      products: [],
      product_types: [],
      shipping_options: [],
    },
  })
  const notification = useNotification()

  const layeredModalContext = useContext(LayeredModalContext)

  const onSave = (data) => {
    createTaxRate.mutate(data, {
      onSuccess: () => {
        notification("Success", "Successfully created tax rate.", "success")
        onDismiss()
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  useEffect(() => {
    register("region_id")
    setValue("region_id", regionId)
    register("products")
    register("product_types")
    register("shipping_options")
  }, [])

  const rules = watch(["products", "product_types", "shipping_options"])

  const handleOverridesSelected = (rule) => {
    switch (rule.type) {
      case "products":
        setValue("products", rule.items)
        break
      case "product_types":
        setValue("product_types", rule.items)
        break
      case "shipping_options":
        setValue("shipping_options", rule.items)
        break
      default:
        break
    }
  }

  return (
    <LayeredModal
      isLargeModal
      context={layeredModalContext}
      handleClose={onDismiss}
    >
      <form onSubmit={handleSubmit(onSave)}>
        <Modal.Body>
          <Modal.Header handleClose={onDismiss}>
            <div>
              <h1 className="inter-xlarge-semibold">Add Tax Rate</h1>
            </div>
          </Modal.Header>
          <Modal.Content>
            <div>
              <p className="inter-base-semibold mb-base">Details</p>
              <Input
                name="name"
                label="Name"
                placeholder="Rate name"
                ref={register({ required: true })}
                className="mb-base min-w-[335px] w-full"
              />
              <Input
                type="number"
                min={0}
                max={100}
                step={0.01}
                name="rate"
                label="Rate"
                placeholder="12"
                ref={register({ min: 0, max: 100, required: true })}
                className="mb-base min-w-[335px] w-full"
              />
              <Input
                placeholder="1000"
                name="code"
                label="Code"
                ref={register({ required: true })}
                className="mb-base min-w-[335px] w-full"
              />
            </div>
            <div>
              <p className="inter-base-semibold mb-base">Overrides</p>
              {(rules.product_types.length > 0 ||
                rules.products.length > 0 ||
                rules.shipping_options.length > 0) && (
                <div className="flex flex-col gap-base">
                  {rules.products.length > 0 && (
                    <TaxRuleItem
                      onDelete={() =>
                        handleOverridesSelected({ type: "products", items: [] })
                      }
                      onEdit={() => {
                        layeredModalContext.push(
                          SelectOverridesScreen(
                            layeredModalContext.pop,
                            regionId,
                            handleOverridesSelected,
                            {
                              items: rules.products,
                              type: "products",
                            }
                          )
                        )
                      }}
                      index={1}
                      name="Product Rules"
                      description={`Applies to ${
                        rules.products.length
                      } product${rules.products.length > 1 ? "s" : ""}`}
                    />
                  )}
                  {rules.product_types.length > 0 && (
                    <TaxRuleItem
                      onDelete={() =>
                        handleOverridesSelected({
                          type: "product_types",
                          items: [],
                        })
                      }
                      onEdit={() => {
                        layeredModalContext.push(
                          SelectOverridesScreen(
                            layeredModalContext.pop,
                            regionId,
                            handleOverridesSelected,
                            {
                              items: rules.product_types,
                              type: "product_types",
                            }
                          )
                        )
                      }}
                      index={2}
                      name="Product Type Rules"
                      description={`Applies to ${
                        rules.product_types.length
                      } product type${
                        rules.product_types.length > 1 ? "s" : ""
                      }`}
                    />
                  )}
                  {rules.shipping_options.length > 0 && (
                    <TaxRuleItem
                      onDelete={() =>
                        handleOverridesSelected({
                          type: "shipping_options",
                          items: [],
                        })
                      }
                      onEdit={() => {
                        layeredModalContext.push(
                          SelectOverridesScreen(
                            layeredModalContext.pop,
                            regionId,
                            handleOverridesSelected,
                            {
                              items: rules.shipping_options,
                              type: "shipping_options",
                            }
                          )
                        )
                      }}
                      index={3}
                      name="Shipping Option Rules"
                      description={`Applies to ${
                        rules.shipping_options.length
                      } shipping option${
                        rules.shipping_options.length > 1 ? "s" : ""
                      }`}
                    />
                  )}
                </div>
              )}
              {!(
                rules.product_types.length > 0 &&
                rules.products.length > 0 &&
                rules.shipping_options.length > 0
              ) && (
                <Button
                  type="button"
                  onClick={() => {
                    layeredModalContext.push(
                      SelectOverridesScreen(
                        layeredModalContext.pop,
                        regionId,
                        handleOverridesSelected
                      )
                    )
                  }}
                  className="w-full mt-base"
                  size="medium"
                  variant="secondary"
                >
                  <PlusIcon /> Add Overrides
                </Button>
              )}
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full">
              <Button
                type="button"
                onClick={onDismiss}
                variant="ghost"
                size="small"
                className="w-eventButton justify-center"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="small"
                className="w-eventButton justify-center"
              >
                Create
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </LayeredModal>
  )
}

const SelectOverridesScreen = (
  pop,
  regionId,
  onOverridesSelected,
  options = {}
) => {
  return {
    title: "Add override",
    onBack: () => pop(),
    view: (
      <TaxRuleSelector
        regionId={regionId}
        onSubmit={onOverridesSelected}
        {...options}
      />
    ),
  }
}

export default NewTaxRate
