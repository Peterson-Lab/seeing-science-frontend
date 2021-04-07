import { Button, HStack, VStack, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import ReactPlayer, { ReactPlayerProps } from 'react-player'
import { getResponseTime, useResponseStart } from '../hooks/useResponseStart'
import { TimelineNodeProps } from '../types'
import { TimelineNodeError } from '../utils/errors'

interface AudioTestScreen {
  timeline?: TimelineNodeProps
  buttonText: string
  url: string
  playerProps?: ReactPlayerProps
}

export const AudioTestScreen: React.FC<AudioTestScreen> = ({
  children,
  timeline,
  buttonText,
  url,
  playerProps,
}) => {
  const [showHelpText, setShowHelpText] = useState(false)

  if (!timeline) {
    throw new TimelineNodeError()
  }

  const responseStart = useResponseStart(timeline.isActive)

  const handleResponse = (): void => {
    const responseTime = getResponseTime(responseStart)
    timeline.onFinish({
      type: 'instruction',
      node: timeline.index,
      correct: null,
      response: buttonText,
      time: responseTime,
    })
  }

  if (!timeline.isActive) {
    return null
  }

  return (
    <VStack px={20} spacing={2} textAlign="center">
      {children}
      <ReactPlayer
        url={url}
        controls={true}
        width="80%"
        height="80%"
        {...playerProps}
      />
      <HStack py="20px" width="80%" justify="center" spacing={3}>
        <Button
          colorScheme="blue"
          size="lg"
          fontSize="20px"
          fontWeight="600"
          onClick={() => handleResponse()}
        >
          Yes
        </Button>
        <Button
          colorScheme="blue"
          size="lg"
          fontSize="20px"
          fontWeight="600"
          onClick={() => setShowHelpText(true)}
        >
          No
        </Button>
      </HStack>
      {showHelpText ? (
        <Text fontSize="20px">uh oh! Can you turn up the speaker volume?</Text>
      ) : null}
    </VStack>
  )
}
