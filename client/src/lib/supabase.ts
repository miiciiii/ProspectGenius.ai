import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xpgjprtuloppvhwyhmgp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZ2pwcnR1bG9wcHZod3lobWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNDg1OTUsImV4cCI6MjA3MjgyNDU5NX0.-4sx-003NA0kWe2hAXHefFd5MRWt3Gtr0Js02sdyvfs';

// Create client with placeholder values for prototype
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
