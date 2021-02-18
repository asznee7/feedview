import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { NewsService } from 'src/news/news.service';
import { Cron, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';

@WebSocketGateway()
export class MainEventsGateway {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(NewsService) private newsSerivce: NewsService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  private clientQueries: { [id: string]: string } = {};

  @SubscribeMessage('test')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('query')
  async query(@MessageBody() data, @ConnectedSocket() client): Promise<void> {
    // ): Promise<Observable<any>> {
    const clientId = client.id;
    this.clientQueries[clientId] = data;
    // if (data) {
    //   const cachedResponse = await this.cacheManager.get(data);
    //   if (cachedResponse)
    //     return from([1]).pipe(
    //       map(() => ({ event: 'news', data: cachedResponse })),
    //     );
    // }
    // // return null;
    // return this.newsSerivce.getNews(data).pipe(
    //   map((response) => {
    //     if (response) {
    //       this.cacheManager.set(data, response, { ttl: 60 * 10 });
    //       console.log({ data: response });
    //       return { event: 'news', data: response };
    //     }
    //   }),
    // );

    const nameInterval = `${client.id}_news`;
    const interval = this.schedulerRegistry
      .getIntervals()
      .find((i) => i === nameInterval);

    if (interval) {
      clearInterval(this.schedulerRegistry.getInterval(nameInterval));
    }

    // client.send(JSON.stringify({ event: 'news', data: [] }));
    // console.log('hello');
    // this.server.to(client).emit(JSON.stringify({ event: 'news', data: [] }));

    this.queryToClient(clientId);
    const callback = () => {
      this.queryToClient(clientId);
    };

    const newInterval = setInterval(callback, 60 * 10 * 1000);
    this.schedulerRegistry.addInterval(nameInterval, newInterval);
  }

  // @Interval(3000)
  async queryToClient(clientId) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const client: WebSocket = Array.from(this.server.clients).find(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (v) => v.id === clientId,
    );

    const data = this.clientQueries[clientId];

    const cachedResponse = await this.cacheManager.get(data);
    if (data && cachedResponse) {
      client.send(JSON.stringify({ event: 'news', data: cachedResponse }));
    }

    this.newsSerivce.getNews(data).subscribe((response) => {
      if (response) {
        this.cacheManager.set(data, response, { ttl: 60 * 10 });
        client.send(JSON.stringify({ event: 'news', data: response }));
      }
    });
  }

  async afterInit(server: Server) {
    this.logger.log('Init');
    console.log(await this.cacheManager.get('key'));

    // // await this.cacheManager.set('asd', 'asdasd');

    // this.cacheManager.get('key', (err, result) => {
    //   console.log(result);
    //   // >> 'bar'
    //   this.cacheManager.del('foo', (err) => {});
    // });
  }

  handleDisconnect(client: any, ...args: any[]) {
    this.logger.log(`Client disconnected: ${client.id}`);

    const nameInterval = `${client.id}_news`;
    const interval = this.schedulerRegistry
      .getIntervals()
      .find((i) => i === nameInterval);

    if (interval) {
      clearInterval(this.schedulerRegistry.getInterval(nameInterval));
    }
  }

  handleConnection(client: WebSocket, ...args: any[]) {
    const clientKey = args[0].headers['sec-websocket-key'];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    client.id = clientKey;
    this.logger.log(`Client connected: ${clientKey}`);
  }
}
