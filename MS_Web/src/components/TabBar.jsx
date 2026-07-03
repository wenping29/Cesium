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
    <Box sx={{ borderBottom: 0, padding: 0,borderColor: 'divider', background: 'background.paper' }}>
      <Tabs
        value={currentValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          height: 32,
          minHeight: 32,
          paddingTop: "1px",
          paddingBottom: "1px",
          paddingLeft:"1px",
          paddingRight: "1px",
          '& .MuiTabs-indicator': {
            backgroundColor: 'primary.main',
          },
          '& .MuiTab-root': {
            minWidth: 80,
            maxWidth: 300,
            height: 24,
            minHeight: 32,
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.path}
            value={tab.path}
            icon={tab.icon}
            iconPosition="start"
            sx={{ padding: 0,height:24,minHeight:24 }}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1,height:24 }}>
                {tab.title}
                <CloseIcon
                  fontSize="small"
                  onClick={(e) => handleClose(e, tab.path)}
                  sx={{ cursor: 'pointer', opacity: 0.4, '&:hover': { opacity: 1, color: 'error.main' } }}
                />
              </Box>
            }
          />
        ))}
      </Tabs>
    </Box>
  )
}