import { Button, Card, Flex, Typography } from 'antd'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { decrement, increment } from '../store/slices/counterSlice'

const { Title } = Typography

function Home() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      style={{ minHeight: '60vh' }}
      gap="middle"
    >
      <Title level={2}>Home Page</Title>
      <Card style={{ width: 300, textAlign: 'center' }}>
        <Title level={3}>Redux Counter</Title>
        <Title style={{ margin: '24px 0' }}>{count}</Title>
        <Flex gap="small" justify="center">
          <Button type="primary" onClick={() => dispatch(decrement())}>
            -1
          </Button>
          <Button type="primary" onClick={() => dispatch(increment())}>
            +1
          </Button>
        </Flex>
      </Card>
    </Flex>
  )
}

export default Home
