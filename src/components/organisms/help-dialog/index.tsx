import React, { useEffect, useState } from "react"
import Button from "../../fundamentals/button"
import DiscordIcon from "../../fundamentals/icons/discord-icon"
import InputField from "../../molecules/input"
import Textarea from "../../molecules/textarea"

import * as RadixDropdown from "@radix-ui/react-popover"
import Picker, { SKIN_TONE_NEUTRAL } from "emoji-picker-react"
import HappyIcon from "../../fundamentals/icons/happy-icon"

const MailDialog = ({ onDismiss }) => {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [bodySelectionStart, setBodySelectionStart] = useState(0)
  const [link, setLink] = useState("mailto:support@medusajs.com")
  const ref = React.useRef<HTMLDivElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)

  React.useEffect(() => {
    setLink(
      `mailto:support@medusajs.com?subject=${encodeURI(
        subject
      )}&body=${encodeURI(body)}`
    )
  }, [subject, body])

  useEffect(() => {
    console.log(showEmojiPicker)
  }, [showEmojiPicker])

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !showEmojiPicker
      ) {
        onDismiss && onDismiss()
      }
    }
    document.addEventListener("click", handleClickOutside, true)
    return () => {
      document.removeEventListener("click", handleClickOutside, true)
    }
  }, [onDismiss, showEmojiPicker])

  const handleAddEmoji = (e) => {
    setBody(
      `${body.slice(0, bodySelectionStart)}${e} ${body.slice(
        bodySelectionStart
      )}`
    )
  }

  return (
    <div
      ref={ref}
      className="bg-grey-0 w-[400px] shadow-dropdown rounded-rounded p-8 top-[64px] bottom-2 right-3 rounded overflow-x-hidden fixed flex flex-col justify-between"
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
          value={body}
          onSelect={(e) =>
            setBodySelectionStart(e?.target?.selectionStart || 0)
          }
          onChange={(e) => {
            setBody(e.target.value)
          }}
          rows={8}
        >
          <EmojiPicker
            isOpen={showEmojiPicker}
            onChange={setShowEmojiPicker}
            onEmojiClick={handleAddEmoji}
          />
        </Textarea>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-grey-40 mb-3">
          <a href="https://discord.gg/medusajs">
            <DiscordIcon size={24} />
          </a>
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

const EmojiPicker = ({ isOpen, onChange, onEmojiClick }) => {
  return (
    <RadixDropdown.Root open={isOpen} onOpenChange={(val) => onChange(val)}>
      <RadixDropdown.Trigger>
        <Button
          variant="ghost"
          size="small"
          className="focus:border-none focus:shadow-none text-grey-40 hover:text-violet-60 p-0 h-5 w-5"
        >
          <HappyIcon size={20} />
        </Button>
      </RadixDropdown.Trigger>

      <RadixDropdown.Content
        sideOffset={5}
        className="border bg-grey-0 border-grey-20 -translate-x-1/2 rounded-rounded shadow-dropdown min-w-[200px] z-[100]"
      >
        <Picker
          onEmojiClick={(e, data) => {
            onEmojiClick(data.emoji)
          }}
          disableAutoFocus={true}
          skinTone={SKIN_TONE_NEUTRAL}
          native
          disableSkinTonePicker={true}
          searchPlaceholder={"Search Emoji..."}
          groupNames={{
            smileys_people: "Smileys & People",
            animals_nature: "Animals & Nature",
            food_drink: "Food & Drink",
            travel_places: "Travel & Places",
            activities: "Activities",
            objects: "Objects",
            symbols: "Symbols",
            flags: "Flags",
            recently_used: "Recently Used",
          }}
        />
      </RadixDropdown.Content>
    </RadixDropdown.Root>
  )
}

export default MailDialog
