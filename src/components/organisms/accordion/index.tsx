import * as AccordionPrimitive from "@radix-ui/react-accordion"
import React from "react"
import Button from "../../fundamentals/button"
import IconTooltip from "../../molecules/icon-tooltip"

// type AccordionItemProps = {
//   title: string
//   description?: string
//   required?: boolean
//   tooltip?: string
// }

// type AccordionProps = {
//   /**
//    * If true collapsed items will not be unmounted
//    */
//   keepMounted?: boolean
// }

// const Accordion: React.FC<AccordionProps> & {
//   Item: React.FC<AccordionItemProps>
// } = ({ children }) => {
//   return (
//     <div>
//       {Children.map(children, (child, index) => (
//         <div
//           key={index}
//           className="border-b border-grey-20 last:border-none pb-5xlarge mb-5 last:mb-0"
//         >
//           {child}
//         </div>
//       ))}
//     </div>
//   )
// }

// const Item: React.FC<AccordionItemProps> = ({
//   title,
//   description,
//   required = false,
//   tooltip,
//   children,
// }) => {
//   const [open, setOpen] = useState(false)
//   return (
// <div>
//   <div className="flex items-center justify-between">
//     <div className="flex items-center gap-x-2xsmall">
//       <span className="inter-large-semibold">
//         {title}
//         {required && <span className="text-rose-50">*</span>}
//       </span>
//       {tooltip && <InfoTooltip content={tooltip} />}
//     </div>
//     <Button
//       variant="ghost"
//       size="small"
//       className="p-[6px]"
//       onClick={() => setOpen(!open)}
//     >
//       {open ? <MinusIcon size={20} /> : <PlusIcon size={20} />}
//     </Button>
//   </div>
//   <div className="text-grey-50 inter-base-regular">
//     {description && <p>{description}</p>}
//     <div
//       className={clsx({
//         "animate-fade-out-top": !open,
//         "animate-fade-in-top": open,
//       })}
//     >
//       {children}
//     </div>
//   </div>
// </div>
//   )
// }

// Accordion.Item = Item

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
      className="border-b border-grey-20 transition- pb-5 radix-state-open:pb-5xlarge mb-5 last:mb-0 group"
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="flex items-center justify-between w-full">
          <div className="flex items-center gap-x-2xsmall">
            <span className="inter-large-semibold">
              {title}
              {required && <span className="text-rose-50">*</span>}
            </span>
            {tooltip && <IconTooltip content={tooltip} />}
          </div>
          <MorphingTrigger />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content forceMount>
        <div className="text-grey-50 inter-base-regular transition-all duration-300 h-radix-accordion opacity-100 group-radix-state-closed:h-0 overflow-hidden group-radix-state-closed:opacity-0">
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
