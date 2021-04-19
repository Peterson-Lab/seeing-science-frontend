import { Center } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import React from 'react'
import Layout from '../components/Layout/Layout'

const UnitySpatialGame = dynamic(
  () => import('../components/UnitySpatialGame'),
  { ssr: false }
)

interface SpatialGameProps {}

const SpatialGame: React.FC<SpatialGameProps> = () => {
  return (
    <Layout>
      <Center height="95vh">
        <UnitySpatialGame />
      </Center>
    </Layout>
  )
}

export default SpatialGame
