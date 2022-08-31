import * as AccordionPrimitive from "@radix-ui/react-accordion"
import clsx from "clsx"
import React from "react"
import IconTooltip from "../../molecules/icon-tooltip"

type AccordionItemProps = AccordionPrimitive.AccordionItemProps & {
  title: string
  subtitle?: string
  description?: string
  required?: boolean
  tooltip?: string
  forceMountContent?: true
  headingSize?: "small" | "medium" | "large"
  customTrigger?: React.ReactNode
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
  subtitle,
  description,
  required,
  tooltip,
  children,
  className,
  headingSize = "large",
  customTrigger = undefined,
  forceMountContent = undefined,
  ...props
}) => {
  const headerClass = clsx({
    "inter-small-semibold": headingSize === "small",
    "inter-base-semibold": headingSize === "medium",
    "inter-large-semibold": headingSize === "large",
  })

  const paddingClasses = clsx({
    "pb-0 mb-6 ": headingSize === "medium",
    "pb-5 radix-state-open:pb-5xlarge mb-5 ": headingSize === "large",
  })

  return (
    <AccordionPrimitive.Item
      {...props}
      className={clsx(
        "border-b border-grey-20 last:mb-0 group",
        { "opacity-30": props.disabled },
        paddingClasses,
        className
      )}
    >
      <AccordionPrimitive.Header className="px-1">
        <AccordionPrimitive.Trigger className="w-full" asChild>
          <div className="flex flex-col">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-x-2xsmall">
                <span className={headerClass}>
                  {title}
                  {required && <span className="text-rose-50">*</span>}
                </span>
                {tooltip && <IconTooltip content={tooltip} />}
              </div>
              {customTrigger || <MorphingTrigger />}
            </div>
            {subtitle && (
              <span className="inter-small-regular text-grey-50 mt-1">
                {subtitle}
              </span>
            )}
          </div>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        forceMount={forceMountContent}
        className={clsx(
          "overflow-hidden radix-state-closed:animate-accordion-close radix-state-open:animate-accordion-open px-1"
        )}
      >
        <div className="inter-base-regular group-radix-state-closed:animate-accordion-close">
          {description && <p className="text-grey-50 ">{description}</p>}
          <div className="w-full">{children}</div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

Accordion.Item = Item

const MorphingTrigger = () => {
  return (
    <div className="p-[6px] relative group btn-ghost rounded-rounded">
      <div className="w-5 h-5">
        <span className="absolute bg-grey-50 rounded-circle inset-y-[31.75%] left-[48%] right-1/2 w-[1.5px] group-radix-state-open:rotate-90 duration-300" />
        <span className="absolute bg-grey-50 rounded-circle inset-x-[31.75%] top-[48%] bottom-1/2 h-[1.5px] group-radix-state-open:rotate-90 group-radix-state-open:left-1/2 group-radix-state-open:right-1/2 duration-300" />
      </div>
    </div>
  )
}

export default Accordion
