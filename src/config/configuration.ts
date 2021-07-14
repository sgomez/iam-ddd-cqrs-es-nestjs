export default () => ({
  database: {
    uri: process.env.DATABASE_URL || 'mongodb://localhost/database',
  },
  eventstore: {
    connection: process.env.EVENTSTORE_URL || 'esdb://localhost:2113?tls=false',
    category: process.env.EVENTSTORE_STREAM,
  },
});
