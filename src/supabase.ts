import { createClient } from '@supabase/supabase-js'

const client = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_PUBLIC_KEY, { auth: { persistSession: false } }
)

export default client;
