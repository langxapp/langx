import { Injectable } from '@angular/core';
import { ID, Models } from 'appwrite';
import { BehaviorSubject, concatMap, from, tap, Observable } from 'rxjs';

// Environment and services Imports
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api/api.service';

// Interface Imports
import { Account } from 'src/app/models/Account';
import { RegisterRequestInterface } from 'src/app/models/types/requests/registerRequest.interface';
import { LoginRequestInterface } from 'src/app/models/types/requests/loginRequest.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = new BehaviorSubject<Account | null>(null);
  private account$: Observable<Account | null> = null;

  constructor(private api: ApiService) {}

  //
  // USER DATA
  //

  getUser() {
    return this._user.asObservable();
  }

  getUserId() {
    return this._user.value?.$id;
  }

  createJWT() {
    return this.api.account.createJWT();
  }

  //
  // ACCOUNT API
  //

  login(data: LoginRequestInterface): Observable<Account> {
    const authReq = this.api.account.createEmailSession(
      data.email,
      data.password
    );
    return from(authReq).pipe(
      concatMap(() => this.api.account.get()),
      tap((user) => this._user.next(user))
    );
  }

  register(data: RegisterRequestInterface): Observable<Account> {
    const promise = this.api.account.create(
      ID.unique(),
      data.email,
      data.password,
      data.name
    );
    return from(promise).pipe(
      concatMap(() =>
        this.api.account.createEmailSession(data.email, data.password)
      ),
      concatMap(() => this.api.account.get()),
      tap((user) => {
        return this._user.next(user);
      })
    );
  }

  updatePrefs(prefs: Models.Preferences) {
    const authReq = this.api.account.updatePrefs(prefs);
    return from(authReq).pipe(
      concatMap(() => this.api.account.get()),
      tap((user) => this._user.next(user))
    );
  }

  getPrefs() {
    const authReq = this.api.account.getPrefs();
    return from(authReq);
  }

  getAccount(): Observable<Account> {
    return from(this.api.account.get());
  }

  logout(): Observable<any> {
    return from(this.api.account.deleteSession('current')).pipe(
      tap(() => this._user.next(null))
    );
  }

  // TODO: It may be async function
  resetPassword(email: string) {
    console.log('resetPassword:', email);
    return this.api.account
      .createRecovery(email, environment.url.RESET_PASSWORD_URL)
      .then((response) => {
        console.log('Recovery email sent', response);
      })
      .catch((error) => {
        console.log('Error sending recovery email', error);
      });
  }

  updateRecovery(userId: string, secret: string, password: string) {
    return this.api.account.updateRecovery(userId, secret, password, password);
    // .then((response) => {
    //   console.log('Recovery successfully updated', response);
    // })
    // .catch((error) => {
    //   console.log('Error updating recovery', error);
    //   return error;
    // });
  }

  signInWithGoogle(platform: string) {
    console.log('signInWithGoogle', platform);
    this.api.account.createOAuth2Session(
      'google',
      environment.url.HOME_URL,
      environment.url.LOGIN_URL
    );
  }

  signInWithFacebook(platform: string) {
    console.log('signInWithFacebook', platform);
    this.api.account.createOAuth2Session(
      'facebook',
      environment.url.HOME_URL,
      environment.url.LOGIN_URL
    );
  }

  signInWithApple(platform: string) {
    console.log('signInWithApple', platform);
    this.api.account.createOAuth2Session(
      'apple',
      environment.url.HOME_URL,
      environment.url.LOGIN_URL
    );
  }
}
