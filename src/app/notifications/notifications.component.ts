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
    results: [];

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

    sendMessage(msg: string) {
        this.transactionService.checkin(msg)
        .subscribe((transactions: any) => {
            console.log(transactions);
            if (transactions.status == 'ok') {
                this.socket.emit("message", msg);
            }
        }, error => { 
            
            console.log(error);
            // this.redirect();
        });
    }
}
