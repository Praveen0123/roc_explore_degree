import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MaterialModule } from '../material/material.module';
import { PipesModule } from '../pipes/pipes.module';
import { ButtonWithIconComponent } from './button-with-icon/button-with-icon.component';
import { SliderComponent } from './slider/slider.component';


@NgModule({
  imports:
    [
      CommonModule,
      ReactiveFormsModule,
      PipesModule,
      FontAwesomeModule,
      MaterialModule
    ],
  declarations:
    [
      ButtonWithIconComponent,
      SliderComponent
    ],
  exports:
    [
      ButtonWithIconComponent,
      SliderComponent
    ],
})
export class ComponentsModule { }
