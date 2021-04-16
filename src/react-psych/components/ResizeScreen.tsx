import { Box, Button, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { getResponseTime, useResponseStart } from '../hooks/useResponseStart'
import { TimelineNodeProps } from '../types'
import { TimelineNodeError } from '../utils/errors'

interface ResizeScreen {
  timeline?: TimelineNodeProps
  buttonText: string
  inputKey?: string
}

export const ResizeScreen: React.FC<ResizeScreen> = ({
  children,
  timeline,
  buttonText,
}) => {

    // const ratio = 3.37 / 2.125;

    const [width, setWidth] = useState(337);
    const [height, setHeight] = useState(213);
    const [showButton, setShowButton] = useState(false);

    if (!timeline) {
        throw new TimelineNodeError()
      }



    const mouseDownEvent = (e: MouseEvent) => {
        e.preventDefault();

        setWidth(e.pageX);
        setHeight(Math.round(e.pageX * 0.632));

    }

    const keyDownEvent = (e: KeyboardEvent) => {
        if(e.key === 'Enter') {
            window.removeEventListener('mousedown', mouseDownEvent);
            setShowButton(true);
        }
    }

    useEffect(() => {
        if(timeline.isActive) {
        window.addEventListener('mousedown', mouseDownEvent);
        window.addEventListener('keydown', keyDownEvent);
        }
    }, [timeline.isActive])



  if (!timeline) {
    throw new TimelineNodeError()
  }

  const responseStart = useResponseStart(timeline.isActive)

  const handleResponse = (): void => {
    const responseTime = getResponseTime(responseStart)
    const ratio = width / 337;
    timeline.onFinish({
      type: 'resize',
      node: timeline.index,
      correct: null,
      response: ratio,
      time: responseTime,
    })
  }

  if (!timeline.isActive) {
    return null
  }

  return (
    <VStack>
        <Box background="green" width={width} height={height} position='absolute' left={0} top={0}></Box>
      {children}
      <Button
        colorScheme="blue"
        mt="3vh"
        size="lg"
        fontSize="20px"
        fontWeight="600"
        onClick={handleResponse}
        display={showButton ? 'flex' : 'none'}
      >
        {buttonText}
      </Button>
    </VStack>
  )
}
