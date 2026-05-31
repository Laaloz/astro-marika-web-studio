import type {APIRoute} from 'astro'

const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY?.trim() || ''
const recaptchaMinScore = Number.parseFloat(process.env.RECAPTCHA_MIN_SCORE || '0.5')

type RecaptchaVerifyResponse = {
  success?: boolean
  score?: number
  action?: string
  challenge_ts?: string
  hostname?: string
  'error-codes'?: string[]
}

const toStringValue = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value : '')

const withStatusParam = (targetUrl: string, status: 'success' | 'error') => {
  const url = new URL(targetUrl)
  url.searchParams.set('form-status', status)
  return url.toString()
}

export const POST: APIRoute = async ({request, site}) => {
  const formData = await request.formData()
  const referer = request.headers.get('referer')
  const fallbackRedirect = site?.origin ? `${site.origin}/` : '/'
  const baseRedirect = referer || fallbackRedirect
  const successRedirect = withStatusParam(baseRedirect, 'success')
  const errorRedirect = withStatusParam(baseRedirect, 'error')

  const honeypotValue = toStringValue(formData.get('bot-field')).trim()
  if (honeypotValue) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: successRedirect,
      },
    })
  }

  const recaptchaToken = toStringValue(formData.get('g-recaptcha-response')).trim()
  if (!recaptchaSecretKey || !recaptchaToken) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: errorRedirect,
      },
    })
  }

  const verifyBody = new URLSearchParams({
    secret: recaptchaSecretKey,
    response: recaptchaToken,
  })

  const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: verifyBody.toString(),
  })

  if (!recaptchaResponse.ok) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: errorRedirect,
      },
    })
  }

  const recaptchaResult = (await recaptchaResponse.json()) as RecaptchaVerifyResponse
  const isValidToken =
    recaptchaResult.success === true &&
    recaptchaResult.action === 'contact_form_submit' &&
    typeof recaptchaResult.score === 'number' &&
    recaptchaResult.score >= recaptchaMinScore

  if (!isValidToken) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: errorRedirect,
      },
    })
  }

  const forwardBody = new FormData()
  for (const [key, value] of formData.entries()) {
    if (key === 'g-recaptcha-response') continue
    forwardBody.append(key, value)
  }

  const origin = site?.origin || new URL(request.url).origin
  const forwardResponse = await fetch(`${origin}/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: forwardBody,
  })

  if (!forwardResponse.ok) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: errorRedirect,
      },
    })
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: successRedirect,
    },
  })
}
