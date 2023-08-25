import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LanguageLevelModalComponent } from 'src/app/components/language-level-modal/language-level-modal.component';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.page.html',
  styleUrls: ['./filters.page.scss'],
})
export class FiltersPage implements OnInit {

  isLoading: boolean = false;
  filterData: any;
  currentUserData: any;
  
  filterLanguage: Array<any> = [];

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getUserData();
  }

  onSubmit() { 
    console.log(this.filterData);
  }

  getUserData() {
    this.authService.getUserData().then((currentUserData) => {
      this.currentUserData = currentUserData;
      console.log('currentUserData: ', currentUserData);
    }).catch((error) => {
      console.log('error: ', error);
    });
  }

  message = 'This modal example uses the modalController to present and dismiss modals.';
  async openLangModal(lang) {
    const modal = await this.modalCtrl.create({
      // TODO: it should be a style with --auto-height
      initialBreakpoint: 0.5,
      breakpoints: [0,1],
      cssClass: 'modalClass',
      component: LanguageLevelModalComponent,
      componentProps: { langName: lang?.name }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      let item = { lang: lang?.code, level: data };
      this.filterLanguage.push(item);
      console.log(this.filterLanguage);
    }
  }

  showLangLevel(lang) {
    let l = this.filterLanguage.find(item => item.lang === lang?.code)?.level;
    if (l==1) { return 'Beginner'; }
    else if (l==2) { return 'Intermediate'; }
    else if (l==3) { return 'Advanced'; }
    else { return false; }
  }

  resetFilter(){
    this.filterData = {};
    this.filterLanguage = [];
  }

}