import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ActivatedRoute } from "@angular/router";
import { TransactionService } from './../services/transactions.services';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})

export class NotificationsComponent implements OnInit {
    messages: string;

    constructor(
        private socket: Socket, 
        private route: ActivatedRoute,
        private transactionService: TransactionService
    ) { 

    }

    ngOnInit() {
        this.messages = this.route.snapshot.queryParamMap.get("rfid");
        this.sendMessage(this.messages);
    }

    checkIn(msg: string): Promise <any> {
        return Promise.resolve((() => {
            this.transactionService.checkin(msg)
            .subscribe((transactions: any) => {
                console.log(transactions.data);
            }, error => { 
                // this.redirect();
            });
        })());
    }

    sendMessage(msg: string){
        this.checkIn(msg).then(data => {
            if (data.status == 'ok') {
                this.socket.emit("message", msg);
            }
        });
    }
}
