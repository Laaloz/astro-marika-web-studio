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

export const POST: APIRoute = async ({request}) => {
  const formData = await request.formData()

  const honeypotValue = toStringValue(formData.get('bot-field')).trim()
  if (honeypotValue) {
    return Response.json({ok: true})
  }

  const recaptchaToken = toStringValue(formData.get('g-recaptcha-response')).trim()
  if (!recaptchaSecretKey || !recaptchaToken) {
    return Response.json({ok: false, reason: 'missing_token_or_secret'}, {status: 400})
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
    return Response.json({ok: false, reason: 'verify_request_failed'}, {status: 400})
  }

  const recaptchaResult = (await recaptchaResponse.json()) as RecaptchaVerifyResponse
  const isValidToken =
    recaptchaResult.success === true &&
    recaptchaResult.action === 'contact_form_submit' &&
    typeof recaptchaResult.score === 'number' &&
    recaptchaResult.score >= recaptchaMinScore

  if (!isValidToken) {
    return Response.json({ok: false, reason: 'invalid_token', details: recaptchaResult}, {status: 400})
  }

  return Response.json({ok: true, score: recaptchaResult.score})
}
