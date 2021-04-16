import { Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { SelectImage, TextScreen, Timeline } from '../../react-psych'
import { AudioTestScreen } from '../../react-psych/components/AudioTestScreen'
import { BeginScreen } from '../../react-psych/components/BeginScreen'
import { MultipleVideoScreen } from '../../react-psych/components/MultipleVideoScreen'
import { NumberInputScreen } from '../../react-psych/components/NumberInputScreen'
import { PracticeSelectImage } from '../../react-psych/components/PracticeSelectImage'
import { ResizeScreen } from '../../react-psych/components/ResizeScreen'
import { VideoScreen } from '../../react-psych/components/VideoScreen'
import {
  createPracticeQuestionList,
  createTestQuestionList,
} from '../../react-psych/questionList'
import { defaultUserResponse } from '../../react-psych/types'

const questionList = createTestQuestionList()

const practiceQuestionList = createPracticeQuestionList()

const ReactPsych: React.FC = () => {
  const router = useRouter()
  // const rqClient = createClient()
  // const { mutateAsync } = usePostTrialMutation(rqClient)

  const [id, setId] = useState(-1)
  // const [questionNo, setQuestionNo] = useState(1)

  const finish = (): void => {
    router.push('/')
  }

  const onNodeFinish = async (data: defaultUserResponse): Promise<void> => {
    // let res: PostTrialMutation

    switch (data.type) {
      case 'input':
        if (typeof data.response != 'number') {
          throw new Error('input response invalid')
        }
        setId(data.response)
        return
      case 'question':
        if (
          typeof data.response != 'number' ||
          typeof data.correct != 'boolean' ||
          typeof data.time != 'number' ||
          typeof data.targetFile != 'string' ||
          typeof data.responseFile_1 != 'string' ||
          typeof data.responseFile_2 != 'string' ||
          typeof data.responseFile_3 != 'string' ||
          typeof data.responseFile_4 != 'string'
        ) {
          throw new Error('data invalid')
        }
        if (id <= 0) {
          throw new Error('id not set')
        }

        // res = await mutateAsync({
        //   data: {
        //     answer: data.response,
        //     correct: data.correct,
        //     participantId: id,
        //     questionId: questionNo,
        //     time: data.time,
        //     target: data.targetFile,
        //     response_1: data.responseFile_1,
        //     response_2: data.responseFile_2,
        //     response_3: data.responseFile_3,
        //     response_4: data.responseFile_4,
        //   },
        // })

        // console.log(res)
        // setQuestionNo((prevNo) => prevNo + 1)
        return
      case 'resize':
      case 'practice':
      case 'instruction':
      default:
        return
    }
  }

  // useEffect(() => {
  //   cacheImages(['/exp/drt/danny.png'])
  // }, [])

  return (
    <Layout>
      <Flex align="center" justify="center">
        <Flex shadow="md" align="center" justify="center" my={5}>
          <Timeline onFinish={finish} sendNodeData={onNodeFinish} size="100">
            <BeginScreen buttonText="Next">
              <VStack spacing={4} mx={10} mb={5} textAlign="center">
                <Heading fontSize="70px">
                  Diagrammatic Representations Test
                </Heading>
                <Text px={60} mb={6}></Text>
              </VStack>
            </BeginScreen>
            <NumberInputScreen
              buttonText="Next"
              fieldLabel="Participant ID"
              fieldPlaceholder="123"
              setNumber={setId}
            >
              <Heading>Enter your Participant ID</Heading>
            </NumberInputScreen>
            <ResizeScreen buttonText="Next">
              <Heading fontSize="60px">Image Calibration</Heading>
              <Text px={60} fontSize="25px">
                Take a credit card and line it up with the top left corner of your screen. Click on the bottom right corner of the credit card, so the green box matches it.
              </Text>
              <Text px={60} fontSize="25px">
                Once you have it matched, press Enter on your keyboard to lock it in, and then press Next.
              </Text>
            </ResizeScreen>
            <AudioTestScreen
              buttonText="Yes"
              url="/drt/instructions/audio_test.mp3"
              playerProps={{ height: '50px', playing: true, loop: true }}
            >
              <VStack spacing={8} mx={10} mb={10} textAlign="center">
                <Heading fontSize="60px">Audio Test</Heading>
                <Text px={60} fontSize="25px">
                  Do you hear the music?
                </Text>
              </VStack>
            </AudioTestScreen>
            <MultipleVideoScreen
              urls={[
                '/drt/instructions/DRT_instructions.mp4',
                '/drt/instructions/DRT_demo.mp4',
              ]}
              buttonText="Next"
            >
              <Text fontSize="25px">
                Press the play button on the bottom left side of the video
                player to begin playing the video!
              </Text>
            </MultipleVideoScreen>
            <VideoScreen
              url="/drt/instructions/practice_question_instructions.mp3"
              buttonText="Start"
              playerProps={{ playing: true }}
            >
              <VStack spacing={6} mb={5}>
                <Heading fontSize="60px">Practice</Heading>
                <Text fontSize="25px">Now let&apos;s practice!</Text>
                <Text fontSize="25px">When you are ready, click Start.</Text>
              </VStack>
            </VideoScreen>
            {practiceQuestionList.map((q, idx) => {
              return <PracticeSelectImage key={idx} {...q} />
            })}
            <VideoScreen
              url="/drt/instructions/test_question_instructions.mp3"
              buttonText="Start"
              playerProps={{ playing: true }}
            >
              <VStack spacing={6} mb={5}>
                <Text fontSize="25px">
                  Now we&apos;ll move on to the rest of the drawings.
                </Text>
                <Text fontSize="25px">
                  This time, you won&apos;t see if your answers were right or
                  wrong.
                </Text>
                <Text fontSize="25px">
                  If you aren&apos;t sure, just take your best guess.
                </Text>
                <Text fontSize="25px">When you are ready, click Start!</Text>
              </VStack>
            </VideoScreen>

            {questionList.map((q, idx) => {
              return <SelectImage key={idx} {...q} />
            })}
            <TextScreen buttonText="Finish">
              <Heading fontSize="70px">Done!</Heading>
              <Text mb={4} fontSize="25px">
                Click below to return to the home page.
              </Text>
            </TextScreen>
          </Timeline>
        </Flex>
      </Flex>
    </Layout>
  )
}

export default ReactPsych
