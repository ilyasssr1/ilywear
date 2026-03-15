const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ybzqocjwfvyuvuzkvuua.supabase.co';
const supabaseAnonKey = 'sb_publishable_T7d6UOCMhFXal53BFUZFlQ_vZJncQkM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkIdType() {
  const { data, error } = await supabase
    .from('orders')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Error:', error.message);
  } else if (data && data.length > 0) {
    const id = data[0].id;
    console.log('ID Value:', id);
    console.log('ID Type:', typeof id);
  } else {
    console.log('No orders found to check.');
  }
}

checkIdType();
