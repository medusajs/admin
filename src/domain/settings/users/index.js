import React, { useEffect, useState } from "react"
import { Box, Button, Flex, Text } from "rebass"
import Card from "../../../components/card"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import {
  DefaultCellContent,
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
} from "../../../components/table"
import Badge from "../../../components/fundamentals/badge"
import Medusa from "../../../services/api"
import EditUser from "./edit"
import EditInvite from "./invite/edit"
import Invite from "./invite"

const Users = () => {
  const [users, setUsers] = useState([])
  const [shouldRefetch, setShouldRefetch] = useState(0)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedInvite, setSelectedInvite] = useState(null)

  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(10)

  const handleClose = () => {
    setSelectedUser(null)
    setSelectedInvite(null)
  }

  const triggerRefetch = () => {
    setShouldRefetch(prev => prev + 1)
  }

  useEffect(() => {
    let userList = []
    Medusa.users
      .list()
      .then(res => res.data)
      .then(userData => {
        const users = [...userData.users]

        Medusa.invites
          .list()
          .then(res => res.data)
          .then(inviteData => {
            const invites = [...inviteData.invites]
            setUsers([...users, ...invites])
          })
      })
  }, [shouldRefetch])

  const handlePagination = direction => {
    const updatedOffset =
      direction === "next"
        ? parseInt(offset) + parseInt(limit)
        : parseInt(offset) - parseInt(limit)
    setOffset(updatedOffset)
  }

  return (
    <>
      <Flex pb={5} pt={5} justifyContent="center">
        <Card alignContent="center" width="90%" px={3}>
          <Flex width={1} flexDirection="column">
            <BreadCrumb
              previousRoute="/a/settings"
              previousBreadCrumb="Settings"
              currentPage="Users"
            />
            <Flex justifyContent="space-between" alignItems="center">
              <Text mb={3} fontSize={20} fontWeight="bold">
                Users
              </Text>
              <Invite triggerRefetch={triggerRefetch} />
            </Flex>
            <Card.Body py={0} flexDirection="column">
              <Table>
                <TableHead>
                  <TableHeaderRow>
                    <Flex width={1} justifyContent="space-between">
                      <Flex px={0} width={1 / 4}>
                        <TableHeaderCell fontWeight={450}>Name</TableHeaderCell>
                      </Flex>
                      <Flex width="55%">
                        <TableHeaderCell fontWeight={450}>
                          Email
                        </TableHeaderCell>
                      </Flex>
                      {/* <Flex width={1 / 5}>
                        <TableHeaderCell fontWeight={450}>Role</TableHeaderCell>
                      </Flex> */}
                      <Flex width={1 / 5}>
                        <TableHeaderCell />
                      </Flex>
                    </Flex>
                  </TableHeaderRow>
                </TableHead>
                <TableBody>
                  {users.slice(offset, offset + limit).map((user, i) => {
                    return (
                      <TableRow
                        key={i}
                        color={user?.token ? "gray" : "inherit"}
                        fontWeight={550}
                      >
                        <Flex width={1}>
                          <Flex width={1 / 4}>
                            <TableDataCell>
                              <DefaultCellContent variant="tiny.default">
                                {`${user.first_name || "-"} ${
                                  user.last_name || ""
                                }`}
                              </DefaultCellContent>
                            </TableDataCell>
                          </Flex>
                          <Flex width="55%">
                            <TableDataCell>
                              <DefaultCellContent>
                                <Flex
                                  width={1}
                                  alignItems="baseline"
                                  justifyContent="space-between"
                                >
                                  {user?.token ? user.user_email : user.email}{" "}
                                  {user?.token &&
                                    new Date(user?.expires_at) < new Date() && (
                                      <Badge bg="yellow">Expired</Badge>
                                    )}
                                </Flex>
                              </DefaultCellContent>
                            </TableDataCell>
                          </Flex>
                          {/* <Flex width={1 / 5}>
                            <TableDataCell>
                              <DefaultCellContent
                                sx={{ textTransform: "capitalize" }}
                              >
                                {user.role}
                              </DefaultCellContent>
                            </TableDataCell>
                          </Flex> */}
                          <Flex width={1 / 5}>
                            <TableDataCell
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                              }}
                            >
                              {user.role === "owner" ? null : user?.token ? (
                                <Button
                                  onClick={() => {
                                    setSelectedInvite(user)
                                  }}
                                  mr={"1px"}
                                >
                                  Edit invite
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => setSelectedUser(user)}
                                  mr={"1px"}
                                >
                                  Edit user
                                </Button>
                              )}
                            </TableDataCell>
                          </Flex>
                        </Flex>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <Flex alignItems="center" justifyContent="space-between" mt={2}>
                <Box>
                  <Text variant="small.default">
                    {users.filter(usr => !usr.token).length} member
                    {users.length === 1 ? "" : "s"}
                  </Text>
                </Box>
                <Box>
                  <Button
                    onClick={() => handlePagination("previous")}
                    disabled={offset === 0}
                    variant={"primary"}
                    fontSize="12px"
                    height="24px"
                    mr={1}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => handlePagination("next")}
                    disabled={users.length <= offset + limit}
                    variant={"primary"}
                    fontSize="12px"
                    height="24px"
                    ml={1}
                  >
                    Next
                  </Button>
                </Box>
              </Flex>
            </Card.Body>
          </Flex>
        </Card>
      </Flex>
      {selectedUser && !selectedInvite && (
        <EditUser
          handleClose={handleClose}
          triggerRefetch={triggerRefetch}
          user={selectedUser}
        />
      )}
      {selectedInvite && !selectedUser && (
        <EditInvite
          handleClose={handleClose}
          triggerRefetch={triggerRefetch}
          invite={selectedInvite}
        />
      )}
    </>
  )
}

export default Users
