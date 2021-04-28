import { CONFIG } from '@app/config/config';
import { Entity, Guard, Result } from '@vantage-point/ddd-core';


interface EducationFinancingProps
{
  isTaxDependent: boolean;
  outOfPocketExpensesByYear: number[];
  federalLoanAmountByYear: number[];
  privateLoanAmountByYear: number[];
  yearsToPayOffFederalLoan: number;
  yearsToPayOffPrivateLoan: number;
}

export class EducationFinancing extends Entity<EducationFinancingProps>
{
  get isTaxDependent(): boolean
  {
    return this.props.isTaxDependent;
  }
  get outOfPocketExpensesByYear(): number[]
  {
    return this.props.outOfPocketExpensesByYear;
  }
  get federalLoanAmountByYear(): number[]
  {
    return this.props.federalLoanAmountByYear;
  }
  get privateLoanAmountByYear(): number[]
  {
    return this.props.privateLoanAmountByYear;
  }
  get yearsToPayOffFederalLoan(): number
  {
    return this.props.yearsToPayOffFederalLoan;
  }
  get yearsToPayOffPrivateLoan(): number
  {
    return this.props.yearsToPayOffPrivateLoan;
  }

  private constructor(props: EducationFinancingProps)
  {
    super(props);
  }

  public static create(props: EducationFinancingProps): Result<EducationFinancing>
  {
    const propsResult = Guard.againstNullOrUndefinedBulk(
      [
      ]);

    if (!propsResult.succeeded)
    {
      return Result.failure<EducationFinancing>(propsResult.message || 'education financing properties error');
    }

    const careerGoal = new EducationFinancing
      (
        {
          ...props,
          isTaxDependent: props.isTaxDependent ?? true,
          outOfPocketExpensesByYear: props.outOfPocketExpensesByYear ?? [0],
          federalLoanAmountByYear: props.federalLoanAmountByYear ?? [0],
          privateLoanAmountByYear: props.privateLoanAmountByYear ?? [0],
          yearsToPayOffFederalLoan: props.yearsToPayOffFederalLoan ?? CONFIG.EDUCATION_FINANCING.DEFAULT_PAY_OFF_FEDERAL_LOAN_IN_YEARS,
          yearsToPayOffPrivateLoan: props.yearsToPayOffPrivateLoan ?? CONFIG.EDUCATION_FINANCING.DEFAULT_PAY_OFF_PRIVATE_LOAN_IN_YEARS
        }
      );

    return Result.success<EducationFinancing>(careerGoal);
  }

  updateOutOfPocketExpensesByYear(outOfPocketExpensesByYear: number[])
  {
    this.props.outOfPocketExpensesByYear = outOfPocketExpensesByYear;
  }
}
