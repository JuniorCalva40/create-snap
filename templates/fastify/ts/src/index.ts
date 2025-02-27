import Fastify from 'fastify';
import 'dotenv/config';

const fastify = Fastify({
  logger: true,
});

const PORT = process.env.PORT || 3000;

fastify.get('/', async () => {
  return { hello: 'Hello from Server Fastify :)' };
});

const start = async () => {
  try {
    await fastify.listen({ port: Number(PORT) });
    fastify.log.info(`Server is running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

export { fastify };
