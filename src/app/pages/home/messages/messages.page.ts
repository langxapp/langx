import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { lastSeen } from 'src/app/extras/utils';
import { Auth2Service } from 'src/app/services/auth/auth2.service';
import { RoomService } from 'src/app/services/chat/room.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  chatRooms: any;
  isLoading: boolean = false;

  model = {
    icon: 'chatbubbles-outline',
    title: 'No Chat Rooms',
    color: 'warning',
  };

  constructor(
    private router: Router,
    private auth2Service: Auth2Service,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.getRooms(); // get all chat Rooms
  }

  getRooms() {
    const cUserId = this.auth2Service.getUserId();
    this.roomService.getRooms(cUserId).then((data) => {
      this.chatRooms = data.documents;
      console.log('chat3Rooms: ', this.chatRooms);
    });
  }

  getChat(room) {
    const navData: NavigationExtras = {
      queryParams: {
        name: room?.userData?.name,
        uid: room?.userData?.$id,
      },
    };
    this.router.navigate(['/', 'home', 'chat3', room.$id], navData);
  }

  getUser(user: any) {
    return user;
  }

  openArchiveMessages() {
    console.log('openArchiveMessages clicked');
  }

  handleRefresh(event) {
    this.getRooms();
    event.target.complete();
    console.log('Async operation refresh has ended');
  }

  archiveChat(room) {
    console.log('archiveChat clicked', room);
  }

  lastSeen(d: any) {
    if (!d) return null;
    return lastSeen(d);
  }
}
