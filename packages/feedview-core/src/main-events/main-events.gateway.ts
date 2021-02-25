/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NewsService } from 'src/news/news.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TwitterService } from 'src/twitter/twitter.service';
import { INewsResponseData } from 'src/news/interfaces/news.interface';

@WebSocketGateway()
export class MainEventsGateway {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(NewsService) private newsSerivce: NewsService,
    @Inject(TwitterService) private twitterService: TwitterService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  private clientQueries: { [id: string]: string } = {};

  @SubscribeMessage('query')
  async query(@MessageBody() data, @ConnectedSocket() client): Promise<void> {
    const clientId = client.id;
    this.clientQueries[clientId] = data;

    this.clearIntervals(clientId);
    this.setIntervals(clientId);
  }

  async sendPosts(clientId: string, type: 'twitter' | 'news') {
    // @ts-ignore
    const client: WebSocket = Array.from(this.server.clients).find(
      // @ts-ignore
      (v) => v.id === clientId,
    );

    const query = this.clientQueries[clientId];

    const cacheKey = `${type}__${query}`;

    const cachedResponse: INewsResponseData = await this.cacheManager.get(
      cacheKey,
    );

    if (query && cachedResponse && cachedResponse[type]) {
      client.send(JSON.stringify({ event: type, data: cachedResponse[type] }));
    }

    const sendData = (response) => {
      const ttl = type === 'twitter' ? 5 : 60 * 10;

      if (response) {
        this.cacheManager.set(cacheKey, response, { ttl });
        client.send(JSON.stringify({ event: type, data: response }));
      }

      return response;
    };

    if (type === 'news') {
      this.newsSerivce.getNews(query).subscribe(sendData);
    }

    if (type === 'twitter') {
      this.twitterService.getTweets(query).subscribe(sendData);
    }
  }

  clearIntervals(clientId: string) {
    const newsIntervalKey = `${clientId}_news`;
    const twitterIntervalKey = `${clientId}_twitter`;

    const intervals = this.schedulerRegistry.getIntervals();

    if (intervals.includes(newsIntervalKey)) {
      clearInterval(this.schedulerRegistry.getInterval(newsIntervalKey));
    }

    if (intervals.includes(twitterIntervalKey)) {
      clearInterval(this.schedulerRegistry.getInterval(twitterIntervalKey));
    }
  }

  setIntervals(clientId: string) {
    const newsCallback = () => {
      this.logger.log(`News sent to client: ${clientId}`);
      this.sendPosts(clientId, 'news');
    };

    const twitterCallback = () => {
      this.logger.log(`Tweets sent to client: ${clientId}`);
      this.sendPosts(clientId, 'twitter');
    };

    newsCallback();
    twitterCallback();

    const newsInterval = setInterval(newsCallback, 30 * 60 * 1000);
    const twitterInterval = setInterval(twitterCallback, 10 * 60 * 1000);

    const newsIntervalKey = `${clientId}_news`;
    const twitterIntervalKey = `${clientId}_twitter`;

    this.schedulerRegistry.addInterval(newsIntervalKey, newsInterval);
    this.schedulerRegistry.addInterval(twitterIntervalKey, twitterInterval);
  }

  handleDisconnect(client: any, ...args: any[]) {
    this.clearIntervals(client.id);

    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: WebSocket, ...args: any[]) {
    const clientKey = args[0].headers['sec-websocket-key'];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    client.id = clientKey;

    this.logger.log(`Client connected: ${clientKey}`);
  }
}
