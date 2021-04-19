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
    <Center>
      <Unity width="960px" height="600px" unityContent={unityContent} />
    </Center>
  )
}

export default UnitySpatialGame
