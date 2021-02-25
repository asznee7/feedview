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

  @SubscribeMessage('registration')
  register(@MessageBody() clientId, @ConnectedSocket() client): void {
    client.id = clientId;

    this.clearIntervals(clientId);
    this.setIntervals(clientId);

    this.logger.log(`Client registered: ${clientId}`);
  }

  @SubscribeMessage('query')
  async query(@MessageBody() query, @ConnectedSocket() client): Promise<void> {
    const clientId = client.id;

    this.cacheManager.set(`${clientId}__query`, query, { ttl: 1000000 });

    this.clearIntervals(clientId);
    this.setIntervals(clientId);
  }

  async sendPosts(clientId: string, type: 'twitter' | 'news') {
    // @ts-ignore
    const client: WebSocket = Array.from(this.server.clients).find(
      // @ts-ignore
      (v) => v.id === clientId,
    );

    const query: string = await this.cacheManager.get(`${clientId}__query`);

    if (!client || !query) return;

    const cacheKey = `${type}__${query}`;

    const cachedResponse = await this.cacheManager.get(cacheKey);

    if (cachedResponse) {
      client.send(JSON.stringify({ event: type, data: cachedResponse }));
      return;
    }

    const sendData = (response) => {
      const ttl = type === 'twitter' ? 5 * 60 : 10 * 60;

      if (response) {
        this.cacheManager.set(cacheKey, response, { ttl });
        client.send(JSON.stringify({ event: type, data: response }));
        this.logger.log(`Fresh data ${type} sent to client: ${clientId}`);
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
      this.schedulerRegistry.deleteInterval(newsIntervalKey);
    }

    if (intervals.includes(twitterIntervalKey)) {
      clearInterval(this.schedulerRegistry.getInterval(twitterIntervalKey));
      this.schedulerRegistry.deleteInterval(twitterIntervalKey);
    }
  }

  setIntervals(clientId: string) {
    const newsCallback = () => {
      this.sendPosts(clientId, 'news');
    };

    const twitterCallback = () => {
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

  handleDisconnect(client: any) {
    this.clearIntervals(client.id);

    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: WebSocket, ...args: any[]) {
    this.logger.log('Client connected');
  }
}
