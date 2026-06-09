import { createClient } from '@supabase/supabase-js';

// L'URL d'accès réseau à l'API de ton projet
const supabaseUrl = "https://fgcshstjmcebuenkfyer.supabase.co";

// Colle ici la clé Publishable key que tu viens de copier 
const supabaseAnonKey = "sb_publishable_GTf9EVOPzvO22Bvq5UAZ2Q_dWkfFrMc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);