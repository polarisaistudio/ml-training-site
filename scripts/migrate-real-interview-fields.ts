/**
 * Migration: Add real interview fields to questions table
 *
 * Run with: npx tsx scripts/migrate-real-interview-fields.ts
 */

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function migrate() {
  console.log('=== Migration: Add Real Interview Fields ===\n');

  const sql = neon(process.env.DATABASE_URL!);

  try {
    // Check if columns already exist
    const checkColumns = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'questions'
      AND column_name IN ('source_type', 'interview_log_id', 'real_interview_details')
    `;

    const existingColumns = checkColumns.map(row => row.column_name);
    console.log('Existing columns:', existingColumns.length > 0 ? existingColumns.join(', ') : 'none');

    // Add source_type column if not exists
    if (!existingColumns.includes('source_type')) {
      console.log('Adding source_type column...');
      await sql`
        ALTER TABLE questions
        ADD COLUMN source_type VARCHAR(20) DEFAULT 'generated' NOT NULL
      `;
      console.log('  ✓ source_type column added');
    } else {
      console.log('  - source_type column already exists');
    }

    // Add interview_log_id column if not exists
    if (!existingColumns.includes('interview_log_id')) {
      console.log('Adding interview_log_id column...');
      await sql`
        ALTER TABLE questions
        ADD COLUMN interview_log_id INTEGER REFERENCES interview_logs(id)
      `;
      console.log('  ✓ interview_log_id column added');
    } else {
      console.log('  - interview_log_id column already exists');
    }

    // Add real_interview_details column if not exists
    if (!existingColumns.includes('real_interview_details')) {
      console.log('Adding real_interview_details column...');
      await sql`
        ALTER TABLE questions
        ADD COLUMN real_interview_details JSONB
      `;
      console.log('  ✓ real_interview_details column added');
    } else {
      console.log('  - real_interview_details column already exists');
    }

    // Update all existing questions to be 'generated' type if null
    console.log('\nUpdating existing questions to source_type = "generated"...');
    const updateResult = await sql`
      UPDATE questions
      SET source_type = 'generated'
      WHERE source_type IS NULL
    `;
    console.log(`  ✓ Updated ${updateResult.length || 0} questions`);

    // Verify the changes
    console.log('\n=== Verification ===');
    const verifyColumns = await sql`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'questions'
      AND column_name IN ('source_type', 'interview_log_id', 'real_interview_details')
      ORDER BY column_name
    `;

    console.log('\nNew columns in questions table:');
    verifyColumns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (default: ${col.column_default || 'none'})`);
    });

    // Count questions by source type
    const counts = await sql`
      SELECT source_type, COUNT(*) as count
      FROM questions
      GROUP BY source_type
    `;

    console.log('\nQuestions by source type:');
    counts.forEach(row => {
      console.log(`  - ${row.source_type}: ${row.count}`);
    });

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
