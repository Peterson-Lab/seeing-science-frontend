import { GraphQLClient } from 'graphql-request'
import { useState } from 'react'
import { usePostTrialMutation } from '../generated/graphql'
import { defaultUserResponse } from '../react-psych/types'
import { __prod__ } from './constants'

export const useTimelineNodeFinish = (
  rqClient: GraphQLClient
): [(data: defaultUserResponse) => Promise<void>, (input: number) => void] => {
  const [id, setId] = useState(-1)
  const [questionNo, setQuestionNo] = useState(1)
  const { mutateAsync } = usePostTrialMutation(rqClient)

  return [
    async (data: defaultUserResponse): Promise<void> => {
      switch (data.type) {
        case 'input':
          if (typeof data.response != 'number') {
            throw new Error('input response invalid')
          }
          setId(data.response)
          return
        case 'question':
        case 'practice':
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
          if (id < 0) {
            throw new Error('id not set')
          }
          if (__prod__) {
            await mutateAsync({
              data: {
                answer: data.response,
                correct: data.correct,
                participantId: id,
                questionId: questionNo,
                time: data.time,
                target: data.targetFile,
                response_1: data.responseFile_1,
                response_2: data.responseFile_2,
                response_3: data.responseFile_3,
                response_4: data.responseFile_4,
              },
            })
          } else {
            console.log(data)
          }
          setQuestionNo((prevNo) => prevNo + 1)

          return
        case 'resize':
        case 'instruction':
        default:
          return
      }
    },
    setId,
  ]
}
