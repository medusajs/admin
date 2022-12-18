import Section from "../../../../../components/organisms/section"
import PriceListProductsTable from "./price-list-products-table"

type Props = {
  priceListId: string
}

const PriceListPricesSection = ({ priceListId }: Props) => {
  return (
    <Section title="Prices">
      <PriceListProductsTable priceListId={priceListId} />
    </Section>
  )
}

export default PriceListPricesSection
