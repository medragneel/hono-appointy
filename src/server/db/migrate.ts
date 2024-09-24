import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { db } from './client';


(() => {

    console.log('Starting migrations');

    migrate(db, { migrationsFolder: 'drizzle' });

    console.log('Migrations complete.');
})();
