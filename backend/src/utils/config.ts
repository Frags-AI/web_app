
interface ConfigProps {
    PORT: string
    ENVIRONMENT: string
    STRIPE_PUBLIC: string
    STRIPE_SECRET: string
    CLERK_PUBLIC: string
    CLERK_SECRET: string
    S3_ACCESS: string
    S3_SECRET: string
    S3_BUCKET: string
    S3_REGION: string
    NGROK_DOMAIN?: string
    NGROK_AUTHTOKEN?: string
    CLERK_SIGNING_SECRET: string
    STRIPE_SIGNING_SECRET: string
    MODEL_SIGNING_SECRET: string
    MODEL_SERVER_URL: string
    FRONTEND_SERVER_URL: string
    RESEND_API_KEY: string
    RESEND_DOMAIN: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_REDIRECT_URI: string
    ALLOWED_ORIGINS: string[]
}


const PORT = process.env.PORT || '3000'
const ENVIRONMENT = process.env.NODE_ENV || 'DEVELOPMENT'
const STRIPE_PUBLIC = process.env.STRIPE_PUBLISHABLE_KEY || ''
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || ''
const CLERK_PUBLIC = process.env.CLERK_PUBLISHABLE_KEY || ''
const CLERK_SECRET = process.env.CLERK_SECRET_KEY || ''
const S3_ACCESS = process.env.S3_ACCESS_KEY || ''
const S3_SECRET = process.env.S3_SECRET_ACCESS_KEY || ''
const S3_BUCKET = process.env.S3_BUCKET_NAME || ''
const S3_REGION = process.env.S3_BUCKET_REGION || ''
const NGROK_DOMAIN = process.env.NGROK_DOMAIN || ''
const NGROK_AUTHTOKEN = process.env.NGROK_AUTHTOKEN || ''
const CLERK_SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET || ''
const STRIPE_SIGNING_SECRET = process.env.STRIPE_SIGNING_SECRET || ''
const MODEL_SIGNING_SECRET = process.env.MODEL_SIGNING_SECRET || ''
const MODEL_SERVER_URL = process.env.MODEL_SERVER_URL || ''
const FRONTEND_SERVER_URL = process.env.FRONTEND_SERVER_URL || ''
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const RESEND_DOMAIN = process.env.RESEND_DOMAIN || ''
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || ''

const allowedOrigins: string[] = [ 
    "https://fragsai.com", 
    "https://www.fragsai.com", 
    "https://model.fragsai.com",
    "https://www.model.fragsai.com", 
    "https://backend.fragsai.com", 
    "https://www.backend.fragsai.com",
    "http://localhost:5173", 
    "http://localhost:8000", 
    "http://localhost:3000" 
]


const config: ConfigProps = {
    PORT,
    STRIPE_PUBLIC,
    STRIPE_SECRET,
    CLERK_PUBLIC,
    CLERK_SECRET,
    S3_BUCKET,
    S3_REGION,
    S3_ACCESS,
    S3_SECRET,
    ENVIRONMENT,
    NGROK_DOMAIN,
    NGROK_AUTHTOKEN,
    CLERK_SIGNING_SECRET,
    STRIPE_SIGNING_SECRET,
    MODEL_SIGNING_SECRET,
    MODEL_SERVER_URL,
    RESEND_API_KEY,
    RESEND_DOMAIN,
    FRONTEND_SERVER_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    ALLOWED_ORIGINS: allowedOrigins
}

export default config
