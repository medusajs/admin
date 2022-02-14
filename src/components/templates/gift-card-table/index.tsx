import moment from "moment"
import React, { useEffect, useState } from "react"
import { formatAmountWithSymbol } from "../../../utils/prices"
import StatusIndicator from "../../fundamentals/status-indicator"
import InfoTooltip from "../../molecules/info-tooltip"
import Table from "../../molecules/table"
import { FilteringOptionProps } from "../../molecules/table/filtering-option"

type GiftCardTableProps = {
  giftCards: any[]
}

const GiftCardTable: React.FC<GiftCardTableProps> = ({ giftCards }) => {
  const [shownGiftCards, setShowngiftCards] = useState<any[]>(giftCards)
  const [
    originalAmountSortDirection,
    setOriginalAmountSortDirection,
  ] = useState(undefined)
  const [
    remainingAmountSortDirection,
    setRemainingAmountSortDirection,
  ] = useState(undefined)
  const [createdAtSortDirection, setCreatedAtSortDirection] = useState(
    undefined
  )

  const [sortingClicked, setSortingClicked] = useState(false)

  const [filteringOptions, setFilterinOptions] = useState<
    FilteringOptionProps[]
  >([])

  const handleSort = () => {
    // TODO Correct sorting with api update
  }

  useEffect(() => {
    if (sortingClicked) {
      handleSort()
    }
    setSortingClicked(false)
  }, [sortingClicked])

  useEffect(() => {
    if (!giftCards) {
      return
    }
    const creationTimeOptions = giftCards.reduce((prev, curr) => {
      const year = moment(curr.created_at).format("YYYY")
      prev[year] = [...(prev[year] || []), curr]
      return prev
    }, {})

    // TODO correct filtering with api update
    setFilterinOptions([
      {
        title: "Creation time",
        options: [
          {
            title: "All",
            count: giftCards.length,
            onClick: () => setShowngiftCards(giftCards),
          },
          ...Object.keys(creationTimeOptions).map((co) => {
            return {
              title: co,
              count: creationTimeOptions[co].length,
              onClick: () => setShowngiftCards(creationTimeOptions[co]),
            }
          }),
        ],
      },
      {
        title: "Status",
        options: [
          {
            title: "All",
            count: giftCards.length,
            onClick: () => setShowngiftCards(giftCards),
          },
          {
            title: "None",
            count: giftCards.filter((gc) => !gc.balance).length,
            onClick: () =>
              setShowngiftCards(giftCards.filter((gc) => !gc.balance)),
          },
          {
            title: "Value left",
            count: giftCards.filter((gc) => gc.balance).length,
            onClick: () =>
              setShowngiftCards(giftCards.filter((gc) => gc.balance)),
          },
        ],
      },
    ])

    setShowngiftCards(giftCards)
  }, [giftCards])

  const getGiftCardRow = (giftCard, index) => {
    return (
      <Table.Row
        linkTo={`/a/gift-cards/${giftCard.id}`}
        key={`giftCard-${index}`}
        color={"inherit"}
      >
        <Table.Cell className="w-[200px] truncate">{giftCard.code}</Table.Cell>
        <Table.Cell
          className="truncate"
          {...(giftCard.order && {
            linkTo: `/a/orders/${giftCard.order.id}`,
          })}
        >
          {giftCard.order ? `# ${giftCard.order.display_id}` : "-"}
        </Table.Cell>
        <Table.Cell>
          {giftCard?.region ? (
            formatAmountWithSymbol({
              amount: giftCard.value,
              currency: giftCard.region.currency_code,
            })
          ) : (
            <div className="flex items-center space-x-2">
              <span>N / A</span>
              <InfoTooltip content={"Region has been deleted"} />
            </div>
          )}
        </Table.Cell>
        <Table.Cell className="">
          {giftCard.balance ? (
            giftCard?.region ? (
              formatAmountWithSymbol({
                amount: giftCard.value,
                currency: giftCard.region.currency_code,
              })
            ) : (
              <div className="flex items-center space-x-2">
                <span>N / A</span>
                <InfoTooltip content={"Region has been deleted"} />
              </div>
            )
          ) : (
            <StatusIndicator title="None" variant="danger" />
          )}
        </Table.Cell>
        <Table.Cell className="truncate">
          {moment(giftCard.created_at).format("MMM Do YYYY")}
        </Table.Cell>
        <Table.Cell></Table.Cell>
      </Table.Row>
    )
  }

  const handleGiftCardSearch = (term: string) => {}

  return (
    <div className="w-full h-full overflow-y-auto">
      <Table
        filteringOptions={filteringOptions}
        enableSearch
        searchPlaceholder={"Search Gift Cards"}
        handleSearch={handleGiftCardSearch}
      >
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell>Code</Table.HeadCell>
            <Table.HeadCell>Order</Table.HeadCell>
            <Table.SortingHeadCell
              sortDirection={originalAmountSortDirection}
              setSortDirection={setOriginalAmountSortDirection}
              onSortClicked={() => setSortingClicked(true)}
            >
              Original amount
            </Table.SortingHeadCell>
            <Table.SortingHeadCell
              sortDirection={remainingAmountSortDirection}
              setSortDirection={setRemainingAmountSortDirection}
              onSortClicked={() => setSortingClicked(true)}
            >
              Amount left
            </Table.SortingHeadCell>
            <Table.SortingHeadCell
              sortDirection={createdAtSortDirection}
              setSortDirection={setCreatedAtSortDirection}
              onSortClicked={() => setSortingClicked(true)}
            >
              Created
            </Table.SortingHeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body className="text-grey-90">
          {shownGiftCards?.map((gc, idx) => getGiftCardRow(gc, idx))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default GiftCardTable
