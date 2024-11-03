import Fastify from 'fastify';

const fastify = Fastify({
  logger: true,
});
const PORT = process.env.PORT || 3000;

fastify.get('/', async (request, reply) => {
  return { hello: 'Hello from Server Fastify :)' };
});

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
