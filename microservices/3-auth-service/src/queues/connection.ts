import { config } from '@auth/config';
import { winstonLogger } from '@rayeeskha/jobber-shared';
import client, { Channel, ChannelModel } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'gigQueueConnection',
  'debug',
);

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: ChannelModel = await client.connect(
      `${config.RABBITMQ_ENDPOINT}`,
    );
    const channel: Channel = await connection.createChannel();
    log.info('Auth server connected to rabbit queue successfully...');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'AuthService error createConnection() method:', error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: ChannelModel): void {
  //signal It runs ONLY when: app is stopped
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}

export { createConnection };
