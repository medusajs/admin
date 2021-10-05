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
import { ReactComponent as ProfileIcon } from "../../assets/svg/profile.svg"
import { InterfaceContext } from "../../context/interface"
import Spinner from "../spinner"
import { SearchBar } from "./elements"
import Popover from "./popover"
import Medusa from "../../services/api"

const UnstyledButton = styled.button`
  padding: 0;
  color: inherit;
  font-weight: 500;
  font-size: 14px;
  font-family: inherit;
  font-style: inherit;
  text-align: inherit;
  text-decoration: none;
  background-color: transparent;
  border: 0;
  outline: none;
  cursor: pointer;
  box-shadow: none;
  line-height: 100%;

  &:hover {
    box-shadow: none;
    color: ${props => props.theme.colors["darkest"]};
  }
`

const TopBar = () => {
  const onSearch = () => ({}) //const { onSearch } = useContext(InterfaceContext)
  const [focusing, setFocusing] = useState(false)
  const [query, setQuery] = useState("")
  const [showProfile, setShowProfile] = useState(false)
  const searchRef = useRef(null)

  useHotkeys(
    "/",
    () => {
      if (searchRef && searchRef.current) {
        setFocusing(true)
        searchRef.current.focus()
        return false
      }
    },
    {},
    [searchRef]
  )

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
      }}
    >
      <Flex
        px={3}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1200px",
          margin: "auto",
          width: "100%",
        }}
      >
        <SearchBar
          value={query}
          placeholder={"Search..."}
          onKeyDown={onKeyDown}
          onChange={handleChange}
          ref={searchRef}
        />
        <Flex alignItems="center">
          <Box
            sx={{
              position: "relative",
              svg: {
                fill: "medusa",
                ":hover": {
                  cursor: "pointer",
                  fill: "ui-100",
                },
              },
            }}
            bg={"white"}
            data-for="profile-popover"
            data-delay-hide={50}
            data-tip
            data-event="click"
          >
            <ProfileIcon>
              <Popover id="profile-popover">
                <ProfilePopover />
              </Popover>
            </ProfileIcon>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

const ProfilePopover = () => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  if (!user) {
    Medusa.auth.session().then(response => {
      setUser(response.data.user)
      setLoading(false)
    })
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
        {loading ? (
          <Spinner />
        ) : (
          <Text variant="body.heavy">
            {user.first_name} {user.last_name}
          </Text>
        )}
        <Box
          mt={2}
          mb={-3}
          mx={-3}
          px={3}
          py={2}
          sx={{
            bg: "medusa",
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
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

export default TopBar
