import dotenv from 'dotenv'
dotenv.config()

interface ConfigProps {
    PORT: string;
    ENVIRONMENT: string;
    DB_URI: string;
    DB_KEY: string;
    STRIPE_PUBLIC: string;
    STRIPE_SECRET: string;
    CLERK_PUBLIC: string;
    CLERK_SECRET: string;
    S3_ACCESS: string;
    S3_SECRET: string;
    S3_BUCKET: string;
    S3_REGION: string;
    NGROK_DOMAIN?: string;
}

const PORT = process.env.PORT || '3000'
const ENVIRONMENT = process.env.NODE_ENV || 'development'
const DB_URI = (ENVIRONMENT === 'production') ? process.env.SUPABASE_URL ?? '' : process.env.TEST_SUPABASE_URL ?? ''
const DB_KEY = (ENVIRONMENT === 'production') ? process.env.SUPABASE_KEY ?? '' : process.env.TEST_SUPABASE_KEY ?? ''
const STRIPE_PUBLIC = process.env.STRIPE_PUBLISHABLE_KEY || ''
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || ''
const CLERK_PUBLIC = process.env.CLERK_PUBLISHABLE_KEY || ''
const CLERK_SECRET = process.env.CLERK_SECRET_KEY || ''
const S3_ACCESS = process.env.S3_ACCESS_KEY || ''
const S3_SECRET = process.env.S3_SECRET_ACCESS_KEY || ''
const S3_BUCKET = process.env.S3_BUCKET_NAME || ''
const S3_REGION = process.env.S3_BUCKET_REGION || ''
const NGROK_DOMAIN = process.env.NGROK_DOMAIN || ''


const config: ConfigProps = {
    PORT,
    DB_URI,
    DB_KEY,
    STRIPE_PUBLIC,
    STRIPE_SECRET,
    CLERK_PUBLIC,
    CLERK_SECRET,
    S3_BUCKET,
    S3_REGION,
    S3_ACCESS,
    S3_SECRET,
    ENVIRONMENT,
    NGROK_DOMAIN
}

export default config
