const { createClient } = require('@supabase/supabase-js');

// Constants from .env.local
const supabaseUrl = 'https://ybzqocjwfvyuvuzkvuua.supabase.co';
const supabaseAnonKey = 'sb_publishable_T7d6UOCMhFXal53BFUZFlQ_vZJncQkM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('--- Testing Supabase Connection ---');
  console.log('URL:', supabaseUrl);
  
  try {
    // 1. Fetch products count
    console.log('\n1. Fetching products...');
    const { data: products, error: pError } = await supabase.from('products').select('*').limit(2);
    if (pError) {
      console.error('❌ Products Error:', pError.message);
    } else {
      console.log('✅ Products check successful. Count:', products.length);
      console.log('Sample data:', products);
    }

    // 2. Auth test
    console.log('\n2. Testing Auth (Attempt fake login)...');
    const { error: lError } = await supabase.auth.signInWithPassword({
      email: 'invalid@test.com',
      password: 'password123'
    });
    if (lError) {
      console.log('✅ Auth API responded (Error as expected):', lError.message);
    } else {
      console.log('⚠️ Auth API responded with SUCCESS (Unexpected!)');
    }

    console.log('\n--- Test Finished ---');
  } catch (err) {
    console.error('❌ Script crashed:', err.message);
  }
}

testConnection();
