import { Link } from "gatsby"
import React, { useState } from "react"
import Button from "../../fundamentals/button"
import DiscordIcon from "../../fundamentals/icons/discord-icon"
import InputField from "../../molecules/input"
import Textarea from "../../molecules/textarea"

const MailDialog = ({ onDismiss }) => {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [link, setLink] = useState("mailto:support@medusajs.com")
  const ref = React.useRef(null)

  React.useEffect(() => {
    setLink(
      `mailto:support@medusajs.com?subject=${encodeURI(
        subject
      )}&body=${encodeURI(body)}`
    )
  }, [subject, body])

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onDismiss && onDismiss()
      }
    }
    document.addEventListener("click", handleClickOutside, true)
    return () => {
      document.removeEventListener("click", handleClickOutside, true)
    }
  }, [onDismiss])

  return (
    <div
      ref={ref}
      className="bg-grey-0 w-[400px] shadow-dropdown rounded-rounded p-8 top-[64px] bottom-2 right-3 rounded overflow-x-hidden fixed right-0 flex flex-col justify-between"
    >
      <div>
        <h1 className="inter-xlarge-semibold mb-1">How can we help?</h1>
        <h2 className="inter-small-regular text-grey-50 mb-6">
          We usually respond in a few hours
        </h2>
        <InputField
          label={"Subject"}
          value={subject}
          className="mb-4"
          placeholder="What is it about?..."
          onChange={(e) => setSubject(e.target.value)}
        />
        <Textarea
          label={"How can we help?"}
          placeholder="Write a message..."
          className="overflow-visible"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
        />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-grey-40 mb-3">
          <Link to="https://discord.gg/medusajs" target={"_blank"}>
            <DiscordIcon size={24} />
          </Link>
        </span>
        <span className="inter-small-regular w-full text-center text-grey-40">
          Feel free to join a community of
        </span>
        <span className="inter-small-regular w-full text-center text-grey-40 mb-7">
          merchants and e-commerce developers
        </span>
        <a className="w-full" href={link}>
          <Button variant="primary" size="large" className="w-full">
            Send a message
          </Button>
        </a>
      </div>
    </div>
  )
}

export default MailDialog
