<?php
/**
 * Configuration File
 * 
 * IMPORTANT: Do NOT commit this file with your real API key!
 * Add config.php to .gitignore
 */

// OpenAI API Key
define('OPENAI_API_KEY', 'YOUR_API_KEY_HERE');

// Allowed origins (your GitHub Pages URL)
define('ALLOWED_ORIGINS', [
    'https://beastmodz.github.io',
    'http://localhost:8080', // For local testing
    'http://127.0.0.1:8080'
]);

// API Settings
define('OPENAI_MODEL', 'gpt-4o-mini');
define('OPENAI_TEMPERATURE', 0.3);
define('OPENAI_MAX_TOKENS', 500);
?>
