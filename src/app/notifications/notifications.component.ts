import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
styleUrls: ['./notifications.component.scss']
})

export class NotificationsComponent implements OnInit {
    messages: string;

    constructor(private socket: Socket, private route: ActivatedRoute) { }

    ngOnInit() {
        this.messages = this.route.snapshot.queryParamMap.get("rfid");
        this.sendMessage(this.messages);
    }

    sendMessage(msg: string){
        this.socket.emit("message", msg);
    }
}
