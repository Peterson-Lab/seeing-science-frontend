import { Button, HStack, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import ReactPlayer, { ReactPlayerProps } from 'react-player'
import { getResponseTime, useResponseStart } from '../hooks/useResponseStart'
import { TimelineNodeProps } from '../types'
import { TimelineNodeError } from '../utils/errors'

interface MultipleVideoScreen {
  timeline?: TimelineNodeProps
  buttonText: string
  urls: string[]
  playerProps?: ReactPlayerProps
}

export const MultipleVideoScreen: React.FC<MultipleVideoScreen> = ({
  children,
  timeline,
  buttonText,
  urls,
  playerProps,
}) => {
  const [currentVideo, setCurrentVideo] = useState(0)
  const [showButtons, setShowButtons] = useState(false)
  const [hasBacked, setHasBacked] = useState(false)

  if (!timeline) {
    throw new TimelineNodeError()
  }

  const responseStart = useResponseStart(timeline.isActive)

  const handleResponse = (): void => {
    if (currentVideo === urls.length - 1) {
      const responseTime = getResponseTime(responseStart)
      timeline.onFinish({
        type: 'instruction',
        node: timeline.index,
        correct: null,
        response: buttonText,
        time: responseTime,
      })
      return
    }
    if(!hasBacked) setShowButtons(false)
    setCurrentVideo((vid) => (vid += 1))
  }

  const handleBack = ():void => {
    setHasBacked(true)
    setCurrentVideo((vid) => (vid -= 1))
  }

  if (!timeline.isActive) {
    return null
  }

  return (
    <VStack px={20} spacing={2} textAlign="center">
      {children}
      {urls.map((url, idx) => (
        <VStack key={idx} display={currentVideo === idx ? 'flex' : 'none'}>
          <ReactPlayer
            url={url}
            controls={true}
            width="80%"
            height="80%"
            onEnded={() => setShowButtons(true)}
            {...playerProps}
          />
        </VStack>
      ))}
      {showButtons ? (
        <HStack>
          {currentVideo > 0 ? (
            <Button
              colorScheme="blue"
              size="lg"
              fontSize="20px"
              fontWeight="600"
              onClick={() => handleBack()}
            >
              Back
            </Button>
          ) : null}
          <Button
            colorScheme="blue"
            size="lg"
            fontSize="20px"
            fontWeight="600"
            onClick={() => handleResponse()}
          >
            {buttonText}
          </Button>
        </HStack>
      ) : null}
    </VStack>
  )
}
