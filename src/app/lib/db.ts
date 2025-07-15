import { createClient } from '@supabase/supabase-js'
import { MongoClient } from 'mongodb'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const mongoUri = process.env.MONGODB_URI!
const client = new MongoClient(mongoUri)

export const getMongoClient = async () => {
  await client.connect()
  return client
}