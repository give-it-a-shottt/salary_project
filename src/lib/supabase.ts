import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase URL과 API Key를 가져옵니다
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase 클라이언트를 생성합니다
// 이 클라이언트를 통해 데이터베이스에 접근할 수 있습니다
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
