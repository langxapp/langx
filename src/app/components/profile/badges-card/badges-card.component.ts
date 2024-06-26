import { Browser } from '@capacitor/browser';
import { isEqual } from 'lodash';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-badges-card',
  templateUrl: './badges-card.component.html',
  styleUrls: ['./badges-card.component.scss'],
})
export class BadgesCardComponent implements OnInit, OnChanges {
  @Input() badges: string[];

  badgesList: Object[] = [];

  constructor() {}

  ngOnInit() {
    this.initBadges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['badges'] &&
      !isEqual(changes['badges'].currentValue, changes['badges'].previousValue)
    ) {
      this.initBadges();
    }
  }

  initBadges() {
    this.badgesList = this.badges?.map((badge: string) => {
      const name = badge
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        name,
        url: `/assets/image/badges/${badge}.png`,
        pageURL: `${environment.ext.token.LITEPAPER}/litepaper/library/badges#${badge}-badge`,
      };
    });
  }

  async openPage(pageURL: any) {
    console.log(pageURL);
    await Browser.open({ url: pageURL });
  }
}
