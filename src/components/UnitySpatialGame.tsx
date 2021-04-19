import { Center } from '@chakra-ui/react'
import React from 'react'
import Unity, { UnityContent } from 'react-unity-webgl'

interface UnitySpatialGameProps {}

const UnitySpatialGame: React.FC<UnitySpatialGameProps> = ({}) => {
  const unityContent = new UnityContent(
    '/spatial/web.json',
    '/spatial/UnityLoader.js'
  )

  return (
    <Center height="80%" width="80%">
      <Unity width="100%" height="100%" unityContent={unityContent} />
    </Center>
  )
}

export default UnitySpatialGame
