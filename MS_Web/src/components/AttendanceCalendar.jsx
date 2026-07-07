import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material'
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  HolidayVillage as HolidayIcon
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

// 考勤状态类型
const ATTENDANCE_STATUS = {
  FULL: 'full',      // 上下班都打卡
  PARTIAL: 'partial', // 只打了一次卡
  NONE: 'none',      // 没打卡
  HOLIDAY: 'holiday', // 假期
  WEEKEND: 'weekend'  // 周末
}

export default function AttendanceCalendar({ compact = false }) {
  const { t } = useTranslation()
  const theme = useTheme()
  const [currentMonth, setCurrentMonth] = useState(dayjs())
  const [attendanceData, setAttendanceData] = useState({})

  // 模拟生成考勤数据
  useEffect(() => {
    const data = {}
    const today = dayjs()
    const startOfMonth = currentMonth.startOf('month')
    const endOfMonth = currentMonth.endOf('month')

    // 遍历当月每一天
    for (let d = startOfMonth; d.isBefore(endOfMonth) || d.isSame(endOfMonth); d = d.add(1, 'day')) {
      const dateStr = d.format('YYYY-MM-DD')
      const dayOfWeek = d.day()

      // 模拟假期：每月1号和一些特定日期
      const isHoliday = d.date() === 1 || (d.date() === 15 && d.month() === 0)

      if (isHoliday) {
        data[dateStr] = { status: ATTENDANCE_STATUS.HOLIDAY }
      } else if (dayOfWeek === 0 || dayOfWeek === 6) {
        // 周末
        data[dateStr] = { status: ATTENDANCE_STATUS.WEEKEND }
      } else if (d.isAfter(today)) {
        // 未来日期不设置状态
        data[dateStr] = { status: null }
      } else {
        // 随机生成考勤状态
        const random = Math.random()
        if (random < 0.6) {
          data[dateStr] = {
            status: ATTENDANCE_STATUS.FULL,
            checkIn: '08:' + String(Math.floor(Math.random() * 30)).padStart(2, '0'),
            checkOut: '18:' + String(Math.floor(Math.random() * 30)).padStart(2, '0')
          }
        } else if (random < 0.85) {
          data[dateStr] = {
            status: ATTENDANCE_STATUS.PARTIAL,
            checkIn: '09:' + String(Math.floor(Math.random() * 30)).padStart(2, '0'),
            checkOut: null
          }
        } else {
          data[dateStr] = { status: ATTENDANCE_STATUS.NONE }
        }
      }
    }
    setAttendanceData(data)
  }, [currentMonth])

  // 日历导航
  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'))
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'))
  const goToToday = () => setCurrentMonth(dayjs())

  // 获取当月的日期数组
  const getCalendarDays = () => {
    const startOfMonth = currentMonth.startOf('month')
    const endOfMonth = currentMonth.endOf('month')
    const startOfCalendar = startOfMonth.startOf('week')
    const endOfCalendar = endOfMonth.endOf('week')

    const days = []
    for (let d = startOfCalendar; d.isBefore(endOfCalendar) || d.isSame(endOfCalendar); d = d.add(1, 'day')) {
      days.push(d)
    }
    return days
  }

  // 获取日期状态的样式
  const getDayStatusStyle = (date) => {
    const dateStr = date.format('YYYY-MM-DD')
    const data = attendanceData[dateStr]
    const isCurrentMonth = date.month() === currentMonth.month()
    const isToday = date.isSame(dayjs(), 'day')

    let bgColor = 'transparent'
    let textColor = theme.palette.text.primary
    let borderColor = 'transparent'

    if (!isCurrentMonth) {
      textColor = theme.palette.text.disabled
    }

    if (data) {
      switch (data.status) {
        case ATTENDANCE_STATUS.FULL:
          bgColor = alpha(theme.palette.success.main, 0.15)
          borderColor = theme.palette.success.main
          break
        case ATTENDANCE_STATUS.PARTIAL:
          bgColor = alpha(theme.palette.warning.main, 0.15)
          borderColor = theme.palette.warning.main
          break
        case ATTENDANCE_STATUS.NONE:
          bgColor = alpha(theme.palette.error.main, 0.15)
          borderColor = theme.palette.error.main
          break
        case ATTENDANCE_STATUS.HOLIDAY:
          bgColor = alpha(theme.palette.info.main, 0.15)
          borderColor = theme.palette.info.main
          textColor = theme.palette.info.main
          break
        case ATTENDANCE_STATUS.WEEKEND:
          bgColor = alpha(theme.palette.grey[300], 0.3)
          textColor = isCurrentMonth ? theme.palette.text.secondary : theme.palette.text.disabled
          break
      }
    }

    if (isToday) {
      borderColor = theme.palette.primary.main
      textColor = theme.palette.primary.main
    }

    return { bgColor, textColor, borderColor, isCurrentMonth, isToday }
  }

  // 获取状态图标
  const getStatusIcon = (date) => {
    const dateStr = date.format('YYYY-MM-DD')
    const data = attendanceData[dateStr]
    if (!data || !data.status) return null

    switch (data.status) {
      case ATTENDANCE_STATUS.FULL:
        return <CheckCircleIcon sx={{ fontSize: compact ? 12 : 16, color: theme.palette.success.main }} />
      case ATTENDANCE_STATUS.PARTIAL:
        return <ScheduleIcon sx={{ fontSize: compact ? 12 : 16, color: theme.palette.warning.main }} />
      case ATTENDANCE_STATUS.NONE:
        return <CancelIcon sx={{ fontSize: compact ? 12 : 16, color: theme.palette.error.main }} />
      case ATTENDANCE_STATUS.HOLIDAY:
        return <HolidayIcon sx={{ fontSize: compact ? 12 : 16, color: theme.palette.info.main }} />
      default:
        return null
    }
  }

  // 渲染日期单元格
  const renderDayCell = (date) => {
    const dateStr = date.format('YYYY-MM-DD')
    const data = attendanceData[dateStr]
    const { bgColor, textColor, borderColor, isCurrentMonth, isToday } = getDayStatusStyle(date)

    const tooltipContent = () => {
      if (!data || !data.status) return t('calendar.noData')

      switch (data.status) {
        case ATTENDANCE_STATUS.FULL:
          return (
            <>
              <Typography variant="body2" fontWeight="bold">{t('calendar.fullAttendance')}</Typography>
              <Typography variant="caption">{t('calendar.checkIn')}: {data.checkIn}</Typography>
              <br />
              <Typography variant="caption">{t('calendar.checkOut')}: {data.checkOut}</Typography>
            </>
          )
        case ATTENDANCE_STATUS.PARTIAL:
          return (
            <>
              <Typography variant="body2" fontWeight="bold">{t('calendar.partialAttendance')}</Typography>
              {data.checkIn && <Typography variant="caption">{t('calendar.checkIn')}: {data.checkIn}</Typography>}
              {data.checkOut && <Typography variant="caption">{t('calendar.checkOut')}: {data.checkOut}</Typography>}
            </>
          )
        case ATTENDANCE_STATUS.NONE:
          return <Typography variant="body2" fontWeight="bold">{t('calendar.noAttendance')}</Typography>
        case ATTENDANCE_STATUS.HOLIDAY:
          return <Typography variant="body2" fontWeight="bold">{t('calendar.holiday')}</Typography>
        case ATTENDANCE_STATUS.WEEKEND:
          return <Typography variant="body2" fontWeight="bold">{t('calendar.weekend')}</Typography>
        default:
          return t('calendar.noData')
      }
    }

    return (
      <Tooltip key={dateStr} title={tooltipContent()} arrow placement="top">
        <Box
          sx={{
            minHeight: compact ? 50 : 70,
            p: compact ? 0.5 : 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            bgcolor: bgColor,
            border: isToday ? 2 : 1,
            borderColor: borderColor,
            borderRadius: 1,
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: theme.shadows[2]
            },
            opacity: isCurrentMonth ? 1 : 0.4
          }}
        >
          <Typography
            variant={compact ? "caption" : "body2"}
            sx={{
              fontWeight: isToday ? 'bold' : 'normal',
              color: textColor,
              mb: 0.5
            }}
          >
            {date.date()}
          </Typography>
          {getStatusIcon(date)}
        </Box>
      </Tooltip>
    )
  }

  const weekDays = [
    t('calendar.sunday'),
    t('calendar.monday'),
    t('calendar.tuesday'),
    t('calendar.wednesday'),
    t('calendar.thursday'),
    t('calendar.friday'),
    t('calendar.saturday')
  ]

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      {/* 日历头部 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChevronLeftIcon
            sx={{ cursor: 'pointer', '&:hover': { color: theme.palette.primary.main }, fontSize: 20 }}
            onClick={prevMonth}
          />
          <Typography variant="subtitle1" fontWeight="medium">
            {currentMonth.format('YYYY年 MM月')}
          </Typography>
          <ChevronRightIcon
            sx={{ cursor: 'pointer', '&:hover': { color: theme.palette.primary.main }, fontSize: 20 }}
            onClick={nextMonth}
          />
        </Box>
        <Chip
          label={t('calendar.today')}
          size="small"
          onClick={goToToday}
          sx={{ cursor: 'pointer', height: 24, fontSize: '0.75rem' }}
        />
      </Box>

      {/* 图例 */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
        <Chip
          size="small"
          icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
          label={t('calendar.fullAttendance')}
          color="success"
          variant="outlined"
          sx={{ height: 24, fontSize: '0.7rem' }}
        />
        <Chip
          size="small"
          icon={<ScheduleIcon sx={{ fontSize: 14 }} />}
          label={t('calendar.partialAttendance')}
          color="warning"
          variant="outlined"
          sx={{ height: 24, fontSize: '0.7rem' }}
        />
        <Chip
          size="small"
          icon={<CancelIcon sx={{ fontSize: 14 }} />}
          label={t('calendar.noAttendance')}
          color="error"
          variant="outlined"
          sx={{ height: 24, fontSize: '0.7rem' }}
        />
        <Chip
          size="small"
          icon={<HolidayIcon sx={{ fontSize: 14 }} />}
          label={t('calendar.holiday')}
          color="info"
          variant="outlined"
          sx={{ height: 24, fontSize: '0.7rem' }}
        />
      </Box>

      {/* 日历网格 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
        {/* 星期标题 */}
        {weekDays.map((day, index) => (
          <Box key={index} sx={{ textAlign: 'center', p: 0.5 }}>
            <Typography
              variant="caption"
              fontWeight="bold"
              sx={{
                color: index === 0 || index === 6 ? theme.palette.text.secondary : theme.palette.text.primary
              }}
            >
              {day}
            </Typography>
          </Box>
        ))}

        {/* 日期单元格 */}
        {getCalendarDays().map((date) => renderDayCell(date))}
      </Box>
    </Box>
  )
}
