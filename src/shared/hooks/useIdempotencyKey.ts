import { useCallback, useRef } from 'react'

/**
 * One Idempotency-Key per submission attempt (API spec 2.3 / 5.2 / 5.3): reused across
 * retries of the same attempt, regenerated only after the caller confirms success so a
 * resubmit after a real failure isn't mistaken for a duplicate by the server.
 */
export function useIdempotencyKey() {
  const keyRef = useRef(crypto.randomUUID())

  const regenerate = useCallback(() => {
    keyRef.current = crypto.randomUUID()
  }, [])

  return { idempotencyKey: keyRef.current, regenerate }
}
