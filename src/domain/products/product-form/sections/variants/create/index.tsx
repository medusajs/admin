import React from "react"
import ProductOptions from "./product-options"

const CreateVariants = () => {
  return (
    <div>
      <ProductOptions />
      {/* {fields.map((v, i) => {
        console.log(fields)
        return (
          <div key={v.id}>
            <InputField
              name={`variants[${i}].title`}
              ref={register()}
              defaultValue={v.title ?? undefined}
            />
            {v.options?.map((o, j) => {
              return (
                <div key={j}>
                  <span>value {o.value}</span>
                  <input
                    type="hidden"
                    name={`variants[${i}].options[${j}].value`}
                    defaultValue={o.value}
                  />
                </div>
              )
            })}
          </div>
        )
      })} */}
    </div>
  )
}

export default CreateVariants
