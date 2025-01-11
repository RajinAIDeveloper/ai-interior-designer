import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './config/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:tWag4HLpy1sY@ep-shiny-glade-a59ps35r.us-east-2.aws.neon.tech/ai-interior-designer?sslmode=require',
  },
});
