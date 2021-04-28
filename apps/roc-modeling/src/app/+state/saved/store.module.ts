import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoiModelModule } from '@app/domain';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SavedStoreEffects } from './effects';
import { reducer } from './reducer';
import { SAVED_STORE_FEATURE_KEY } from './state';


@NgModule({
  imports:
    [
      CommonModule,
      StoreModule.forFeature(SAVED_STORE_FEATURE_KEY, reducer),
      EffectsModule.forFeature([SavedStoreEffects]),
      RoiModelModule
    ],
  declarations:
    [

    ]
})
export class SavedStoreModule { }
