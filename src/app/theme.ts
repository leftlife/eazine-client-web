import { createTheme } from '@mui/material/styles'

/** Scoped to the /admin route tree only — the public site is styled with Tailwind. */
export const adminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1d4ed8' },
  },
  shape: {
    borderRadius: 8,
  },
})
