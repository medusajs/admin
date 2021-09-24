import React from "react"
import { Flex, Text, Box } from "rebass"
import Button from "../../../components/button"

const ReturnReasonsList = ({ return_reasons, onEditClick }) => {
  console.log(return_reasons)
  return (
    <Flex width={1} flexDirection="column">
      <Flex
        py={3}
        width={1}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          borderBottom: "1px solid",
          borderColor: "muted",
        }}
      >
        <Box
          width={1 / 6}
          maxWidth="400px"
          fontWeight="500"
          sx={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <Text sx={{ fontSize: "14px" }}>LABEL</Text>
        </Box>
        <Box
          width={1 / 4}
          maxWidth="400px"
          fontWeight="500"
          sx={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <Text sx={{ fontSize: "14px" }}>CODE</Text>
        </Box>
        <Box
          width={1 / 3}
          maxWidth="400px"
          fontWeight="500"
          sx={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <Text sx={{ fontSize: "14px" }}>DESCRIPTION</Text>
        </Box>
        <Box width={1 / 10}></Box>
      </Flex>
      {return_reasons.map(r => (
        <Flex
          key={r.id}
          py={2}
          width={1}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            borderBottom: "1px solid",
            borderColor: "muted",
          }}
        >
          <Box
            width={1 / 6}
            maxWidth="400px"
            fontWeight="500"
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <Text sx={{ fontSize: "14px" }} color="black">
              {r.label}
            </Text>
          </Box>
          <Box
            width={1 / 4}
            maxWidth="400px"
            fontWeight="500"
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <Text sx={{ fontSize: "14px" }} color="black">
              {r.value}
            </Text>
          </Box>
          <Box
            width={1 / 3}
            maxWidth="400px"
            fontWeight="500"
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <Text sx={{ fontSize: "14px" }} color="black">
              {r.description}
            </Text>
          </Box>
          <Flex width={1 / 10} justifyContent="flex-end">
            <Button variant="primary" onClick={() => onEditClick(r)}>
              Edit
            </Button>
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}

export default ReturnReasonsList
