import {
  useAdminCollections,
  useAdminCreateProduct,
  useAdminProduct,
  useAdminProductTypes,
  useAdminStore,
  useAdminUpdateProduct,
} from "medusa-react"
import React, { useEffect } from "react"
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form"
import Checkbox from "../../../components/atoms/checkbox"
import FileUploadField from "../../../components/atoms/file-upload-field"
import Button from "../../../components/fundamentals/button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import InfoTooltip from "../../../components/molecules/info-tooltip"
import Input from "../../../components/molecules/input"
import Select from "../../../components/molecules/select"
import TagInput from "../../../components/molecules/tag-input"
import Textarea from "../../../components/molecules/textarea"
import BodyCard from "../../../components/organisms/body-card"
import CurrencyInput from "../../../components/organisms/currency-input"
import RadioGroup from "../../../components/organisms/radio-group"
import DraggableTable from "../../../components/templates/draggable-table"
import useToaster from "../../../hooks/use-toaster"
import { getErrorMessage } from "../../../utils/error-messages"

const productToFormValuesMapper = (product) => {
  return {
    ...product,
    collection: product?.collection
      ? { id: product.collection.id, label: product.collection.title }
      : null,
    type: product?.type
      ? { id: product.type.id, label: product.type.value }
      : null,
    images: product?.images || [],
  }
}

const formValuesToProductMapper = (values) => {
  return {
    title: values.title,
    handle: values.handle,
    allow_backorders: values.allow_backorders,
    manage_inventory: values.manage_inventory,
    description: values.description,
    thumbnail: values.thumbnail,
    collection_id: values?.collection ? values.collection.value : "",
    type: values?.type
      ? { id: values.type.value, value: values.type.label }
      : null,
    images: values?.images.map((image) => image.url),
    options: [{ title: "Default Option" }],
    tags: values?.tags ? values.tags.map((tag) => ({ value: tag })) : [],
    variants: [
      {
        title: values?.title,
        sku: values?.sku,
        ean: values?.ean,
        inventory_quantity: values?.inventory_quantity,
        options: [{ title: "Default Variant" }],
        prices: values?.prices ? values.prices.map((p) => p.price) : [],
      },
    ],
    width: values.width,
    length: values.length,
    weight: values.weight,
    height: values.height,
    country: values.country,
    material: values.material,
    mid_code: values.mid_code,
    hs_code: values.hs_code,
  }
}

const ProductDetailPage = ({ id }) => {
  const toaster = useToaster()
  const { product } = useAdminProduct(id)
  const updateProduct = useAdminUpdateProduct(id)

  const onSubmit = (data) => {
    console.log(data)
    updateProduct.mutate(data, {
      onSuccess: () => {
        toaster("Product updated successfully", "success")
      },
      onError: (error) => {
        toaster(getErrorMessage(error), "error")
      },
    })
  }
  return (
    <ProductFormProvider
      product={productToFormValuesMapper(product)}
      onSubmit={console.log}
    >
      <ProductDetail />
    </ProductFormProvider>
  )
}

const NewProductPage = ({ id }) => {
  const toaster = useToaster()
  const createProduct = useAdminCreateProduct(id)

  const onSubmit = (data) => {
    console.log({ data: formValuesToProductMapper(data) })
    // createProduct.mutate(formValuesToProductMapper(data), {
    //   onSuccess: () => {
    //     toaster("Product created successfully", "success")
    //   },
    //   onError: (error) => {
    //     toaster(getErrorMessage(error), "error")
    //   },
    // })
  }
  return (
    <ProductFormProvider onSubmit={onSubmit}>
      <ProductDetail />
    </ProductFormProvider>
  )
}

const ProductDetail = () => {
  const { isVariantsView } = useProductForm()
  const { store } = useAdminStore()
  const currencyCodes = store?.currencies.map((currency) => currency.code)

  return (
    <>
      <div>
        <General />
      </div>
      <div className="mt-large">
        <Prices
          currencyCodes={currencyCodes}
          defaultCurrencyCode={store?.default_currency_code}
          defaultAmount={1000}
        />
      </div>
      <div className="mt-large">
        <Images />
      </div>
      {isVariantsView && (
        <div className="mt-large">
          <Variants />
        </div>
      )}
      <div className="mt-large">
        <StockAndInventory />
      </div>
      <div className="mt-base flex justify-end items-center gap-x-2">
        <Button variant="secondary" size="small">
          Cancel
        </Button>
        <Button variant="secondary" size="small">
          Save as draft
        </Button>
        <Button variant="primary" size="medium" type="submit">
          Publish Product
        </Button>
      </div>
    </>
  )
}

export { ProductDetailPage, NewProductPage }

const VARIANTS_VIEW = "variants"
const SINGLE_PRODUCT_VIEW = "single"

type PRODUCT_VIEW = typeof VARIANTS_VIEW | typeof SINGLE_PRODUCT_VIEW

const defaultProduct = {
  images: [],
  prices: [],
  type: null,
  collection: null,
  thumbnail: "",
}

const ProductFormProvider = ({
  product = defaultProduct,
  onSubmit,
  children,
}) => {
  const [images, setImages] = React.useState<any[]>([])

  const appendImage = (image) => setImages([...images, image])

  const removeImage = (image) => {
    const idx = images.findIndex((img) => img.image === image.image)
    if (idx !== -1) {
      images.splice(idx, 1)
    }
    setImages([...images])
  }

  const [viewType, setViewType] = React.useState<PRODUCT_VIEW>(
    SINGLE_PRODUCT_VIEW
  )

  const methods = useForm()

  React.useEffect(() => {
    methods.reset({
      ...product,
    })
    setImages(product.images)
  }, [product])

  const handleSubmit = (values) => {
    console.log("onsubmit:", { values })
    onSubmit({ ...values, images })
  }

  return (
    <FormProvider {...methods}>
      <ProductFormContext.Provider
        value={{
          images,
          setImages,
          appendImage,
          removeImage,
          setViewType,
          viewType,
          isVariantsView: viewType === VARIANTS_VIEW,
        }}
      >
        <form onSubmit={methods.handleSubmit(handleSubmit)}>{children} </form>
      </ProductFormContext.Provider>
    </FormProvider>
  )
}

const ProductFormContext = React.createContext<{
  images: any[]
  setImages: (images: any[]) => void
  appendImage: (image: any) => void
  removeImage: (image: any) => void
  setViewType: (value: PRODUCT_VIEW) => void
  viewType: PRODUCT_VIEW
  isVariantsView: boolean
} | null>(null)

export const useProductForm = () => {
  const context = React.useContext(ProductFormContext)
  const form = useFormContext()
  if (!context) {
    throw new Error("useProductForm must be a child of ProductFormContext")
  }
  return { ...form, ...context }
}

const General = () => {
  const { register, control, setViewType, viewType } = useProductForm()
  const { types } = useAdminProductTypes()
  const { collections } = useAdminCollections()

  const typeOptions =
    types?.map((tag) => ({ label: tag.value, value: tag.id })) || []
  const collectionOptions =
    collections?.map((collection) => ({
      label: collection.title,
      value: collection.id,
    })) || []

  return (
    <BodyCard
      title="General"
      subtitle="To start selling, all you need is a name, price, and image"
    >
      <div className="mt-large">
        <h6 className="inter-base-semibold mb-1">Details</h6>
        <label
          htmlFor="name"
          className="inter-small-regular text-grey-50 block max-w-[370px] mb-base"
        >
          Give your product a short and clear name. 50-60 characters is the
          recommended length for search engines.
        </label>
        <div className="flex gap-8 mb-base">
          <Input
            id="name"
            label="Name"
            name="title"
            placeholder="Jacket, Sunglasses..."
            required
            ref={register}
          />
          <Input
            tooltipContent="Handles are used for this and that"
            label="Handle"
            name="handle"
            placeholder="/bathrobes"
            ref={register}
          />
        </div>
        <label
          className="inter-small-regular text-grey-50 block max-w-[370px] mb-base"
          htmlFor="description"
        >
          Give your product a short and clear description. 120-160 characters is
          the recommended length for search engines.
        </label>
        <div className="grid grid-rows-3 grid-cols-2 gap-x-8 gap-y-4 mb-xlarge">
          <Textarea
            name="description"
            id="description"
            required
            label="Description"
            placeholder="Short description of the product..."
            className="row-span-full"
            rows={8}
            ref={register}
          />
          <Controller
            as={Select}
            control={control}
            label="Collection"
            name="collection"
            overrideStrings={{ selectSomeItems: "Select collection..." }}
            options={collectionOptions}
          />
          <Controller
            as={Select}
            control={control}
            label="Type"
            name="type"
            overrideStrings={{ selectSomeItems: "Select type..." }}
            options={typeOptions}
          />
          <Controller
            render={({ onChange, value }) => (
              <TagInput
                label="Tags (separated by comma)"
                placeholder="Spring, Summer..."
                onChange={onChange}
                values={value}
              />
            )}
            control={control}
            name="tags"
          />
        </div>
        <RadioGroup.Root
          value={viewType}
          onValueChange={setViewType}
          className="flex items-center gap-4"
        >
          <RadioGroup.SimpleItem
            label="Simple product"
            value={SINGLE_PRODUCT_VIEW}
          />
          <RadioGroup.SimpleItem
            label="Product with variants"
            value={VARIANTS_VIEW}
          />
        </RadioGroup.Root>
      </div>
    </BodyCard>
  )
}

const columns = [
  {
    Header: "Image",
    accessor: "image",
    Cell: ({ cell }) => {
      console.log({ cell })
      return (
        <div className="py-base large:w-[176px] xsmall:w-[80px]">
          <img
            className="h-[80px] w-[80px] object-cover rounded"
            src={cell.row.original.url}
          />
        </div>
      )
    },
  },
  {
    Header: "File Name",
    accessor: "name",
    Cell: ({ cell }) => {
      return (
        <div className="large:w-[700px] medium:w-[400px] small:w-auto">
          <p className="inter-small-regular">{cell.row.original?.name}</p>
          <span className="inter-small-regular text-grey-50">
            {typeof cell.row.original.size === "number"
              ? `${(cell.row.original.size / 1024).toFixed(2)} KB`
              : cell.row.original?.size}
          </span>
        </div>
      )
    },
  },
  {
    Header: <div className="text-center">Thumbnail</div>,
    accessor: "thumbnail",
    Cell: ({ cell }) => {
      return (
        <div className="flex justify-center">
          <RadioGroup.SimpleItem
            className="justify-center"
            value={cell.row.original.url}
          />
        </div>
      )
    },
  },
]

const Images = () => {
  const {
    register,
    setValue,
    images,
    setImages,
    appendImage,
    removeImage,
  } = useProductForm()

  useEffect(() => {
    register("thumbnail")
  }, [])

  return (
    <BodyCard title="Images" subtitle="Add up to 10 images to your product">
      <div className="mt-base">
        <RadioGroup.Root
          // defaultValue={entities[0].image}
          onValueChange={(value) => {
            console.log("thumbnail", value)
            setValue("thumbnail", value)
          }}
        >
          <DraggableTable
            onDelete={removeImage}
            columns={columns}
            entities={images}
            setEntities={setImages}
          />
        </RadioGroup.Root>
      </div>
      <div className="mt-2xlarge">
        <FileUploadField
          onFileChosen={(files) => {
            const file = files[0]
            const url = URL.createObjectURL(file)
            appendImage({ url, name: file.name, size: file.size })
          }}
          placeholder="1200 x 1600 (3:4) recommended, up to 10MB each"
          filetypes={["png"]}
          className="py-large"
        />
      </div>
    </BodyCard>
  )
}

const Variants = () => {
  const { register } = useProductForm()
  const [variations, setVariations] = React.useState([])
  return (
    <BodyCard
      title="Variants"
      subtitle="Add variations of this product. Offer your customers different
options for price, color, format, size, shape, etc."
    >
      <div className="mt-large">
        <div className="flex items-center mb-base">
          <h6 className="inter-base-semibold text-grey-90 mr-1.5">General</h6>
          <InfoTooltip content={"Some helpful content"} />
        </div>
        <div className="max-w-[565px]">
          {Array(3)
            .fill(0)
            .map((_) => (
              <div className="last:mb-0 mb-xsmall flex items-center gap-x-1">
                <Input
                  required
                  name="title"
                  label="Option Title"
                  placeholder="Color, Size..."
                  ref={register}
                />
                <TagInput
                  required
                  placeholder="Blue, Green..."
                  name="variations"
                  label="Variations (separated by comma)"
                  values={variations}
                  onChange={(values) => {
                    setVariations(values)
                  }}
                />
                <button className="ml-large">
                  <TrashIcon
                    // onClick={onClickDelete(index)}
                    className="text-grey-40"
                    size="20"
                  />
                </button>
              </div>
            ))}
        </div>
        <div className="mt-large mb-small">
          <Button
            // onClick={appendDenomination}
            type="button"
            variant="ghost"
            size="small"
            // disabled={availableCurrencies.length === 0}
          >
            <PlusIcon size={20} />
            Add a price
          </Button>
        </div>
      </div>
    </BodyCard>
  )
}

const Prices = ({ currencyCodes, defaultCurrencyCode, defaultAmount }) => {
  const { register, control } = useProductForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "prices",
    keyName: "indexId",
  })
  const selectedCurrencies = fields.map((field) => field.price.currency_code)
  const availableCurrencies = currencyCodes?.filter(
    (currency) => !selectedCurrencies.includes(currency)
  )

  const appendPrice = () => {
    let newCurrency = availableCurrencies[0]
    if (!selectedCurrencies.includes(defaultCurrencyCode)) {
      newCurrency = defaultCurrencyCode
    }
    append({
      price: { currency_code: newCurrency, amount: defaultAmount },
    })
  }

  const deletePrice = (index) => {
    return () => {
      remove(index)
    }
  }
  return (
    <BodyCard
      title="Pricing"
      subtitle="To start selling, all you need is a name, price, and image"
    >
      <div className="mt-base">
        <div className="flex items-center mb-base">
          <h6 className="inter-base-semibold text-grey-90 mr-1.5">Prices</h6>
          <InfoTooltip content={"Some helpful content"} />
        </div>
        <div className="max-w-[630px]">
          {fields.map((field, index) => {
            return (
              <div
                key={field.indexId}
                className="last:mb-0 mb-xsmall flex items-center"
              >
                <div className="flex-1">
                  <Controller
                    control={control}
                    key={field.indexId}
                    name={`prices[${index}].price`}
                    ref={register()}
                    defaultValue={field.price}
                    render={({ onChange, value }) => {
                      return (
                        <CurrencyInput
                          currencyCodes={currencyCodes}
                          currentCurrency={value?.currency_code}
                          size="medium"
                          onChange={(code) =>
                            onChange({ ...value, currency_code: code })
                          }
                        >
                          <CurrencyInput.AmountInput
                            label="Amount"
                            onChange={(amount) =>
                              onChange({ ...value, amount })
                            }
                            amount={value?.amount}
                          />
                        </CurrencyInput>
                      )
                    }}
                  />
                </div>
                {field.price?.currency_code !== defaultCurrencyCode ? (
                  <button className="ml-large">
                    <TrashIcon
                      onClick={deletePrice(index)}
                      className="text-grey-40"
                      size="20"
                    />
                  </button>
                ) : null}
              </div>
            )
          })}
          <div className="mt-large mb-small">
            <Button
              onClick={appendPrice}
              type="button"
              variant="ghost"
              size="small"
              // disabled={availableCurrencies.length === 0}
            >
              <PlusIcon size={20} />
              Add a price
            </Button>
          </div>
        </div>
      </div>
    </BodyCard>
  )
}

const StockAndInventory = () => {
  const { register } = useProductForm()
  return (
    <BodyCard
      title="Stock & Inventory"
      subtitle="To start selling, all you need is a name, price, and image"
    >
      <div className="mt-large">
        <div className="flex items-center mb-base">
          <h6 className="inter-base-semibold text-grey-90 mr-1.5">General</h6>
          <InfoTooltip content={"Some helpful content"} />
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-large">
          <Input
            label="Stock Keeping Unit (SKU)"
            name="sku"
            placeholder="SUN-G, JK1234..."
            ref={register}
          />
          <Input
            label="Barcode (EAN)"
            name="ean"
            placeholder="1231231231234..."
            ref={register}
          />
          <Input
            label="Quantity in stock"
            name="inventory_quantity"
            type="number"
            placeholder="100"
            ref={register}
          />
        </div>
        <div className="flex items-center gap-4 mb-xlarge">
          <div className="flex item-center gap-x-1.5">
            <Checkbox
              name="manage_inventory"
              label="Manage Inventory"
              ref={register}
            />
            <InfoTooltip content={"something"} />
          </div>
          <div className="flex item-center gap-x-1.5">
            <Checkbox
              name="allow_backorders"
              ref={register}
              label="Allow backorders"
            />
            <InfoTooltip content={"something"} />
          </div>
        </div>
        <div className="flex items-center mb-base">
          <h6 className="inter-base-semibold text-grey-90 mr-1.5">
            Dimensions
          </h6>
          <InfoTooltip content={"Some helpful content"} />
        </div>
        <div className="flex gap-x-8">
          <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-4 mb-large">
            <Input
              label="Height"
              name="height"
              ref={register}
              placeholder="100..."
            />
            <Input
              label="Width"
              name="width"
              ref={register}
              placeholder="100..."
            />
            <Input
              label="Length"
              name="length"
              ref={register}
              placeholder="100..."
            />
            <Input
              label="Weight"
              name="weight"
              ref={register}
              placeholder="100..."
            />
          </div>
          <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-4 mb-large">
            <Input
              label="MID Code"
              name="mid_code"
              ref={register}
              placeholder="100..."
            />
            <Input
              label="HS Code"
              name="hs_code"
              ref={register}
              placeholder="100..."
            />
            <Input
              ref={register}
              label="Country of origin"
              name="country"
              placeholder="Denmark..."
            />
            <Input
              label="Material"
              name="material"
              ref={register}
              placeholder="Wool..."
            />
          </div>
        </div>
      </div>
    </BodyCard>
  )
}
