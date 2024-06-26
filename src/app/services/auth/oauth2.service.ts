import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { BackgroundColor, InAppBrowser, UrlEvent } from '@capgo/inappbrowser';

import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class OAuth2Service {
  HEADERS = {
    'user-agent': `Mozilla/5.0 (iPhone; CPU iPhone OS16_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.2 Mobile/15E148 Safari/604.1`,
  };

  constructor(private router: Router, private authService: AuthService) {}

  signInWithDiscord() {
    if (!Capacitor.isNativePlatform())
      return this.authService.signInWithDiscord();

    // For mobile
    InAppBrowser.openWebView({
      url: `${environment.url.AUTH_PROVIDER_URL}/discord`,
      headers: this.HEADERS,
      title: 'Sign in with Discord',
      backgroundColor: BackgroundColor.WHITE,
    });
    this.addBrowserListeners();
  }

  signInWithGoogle() {
    if (!Capacitor.isNativePlatform())
      return this.authService.signInWithGoogle();

    // For mobile
    InAppBrowser.openWebView({
      url: `${environment.url.AUTH_PROVIDER_URL}/google`,
      headers: this.HEADERS,
      title: 'Sign in with Google',
      backgroundColor: BackgroundColor.WHITE,
    });
    this.addBrowserListeners();
  }

  signInWithFacebook() {
    if (!Capacitor.isNativePlatform())
      return this.authService.signInWithFacebook();

    // For mobile
    InAppBrowser.openWebView({
      url: `${environment.url.AUTH_PROVIDER_URL}/facebook`,
      headers: this.HEADERS,
      title: 'Sign in with Facebook',
      backgroundColor: BackgroundColor.WHITE,
    });
    this.addBrowserListeners();
  }

  signInWithApple() {
    if (!Capacitor.isNativePlatform())
      return this.authService.signInWithApple();

    // For mobile
    InAppBrowser.openWebView({
      url: `${environment.url.AUTH_PROVIDER_URL}/apple`,
      headers: this.HEADERS,
      title: 'Sign in with Apple',
      backgroundColor: BackgroundColor.WHITE,
    });
    this.addBrowserListeners();
  }

  private addBrowserListeners() {
    // console.log('InAppBrowser listeners started');

    // urlChangeEvent
    InAppBrowser.addListener('urlChangeEvent', (res: UrlEvent) => {
      if (res.url.startsWith(environment.url.SUCCESS_OAUTH2)) {
        // Remove delete
        InAppBrowser.close();

        const redirectUrl = res.url.split(environment.url.HOMEPAGE_URL)[1];
        // console.log('redirectUrl', redirectUrl);
        this.router.navigateByUrl(redirectUrl);
      }
      if (res.url.startsWith(environment.url.FAILURE_OAUTH2)) {
        // Remove delete
        InAppBrowser.close();

        const redirectUrl = res.url.split(environment.url.HOMEPAGE_URL)[1];
        // console.log('redirectUrl', redirectUrl);
        this.router.navigateByUrl(redirectUrl);
      }
    });

    // Close event
    InAppBrowser.addListener('closeEvent', () => {
      // console.log('InAppBrowser closed');
      // Remove delete
      InAppBrowser.removeAllListeners();
      // console.log('all listeners removed');
    });
  }
}
