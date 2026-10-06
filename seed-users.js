import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://yovwxnkqvavthyygbbup.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Myo5rCrEI6OKd8ccHC8HCQ_T3c-_lGd';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const users = [
  { email: 'superadmin@demo.com', role: 'Super Admin' },
  { email: 'orgadmin@demo.com', role: 'Org Admin' },
  { email: 'esgmanager@demo.com', role: 'ESG Manager' },
  { email: 'datacontributor@demo.com', role: 'Data Contributor' },
  { email: 'auditor@demo.com', role: 'Auditor' }
];

async function createUsers() {
  console.log('Starting user creation...');
  for (const user of users) {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: 'DemoPassword123!',
      options: {
        data: {
          full_name: user.role,
          organization_name: 'Demo Corp',
          organization_industry: 'Technology',
          organization_country: 'India'
        }
      }
    });

    if (error) {
      console.error(`Error creating ${user.email}:`, error.message);
    } else {
      console.log(`Successfully signed up: ${user.email}`);
      if (data?.user?.identities?.length === 0) {
        console.log(`Note: ${user.email} already exists.`);
      }
    }
  }
  console.log('Done!');
}

createUsers();
