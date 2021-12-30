import React from "react"
import Actionables from "../molecules/actionables"

const BodyCard = ({ title, subtitle, events, actionables, children }) => {
  return (
    <div className="rounded-rounded border border-grey-20 max-h-full">
      <div className="pt-large px-xlarge">
        <div className="flex items-center justify-between">
          {title ? (
            <h1 className="inter-xlarge-semibold text-grey-90">{title}</h1>
          ) : (
            <div />
          )}
          <Actionables actions={actionables} />
        </div>
        {subtitle && (
          <h3 className="inter-small-regular text-grey-50">{subtitle}</h3>
        )}
        <div className="mt-large overflow-y-scroll">{children}</div>
      </div>
      <div
        className={`min-h-[24px] ${
          events &&
          events.length > 0 &&
          "pb-large pt-base px-xlarge border-t border-grey-20"
        }`}
      >
        {events && events.length > 0 && (
          <div className="flex items-center flex-row-reverse">
            {events.map((event, i) => {
              return (
                <button
                  key={i}
                  className={`${
                    i < 1 ? "btn-primary-small" : "btn-ghost-small"
                  } first:ml-xsmall min-w-[130px] justify-center`}
                >
                  {event.text}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default BodyCard
