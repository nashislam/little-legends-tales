// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pjyzjhkmteiurgckazmg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqeXpqaGttdGVpdXJnY2them1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MTU0NzcsImV4cCI6MjA1OTQ5MTQ3N30.ukFFCj2g107SZsTrOb_o3eASANaP2gVzlDJWDd7fGG8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);