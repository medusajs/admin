import { useContext } from "react"
import { AccountContext } from "../context/account"

export const useIsMe = (userId: string | undefined) => {
  const account = useContext(AccountContext)

  const isMe = !account.id || !userId ? false : account.id === userId
  console.log(account.id, userId, isMe)

  return isMe
}
