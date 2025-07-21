// instrumentation-client.js
import posthog from 'posthog-js'

// Jangan inisialisasi kalau key tidak ada (bisa error di dev)
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    loaded: (ph) => {
      console.log('✅ PostHog initialized', ph);
    }
  });
}

export default posthog;
