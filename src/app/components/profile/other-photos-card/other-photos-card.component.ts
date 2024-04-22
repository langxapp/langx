import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { Observable, forkJoin, of } from 'rxjs';

import { UserService } from 'src/app/services/user/user.service';

import { PreviewPhotoComponent } from 'src/app/components/preview-photo/preview-photo.component';

@Component({
  selector: 'app-other-photos-card',
  templateUrl: './other-photos-card.component.html',
  styleUrls: ['./other-photos-card.component.scss'],
})
export class OtherPhotosCardComponent implements OnInit {
  @Input() otherPics: string[];
  @ViewChild(IonModal) modal: IonModal;

  otherPics$: Observable<URL[]> = of([]);

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.otherPics$ = forkJoin(
      (this.otherPics || []).map((id) => this.userService.getUserFileView(id))
    );
  }

  async openPreview(photos$: Observable<URL | URL[]>): Promise<void> {
    photos$.subscribe(async (photos) => {
      const modal = await this.modalCtrl.create({
        component: PreviewPhotoComponent,
        componentProps: {
          photos: Array.isArray(photos) ? photos : [photos],
        },
      });
      modal.present();
    });
  }

  dismissModal() {
    this.modal.dismiss();
  }
}