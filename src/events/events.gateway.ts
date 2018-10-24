import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@WebSocketGateway(3001)
export class EventsGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('message')
  onEvent(client, data) {
    console.log(data);
    return of(1).pipe(map(item => ({ event: 'message', data })));
  }
}
