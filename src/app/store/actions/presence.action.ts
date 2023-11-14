import { createAction, props } from '@ngrx/store';

import { ActionTypes } from 'src/app/store/actions/presence.actiontypes';
import { User } from 'src/app/models/User';
import { ErrorInterface } from 'src/app/models/types/errors/error.interface';

export const updatePresenceAction = createAction(
  ActionTypes.UPDATE_PRESENCE,
  props<{ curerentUserId: string; request: { lastSeen: Date } }>()
);

export const updatePresenceSuccessAction = createAction(
  ActionTypes.UPDATE_PRESENCE_SUCCESS,
  props<{ payload: User }>()
);

export const updatePresenceFailureAction = createAction(
  ActionTypes.UPDATE_PRESENCE_FAILURE,
  props<{ error: ErrorInterface }>()
);
