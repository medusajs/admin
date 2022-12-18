import { PriceListStatus } from "@medusajs/medusa"
import { useAdminCreatePriceList } from "medusa-react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Accordion from "../../../components/organisms/accordion"
import { nestedForm } from "../../../utils/nested-form"
import PriceListConfigurationForm from "../components/price-list-configuration-form"
import PriceListGeneralForm from "../components/price-list-general-form"
import PriceListPricesForm from "../components/price-list-prices-form"
import PriceListTypeForm from "../components/price-list-type-form"
import { NewPriceListFormData } from "../types"

const NewPriceList = () => {
  const form = useForm<NewPriceListFormData>()
  const { handleSubmit } = form

  const { mutate, isLoading } = useAdminCreatePriceList()

  const onSubmit = (status: PriceListStatus) =>
    handleSubmit((data) => {
      mutate({
        type: data.list_type.type,
        name: data.general.name,
        description: data.general.description,
        starts_at: data.configuration.starts_at,
        ends_at: data.configuration.ends_at,
        includes_tax: data.configuration.includes_tax,
        customer_groups: data.configuration.customer_groups,
        prices: data.prices.prices,
        status: status,
      })
    })

  return (
    <FocusModal>
      <FocusModal.Header>
        <div>
          <Button variant="secondary" size="small">
            <CrossIcon size="16" />
          </Button>
          <div>
            <Button
              variant="secondary"
              size="small"
              disabled={isLoading}
              loading={isLoading}
              onClick={() => onSubmit(PriceListStatus.DRAFT)}
            >
              Save as draft
            </Button>
            <Button
              variant="secondary"
              size="small"
              disabled={isLoading}
              loading={isLoading}
              onClick={() => onSubmit(PriceListStatus.ACTIVE)}
            >
              Publish price list
            </Button>
          </div>
        </div>
      </FocusModal.Header>
      <FocusModal.Main>
        <Accordion type="multiple" defaultValue={["list_type"]}>
          <Accordion.Item value="list_type" title="Price list type" required>
            <PriceListTypeForm form={nestedForm(form, "list_type")} />
          </Accordion.Item>
          <Accordion.Item value="general" title="General" required>
            <PriceListGeneralForm form={nestedForm(form, "general")} />
          </Accordion.Item>
          <Accordion.Item value="configuration" title="Configuration">
            <PriceListConfigurationForm
              form={nestedForm(form, "configuration")}
            />
          </Accordion.Item>
          <Accordion.Item value="list_prices" title="Prices" required>
            <PriceListPricesForm form={nestedForm(form, "prices")} />
          </Accordion.Item>
        </Accordion>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default NewPriceList
