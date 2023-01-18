import {
  CreateStockLocationInput,
  StockLocationAddressInput,
} from "@medusajs/medusa"
import { useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../../components/molecules/modal/focus-modal"
import Accordion from "../../../../components/organisms/accordion"
import { nestedForm } from "../../../../utils/nested-form"
import AddressForm, {
  LocationAddressFormType,
} from "../components/address-form"
import GeneralForm, { GeneralFormType } from "../components/general-form"

type NewLocationForm = {
  general: GeneralFormType
  address: LocationAddressFormType
}

const NewLocation = ({ onClose }: { onClose: () => void }) => {
  const form = useForm<NewLocationForm>({
    defaultValues: {
      general: {
        name: "",
      },
      address: undefined,
    },
  })

  const { handleSubmit, formState } = form

  const onSubmit = () =>
    handleSubmit(async (data) => {
      const payload = createPayload(data)
      console.log({ payload })
    })

  const { isDirty, isValid, isSubmitting } = formState
  // console.log(formState)
  console.log({ isValid, isSubmitting })

  return (
    <form className="w-full">
      <FocusModal>
        <FocusModal.Header>
          <div className="flex justify-between w-full px-8 medium:w-8/12">
            <Button
              size="small"
              variant="ghost"
              type="button"
              onClick={onClose}
            >
              <CrossIcon size={20} />
            </Button>
            <div className="flex gap-x-small">
              <Button
                size="small"
                variant="secondary"
                type="button"
                disabled={!isDirty || !isValid}
                onClick={onSubmit()}
              >
                Add location
              </Button>
            </div>
          </div>
        </FocusModal.Header>
        <FocusModal.Main className="flex justify-center w-full no-scrollbar">
          <div className="medium:w-7/12 large:w-6/12 small:w-4/5 max-w-[700px] my-16">
            <h1 className="px-1 font-semibold mb-base text-grey-90 text-xlarge">
              Add new location
            </h1>
            <Accordion defaultValue={["general"]} type="multiple">
              <Accordion.Item
                value={"general"}
                title={"General Information"}
                required
              >
                <p className="inter-base-regular text-grey-50">
                  Specify the details about this location
                </p>
                <div className="flex flex-col mt-xlarge gap-y-xlarge">
                  <GeneralForm
                    form={nestedForm(form, "general")}
                    requireHandle={false}
                  />
                  <AddressForm form={nestedForm(form, "address")} />
                </div>
              </Accordion.Item>
              <Accordion.Item value={"sales_channels"} title={"Sales Channels"}>
                <h2>Sales Channels</h2>
              </Accordion.Item>
            </Accordion>
          </div>
        </FocusModal.Main>
      </FocusModal>
    </form>
  )
}

const createPayload = (data): CreateStockLocationInput => {
  const { general, address } = data
  let addressInput
  if (address.address_1) {
    addressInput = {
      address_1: address.address_1,
    } as StockLocationAddressInput
  }
  return { name: general.name, address: addressInput }
}

export default NewLocation
