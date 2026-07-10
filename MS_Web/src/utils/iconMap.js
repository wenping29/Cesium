import HomeIcon from '@mui/icons-material/Home'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows'
import MapIcon from '@mui/icons-material/Map'
import LayersIcon from '@mui/icons-material/Layers'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import TableChartIcon from '@mui/icons-material/TableChart'
import VolcanoIcon from '@mui/icons-material/Volcano'
import StormIcon from '@mui/icons-material/Storm'
import WavesIcon from '@mui/icons-material/Waves'
import AirIcon from '@mui/icons-material/Air'
import PeopleIcon from '@mui/icons-material/People'
import InsightsIcon from '@mui/icons-material/Insights'
import SettingsIcon from '@mui/icons-material/Settings'
import ShieldIcon from '@mui/icons-material/Shield'
import BusinessIcon from '@mui/icons-material/Business'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import ScheduleIcon from '@mui/icons-material/Schedule'
import DescriptionIcon from '@mui/icons-material/Description'
import TimerIcon from '@mui/icons-material/Timer'
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage'
import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import HistoryIcon from '@mui/icons-material/History'
import FindInPageIcon from '@mui/icons-material/FindInPage'
import VisibilityIcon from '@mui/icons-material/Visibility'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SendIcon from '@mui/icons-material/Send'
import InfoIcon from '@mui/icons-material/Info'
import WallpaperIcon from '@mui/icons-material/Wallpaper'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import FolderIcon from '@mui/icons-material/Folder'
import HelpIcon from '@mui/icons-material/Help'
import SecurityIcon from '@mui/icons-material/Security'
import StorageIcon from '@mui/icons-material/Storage'
import MenuIcon from '@mui/icons-material/Menu'

export const iconMap = {
  'Home': HomeIcon,
  'Dashboard': DashboardIcon,
  'DesktopWindows': DesktopWindowsIcon,
  'Map': MapIcon,
  'Layers': LayersIcon,
  'MapOutlined': MapOutlinedIcon,
  'TableChart': TableChartIcon,
  'Volcano': VolcanoIcon,
  'Storm': StormIcon,
  'Waves': WavesIcon,
  'Air': AirIcon,
  'People': PeopleIcon,
  'Insights': InsightsIcon,
  'Settings': SettingsIcon,
  'Shield': ShieldIcon,
  'Business': BusinessIcon,
  'Analytics': AnalyticsIcon,
  'Schedule': ScheduleIcon,
  'Description': DescriptionIcon,
  'Timer': TimerIcon,
  'HolidayVillage': HolidayVillageIcon,
  'BeachAccess': BeachAccessIcon,
  'History': HistoryIcon,
  'FindInPage': FindInPageIcon,
  'Visibility': VisibilityIcon,
  'Notifications': NotificationsIcon,
  'Send': SendIcon,
  'Info': InfoIcon,
  'Wallpaper': WallpaperIcon,
  'DashboardOutlined': DashboardOutlinedIcon,
  'Folder': FolderIcon,
  'Help': HelpIcon,
  'Security': SecurityIcon,
  'Storage': StorageIcon,
  'Menu': MenuIcon
}

export const getIconComponent = (iconName) => {
  if (!iconName) return null
  const IconComponent = iconMap[iconName]
  return IconComponent || null
}
