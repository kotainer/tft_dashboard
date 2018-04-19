import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { environment } from '../environments/environment';

import * as socketIo from 'socket.io-client';

@Injectable()
export class SocketService {
    private socket;
    private types = {
        INIT: 0,
        MESSAGE: 1,
        TICK: 2
    };

    public initSocket(): void {
        this.socket = socketIo(environment.SOCKET_SERVER_URL);
        this.socket.on('connect', () => {
            this.socket.emit('init');
        });
    }

    public send(message: any): void {
        this.socket.emit('message', message);
    }

    public onMessage(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('message', (data: any) => {
                if (data.result) {
                    if (data.type === this.types.MESSAGE) {
                        observer.next(data.data);
                    }
                }

                console.log('socket', data);
            });

            this.socket.on('tick', (data: any) => {
                console.log('socket', data);
                if (data.result) {
                    if (data.type === this.types.MESSAGE) {
                        observer.next(data.data);
                    }
                }
            });
        });
    }
}
