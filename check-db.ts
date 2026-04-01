import { supabase } from './src/lib/supabase';

async function checkColumns() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Sample product:', data[0]);
    console.log('Available keys:', Object.keys(data[0] || {}));
  }
}

checkColumns();
