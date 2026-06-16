import 'express-async-errors';
import http from 'http';

import { IEmailMessageDetails, winstonLogger } from '@rayeeskha/jobber-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { consumeAuthEmailMessages } from './queues/email.consumer';
import { Channel } from 'amqplib';
// import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';
const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');
export function start(app: Application): void {
  startServer(app);
  app.use('', healthRoutes());
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  // const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=1222`;
  // const messageDetails: IEmailMessageDetails = {
  //   receiverEmail: `${config.SENDER_EMAIL}`,
  //   resetLink: verificationLink,
  //   username: 'Rayees khan',
  //   template: 'forgotPassword'
  // };
  // const message = JSON.stringify(messageDetails);

  const emailChannel: Channel = (await createConnection()) as Channel;
  // emailChannel.publish('jobber-email-notification', 'auth-email', Buffer.from(message));
  await consumeAuthEmailMessages(emailChannel);
  // await consumeOrderEmailMessages(emailChannel);
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
}
