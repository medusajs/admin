import React, { useEffect, useState } from "react"
import clsx from "clsx"
import SidebarTeamMember from "../../molecules/sidebar-team-member"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import ArrowLeftIcon from "../../fundamentals/icons/arrow-left-icon"
import ArrowRightIcon from "../../fundamentals/icons/arrow-right-icon"
import InviteModal from "../invite-modal"
import { useAdminUsers } from "medusa-react"
import { User } from "@medusajs/medusa"

type PaginationArrowsProps = {
  currentPage: number
  paginationLength: number
  handleNextPage: () => void
  handlePreviousPage: () => void
}

type UserType = Omit<User, "password_hash">

const PAGE_SIZE = 6

const getColor = (index: number): string => {
  const colors = [
    "bg-fuschia-40",
    "bg-pink-40",
    "bg-orange-40",
    "bg-teal-40",
    "bg-cyan-40",
    "bg-blue-40",
    "bg-indigo-40",
  ]
  return colors[index % colors.length]
}

const PaginationArrows: React.FC<PaginationArrowsProps> = ({
  handlePreviousPage,
  handleNextPage,
  currentPage,
  paginationLength,
}) => {
  const enabledClasses = " hover:bg-grey-5 cursor-pointer"
  const disabledClasses = "text-grey-30"
  return (
    <div className="flex text-grey-50">
      <span
        onClick={handlePreviousPage}
        className={clsx(
          `mr-1.5 w-5 h-5 transition rounded-base flex justify-center items-center`,
          {
            [`${disabledClasses}`]: currentPage === 0,
            [`${enabledClasses}`]: currentPage !== 0,
          }
        )}
      >
        <ArrowLeftIcon size={16} />
      </span>
      <span
        onClick={handleNextPage}
        className={clsx(
          `w-5 h-5 transition rounded-base flex justify-center items-center`,
          {
            [`${disabledClasses}`]: currentPage + 1 === paginationLength,
            [`${enabledClasses}`]: currentPage + 1 !== paginationLength,
          }
        )}
      >
        <ArrowRightIcon size={16} />
      </span>
    </div>
  )
}

const SidebarTeam: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [paginatedUsers, setPaginatedUsers] = useState<UserType[][]>([])

  const { users, isLoading } = useAdminUsers()

  useEffect(() => {
    if (!isLoading && users?.length) {
      const paginationResult: UserType[][] = []
      for (let i = 0; i < users.length; i += PAGE_SIZE) {
        paginationResult.push(users.slice(i, i + PAGE_SIZE))
      }

      setPaginatedUsers(paginationResult)
    }
  }, [isLoading, users])

  const previousPage = () => {
    if (currentPage !== 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const nextPage = () => {
    if (paginatedUsers.length !== currentPage + 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="h-72 border-b border-grey-20">
      <div className="flex items-center justify-between">
        <span className="text-grey-50 ">Your team</span>
        <div className="flex stroke-grey-50">
          <PaginationArrows
            handleNextPage={nextPage}
            handlePreviousPage={previousPage}
            currentPage={currentPage}
            paginationLength={paginatedUsers.length}
          />
        </div>
      </div>

      {paginatedUsers[currentPage] &&
        paginatedUsers[currentPage].map((u, index) => (
          <SidebarTeamMember color={getColor(index)} key={u.id} user={u} />
        ))}
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center bg-grey-0 px-2.5 py-1.5 cursor-pointer text-violet-60"
      >
        <div className="w-[24px] h-[24px]  bg-violet-20 text-violet-60 rounded-full text-center flex justify-center items-center text-violet-60">
          <PlusIcon size={16} />
        </div>
        <span className="ml-2.5">Invite your team</span>
      </div>
      {isOpen && <InviteModal handleClose={() => setIsOpen(false)} />}
    </div>
  )
}

export default SidebarTeam
