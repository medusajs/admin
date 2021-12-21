import React, { useState } from 'react'
import SidebarTeamMember from '../../molecules/sidebar-team-member'
// import { ReactComponent as Plus } from "../../assets/svg/2.0/16px/plus.svg"
import { ReactComponent as Plus } from '../../../assets/svg/2.0/16px/plus.svg'
import InviteModal from '../invite-modal'
const SidebarTeam = ({ users }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <span className="text-grey-50">Your team</span>
      <SidebarTeamMember index={1} user={{ first_name: 'Ludvig', last_name: 'Rask' }} profilePicture={'https://s3-alpha-sig.figma.com/img/da2f/3001/4df611215705de44229b5d6ec3419023?Expires=1641168000&Signature=DQIncmouMcnvgGIfUETeZ5QiLYfKHIgf7nKxns2qz7j2o41pIkgpZYm6t7mzAJ6XSJfGSR1vW1bl7iyQsOBukFEtGKIusp6AbU08t9i8T5R8nIM5tEkuWoGEX2RcLX8eRyUPowRZ3UCYaw8Cy9013sv7aRVqhw63OgPwwGUsAAFcbXsMhztHvnL8h-ioJyB~QnpqYmeEzse88oaXTY15pExvd~pvsjE~ov6spysPLrtvtdSSVrfwLjkLU2Zbo~msm6nPeUQHmmwHi9EAkf~FM-kEKV0SPO8pinBRlJSeqsXs8~nqlXc56813fkofzkd-tvtuZyN5ioW2IDKUXenDLw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'} />
      <SidebarTeamMember index={1} user={{ first_name: 'Sebastian', last_name: 'Rindom' }} profilePicture={'https://s3-alpha-sig.figma.com/img/995b/5d61/7722681b38e4be75f2ed6e0246e019ae?Expires=1641168000&Signature=bc-6u~NI4HkvLKA349UO7yJryHVqQUtWjXFBkhba5PBQ3OXWv4CrOXvbypD8q0SHgjpWnwrSWAx0IrKUyjVS3soVtytZTX-np~3E56qrBBoEfEv4BMeuXmu6GRzNUjNgpBU962MRy5VoLGwDs3FfD3VVZUlQEu~muT6VXvzCrZDPPWRc6ojUfcibYPGlJdZ1pQ1WtSNzxsbs9bHiCnAwZDZ0vJVlqE6In7u~lr02L-j-tjtACLd9HG0bemvp5g4M1mytgHalzq7Jkx8YJiekJg7z83GLuGZMOTNCzQKwzm7-4-MFRcAvf7iFfhYwoYtvWq0W4dmq-ERE3xb6HOkgxw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'} />
      <SidebarTeamMember index={6} user={{ first_name: "Philip", last_name: "Korsholm" }} />
      {users.map((u, index) => <SidebarTeamMember index={index} key={u.id} user={u} />)}
      <div onClick={() => setIsOpen(true)} className="flex items-center bg-grey-0 px-2.5 py-1.5 cursor-pointer">
        <div className="w-5 h-5 bg-violet-20 text-grey-0 rounded-full text-center flex justify-center items-center stroke-violet-60"><Plus /></div>
        <span className="ml-2.5 text-violet-60">Invite your team</span>
      </div>
      {isOpen &&
        (<InviteModal handleClose={() => setIsOpen(false)} />)
      }
    </div>
  )
}

export default SidebarTeam