const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ybzqocjwfvyuvuzkvuua.supabase.co';
const supabaseAnonKey = 'sb_publishable_T7d6UOCMhFXal53BFUZFlQ_vZJncQkM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpdate() {
  console.log('Testing update on order #1...');
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'processing' })
    .eq('id', 1)
    .select();

  if (error) {
    console.error('Update Error:', error.message);
  } else {
    console.log('Update Success! Result:', data);
  }
}

testUpdate();
