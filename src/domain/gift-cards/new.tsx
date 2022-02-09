import { navigate } from "gatsby"
import {
  useAdminCreateProduct,
  useAdminProducts,
  useAdminStore,
} from "medusa-react"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import FileUploadField from "../../components/atoms/file-upload-field"
import Button from "../../components/fundamentals/button"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../components/fundamentals/icons/trash-icon"
import InputField from "../../components/molecules/input"
import Modal from "../../components/molecules/modal"
import Textarea from "../../components/molecules/textarea"
import CurrencyInput from "../../components/organisms/currency-input"
import useToaster from "../../hooks/use-toaster"
import { ProductStatus } from "../../types/shared"
import { getErrorMessage } from "../../utils/error-messages"

type NewGiftCardProps = {
  onClose: () => void
}

type Denomination = {
  name: string
  component: React.ReactNode
}

const NewGiftCard: React.FC<NewGiftCardProps> = ({ onClose }) => {
  const [uploading, setUploading] = useState(false)
  const { register, setValue, unregister, handleSubmit } = useForm()
  const { store } = useAdminStore()
  const { refetch } = useAdminProducts()
  const giftCard = useAdminCreateProduct()
  const [denominations, setDenominations] = useState<Denomination[]>([])
  const toaster = useToaster()

  const handleValueUpdate = (name: string, value?: number) => {
    if (!value) {
      return
    }
    setValue(name, value)
  }

  const addDenomination = () => {
    const name = `denominations.${denominations.length}`
    const component = (
      <CurrencyInput
        currentCurrency={store?.default_currency_code}
        readOnly
        size="medium"
      >
        <CurrencyInput.AmountInput
          label="Amount"
          amount={undefined}
          onChange={(v) => handleValueUpdate(name, v)}
        />
      </CurrencyInput>
    )
    register(name, { required: true })
    setDenominations([...denominations, { name, component }])
  }

  const deleteDenomination = (name: string) => {
    unregister(name)
    setDenominations(denominations.filter((d) => d.name !== name))
  }

  const handleFileUpload = async (files) => {
    setUploading(true)
    // TODO upload files
    await new Promise((r) => setTimeout(r, 2000))
    setUploading(false)
  }

  const onSubmit = (data: {
    name: string
    description?: string
    denominations: number[]
  }) => {
    if (!data.denominations) {
      toaster("Please add at least one denomination", "error")
      return
    }

    giftCard.mutate(
      {
        is_giftcard: true,
        title: data.name,
        description: data.description,
        discountable: false,
        options: [{ title: "Denominations" }],
        variants: data.denominations.map((d, i) => ({
          title: `${i + 1}`,
          inventory_quantity: 0,
          manage_inventory: false,
          prices: [{ amount: d, currency_code: store?.default_currency_code }],
          options: [{ value: `${d}` }],
        })),
        status: ProductStatus.PUBLISHED,
      },
      {
        onSuccess: () => {
          toaster("Successfully created gift card", "success")
          refetch()
          navigate("/a/gift-cards/manage")
        },
        onError: (err) => {
          toaster(getErrorMessage(err), "error")
        },
      }
    )
  }

  return (
    <Modal handleClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={onClose}>
            <div>
              <h1 className="inter-xlarge-semibold">Create Gift Card</h1>
            </div>
          </Modal.Header>
          <Modal.Content>
            <div className="mb-base">
              <h3 className="inter-base-semibold">Product information</h3>
            </div>
            <div className="flex flex-col gap-y-base">
              <InputField
                label={"Name"}
                required
                placeholder="The best gift card"
                name="name"
                ref={register({ required: true })}
              />
              <Textarea
                label="Description"
                placeholder="The best gift card of all time"
                name="description"
                ref={register}
              />
            </div>
            <div className="mt-xlarge">
              <h3 className="inter-base-semibold">Thumbnail</h3>
              <div className="h-[80px] mt-base">
                <FileUploadField
                  filetypes={["image/png", "image/jpeg"]}
                  onFileChosen={handleFileUpload}
                  placeholder="1200 x 1600 (3:4) recommended, up to 10MB each"
                />
              </div>
            </div>
            <div className="mt-xlarge">
              <h3 className="inter-base-semibold mb-base">Denominations</h3>
              <div className="flex flex-col gap-y-xsmall">
                {denominations.map((denomination) => {
                  return (
                    <div
                      key={denomination.name}
                      className="flex items-center gap-x-base last:mb-large"
                    >
                      {denomination.component}
                      <Button
                        variant="ghost"
                        size="large"
                        className="w-xlarge h-xlarge text-grey-40"
                        type="button"
                        onClick={() => deleteDenomination(denomination.name)}
                      >
                        <TrashIcon size={20} />
                      </Button>
                    </div>
                  )
                })}
              </div>
              <Button
                variant="ghost"
                size="small"
                onClick={addDenomination}
                type="button"
              >
                <PlusIcon size={20} />
                Add Denomination
              </Button>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full">
              <Button
                type="submit"
                variant="ghost"
                size="small"
                className="w-eventButton"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="small"
                className="w-eventButton"
              >
                Create & Publish
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default NewGiftCard
