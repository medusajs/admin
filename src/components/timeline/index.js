import React from "react"
import { Flex, Box } from "rebass"

const Timeline = ({ children }) => {
  return (
    <Flex
      flexDirection="column"
      pl={3}
      mr={3}
      ml={2}
      sx={{
        borderTop: "1px solid #89959C",
        "> div:last-child > div > .timelineLine": {
          height: "21px",
        },
      }}
    >
      <Box
        sx={{
          height: "10px",
          borderLeft: `1px solid #89959C`,
        }}
      ></Box>
      {children}
    </Flex>
  )
}

const TimelineItem = ({ children }) => {
  const timelineColor = "#89959C"
  return (
    <Flex pt={0} width={1}>
      <Box
        sx={{
          width: "15px",
          position: "relative",
        }}
      >
        <Box
          sx={{
            backgroundColor: timelineColor,
            height: "15px",
            width: "15px",
            borderRadius: "100%",
            position: "absolute",
            border: "4px solid white",
            left: "-7px",
            top: "21px",
            zIndex: "1",
          }}
        ></Box>
        <Box
          className="timelineLine"
          sx={{
            width: "1px",
            height: "100%",
            borderRight: `1px solid ${timelineColor}`,
          }}
        ></Box>
      </Box>
      <Box width={1} sx={{ borderBottom: `hairline` }} pb={3} pt={3} my={1}>
        {children}
      </Box>
    </Flex>
  )
}

Timeline.Item = TimelineItem

export default Timeline
