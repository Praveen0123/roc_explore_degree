import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';

import { HeaderComponent } from './containers/header/header.component';
import { OffCanvasSavedModelsComponent } from './containers/off-canvas-saved-models/off-canvas-saved-models.component';
import { PageNotFoundComponent } from './containers/page-not-found/page-not-found.component';
import { SavedModelComponent } from './components/saved-model/saved-model.component';

@NgModule({
  imports:
    [
      CommonModule,
      RouterModule,
      SharedModule
    ],
  declarations:
    [
      HeaderComponent,
      OffCanvasSavedModelsComponent,
      PageNotFoundComponent,
      SavedModelComponent
    ],
  exports:
    [
      HeaderComponent,
      OffCanvasSavedModelsComponent,
      PageNotFoundComponent
    ]
})
export class CommonUIModule { }
