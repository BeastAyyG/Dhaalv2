const fs = require('fs');
const path = require('path');

// Colors for console
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

console.log(`${YELLOW}🔍 Checking Environment Variables...${RESET}`);

const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'GEMINI_API_KEY'
];

const missing = [];

// Check process.env (CI/CD/Vercel)
// Note: In local dev, nextjs loads .env.local automatically, 
// but this script running via node might need dotenv if run standalone.
try {
    require('dotenv').config({ path: '.env.local' });
} catch (e) {
    // ignore if dotenv not present or .env.local missing
}

requiredVars.forEach(key => {
    if (!process.env[key]) {
        missing.push(key);
    }
});

if (missing.length > 0) {
    console.error(`${RED}❌ Missing Required Environment Variables:${RESET}`);
    missing.forEach(m => console.error(`   - ${m}`));
    console.log(`\n${YELLOW}⚠️  Functionality will be limited. Please add these to your .env.local or Vercel Settings.${RESET}\n`);
    process.exit(1); // Fail build if critical vars missing
} else {
    console.log(`${GREEN}✅ All critical environment variables present.${RESET}\n`);
}
