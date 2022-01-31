import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import Picker, { SKIN_TONE_NEUTRAL } from "emoji-picker-react"
import React from "react"
import Button from "../../fundamentals/button"
import HappyIcon from "../../fundamentals/icons/happy-icon"

type indexProps = {
  onEmojiClick: (emoji: string) => void
}

const EmojiPicker: React.FC<indexProps> = ({ onEmojiClick }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="small"
          className="focus:border-none focus:shadow-none text-grey-40 hover:text-violet-60 p-0 h-5 w-5"
        >
          <HappyIcon size={20} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        sideOffset={5}
        portalled
        className="border bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown overflow-hidden min-w-[200px] z-30"
      >
        <Picker
          onEmojiClick={(e, data) => onEmojiClick(data.emoji)}
          disableAutoFocus={true}
          skinTone={SKIN_TONE_NEUTRAL}
          groupNames={{ smileys_people: "PEOPLE" }}
          native
          pickerStyle={{ border: "none" }}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default EmojiPicker
