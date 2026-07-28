import { useParams } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useAdminUseCaseDetail } from './hooks'

export function UseCaseDetailPage() {
  const { useCaseId = '' } = useParams()
  const { data, isLoading, isError } = useAdminUseCaseDetail(useCaseId)

  if (isLoading) return <CircularProgress />
  if (isError || !data) return <Alert severity="error">사용사례를 불러오지 못했습니다.</Alert>

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">{data.title}</Typography>
        <Chip size="small" label={data.status} />
      </Stack>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {data.summary}
      </Typography>

      <Box
        sx={{ mb: 4 }}
        // body is server-sanitized HTML (API spec 14.1)
        dangerouslySetInnerHTML={{ __html: data.body }}
      />

      <Alert severity="info">수정 화면은 추후 구현 예정입니다.</Alert>
    </Box>
  )
}
