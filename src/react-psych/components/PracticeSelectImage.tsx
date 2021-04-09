import {
  Box,
  Button,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { NextChakraImage } from '../../components/NextChakraImage'
import { sleep } from '../../utils/sleep'
import {
  defaultUserResponse,
  ImageQuestionFields,
  ImageResponse,
  TimelineNodeProps,
} from '../types'
import { TimelineNodeError } from '../utils/errors'

export type PracticeSelectImageProps = ImageQuestionFields & {
  timeline?: TimelineNodeProps
}

type showState = 'cross' | 'question' | 'feedback'

const createBody = (
  show: showState,
  cross: JSX.Element,
  question: JSX.Element,
  feedback: JSX.Element
): JSX.Element => {
  switch (show) {
    case 'cross':
      return cross
    case 'question':
      return question
    case 'feedback':
      return feedback
    default:
      throw new Error('invalid show state')
  }
}

const correctItem = (response: ImageResponse, idx: number): JSX.Element => (
  <Link
    // bgColor="gray.200"
    borderWidth="3px"
    borderRadius="lg"
    p={2}
    // _hover={{ boxShadow: 'outline' }}
    // boxShadow={elementClicked === idx ? 'outline' : undefined}
    outline="solid 5px green"
    key={idx}
  >
    <VStack spacing={4} p={4}>
      <NextChakraImage
        height="70mm"
        width="50mm"
        src={response.answerImage}
        quality={100}
        loading="eager"
        priority={true}
        objectPosition=""
      />
      <Text fontSize="8mm" fontWeight="600">
        {idx + 1}
      </Text>
    </VStack>
  </Link>
)

const createIncorrectFeedbackResponses = (
  responses: ImageResponse[],
  correct: number,
  elementClicked: number
): JSX.Element => {
  const incorrectItem = (response: ImageResponse, idx: number): JSX.Element => (
    <Link
      // bgColor="gray.200"
      borderWidth="3px"
      borderRadius="lg"
      p={2}
      // _hover={{ boxShadow: 'outline' }}
      // boxShadow={elementClicked === idx ? 'outline' : undefined}
      outline="solid 5px red"
      key={idx}
    >
      <VStack spacing={4} p={4}>
        <NextChakraImage
          height="70mm"
          width="50mm"
          src={response.answerImage}
          quality={100}
          loading="eager"
          priority={true}
          objectPosition=""
        />
        <Text fontSize="8mm" fontWeight="600">
          {idx + 1}
        </Text>
      </VStack>
    </Link>
  )

  return (
    <>
      {responses.map((response, idx) => {
        if (idx === correct - 1) return correctItem(response, idx)
        if (idx === elementClicked) return incorrectItem(response, idx)
        return (
          <Link
            // bgColor="gray.200"
            borderWidth="3px"
            borderRadius="lg"
            p={2}
            // _hover={{ boxShadow: 'outline' }}
            // boxShadow={elementClicked === idx ? 'outline' : undefined}
            // outline={idx === correct - 1 ? 'solid'}
            key={idx}
          >
            <VStack spacing={4} p={4}>
              <NextChakraImage
                height="70mm"
                width="50mm"
                src={response.answerImage}
                quality={100}
                loading="eager"
                priority={true}
                objectPosition=""
              />
              <Text fontSize="8mm" fontWeight="600">
                {idx + 1}
              </Text>
            </VStack>
          </Link>
        )
      })}
    </>
  )
}

const createCorrectFeedbackResponses = (
  responses: ImageResponse[],
  correct: number
): JSX.Element => {
  return (
    <>
      {responses.map((response, idx) => {
        if (idx === correct - 1) return correctItem(response, idx)
        return (
          <Link
            // bgColor="gray.200"
            borderWidth="3px"
            borderRadius="lg"
            p={2}
            // _hover={{ boxShadow: 'outline' }}
            // boxShadow={elementClicked === idx ? 'outline' : undefined}
            // outline={idx === correct - 1 ? 'solid'}
            key={idx}
          >
            <VStack spacing={4} p={4}>
              <NextChakraImage
                height="70mm"
                width="50mm"
                src={response.answerImage}
                quality={100}
                loading="eager"
                priority={true}
                objectPosition=""
              />
              <Text fontSize="8mm" fontWeight="600">
                {idx + 1}
              </Text>
            </VStack>
          </Link>
        )
      })}
    </>
  )
}

export const PracticeSelectImage: React.FC<PracticeSelectImageProps> = ({
  stimulus,
  responses,
  timeline,
  correct,
}) => {
  const [responseStart, setResponseStart] = useState(Date.now())
  const [elementClicked, setElementClicked] = useState(-1)
  const [show, setShow] = useState<showState>('cross')
  const [isCorrect, setIsCorrect] = useState(false)
  const [showButton, setShowButton] = useState(false)

  // checks that the timeline props were passed.
  if (!timeline) {
    throw new TimelineNodeError()
  }

  const handleClick = (idx: number): void => {
    setElementClicked(idx)
    const isCorrectResponse = idx === correct - 1
    setIsCorrect(isCorrectResponse)
    setShow('feedback')
  }

  // // handles the user submitting their selection
  // const handleResponse = (): void => {
  //   const isCorrectResponse = elementClicked === correct - 1
  //   setIsCorrect(isCorrectResponse)
  //   setShow('feedback')
  //   // timeline.onFinish(userResponse)
  // }

  const handleFeedbackResponse = (): void => {
    const responseEnd = Date.now()

    const responseTime = responseEnd - responseStart

    const userResponse: defaultUserResponse = {
      type: 'practice',
      node: timeline.index,
      response: elementClicked + 1,
      correct: isCorrect,
      time: responseTime,
    }
    timeline.onFinish(userResponse)
  }

  // Saves the time when the question is shown, might want to set this to just active
  useEffect(() => {
    if (show === 'question') {
      setResponseStart(Date.now())
    }
  }, [show])


  // delay for showing cross and then question
  useEffect(() => {
    const waitShow = async (): Promise<void> => {
      await sleep(1000)
      setShow('question')
    }
    if (timeline.isActive) {
      waitShow()
    }
  }, [timeline.isActive])

  const cross = (
    <>
      <Text
        textAlign="center"
        alignSelf="center"
        justifySelf="center"
        fontSize="3cm"
        fontWeight="800"
      >
        +
      </Text>
      <Box height="18vh"></Box>
    </>
  )

  const question = (
    <>
      <NextChakraImage
        height="70mm"
        width="70mm"
        src={stimulus}
        quality={100}
        loading="eager"
        priority={true}
      />
      <HStack spacing={15}>
        {responses.map((response, idx) => (
          <Link
            // bgColor="gray.200"
            borderWidth="3px"
            borderRadius="lg"
            p={2}
            _hover={{ boxShadow: 'outline' }}
            boxShadow={elementClicked === idx ? 'outline' : undefined}
            key={idx}
            onClick={() => handleClick(idx)}
          >
            <VStack spacing={4} p={4}>
              <NextChakraImage
                height="70mm"
                width="50mm"
                src={response.answerImage}
                quality={100}
                loading="eager"
                priority={true}
                objectPosition=""
              />
              <Text fontSize="8mm" fontWeight="600">
                {idx + 1}
              </Text>
            </VStack>
          </Link>
        ))}
      </HStack>
      <VStack spacing={2}>
        <Box height="20mm" width="1px"></Box>
        <Text fontSize="6mm" fontWeight="600">
          Click on the BEST drawing
        </Text>
        )
      </VStack>
    </>
  )

  const incorrectFeedback = (
    <>
      <ReactPlayer
        url="/drt/instructions/feedback_incorrect.m4a"
        playing={true}
        volume={100}
        height="0px"
        onEnded={() => setShowButton(true)}
      />
      <NextChakraImage
        height="70mm"
        width="70mm"
        src={stimulus}
        quality={100}
        loading="eager"
        priority={true}
      />
      <Heading>Incorrect</Heading>
      <Text fontSize="6mm" fontWeight="600">
        Not quite. Actually, I like this one because it matches the object
        exactly
      </Text>
      <HStack spacing={15}>
        {createIncorrectFeedbackResponses(responses, correct, elementClicked)}
      </HStack>
      <VStack spacing={2}>
        {showButton ? (
          <Button
            colorScheme="blue"
            onClick={handleFeedbackResponse}
            mt="5mm"
            size="lg"
            height="15mm"
            width="50mm"
            fontSize="10mm"
            fontWeight="800"
            display="flex"
          >
            Next
          </Button>
        ) : null}
      </VStack>
    </>
  )

  const correctFeedback = (
    <>
      <ReactPlayer
        url="/drt/instructions/feedback_correct.m4a"
        playing={true}
        volume={100}
        height="0px"
        onEnded={() => setShowButton(true)}
      />
      <NextChakraImage
        height="70mm"
        width="70mm"
        src={stimulus}
        quality={100}
        loading="eager"
        priority={true}
      />
      <Heading>Correct!</Heading>
      <Text fontSize="6mm" fontWeight="600">
        That&apos;s right!
      </Text>
      <HStack spacing={15}>
        {createCorrectFeedbackResponses(responses, correct)}
      </HStack>
      <VStack spacing={2}>
        {showButton ? (
          <Button
            colorScheme="blue"
            onClick={handleFeedbackResponse}
            mt="5mm"
            size="lg"
            height="15mm"
            width="50mm"
            fontSize="10mm"
            fontWeight="800"
            display="flex"
          >
            Next
          </Button>
        ) : null}
      </VStack>
    </>
  )

  const feedback = <>{isCorrect ? correctFeedback : incorrectFeedback}</>

  const body = createBody(show, cross, question, feedback)

  return (
    // hidden images to get Next to preload all of the images when starting the experiment
    // I have no idea why this works but it does!
    <>
      <Box display="none">
        <NextChakraImage
          height="1mm"
          width="1mm"
          src={stimulus}
          quality={100}
          loading="eager"
          priority={true}
        />
        {responses.map((response, idx) => (
          <NextChakraImage
            key={idx}
            height="1mm"
            width="1mm"
            src={response.answerImage}
            quality={100}
            loading="eager"
            priority={true}
          />
        ))}
      </Box>
      {/* The actual shown part. Body starts as just the + and then is rerendered as the question, then the feedback */}
      <VStack
        mt="10mm"
        spacing="10mm"
        display={timeline.isActive ? 'flex' : 'none'}
      >
        {body}
      </VStack>
    </>
  )
}
