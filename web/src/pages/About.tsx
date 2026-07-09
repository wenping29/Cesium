import { Typography, Descriptions } from 'antd'

const { Title } = Typography

const techStack = [
  { label: 'Framework', children: 'React 19' },
  { label: 'Build Tool', children: 'Vite' },
  { label: 'Language', children: 'TypeScript' },
  { label: 'Routing', children: 'React Router 7' },
  { label: 'State Management', children: 'Redux Toolkit' },
  { label: 'HTTP Client', children: 'Axios' },
  { label: 'UI Library', children: 'Ant Design 6' },
]

function About() {
  return (
    <div style={{ padding: 48 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        About This Project
      </Title>
      <Descriptions
        bordered
        column={1}
        style={{ maxWidth: 600, margin: '0 auto' }}
        items={techStack}
      />
    </div>
  )
}

export default About
