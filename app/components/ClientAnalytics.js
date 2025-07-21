'use client'

import { useEffect } from 'react'
import posthog from '../../services/instrumentation-client'

export default function ClientAnalytics() {
  useEffect(() => {
    posthog.capture('page_view', {
      path: window.location.pathname,
    })
  }, [])

  return null // tidak render apa-apa
}
