import React from "react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Accordion from "../../../components/organisms/accordion"
import { nestedForm } from "../../../utils/nested-form"
import DiscountableForm, {
  DiscountableFormType,
} from "../components/discountable-form"
import GeneralForm, { GeneralFormType } from "../components/general-form"
import MediaForm, { MediaFormType } from "../components/media-form"
import OrganizeForm, { OrganizeFormType } from "../components/organize-form"
import ThumbnailForm, { ThumbnailFormType } from "../components/thumbnail-form"

type NewProductForm = {
  general: GeneralFormType
  discounted: DiscountableFormType
  organize: OrganizeFormType
  thumbnail: ThumbnailFormType
  media: MediaFormType
}

type Props = {
  onClose: () => void
}

const NewProduct = ({ onClose }: Props) => {
  const form = useForm<NewProductForm>()
  const {
    handleSubmit,
    formState: { isDirty },
  } = form

  return (
    <form className="w-full">
      <FocusModal>
        <FocusModal.Header>
          <div className="medium:w-8/12 w-full px-8 flex justify-between">
            <Button
              size="small"
              variant="ghost"
              type="button"
              onClick={onClose}
            >
              <CrossIcon size={20} />
            </Button>
            <div className="gap-x-small flex">
              <Button
                size="small"
                variant="secondary"
                type="button"
                disabled={!isDirty}
              >
                Save as draft
              </Button>
              <Button
                size="small"
                variant="primary"
                type="button"
                disabled={!isDirty}
              >
                Publish product
              </Button>
            </div>
          </div>
        </FocusModal.Header>
        <FocusModal.Main className="medium:w-7/12 large:w-6/12 small:w-4/5 max-w-[700px] w-full py-16 no-scrollbar">
          <Accordion defaultValue={["general"]} type="multiple">
            <Accordion.Item
              value={"general"}
              title="General information"
              required
            >
              <p className="inter-base-regular text-grey-50">
                To start selling, all you need is a name and a price.
              </p>
              <div className="mt-xlarge flex flex-col gap-y-xlarge">
                <GeneralForm form={nestedForm(form, "general")} />
                <DiscountableForm form={nestedForm(form, "discounted")} />
              </div>
            </Accordion.Item>
            <Accordion.Item title="Organize" value="organize">
              <p className="inter-base-regular text-grey-50">
                To start selling, all you need is a name and a price.
              </p>
              <div className="mt-xlarge flex flex-col gap-y-xlarge">
                <div>
                  <h3 className="inter-base-semibold mb-base">
                    Organize Product
                  </h3>
                  <OrganizeForm form={nestedForm(form, "organize")} />
                </div>
              </div>
            </Accordion.Item>
            <Accordion.Item title="Variants" value="variants"></Accordion.Item>
            <Accordion.Item title="Thumbnail" value="thumbnail">
              <p className="inter-base-regular text-grey-50 mb-large">
                Used to represent your product during checkout, social sharing
                and more.
              </p>
              <ThumbnailForm form={nestedForm(form, "thumbnail")} />
            </Accordion.Item>
            <Accordion.Item title="Media" value="media">
              <p className="inter-base-regular text-grey-50 mb-large">
                Add images to your product.
              </p>
              <MediaForm form={nestedForm(form, "media")} />
            </Accordion.Item>
          </Accordion>
        </FocusModal.Main>
      </FocusModal>
    </form>
  )
}

export default NewProduct
