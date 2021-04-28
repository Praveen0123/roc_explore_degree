import { Injectable } from '@angular/core';
import { CareerGoalForm, CurrentInformationForm, EducationCostForm } from '@app/core/models';
import { CareerGoalDto, CurrentInformationDto, EducationCostDto, RoiAggregateDto, RoiModelService } from '@app/domain';
import { ExchangeAutoCompleteForLocationGQL, ExchangeAutoCompleteForOccupationGQL, InstitutionByUnitIdGQL, InstructionalProgramGQL } from '@gql';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { AutoCompleteModel } from '@vantage-point/auto-complete-textbox';
import { forkJoin, of } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import {
  addRoiModel,
  loadSelectedRoiModelOrCreateANewOne,
  processCareerGoalForm,
  processCurrentInformationForm,
  processEducationCostForm,
  processEducationFinancingForm,
  requestResetRoiModel,
  resetRoiModelReceived,
  updateRoiModelFromCareerGoal,
  updateRoiModelFromCurrentInformation,
  updateRoiModelFromEducationCost,
  updateRoiModelFromEducationFinancing,
} from './actions';
import { getSelectedRoiModel } from './selectors';



@Injectable()
export class RoiModelStoreEffects
{
  constructor
    (
      private store: Store,
      private actions$: Actions,
      private exchangeAutoCompleteForLocationGQL: ExchangeAutoCompleteForLocationGQL,
      private exchangeAutoCompleteForOccupationGQL: ExchangeAutoCompleteForOccupationGQL,
      private instructionalProgramGQL: InstructionalProgramGQL,
      private institutionByUnitIdGQL: InstitutionByUnitIdGQL,
      private roiModelService: RoiModelService
    ) { }



  loadSelectedRoiModelOrCreateANewOne$ = createEffect(() => this.actions$.pipe
    (
      ofType(loadSelectedRoiModelOrCreateANewOne),
      withLatestFrom(this.store.pipe(select(getSelectedRoiModel))),
      switchMap(([_, selectedRoiModel]) => this.roiModelService.createEmptyRoiAggregateAsync(selectedRoiModel)),
      map((roiAggregateDto: RoiAggregateDto) => addRoiModel({ roiAggregateDto }))
    )
  );



  processCurrentInformationForm$ = createEffect(() => this.actions$.pipe
    (
      ofType(processCurrentInformationForm),
      switchMap((action) =>
      {
        const formData: CurrentInformationForm = action.currentInformationForm;
        const location: AutoCompleteModel = formData?.currentLocation;
        const occupation: AutoCompleteModel = formData?.currentOccupation;

        // console.log('EFFECTS | CAREER GOAL FORM DATA', formData);

        /*
        RETRIEVE LOCATION AND OCCUPATION FROM BACKEND....
        */
        return forkJoin
          (
            {
              location: (location) ? this.exchangeAutoCompleteForLocationGQL.fetch({ autoCompleteModel: location }) : of(null),
              occupation: (occupation) ? this.exchangeAutoCompleteForOccupationGQL.fetch({ autoCompleteModel: occupation }) : of(null)
            }
          )
          .pipe
          (
            switchMap((results) =>
            {
              // console.log('EFFECTS | RESULTS:', results);

              const currentInformation: CurrentInformationDto =
              {
                currentAge: formData.currentAge,
                occupation: (results.occupation) ? results.occupation.data.exchangeAutoCompleteForOccupation : null,
                location: (results.location) ? results.location.data.exchangeAutoCompleteForLocation : null,
                educationLevel: formData.educationLevel
              };

              return this.roiModelService.updateCurrentInformationAsync(currentInformation);
            })
          );
      }),
      map((roiAggregateDto: RoiAggregateDto) => updateRoiModelFromCurrentInformation({ roiAggregateDto }))
    ));



  processCareerGoalForm$ = createEffect(() => this.actions$.pipe
    (
      ofType(processCareerGoalForm),
      switchMap((action) =>
      {
        const formData: CareerGoalForm = action.careerGoalForm;
        const location: AutoCompleteModel = formData?.location;
        const occupation: AutoCompleteModel = formData?.occupation;
        const cipCode: string = formData?.degreeProgram?.id;

        // console.log('EFFECTS | CAREER GOAL FORM DATA', formData);

        /*
        RETRIEVE LOCATION AND OCCUPATION FROM BACKEND....
        */
        return forkJoin
          (
            {
              location: (location) ? this.exchangeAutoCompleteForLocationGQL.fetch({ autoCompleteModel: location }) : of(null),
              occupation: (occupation) ? this.exchangeAutoCompleteForOccupationGQL.fetch({ autoCompleteModel: occupation }) : of(null),
              program: (cipCode) ? this.instructionalProgramGQL.fetch({ cipCode: cipCode }) : of(null)
            }
          )
          .pipe
          (
            switchMap((results) =>
            {
              const careerGoal: CareerGoalDto =
              {
                location: (results.location) ? results.location.data.exchangeAutoCompleteForLocation : null,
                occupation: (results.occupation) ? results.occupation.data.exchangeAutoCompleteForOccupation : null,
                degreeLevel: formData.degreeLevel,
                degreeProgram: (results.program) ? results.program.data.instructionalProgram : null,
                retirementAge: formData.retirementAge,
                careerGoalPathType: formData.careerGoalPathType
              };

              return this.roiModelService.updateCareerGoalAsync(careerGoal);
            })
          );
      }),
      map((roiAggregateDto: RoiAggregateDto) => updateRoiModelFromCareerGoal({ roiAggregateDto }))
    ));



  processEducationCostForm$ = createEffect(() => this.actions$.pipe
    (
      ofType(processEducationCostForm),
      switchMap((action) =>
      {
        const formData: EducationCostForm = action.educationCostForm;
        const institutionId: string = formData?.institution?.id;

        /*
        RETRIEVE INSTITUTION FROM BACKEND....
        */
        return forkJoin
          (
            {
              institution: (institutionId) ? this.institutionByUnitIdGQL.fetch({ unitId: institutionId }) : of(null),
            }
          )
          .pipe
          (
            switchMap((results) =>
            {
              const educationCost: EducationCostDto =
              {
                institution: (results.institution) ? results.institution.data.institution : null,
                startYear: formData.startYear,
                incomeRange: formData.incomeRange,
                isFulltime: formData.isFulltime,
                yearsToCompleteDegree: formData.yearsToCompleteDegree
              };

              return this.roiModelService.updateEducationCostAsync(educationCost);
            })
          );
      }),
      map((roiAggregateDto: RoiAggregateDto) => updateRoiModelFromEducationCost({ roiAggregateDto }))
    ));



  processEducationFinancingForm$ = createEffect(() => this.actions$.pipe
    (
      ofType(processEducationFinancingForm),
      switchMap((action) => this.roiModelService.updateEducationFinancingAsync(action.educationFinancingForm)),
      map((roiAggregateDto: RoiAggregateDto) => updateRoiModelFromEducationFinancing({ roiAggregateDto }))
    ));



  requestResetRoiModel$ = createEffect(() => this.actions$.pipe
    (
      ofType(requestResetRoiModel),
      switchMap(() => this.roiModelService.resetRoiModelAsync()),
      map((roiAggregateDto: RoiAggregateDto) => resetRoiModelReceived({ roiAggregateDto }))
    ));

}
