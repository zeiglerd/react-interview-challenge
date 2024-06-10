import pg from 'pg';

export const query = async (query: string, values: any[] = []): Promise<pg.QueryResult<any>> => {
  const {Client} = pg;
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const res = await client.query(query, values);
  await client.end();
  return res;
}

export const tQuery = async (callback: (client: pg.Client) => void) => {
  const {Client} = pg;
  const client = new Client({ 
    connectionString: process.env.DATABASE_URL, 
  });
  await client.connect();
  await client.query('BEGIN');
  try {
    await callback(client);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  } finally {
    await client.end();
  }
}
