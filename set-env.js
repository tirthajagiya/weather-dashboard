const fs = require('fs');
const path = require('path');

// 1. Try to load variables from .env file if it exists
let apiKey = process.env.OPENWEATHER_API_KEY;

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/OPENWEATHER_API_KEY\s*=\s*(.*)/);
  if (match && match[1]) {
    apiKey = match[1].trim();
  }
}

if (!apiKey) {
  console.warn('Warning: OPENWEATHER_API_KEY not found in .env or system environment variables.');
  apiKey = 'TODO_YOUR_API_KEY_HERE';
}

const envDir = path.join(__dirname, 'src', 'environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

const generateFileContent = (isProd) => `export const environment = {
  production: ${isProd},
  openWeatherApiKey: '${apiKey}',
  openWeatherApiUrl: 'https://api.openweathermap.org/data/2.5'
};
`;

fs.writeFileSync(path.join(envDir, 'environment.ts'), generateFileContent(false));
fs.writeFileSync(path.join(envDir, 'environment.development.ts'), generateFileContent(true));

console.log('Environment configuration files generated successfully.');
