import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Custom fetch wrapper with exponential backoff retry logic for Supabase requests
const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const maxAttempts = 4;
  const initialDelay = 1000; // 1 second
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      const response = await fetch(input, init);

      // Return immediately on successful responses or standard user errors (e.g., 400, 401, 403, 404)
      if (response.status < 500 && response.status !== 429) {
        return response;
      }

      // Retry on server-side errors (502 Bad Gateway / 503 Service Unavailable / 504 Gateway Timeout) 
      // or rate-limiting (429 Too Many Requests) which are typical when Supabase is waking up.
      console.warn(
        `[Supabase Client] Status ${response.status}. Retrying connection... (Attempt ${attempt + 1}/${maxAttempts})`
      );
    } catch (error) {
      console.error(
        `[Supabase Client] Network error occurred. Retrying connection... (Attempt ${attempt + 1}/${maxAttempts})`,
        error
      );
    }

    attempt++;
    if (attempt < maxAttempts) {
      // Exponential backoff with jitter: 1s, 2s, 4s (+ random noise to prevent synchronized retries)
      const delay = initialDelay * Math.pow(2, attempt - 1) + Math.random() * 500;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Final fallback attempt
  return fetch(input, init);
};

// On évite de faire planter le build si les variables d'environnement sont manquantes
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      fetch: customFetch
    }
  }
)

export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'tall3333333333@gmail.com'
