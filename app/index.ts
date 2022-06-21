import 'reflect-metadata';
import buildApp from './app';

const start = async () => {
  const instance = await buildApp();
  instance
    .listen({
      port: instance.config.PORT,
      host: '0.0.0.0',
    })
    .then(() => {
      console.log('Server started successfully');
    })
    .catch((err) => {
      instance.log.error(err);
      process.exit(1);
    });
};
start();
