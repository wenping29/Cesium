import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        px: 2,
        textAlign: 'center',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        © {year} {t('nav.appTitle')}. {t('footer.allRightsReserved')}
      </Typography>
    </Box>
  )
}
