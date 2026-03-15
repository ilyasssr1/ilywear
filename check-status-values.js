const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ybzqocjwfvyuvuzkvuua.supabase.co';
const supabaseAnonKey = 'sb_publishable_T7d6UOCMhFXal53BFUZFlQ_vZJncQkM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkStatusValues() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, status')
    .limit(5);

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Order Statuses:', data.map(o => ({ id: o.id, status: o.status })));
  }
}

checkStatusValues();
