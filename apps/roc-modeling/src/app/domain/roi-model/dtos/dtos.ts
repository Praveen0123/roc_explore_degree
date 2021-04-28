import { EducationLevelEnum, IncomeRangeEnum, LivingConditionTypeEnum, ResidencyTypeEnum } from '@app/core/models';
import { Institution, InstructionalProgram, Location, Occupation } from '@gql';

import { CareerGoalPathEnum } from '../domain/career-goal.model';
import { RoiCalculatorInput, RoiCalculatorOutputModel } from '../models';


export interface RoiAggregateDto
{
  id?: string;
  name: string;
  currentInformation?: CurrentInformationDto;

  roiModelId: string;
  careerGoal: CareerGoalDto,
  educationCost: EducationCostDto,
  educationCostRefinement: EducationCostRefinementDto,
  educationFinancing: EducationFinancingDto;
  roiCalculatorInput: RoiCalculatorInput;
  roiCalculatorInputHash: string;
  roiCalculatorOutput: RoiCalculatorOutputModel;
  radiusInMiles: number;
  dateCreated: Date;
  lastUpdated: Date;

  isCurrentInformationValid: boolean;
  isCareerGoalValid: boolean;
  isEducationCostValid: boolean;
  annualCostOfAttendance: number;
  cumulativeCostOfAttendance: number;
  outOfPocketExpensesByYear: number[];
}

export interface RoiModelDto
{
  id?: string;
  name: string;
  careerGoal: CareerGoalDto,
  educationCost: EducationCostDto,
  educationCostRefinement: EducationCostRefinementDto,
  educationFinancing: EducationFinancingDto;
  roiCalculatorInput: RoiCalculatorInput;
  radiusInMiles: number;
  dateCreated: Date;
  lastUpdated: Date;
}


/* #region  CURRENT INFORMATION */

export interface CurrentInformationDto
{
  currentAge: number;
  occupation?: Occupation;
  location: Location;
  educationLevel: EducationLevelEnum;
}

/* #endregion */



/* #region  CAREER GOAL */

export interface CareerGoalDto
{
  location: Location;
  occupation: Occupation;
  degreeLevel: EducationLevelEnum;
  degreeProgram: InstructionalProgram;
  retirementAge: number;
  careerGoalPathType: CareerGoalPathEnum;
}

/* #endregion */



/* #region  EDUCATION COSTS */

export interface EducationCostDto
{
  institution: Institution;
  startYear: number;
  incomeRange: IncomeRangeEnum;
  isFulltime: boolean;
  yearsToCompleteDegree: number;
}
export interface EducationCostRefinementDto
{
  residencyType: ResidencyTypeEnum;
  livingConditionTypeEnum: LivingConditionTypeEnum;
  costOfAttendance: CostOfAttendanceDto;
  grantsAndScholarships: GrantsAndScholarshipsDto;
}
export interface CostOfAttendanceDto
{
  tuitionAndFees: number;
  booksAndSupplies: number;
  roomAndBoard: number;
  otherExpenses: number;
}
export interface GrantsAndScholarshipsDto
{
  federalPellGrant: number;
  otherFederalGrants: number;
  stateOrLocalGrants: number;
  institutionalGrants: number;
  otherGrants: number;
  giBillBenefits: number;
  dodTuitionAssistance: number;
}

/* #endregion */



/* #region  EDUCATION FINANCING */

export interface EducationFinancingDto
{
  isTaxDependent: boolean;
  outOfPocketExpensesByYear: number[];
  federalLoanAmountByYear: number[];
  privateLoanAmountByYear: number[];
  yearsToPayOffFederalLoan: number;
  yearsToPayOffPrivateLoan: number;
}

/* #endregion */
