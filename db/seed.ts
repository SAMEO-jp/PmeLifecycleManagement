import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { taskTypes } from './schema/taskTypes';

// データベース接続
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  try {
    console.log('Seeding database...');

    // プロジェクトルートタスク種類を追加
    const projectRootTaskType = {
      id: 'project-root',
      typeName: 'プロジェクトルート',
      description: 'プロジェクトのルートタスク。プロジェクト参加者が割り当てられるタスク',
      colorCode: '#2563eb',
      sortOrder: 1,
      isActive: true,
    };

    await db.insert(taskTypes).values(projectRootTaskType).onConflictDoNothing();

    console.log('✅ プロジェクトルートタスク種類を追加しました');
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// スクリプトとして実行された場合のみseedを実行
if (require.main === module) {
  seed().catch(console.error);
}

export { seed };
