import React from "react"
import { useScroll } from "../../hooks/use-scroll"
import Actionables from "../molecules/actionables"

const BodyCard = ({ title, subtitle, events, actionables, children }) => {
  const [isScrolled, scrollListenser] = useScroll()
  return (
    <div className="rounded-rounded border bg-grey-0 border-grey-20 h-full overflow-hidden flex flex-col min-h-[500px] w-full">
      <div
        className="pt-large px-xlarge flex-grow overflow-y-scroll relative"
        onScroll={scrollListenser}
      >
        {isScrolled && (
          <div className="sticky top-0 bg-gradient-to-b from-grey-0 to-transparent h-large z-10" />
        )}
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
        <div className="my-large">{children}</div>
      </div>
      {events && events.length > 0 ? (
        <div className="pb-large pt-base px-xlarge border-t border-grey-20">
          <div className="flex items-center flex-row-reverse">
            {events.map((event, i) => {
              return (
                <button
                  key={i}
                  className={`${
                    i === 0 ? "btn-primary-small" : "btn-ghost-small"
                  } first:ml-xsmall min-w-[130px] justify-center`}
                >
                  {event.text}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="min-h-[24px]" />
      )}
    </div>
  )
}

export default BodyCard
