import { Tabs, Tab, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate, useLocation } from 'react-router-dom'
import tabStore from '../store/tabStore'

export default function TabBar() {
  const { tabs, activeTab, removeTab, setActiveTab } = tabStore()
  const navigate = useNavigate()
  const location = useLocation()

  const currentValue = activeTab || location.pathname

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    navigate(newValue)
  }

  const handleClose = (event, path) => {
    event.stopPropagation()
    removeTab(path)
    if (location.pathname === path) {
      const remaining = tabs.filter((t) => t.path !== path)
      if (remaining.length > 0) {
        navigate(remaining[remaining.length - 1].path)
      } else {
        navigate('/workbench')
      }
    }
  }

  if (tabs.length === 0) return null

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', background: 'background.paper' }}>
      <Tabs
        value={currentValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: 'primary.main',
          },
          '& .MuiTab-root': {
            minWidth: 120,
            maxWidth: 200,
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.path}
            value={tab.path}
            label={tab.title}
            icon={tab.icon}
            iconPosition="start"
            endIcon={
              <CloseIcon
                fontSize="small"
                onClick={(e) => handleClose(e, tab.path)}
                sx={{ cursor: 'pointer', opacity: 0.4, '&:hover': { opacity: 1, color: 'error.main' } }}
              />
            }
          />
        ))}
      </Tabs>
    </Box>
  )
}