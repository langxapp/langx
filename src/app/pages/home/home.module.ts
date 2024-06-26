import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

import { ComponentsModule } from 'src/app/components/components.module';

import { userReducers } from 'src/app/store/reducers/user.reducer';
import { roomReducers } from 'src/app/store/reducers/room.reducer';
import { visitsReducers } from 'src/app/store/reducers/visits.reducer';
import { filtersReducers } from 'src/app/store/reducers/filters.reducer';

import { UserEffects } from 'src/app/store/effects/user.effect';
import { UsersEffects } from 'src/app/store/effects/users.effect';
import { RoomEffects } from 'src/app/store/effects/room.effect';
import { RoomsEffects } from 'src/app/store/effects/rooms.effect';
import { LanguageEffects } from 'src/app/store/effects/language.effect';
import { PresenceEffects } from 'src/app/store/effects/presence.effect';
import { BucketEffects } from 'src/app/store/effects/bucket.effect';
import { NotificationEffects } from 'src/app/store/effects/notification.effect';
import { VisitsEffects } from 'src/app/store/effects/visits.effect';
import { NewBadgeComponent } from 'src/app/components/new-badge/new-badge.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentsModule,
    StoreModule.forFeature('user', userReducers),
    StoreModule.forFeature('room', roomReducers),
    StoreModule.forFeature('visit', visitsReducers),
    StoreModule.forFeature('filter', filtersReducers),
    EffectsModule.forFeature([
      UserEffects,
      UsersEffects,
      RoomEffects,
      RoomsEffects,
      LanguageEffects,
      PresenceEffects,
      BucketEffects,
      NotificationEffects,
      VisitsEffects,
    ]),
  ],
  declarations: [HomePage, NewBadgeComponent],
})
export class HomePageModule {}
