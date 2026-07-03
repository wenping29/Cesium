import { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  ShowChart as ShowChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export default function AnalysisPage() {
  const { t } = useTranslation()
  const [timeRange, setTimeRange] = useState('7days')

  const chartData = [
    { name: t('analysis.charts.lineChart'), icon: <ShowChartIcon />, color: 'primary.main' },
    { name: t('analysis.charts.barChart'), icon: <BarChartIcon />, color: 'success.main' },
    { name: t('analysis.charts.pieChart'), icon: <PieChartIcon />, color: 'warning.main' }
  ]

  const keyMetrics = [
    {
      title: t('analysis.metrics.totalRevenue'),
      value: '¥126,560',
      trend: '+12.5%',
      trendUp: true,
      subtitle: t('analysis.metrics.comparedYesterday')
    },
    {
      title: t('analysis.metrics.visits'),
      value: '8,846',
      trend: '+5.2%',
      trendUp: true,
      subtitle: t('analysis.metrics.comparedYesterday')
    },
    {
      title: t('analysis.metrics.payments'),
      value: '6,560',
      trend: '-2.1%',
      trendUp: false,
      subtitle: t('analysis.metrics.comparedYesterday')
    },
    {
      title: t('analysis.metrics.conversionRate'),
      value: '78%',
      trend: '+8.3%',
      trendUp: true,
      subtitle: t('analysis.metrics.comparedYesterday')
    }
  ]

  const salesData = [
    { month: t('analysis.months.jan'), value: 4000 },
    { month: t('analysis.months.feb'), value: 3000 },
    { month: t('analysis.months.mar'), value: 5000 },
    { month: t('analysis.months.apr'), value: 4500 },
    { month: t('analysis.months.may'), value: 6000 },
    { month: t('analysis.months.jun'), value: 7000 }
  ]

  const categoryData = [
    { name: t('analysis.categories.electronics'), value: 35, color: '#1976d2' },
    { name: t('analysis.categories.clothing'), value: 25, color: '#2e7d32' },
    { name: t('analysis.categories.food'), value: 20, color: '#ed6c02' },
    { name: t('analysis.categories.other'), value: 20, color: '#757575' }
  ]

  const topProducts = [
    { rank: 1, name: t('analysis.products.productA'), sales: 1234, revenue: '¥45,600' },
    { rank: 2, name: t('analysis.products.productB'), sales: 987, revenue: '¥32,500' },
    { rank: 3, name: t('analysis.products.productC'), sales: 765, revenue: '¥28,700' },
    { rank: 4, name: t('analysis.products.productD'), sales: 654, revenue: '¥21,300' },
    { rank: 5, name: t('analysis.products.productE'), sales: 543, revenue: '¥18,900' }
  ]

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 4 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>{t('analysis.timeRange')}</InputLabel>
          <Select
            value={timeRange}
            label={t('analysis.timeRange')}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="today">{t('analysis.timeRanges.today')}</MenuItem>
            <MenuItem value="7days">{t('analysis.timeRanges.last7Days')}</MenuItem>
            <MenuItem value="30days">{t('analysis.timeRanges.last30Days')}</MenuItem>
            <MenuItem value="90days">{t('analysis.timeRanges.last90Days')}</MenuItem>
            <MenuItem value="year">{t('analysis.timeRanges.thisYear')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {keyMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {metric.title}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {metric.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon
                    sx={{
                      color: metric.trendUp ? 'success.main' : 'error.main',
                      transform: metric.trendUp ? 'none' : 'rotate(180deg)'
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: metric.trendUp ? 'success.main' : 'error.main' }}
                  >
                    {metric.trend}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {metric.subtitle}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Sales Trend */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title={t('analysis.charts.salesTrend')} />
            <Divider />
            <CardContent>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', px: 2 }}>
                {salesData.map((item, index) => (
                  <Box key={index} sx={{ textAlign: 'center', width: '100%', maxWidth: 60 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: `${(item.value / 7000) * 240}px`,
                        bgcolor: 'primary.main',
                        borderRadius: 1,
                        minHeight: 20,
                        transition: 'height 0.3s ease',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      {item.month}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title={t('analysis.charts.categoryDistribution')} />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {categoryData.map((item, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{item.name}</Typography>
                      <Typography variant="body2" fontWeight="medium">{item.value}%</Typography>
                    </Box>
                    <Box sx={{ bgcolor: 'background.paper', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                      <Box
                        sx={{
                          height: '100%',
                          width: `${item.value}%`,
                          bgcolor: item.color,
                          borderRadius: 4
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Products */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title={t('analysis.topProducts.title')} />
          <Divider />
          <CardContent>
            <Grid container sx={{ fontWeight: 'bold', mb: 2, px: 1 }}>
              <Grid item xs={2}><Typography variant="body2">{t('analysis.topProducts.rank')}</Typography></Grid>
              <Grid item xs={5}><Typography variant="body2">{t('analysis.topProducts.name')}</Typography></Grid>
              <Grid item xs={2}><Typography variant="body2" textAlign="right">{t('analysis.topProducts.sales')}</Typography></Grid>
              <Grid item xs={3}><Typography variant="body2" textAlign="right">{t('analysis.topProducts.revenue')}</Typography></Grid>
            </Grid>
            {topProducts.map((product) => (
              <Box key={product.rank} sx={{ py: 1.5, px: 1, '&:hover': { bgcolor: 'action.hover' }, borderRadius: 1 }}>
                <Grid container alignItems="center">
                  <Grid item xs={2}>
                    <Typography variant="body2" sx={{
                      color: product.rank <= 3 ? 'primary.main' : 'text.secondary',
                      fontWeight: product.rank <= 3 ? 'bold' : 'normal'
                    }}>
                      #{product.rank}
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="body2">{product.name}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body2" textAlign="right">{product.sales}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" textAlign="right" fontWeight="medium">{product.revenue}</Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Box>
  )
}