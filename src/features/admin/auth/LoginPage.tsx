import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLocation, useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { ApiError } from '@/api/types'
import { useAuth } from './AuthContext'
import { DEV_MOCK_CREDENTIALS } from './devMockConstants'

const loginSchema = z.object({
  loginId: z.string().min(1, '아이디를 입력하세요.'),
  password: z.string().min(1, '비밀번호를 입력하세요.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    try {
      await login(values.loginId, values.password)
      const from = (location.state as { from?: Location })?.from?.pathname ?? '/admin'
      navigate(from, { replace: true })
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setServerError('아이디 또는 비밀번호가 올바르지 않습니다.')
        return
      }
      if (error instanceof ApiError && error.status === 429) {
        setServerError('로그인 시도가 많습니다. 잠시 후 다시 시도하세요.')
        return
      }
      setServerError('로그인 중 오류가 발생했습니다.')
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 12 }}>
      <Paper sx={{ p: 4, width: 360 }} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          관리자 로그인
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        {import.meta.env.DEV && (
          <Alert severity="info" sx={{ mb: 2 }}>            
            <b>
              {DEV_MOCK_CREDENTIALS.loginId} / admin1234!@#
            </b>            
          </Alert>
        )}

        <TextField
          label="아이디"
          fullWidth
          margin="normal"
          autoComplete="username"
          error={!!errors.loginId}
          helperText={errors.loginId?.message}
          {...register('loginId')}
        />
        <TextField
          label="비밀번호"
          type="password"
          fullWidth
          margin="normal"
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={isSubmitting}>
          로그인
        </Button>
      </Paper>
    </Box>
  )
}
