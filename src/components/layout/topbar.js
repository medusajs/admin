import styled from "@emotion/styled"
import { navigate } from "gatsby"
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { Box, Flex, Text } from "rebass"
import { Label } from "@rebass/forms"
import { ReactComponent as ProfileIcon } from "../../assets/svg/profile.svg"
import { ReactComponent as LoopIcon } from "../../assets/svg/loop.svg"
import { InterfaceContext } from "../../context/interface"
import { AccountContext } from "../../context/account"
import Spinner from "../spinner"
import { SearchBar } from "./elements"
import Popover from "./popover"
import Medusa from "../../services/api"
import Tooltip from "../tooltip"

const StyledBox = styled(Box)`
  background-color: #d9dfe8;
  font-size: 12px;
  color: white;
  font-weight: 500;
  line-height: 16px;
  padding-left: 6px;
  padding-right: 6px;
  border-radius: 2px;
  width: 17px;
  height: 17px;
  transition: fill 0.2s ease-in;

  :hover {
    background-color: #454b54;
  }
`

const ProfilePopover = () => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const { handleLogout } = useContext(AccountContext)

  if (!user) {
    Medusa.auth.session().then(response => {
      setUser(response.data.user)
      setLoading(false)
    })
  }

  let username

  if (user?.first_name && user?.last_name) {
    username = user.first_name + " " + user.last_name
  } else {
    username = "Medusa user"
  }

  return (
    <Box
      sx={{
        width: "220px",
        fontSize: "14px",
        borderRadius: "5px",
        background: "lightest",
      }}
    >
      <Box width="100%" p={3}>
        {loading ? <Spinner /> : <Text variant="body.heavy">{username}</Text>}
        <Box
          mt={2}
          mb={-3}
          mx={-3}
          px={3}
          py={2}
          sx={{
            bg: "#F7F7FA",
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            ":hover": {
              cursor: "pointer",
              color: "#89959C",
            },
          }}
        >
          <Text
            variant="link"
            onClick={() => {
              handleLogout()
              navigate("/login")
            }}
          >
            Sign out
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

const TopBar = () => {
  const { onSearch, display } = useContext(InterfaceContext)
  const [focusing, setFocusing] = useState(false)
  const [query, setQuery] = useState("")

  const searchRef = useRef(null)

  useEffect(() => setQuery(""), [onSearch])

  const hotKeyFocus = () => {
    if (searchRef && searchRef.current) {
      setFocusing(true)
      searchRef.current.focus()
      return false
    }
  }

  useHotkeys("shift+7", hotKeyFocus, {}, [searchRef])
  useHotkeys("/", hotKeyFocus, {}, [searchRef])

  const handleChange = e => {
    if (focusing) {
      setFocusing(false)
      return
    } else {
      setQuery(e.target.value)
    }
  }

  const onKeyDown = useCallback(
    event => {
      switch (event.key) {
        case "Enter":
          event.preventDefault()
          event.stopPropagation()
          if (onSearch) {
            onSearch(query)
          }
          searchRef.current.blur()
          break
        case "Esc":
        case "Escape":
          searchRef.current.blur()
          break
        default:
          break
      }
    },
    [onSearch, query]
  )

  return (
    <Flex
      px={4}
      sx={{
        background: "white",
        zIndex: 1001,
        position: "sticky",
        top: 0,
        width: "calc(100% + 64px)",
        marginRight: "-32px",
        marginLeft: "-32px",
        borderBottom: "subtle",
        minHeight: "43px",
      }}
    >
      <Flex
        px={3}
        sx={{
          alignItems: "center",
          justifyContent: display ? "space-between" : "flex-end",
          maxWidth: "1200px",
          margin: "auto",
          width: "100%",
        }}
      >
        {display && (
          <Flex alignItems="center">
            <Box sx={{ width: "35px", marginTop: "3px" }}>
              <LoopIcon />
            </Box>

            <Box sx={{ width: "25px" }}>
              <StyledBox
                data-for="tooltip-globalsearch"
                data-tip="Use '/' as a shortcut begin search."
              >
                <Box>/</Box>
              </StyledBox>
              <Tooltip id="tooltip-globalsearch" />
            </Box>
            <SearchBar
              value={query}
              placeholder={"Search..."}
              onKeyDown={onKeyDown}
              onChange={handleChange}
              ref={searchRef}
            />
          </Flex>
        )}
        <Flex alignItems="center">
          <Box
            sx={{
              position: "relative",
              svg: {
                fill: "medusa",
                ":hover": {
                  cursor: "pointer",
                  fill: "#89959C",
                },
              },
            }}
            bg={"white"}
            data-for="profile-popover"
            data-delay-hide={50}
            data-tip
            data-event="click"
          >
            <ProfileIcon />
            <Popover id="profile-popover">
              <ProfilePopover />
            </Popover>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default TopBar
