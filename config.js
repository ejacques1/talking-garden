/* ------------------------------------------------------------------
   The Talking Garden — configuration
   ------------------------------------------------------------------
   To switch from DEMO mode to REAL accounts:

   1. Create a free project at https://supabase.com  (you have to do
      this bit — it needs your login).
   2. In the Supabase dashboard go to:  Project Settings → API
   3. Copy "Project URL" and the "anon / public" key into the two
      lines below, then save.
   4. Run supabase-schema.sql (in this folder) in the SQL Editor.

   The anon key is DESIGNED to be public and live in the browser —
   it is not a secret. Row Level Security is what protects the data.
   NEVER paste the "service_role" key here. That one is secret.
------------------------------------------------------------------- */

window.TG_CONFIG = {
  SUPABASE_URL:      'https://msldloxmoniiyanllduq.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_-VKCpT0qxzgUu25XqdFjtw_U-I-CQXf',
};

// Demo mode turns itself off automatically once both values are filled in.
window.TG_DEMO = !(window.TG_CONFIG.SUPABASE_URL && window.TG_CONFIG.SUPABASE_ANON_KEY);
