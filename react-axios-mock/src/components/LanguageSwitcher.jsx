import { useState, useRef, useCallback } from 'react'
import { Button, Popper, Paper, Grow, MenuList, MenuItem } from '@mui/material'
import TranslateIcon from '@mui/icons-material/Translate'
import { useTranslation } from 'react-i18next'

const langs = ['en', 'zh', 'ja']

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const timerRef = useRef(null)

  const show = useCallback(() => { clearTimeout(timerRef.current); setOpen(true) }, [])
  const hide = useCallback(() => { timerRef.current = setTimeout(() => setOpen(false), 200) }, [])

  const changeLang = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('lang', lang)
    setOpen(false)
  }

  return (
    <div ref={anchorRef} onMouseEnter={show} onMouseLeave={hide} style={{ display: 'inline-block' }}>
      <Button color="inherit" size="small" startIcon={<TranslateIcon />}>
        {t(`language.${i18n.language}`)}
      </Button>
      <Popper open={open} anchorEl={anchorRef.current} placement="bottom-end" transition disablePortal style={{ zIndex: 1300 }}>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={200}>
            <Paper onMouseEnter={show} onMouseLeave={hide} sx={{ mt: 1, minWidth: 120 }}>
              <MenuList dense>
                {langs.map((l) => (
                  <MenuItem key={l} selected={i18n.language === l} onClick={() => changeLang(l)}>
                    {t(`language.${l}`)}
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}
