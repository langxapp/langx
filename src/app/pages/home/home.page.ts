import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  segment = "community";

  constructor() { }

  ngOnInit() {
  }
  
  logout(){
    console.log('logout clicked!');
  }

  onSegmentChanged(event: any) {
    console.log("SEGMENT:", event.detail.value);
  }
}
