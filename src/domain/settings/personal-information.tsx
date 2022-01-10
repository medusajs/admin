import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import TwoSplitPane from "../../components/templates/two-split-pane"
import BodyCard from "../../components/organisms/body-card"

import useMedusa from "../../hooks/use-medusa"

import { getErrorMessage } from "../../utils/error-messages"
import Input from "../../components/molecules/input"

const PersonalInformation = () => {
  const [selectedCurrencies, setCurrencies] = useState([])
  const { register, setValue, handleSubmit } = useForm()
  const { store, isLoading, update, toaster } = useMedusa("store")

  useEffect(() => {}, [isLoading])

  const onSubmit = data => {
    try {
      update({
        default_currency_code: data.default_currency_code,
        currencies: selectedCurrencies.map(c => c.value),
      })
      toaster("Successfully updated currencies", "success")
    } catch (error) {
      toaster(getErrorMessage(error), "error")
    }
  }

  const events = [
    {
      label: "Save",
      onClick: () => console.log("Save clicked"),
    },
    {
      label: "Cancel changes",
      onClick: () => console.log("Cancel clicked"),
    },
  ]

  return (
    <TwoSplitPane>
      <BodyCard
        title="Personal information"
        subtitle="Manage your Medusa profile"
        events={events}
      >
        <div>
          <span className="inter-base-semibold">Picture</span>
          <div className="w-28 h-28 p-2 mt-2 rounded-rounded hover:bg-grey-5 cursor-pointer">
            <div className="bg-teal-40 rounded-circle w-full h-full uppercase flex items-center justify-center inter-3xlarge-semibold text-grey-0">
              PK
            </div>
          </div>
        </div>

        <div className="mt-6">
          <span className="inter-base-semibold">General</span>
          <div className="flex mt-4">
            <Input label="First name" className="mr-4" />
            <Input label="Last name" />
          </div>
          <Input label="Email" className="mt-6" />
        </div>
      </BodyCard>
    </TwoSplitPane>
  )
}

export default PersonalInformation
