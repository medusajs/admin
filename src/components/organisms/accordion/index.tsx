import * as AccordionPrimitive from "@radix-ui/react-accordion"
import React from "react"
import Button from "../../fundamentals/button"
import InfoTooltip from "../../molecules/info-tooltip"

type AccordionItemProps = AccordionPrimitive.AccordionItemProps & {
  title: string
  description?: string
  required?: boolean
  tooltip?: string
}

const Accordion: React.FC<
  | (AccordionPrimitive.AccordionSingleProps &
      React.RefAttributes<HTMLDivElement>)
  | (AccordionPrimitive.AccordionMultipleProps &
      React.RefAttributes<HTMLDivElement>)
> & {
  Item: React.FC<AccordionItemProps>
} = ({ children, ...props }) => {
  return (
    <AccordionPrimitive.Root {...props}>{children}</AccordionPrimitive.Root>
  )
}

const Item: React.FC<AccordionItemProps> = ({
  title,
  description,
  required,
  tooltip,
  children,
  ...props
}) => {
  return (
    <AccordionPrimitive.Item
      {...props}
      className="border-b border-grey-20 transition-all pb-5 radix-state-open:pb-5xlarge mb-5 last:mb-0 group"
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="flex items-center justify-between w-full">
          <div className="flex items-center gap-x-2xsmall">
            <span className="inter-large-semibold">
              {title}
              {required && <span className="text-rose-50">*</span>}
            </span>
            {tooltip && <InfoTooltip content={tooltip} />}
          </div>
          <MorphingTrigger />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        forceMount
        className="transition-all duration-300 h-accordion group-radix-state-closed:h-0 overflow-hidden"
      >
        <div className="text-grey-50 inter-base-regular transition-all duration-300 opacity-100 group-radix-state-closed:opacity-0">
          {description && <p>{description}</p>}
          <div className="mt-large">{children}</div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

Accordion.Item = Item

const MorphingTrigger = () => {
  return (
    <Button variant="ghost" size="small" className="p-[6px] relative group">
      <div className="w-5 h-5">
        <span className="absolute bg-grey-50 rounded-circle inset-y-[31.75%] left-[48%] right-1/2 w-[1.5px] group-radix-state-open:rotate-90 duration-300" />
        <span className="absolute bg-grey-50 rounded-circle inset-x-[31.75%] top-[48%] bottom-1/2 h-[1.5px] group-radix-state-open:rotate-90 group-radix-state-open:left-1/2 group-radix-state-open:right-1/2 duration-300" />
      </div>
    </Button>
  )
}

export default Accordion
