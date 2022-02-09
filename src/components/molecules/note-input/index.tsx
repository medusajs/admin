import React, { useCallback, useRef, useState } from "react"
import SendIcon from "../../fundamentals/icons/send-icon"
import EmojiPicker from "../emoji-picker"

type NoteInputProps = {
  onSubmit: (note: string | undefined) => void
}

const NoteInput: React.FC<NoteInputProps> = ({ onSubmit }) => {
  const [note, setNote] = useState<string | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleAddEmoji = (emoji: string) => {
    setNote(`${note ? note : ""}${emoji}`)
  }

  const handleSubmit = () => {
    if (onSubmit && note) {
      onSubmit(note)
      setNote("")
    }
  }

  const onKeyDownHandler = useCallback(
    (event) => {
      switch (event.key) {
        case "Enter":
          event.preventDefault()
          event.stopPropagation()
          handleSubmit()
          inputRef.current?.blur()
          break
        case "Esc":
        case "Escape":
          inputRef.current?.blur()
          break
        default:
          break
      }
    },
    [note, setNote, onSubmit]
  )

  return (
    <form>
      <div
        className="flex items-center py-xsmall px-small bg-grey-5 border border-grey-20 rounded-rounded"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-x-small flex-grow">
          <EmojiPicker onEmojiClick={handleAddEmoji} />
          <input
            type="text"
            placeholder="Write a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="flex-grow bg-transparent inter-base-regular placeholder:text-grey-40 focus:outline-none"
            ref={inputRef}
            id="note-input"
            autoComplete="off"
            onKeyDown={onKeyDownHandler}
          />
        </div>
        <button
          className="text-grey-30 hover:text-violet-60"
          type="button"
          onClick={handleSubmit}
        >
          <SendIcon size={20} />
        </button>
      </div>
    </form>
  )
}

export default NoteInput
