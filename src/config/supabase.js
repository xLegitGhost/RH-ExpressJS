const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Advertencia: Falta la configuración de Supabase en el archivo .env');
}

const supabase = createClient(supabaseUrl || 'https://example.supabase.co', supabaseKey || 'public-anon-key');

module.exports = supabase;
