import { Button, HStack, Icon, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { MdReplay } from 'react-icons/md'
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
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)
  const player = React.createRef<ReactPlayer>()

  if (!timeline) {
    throw new TimelineNodeError()
  }

  const responseStart = useResponseStart(timeline.isActive)

  const handleResponse = (): void => {
    setPlaying(false)
    setEnded(false)
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
    if (!hasBacked) setShowButtons(false)
    setCurrentVideo((vid) => (vid += 1))
    player.current?.seekTo(0, 'fraction')
  }

  const handleBack = (): void => {
    setHasBacked(true)
    setCurrentVideo((vid) => (vid -= 1))
  }

  const handleEnd = () => {
    setShowButtons(true)
    setEnded(true)
  }

  const handleReplay = () => {
    player.current?.seekTo(0, 'fraction')
    setEnded(false)
  }

  if (!timeline.isActive) {
    return null
  }

  return (
    <VStack px={20} spacing={2} textAlign="center">
      {children}
      <VStack>
        <ReactPlayer
          url={urls[currentVideo]}
          controls={true}
          ref={player}
          width="80%"
          height="80%"
          onEnded={() => handleEnd()}
          playing={playing}
          {...playerProps}
        />
        <HStack>
          {
            ended ? (
              <Button
                colorScheme="blue"
                size="lg"
                fontSize="20px"
                fontWeight="600"
                onClick={() => handleReplay()}
              >
                <Icon mr={2} as={MdReplay} /> Replay
              </Button>
            ) : null
            // <Button
            //   colorScheme="blue"
            //   size="lg"
            //   fontSize="20px"
            //   fontWeight="600"
            //   onClick={() => handlePlayPause()}
            // >
            //   {playing ? (
            //     <>
            //       <Icon mr={2} as={FaPause} /> Pause
            //     </>
            //   ) : (
            //     <>
            //       <Icon mr={2} as={FaPlay} /> Play
            //     </>
            //   )}
            // </Button>
          }
          {showButtons ? (
            <>
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
            </>
          ) : null}
        </HStack>
      </VStack>
    </VStack>
  )
}
