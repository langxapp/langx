import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { StorageService } from 'src/app/services/storage/storage.service';
import { User } from 'src/app/models/User';
import { currentUserSelector } from 'src/app/store/selectors/auth.selector';
import { Language } from 'src/app/models/Language';
import { FilterService } from 'src/app/services/filter/filter.service';
import { FilterDataInterface } from 'src/app/models/types/filterData.interface';
import { Countries } from 'src/app/models/locale/Countries';
import { Country } from 'src/app/models/locale/Country';
import { countriesSelector } from 'src/app/store/selectors/locale.selector';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.page.html',
  styleUrls: ['./filters.page.scss'],
})
export class FiltersPage implements OnInit, OnDestroy {
  searchTerm: string;

  // TODO: Useless
  isLoading: boolean = false;

  private subscriptions = new Subscription();
  currentUser$: Observable<User | null>;
  countries$: Observable<Countries>;
  countyData: Country[];

  ionRangeDefault = { lower: 20, upper: 75 };

  // Filters data
  filterData: FilterDataInterface = {
    motherLanguages: [],
    studyLanguages: [],
    gender: null,
    country: null,
    minAge: null,
    maxAge: null,
  };

  constructor(
    private store: Store,
    private navCtrl: NavController,
    private router: Router,
    private filterService: FilterService,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    this.initValues();
    await this.checkStorage();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initValues() {
    // Countries values
    this.countries$ = this.store.pipe(select(countriesSelector));
    this.subscriptions.add(
      this.countries$.subscribe((countries: Countries) => {
        this.countyData = countries?.countries;
      })
    );

    this.currentUser$ = this.store.pipe(select(currentUserSelector));
  }

  async checkStorage() {
    // Check localStorage
    const motherLanguagesString = await this.storageService.getValue(
      'motherLanguages'
    );
    const studyLanguagesString = await this.storageService.getValue(
      'motherLanguages'
    );
    const gender = (await this.storageService.getValue('gender')) || null;
    const country = (await this.storageService.getValue('country')) || null;
    const minAgeString = await this.storageService.getValue('minAge');
    const maxAgeString = await this.storageService.getValue('maxAge');

    let minAge = Number(minAgeString) || null;
    let maxAge = Number(maxAgeString) || null;

    // TODO: Seperate here mother language and study languages.
    let motherLanguages: Array<any> = [];
    let studyLanguages: Array<any> = [];
    if (motherLanguagesString) {
      motherLanguages = motherLanguagesString.toLocaleString().split(',');
    }
    if (studyLanguagesString) {
      studyLanguages = studyLanguagesString.toLocaleString().split(',');
    }

    this.filterData.motherLanguages = motherLanguages;
    this.filterData.studyLanguages = studyLanguages;
    this.filterData.gender = gender;
    this.filterData.country = country;
    this.filterData.minAge = minAge;
    this.filterData.maxAge = maxAge;

    // console.log('checkLocalStorage', this.filterData);
  }

  onSubmit() {
    this.setLocalStorage(this.filterData);
    this.filterService.setEvent(this.filterData);

    this.navCtrl.setDirection('back');
    this.router.navigateByUrl('/home/community');
  }

  // TODO: #246 Save filterData with JSON.stringify();
  setLocalStorage(filterData: FilterDataInterface) {
    if (!filterData.motherLanguages) filterData.motherLanguages = [];
    if (!filterData.studyLanguages) filterData.studyLanguages = [];
    if (filterData.motherLanguages.length > 0) {
      this.storageService.setValue(
        'motherLanguages',
        filterData.motherLanguages.toString()
      );
    } else {
      this.storageService.removeValue('motherLanguages');
    }
    if (filterData.studyLanguages.length > 0) {
      this.storageService.setValue(
        'studyLanguages',
        filterData.studyLanguages.toString()
      );
    } else {
      this.storageService.removeValue('studyLanguages');
    }
    if (filterData.gender) {
      this.storageService.setValue('gender', filterData.gender);
    }
    if (filterData.country) {
      this.storageService.setValue('country', filterData.country);
    }
    if (filterData.minAge && filterData.maxAge) {
      this.storageService.setValue('minAge', filterData.minAge.toString());
      this.storageService.setValue('maxAge', filterData.maxAge.toString());
    }
  }

  removeLocalStorage() {
    this.storageService.removeValue('motherLanguages');
    this.storageService.removeValue('studyLanguages');
    this.storageService.removeValue('gender');
    this.storageService.removeValue('country');
    this.storageService.removeValue('minAge');
    this.storageService.removeValue('maxAge');
  }

  //
  // LANGUAGE Methods
  //

  getStudyLanguages(): Observable<Language[]> {
    return this.currentUser$.pipe(
      map((user) => user.languages.filter((lang) => !lang.motherLanguage))
    );
  }

  motherLanguageChecked(event, langName) {
    if (event.detail.checked) {
      if (!this.filterData.motherLanguages)
        this.filterData.motherLanguages = [];
      this.filterData.motherLanguages.push(langName);
    } else {
      this.filterData.motherLanguages = this.filterData.motherLanguages.filter(
        (item) => item !== langName
      );
    }
    console.log(this.filterData);
  }

  isCheckedMotherLanguage(langName) {
    if (!this.filterData.motherLanguages) return false;
    else if (this.filterData.motherLanguages.length == 0) return false;
    else if (
      this.filterData.motherLanguages.length > 0 &&
      this.filterData.motherLanguages.includes(langName)
    )
      return true;
    else return false;
  }

  studyLanguageChecked(event, langName) {
    if (event.detail.checked) {
      if (!this.filterData.studyLanguages) this.filterData.studyLanguages = [];
      this.filterData.studyLanguages.push(langName);
    } else {
      this.filterData.studyLanguages = this.filterData.studyLanguages.filter(
        (item) => item !== langName
      );
    }
    console.log(this.filterData);
  }

  isCheckedStudyLanguage(langName) {
    if (!this.filterData.studyLanguages) return false;
    else if (this.filterData.studyLanguages.length == 0) return false;
    else if (
      this.filterData.studyLanguages.length > 0 &&
      this.filterData.studyLanguages.includes(langName)
    )
      return true;
    else return false;
  }

  //
  // COUNTRY Methods
  //

  countryChange(event) {
    if (event.detail.value) {
      this.filterData.country = event.detail.value;
    }
    console.log(this.filterData);
  }

  showCountry() {
    return this.countyData.find((item) => item.code === this.filterData.country)
      ?.name;
  }

  //
  // GENDER Methods
  //

  genderChange(event) {
    if (event.detail.value) {
      this.filterData.gender = event.detail.value;
    }
    console.log(this.filterData);
  }

  showGender() {
    if (this.filterData.gender == 'male') {
      return 'Male';
    } else if (this.filterData.gender == 'female') {
      return 'Female';
    } else if (this.filterData.gender == 'other') {
      return 'Prefer Not to Say';
    } else return false;
  }

  //
  // AGE Methods
  //

  ageChange(event) {
    if (event.detail.value) {
      this.filterData.minAge = event.detail.value.lower;
      this.filterData.maxAge = event.detail.value.upper;
    }
    console.log(this.filterData);
  }

  showAge() {
    if (this.filterData.minAge && this.filterData.maxAge) {
      return (
        'between ' + this.filterData.minAge + ' and ' + this.filterData.maxAge
      );
    } else return false;
  }

  //
  // RESET All Filters
  //

  resetFilter() {
    this.filterData = {
      motherLanguages: [],
      studyLanguages: [],
      gender: null,
      country: null,
      minAge: null,
      maxAge: null,
    };
    // TODO: Remove following console.log
    console.log(this.filterData);
    this.ionRangeDefault = { lower: 20, upper: 75 };
    this.removeLocalStorage();
  }
}
