/**
 * Import the application builder
 */
import { buildApp } from './app.js';
/**
 * Import environment configuration
 */
import { env } from './config/env.js';

/**
 * Main entry point to start the server
 */
const start = async () => {
  try {
    // Build the Fastify application instance
    const app = await buildApp();
    
    // Start listening for incoming requests
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    
    // Log success message to the console
    console.log(`🚀 Volt Backend running on http://localhost:${env.PORT}`);
  } catch (err) {
    // Log any errors that occur during startup
    console.error(err);
    
    // Exit the process with failure code
    process.exit(1);
  }
};

// Execute the start function
start();
