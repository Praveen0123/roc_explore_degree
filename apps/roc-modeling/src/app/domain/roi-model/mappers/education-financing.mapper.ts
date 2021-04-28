import { IMapper, Result } from '@vantage-point/ddd-core';

import { EducationFinancing } from '../domain/education-financing.model';
import { EducationFinancingDto } from '../dtos';


export class EducationFinancingMapper implements IMapper<EducationFinancing, EducationFinancingDto>
{
  private constructor()
  {
  }

  public static create(): EducationFinancingMapper
  {
    return new EducationFinancingMapper();
  }

  toDTO(input: EducationFinancing): EducationFinancingDto
  {
    const educationFinancingDto: EducationFinancingDto =
    {
      isTaxDependent: input.isTaxDependent,
      outOfPocketExpensesByYear: input.outOfPocketExpensesByYear,
      federalLoanAmountByYear: input.federalLoanAmountByYear,
      privateLoanAmountByYear: input.privateLoanAmountByYear,
      yearsToPayOffFederalLoan: input.yearsToPayOffFederalLoan,
      yearsToPayOffPrivateLoan: input.yearsToPayOffPrivateLoan
    };

    return educationFinancingDto;
  }

  toDomain(input: EducationFinancingDto): Result<EducationFinancing>
  {
    return EducationFinancing.create
      (
        {
          isTaxDependent: input?.isTaxDependent ?? null,
          outOfPocketExpensesByYear: input?.outOfPocketExpensesByYear ?? null,
          federalLoanAmountByYear: input?.federalLoanAmountByYear ?? null,
          privateLoanAmountByYear: input?.privateLoanAmountByYear ?? null,
          yearsToPayOffFederalLoan: input?.yearsToPayOffFederalLoan ?? null,
          yearsToPayOffPrivateLoan: input?.yearsToPayOffPrivateLoan ?? null
        }
      );
  }

}
