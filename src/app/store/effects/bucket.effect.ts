import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map, of, switchMap } from 'rxjs';

import { UserService } from 'src/app/services/user/user.service';
import { ErrorInterface } from 'src/app/models/types/errors/error.interface';

import {
  uploadOtherPhotosAction,
  uploadOtherPhotosFailureAction,
  uploadOtherPhotosSuccessAction,
  uploadProfilePictureAction,
  uploadProfilePictureFailureAction,
  uploadProfilePictureSuccessAction,
} from 'src/app/store/actions/bucket.action';

@Injectable()
export class BucketEffects {
  uploadProfilePicture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadProfilePictureAction),
      switchMap(({ request }) => {
        return this.userService.uploadFile(request).pipe(
          map((payload: URL) => {
            return uploadProfilePictureSuccessAction({ payload });
          }),

          catchError((errorResponse: HttpErrorResponse) => {
            const error: ErrorInterface = {
              message: errorResponse.message,
            };
            return of(uploadProfilePictureFailureAction({ error }));
          })
        );
      })
    )
  );

  uploadOtherPhotos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadOtherPhotosAction),
      switchMap(({ request, currentUserId, otherPhotos }) => {
        return this.userService.uploadFile(request).pipe(
          map((payload: URL) => {
            return payload;
          }),
          switchMap((payload) => {
            const updatedOtherPhotos = [...otherPhotos, payload];
            return this.userService
              .updateUserDoc(currentUserId, {
                otherPhotos: updatedOtherPhotos,
              })
              .pipe(
                map((payload) => {
                  return uploadOtherPhotosSuccessAction({ payload });
                })
              );
          })
        );
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        const error: ErrorInterface = {
          message: errorResponse.message,
        };
        return of(uploadOtherPhotosFailureAction({ error }));
      })
    )
  );

  constructor(private actions$: Actions, private userService: UserService) {}
}
