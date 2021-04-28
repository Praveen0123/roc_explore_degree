import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CONFIG } from '@app/config/config';
import { EducationCostDto, EducationFinancingDto, RoiAggregateDto } from '@app/domain';
import { debounceTime, map, takeWhile } from 'rxjs/operators';

import { CostOfAttendanceComponents, getAvgNetPriceExcludingPellGrantByYear, getCostOfAttendanceByYear, getLoanLimits, ModelLoanLimits, modelLoans } from '@core/utilities/loan';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'roc-education-financing',
  templateUrl: './education-financing.component.html',
  styleUrls: ['./education-financing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EducationFinancingComponent implements OnInit, OnDestroy, OnChanges
{
  private alive = true;

  @Input() roiModel: RoiAggregateDto;
  @Output('onEducationFinancingSubmitted') formSubmissionEventEmitter = new EventEmitter<EducationFinancingDto>();

  formGroup: FormGroup;

  payOffMinimumInYears: number = CONFIG.EDUCATION_FINANCING.PAY_OFF_LOAN_MINIMUM_IN_YEARS;
  payOffMaximumInYears: number = CONFIG.EDUCATION_FINANCING.PAY_OFF_LOAN_MAXIMUM_IN_YEARS;
  startYearList: number[];

  yearsToCompleteDegree: number;
  isFulltime: boolean;
  modelLoanLimits: ModelLoanLimits;
  costOfAttendanceComponents: CostOfAttendanceComponents;
  grantOrScholarshipAidExcludingPellGrant: number;
  avgNetPriceExcludingPellGrantByYear: number[];

  cumulativeAvgNetPriceExcludingPellGrant: number;
  cumulativeOutOfPocketExpenses: number;
  cumulativeOutOfPocketExpensesMax: number;
  federalLoanAmountByYear: number[];
  pellGrantAidByYear: number[];
  cumulativeFederalLoanAmountMax: number = CONFIG.EDUCATION_FINANCING.MAXIMUM_FEDERAL_LOAN_AMOUNT;
  privateLoanAmountByYear: number[];
  cumulativePrivateLoanAmountMax: number;
  sliderStep: number;


  constructor
    (
      private formBuilder: FormBuilder
    ) { }


  ngOnInit(): void
  {
    this.buildForm();
    this.startYearList = this.getYearList();
  }

  ngOnDestroy(): void
  {
    this.alive = false;
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes.roiModel && !changes.roiModel.firstChange)
    {
      this.buildForm();
    }
  }

  onTaxDependentChange(event: MatRadioChange)
  {
    this.formGroup.controls.isTaxDependent.setValue(event.value);
    this.onCumulativeOutOfPocketExpensesInput(this.formGroup.controls.cumulativeOutOfPocketExpenses.value);
  }

  onCumulativeOutOfPocketExpensesInput(cumulativeOutOfPocketExpenses: number)
  {
    const outOfPocketExpensesByYear = new Array(this.yearsToCompleteDegree).fill(cumulativeOutOfPocketExpenses / this.yearsToCompleteDegree);

    const modelLoanOutput = modelLoans(this.costOfAttendanceComponents, outOfPocketExpensesByYear, this.yearsToCompleteDegree, !this.formGroup.controls.isTaxDependent.value, null, this.isFulltime ? 1 : 0.5);
    console.log('🚀 ~ file: education-financing.component.ts ~ line 83 ~ modelLoanOutput', modelLoanOutput);

    this.federalLoanAmountByYear = modelLoanOutput.federalLoanAmountByYear;
    this.privateLoanAmountByYear = modelLoanOutput.privateLoanAmountByYear;
  }

  onCumulativeOutOfPocketExpensesChange(cumulativeOutOfPocketExpenses: number)
  {
    this.onCumulativeOutOfPocketExpensesInput(cumulativeOutOfPocketExpenses);

    this.formGroup.controls.cumulativeOutOfPocketExpenses.setValue(cumulativeOutOfPocketExpenses);
    this.formGroup.controls.cumulativeFederalLoanAmount.setValue(this.arraySum(this.federalLoanAmountByYear));
    this.formGroup.controls.cumulativePrivateLoanAmount.setValue(this.arraySum(this.privateLoanAmountByYear));
  }

  arraySum(array: number[])
  {
    return array?.length ? array.reduce((p, c) => p + c, 0) : 0;
  }

  private buildForm()
  {
    this.setEducationCostVariables();

    const educationFinancing: EducationFinancingDto = this.roiModel?.educationFinancing;

    this.formGroup = this.formBuilder.group
      ({
        isTaxDependent: educationFinancing?.isTaxDependent,
        cumulativeOutOfPocketExpenses: this.arraySum(educationFinancing?.outOfPocketExpensesByYear),
        cumulativeFederalLoanAmount: this.arraySum(educationFinancing?.federalLoanAmountByYear),
        cumulativePrivateLoanAmount: this.arraySum(educationFinancing?.privateLoanAmountByYear),
        yearsToPayOffFederalLoan: educationFinancing?.yearsToPayOffFederalLoan,
        yearsToPayOffPrivateLoan: educationFinancing?.yearsToPayOffPrivateLoan
      });

    this.buildValueChange();
  }

  private buildValueChange()
  {
    this.formGroup.valueChanges
      .pipe
      (
        takeWhile(() => this.alive),
        debounceTime(500),
        map(() =>
        {
          this.emitFormSubmission();
        })
      ).subscribe();
  }

  private emitFormSubmission()
  {
    if (this.formSubmissionEventEmitter.observers.length > 0)
    {
      const outOfPocketExpensesByYear = new Array(this.yearsToCompleteDegree).fill(this.formGroup.controls.cumulativeOutOfPocketExpenses.value / this.yearsToCompleteDegree);
      const federalLoanAmountByYear = new Array(this.yearsToCompleteDegree).fill(this.formGroup.controls.cumulativeFederalLoanAmount.value / this.yearsToCompleteDegree);
      const privateLoanAmountByYear = new Array(this.yearsToCompleteDegree).fill(this.formGroup.controls.cumulativePrivateLoanAmount.value / this.yearsToCompleteDegree);
      const educationFinancing: EducationFinancingDto =
      {
        isTaxDependent: this.formGroup.controls.isTaxDependent.value,
        outOfPocketExpensesByYear: outOfPocketExpensesByYear,
        federalLoanAmountByYear: federalLoanAmountByYear,
        privateLoanAmountByYear: privateLoanAmountByYear,
        yearsToPayOffFederalLoan: this.formGroup.controls.yearsToPayOffFederalLoan.value,
        yearsToPayOffPrivateLoan: this.formGroup.controls.yearsToPayOffPrivateLoan.value
      };

      this.formSubmissionEventEmitter.emit(educationFinancing);
    }
  }

  private getYearList(): number[]
  {
    const currentYear: number = new Date().getFullYear();

    return this.range(currentYear, currentYear + 4);
  }

  private range(start: number, end: number)
  {
    return new Array(end - start + 1).fill(0).map((_, idx) => start + idx);
  }

  private setEducationCostVariables(): void
  {
    const educationCost: EducationCostDto = this.roiModel?.educationCost;
    const educationFinancing: EducationFinancingDto = this.roiModel?.educationFinancing;

    this.yearsToCompleteDegree = educationCost.yearsToCompleteDegree;
    this.isFulltime = educationCost.isFulltime;
    this.modelLoanLimits = getLoanLimits(educationFinancing.isTaxDependent, this.yearsToCompleteDegree);
    this.costOfAttendanceComponents = {
      tuitionAndFees: educationCost.institution?.costOfAttendanceInfo.tuitionAndFees.inDistrict.expenseAmount,
      tuitionAndFeesRaise: (educationCost.institution?.costOfAttendanceInfo.tuitionAndFees.inDistrict.percentChangeFromLastYear ?? 1) - 1,
      booksAndSupplies: educationCost.institution?.costOfAttendanceInfo.booksAndSupplies.expenseAmount,
      booksAndSuppliesRaise: (educationCost.institution?.costOfAttendanceInfo.booksAndSupplies.percentChangeFromLastYear ?? 1) - 1,
      roomAndBoard: educationCost.institution?.costOfAttendanceInfo.livingArrangement.onCampus.roomAndBoard.expenseAmount,
      roomAndBoardRaise: (educationCost.institution?.costOfAttendanceInfo.livingArrangement.onCampus.roomAndBoard.percentChangeFromLastYear ?? 1) - 1,
      otherLivingExpenses: educationCost.institution?.costOfAttendanceInfo.livingArrangement.onCampus.otherExpenses.expenseAmount,
      otherLivingExpensesRaise: (educationCost.institution?.costOfAttendanceInfo.livingArrangement.onCampus.otherExpenses.percentChangeFromLastYear ?? 1) - 1,
    };

    this.grantOrScholarshipAidExcludingPellGrant = educationCost.institution?.avgGrantScholarshipAidInfo.federalGrants.otherFederalGrants.avgAmountAidReceived
      + educationCost.institution?.avgGrantScholarshipAidInfo.stateLocalGovtGrantOrScholarships.avgAmountAidReceived
      + educationCost.institution?.avgGrantScholarshipAidInfo.institutionalGrantsOrScholarships.avgAmountAidReceived;

    const costOfAttendanceByYear = getCostOfAttendanceByYear(this.costOfAttendanceComponents, this.yearsToCompleteDegree);
    this.avgNetPriceExcludingPellGrantByYear = getAvgNetPriceExcludingPellGrantByYear(costOfAttendanceByYear, this.grantOrScholarshipAidExcludingPellGrant, this.yearsToCompleteDegree);

    this.cumulativeAvgNetPriceExcludingPellGrant = this.arraySum(this.avgNetPriceExcludingPellGrantByYear);
    this.cumulativeOutOfPocketExpenses = this.arraySum(educationFinancing?.outOfPocketExpensesByYear);
    this.cumulativeOutOfPocketExpensesMax = this.cumulativeAvgNetPriceExcludingPellGrant;

    this.federalLoanAmountByYear = educationFinancing?.federalLoanAmountByYear ?? [0];

    this.privateLoanAmountByYear = educationFinancing?.privateLoanAmountByYear ?? [0];
    this.cumulativePrivateLoanAmountMax = this.cumulativeAvgNetPriceExcludingPellGrant;

    this.sliderStep = (this.cumulativeAvgNetPriceExcludingPellGrant * .05);
  }
}
