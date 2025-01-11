
import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = 'https://idovwputkmimglkmxedh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkb3Z3cHV0a21pbWdsa214ZWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzODI2MzMsImV4cCI6MjA1MTk1ODYzM30.8LHsYxAJTORQD_STqHWzBwgSxau80PHcvw6MHIwEq3E'
export const supabase = createClient(supabaseUrl, supabaseKey)

export function createSupabaseClient() {
    return createBrowserClient(
      'https://idovwputkmimglkmxedh.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkb3Z3cHV0a21pbWdsa214ZWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzODI2MzMsImV4cCI6MjA1MTk1ODYzM30.8LHsYxAJTORQD_STqHWzBwgSxau80PHcvw6MHIwEq3E'
    );
  }

function getStorage() {
  return supabase.storage
}



export const storage = getStorage();