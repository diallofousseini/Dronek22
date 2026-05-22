# Déploiement sur Vercel - Variables d'environnement nécessaires

Pour déployer sur Vercel, il me faut les valeurs suivantes (copiez-les depuis votre .env.local existant) :

## Firebase Configuration
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
- NEXT_PUBLIC_ADMIN_EMAIL
- ADMIN_EMAIL

## Supabase Configuration
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Database
- DATABASE_URL

## Access Code
- NEXT_PUBLIC_POST_ACCESS_CODE

## Options (si vous les utilisez)
- RESEND_API_KEY
- CONTACT_FROM
- CONTACT_TO
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
- NEXT_PUBLIC_GA4_ID
- SERPER_API_KEY

## Instructions
1. Après avoir fourni ces valeurs, je créerai un .env.vercel temporaire
2. Je me connecterai et déploierai avec le CLI Vercel
3. Le site sera accessible sur https://dronek.vercel.app