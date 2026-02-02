import {
  type DailyWorkRecord,
  type MonthlySettings,
  type TaxCalculation,
  type MonthlySalary,
} from "../types/salary";

/**
 * 일일 근무에 대한 급여를 계산합니다
 */
export const calculateDailyPay = (
  record: DailyWorkRecord,
  settings: MonthlySettings,
) => {
  const regularPay = record.regularHours * settings.hourlyWage;
  const overtimePay =
    record.overtimeHours * settings.hourlyWage * settings.overtimeRate;
  const nightPay = record.nightHours * settings.hourlyWage * settings.nightRate;

  return {
    regularPay,
    overtimePay,
    nightPay,
    totalPay: regularPay + overtimePay + nightPay,
  };
};

/**
 * 4대 보험 및 세금을 계산합니다
 */
export const calculateTax = (grossSalary: number): TaxCalculation => {
  // 1. 국민연금 (4.5%, 상한액 553만원 기준)
  const pensionBase = Math.min(grossSalary, 5530000);
  const nationalPension = Math.floor(pensionBase * 0.045);

  // 2. 건강보험 (3.545%)
  const healthInsurance = Math.floor(grossSalary * 0.03545);

  // 3. 장기요양보험 (건강보험의 12.95%)
  const longTermCare = Math.floor(healthInsurance * 0.1295);

  // 4. 고용보험 (0.9%)
  const employmentInsurance = Math.floor(grossSalary * 0.009);

  // 5. 소득세 계산 (간이세액표 기준 - 단순화)
  let incomeTax = 0;
  if (grossSalary <= 1060000) {
    incomeTax = 0;
  } else if (grossSalary <= 2100000) {
    incomeTax = Math.floor((grossSalary - 1060000) * 0.06);
  } else if (grossSalary <= 4200000) {
    incomeTax = Math.floor(62400 + (grossSalary - 2100000) * 0.15);
  } else if (grossSalary <= 8800000) {
    incomeTax = Math.floor(377400 + (grossSalary - 4200000) * 0.24);
  } else {
    incomeTax = Math.floor(1481400 + (grossSalary - 8800000) * 0.35);
  }

  // 6. 지방소득세 (소득세의 10%)
  const localIncomeTax = Math.floor(incomeTax * 0.1);

  const totalDeduction =
    nationalPension +
    healthInsurance +
    longTermCare +
    employmentInsurance +
    incomeTax +
    localIncomeTax;

  return {
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    incomeTax,
    localIncomeTax,
    totalDeduction,
  };
};

/**
 * 월별 급여를 계산합니다
 */
export const calculateMonthlySalary = (
  workRecords: DailyWorkRecord[],
  settings: MonthlySettings,
): MonthlySalary => {
  // 근무 시간 통계
  let totalRegularHours = 0;
  let totalOvertimeHours = 0;
  let totalNightHours = 0;
  let totalWorkDays = 0;

  // 급여 계산
  let regularPay = 0;
  let overtimePay = 0;
  let nightPay = 0;

  workRecords.forEach((record) => {
    const dailyPay = calculateDailyPay(record, settings);

    totalRegularHours += record.regularHours;
    totalOvertimeHours += record.overtimeHours;
    totalNightHours += record.nightHours;

    if (
      record.regularHours > 0 ||
      record.overtimeHours > 0 ||
      record.nightHours > 0
    ) {
      totalWorkDays++;
    }

    regularPay += dailyPay.regularPay;
    overtimePay += dailyPay.overtimePay;
    nightPay += dailyPay.nightPay;
  });

  const grossSalary = regularPay + overtimePay + nightPay;
  const taxCalculation = calculateTax(grossSalary);
  const netSalary = grossSalary - taxCalculation.totalDeduction;

  return {
    year: settings.year,
    month: settings.month,
    settings,
    totalRegularHours,
    totalOvertimeHours,
    totalNightHours,
    totalWorkDays,
    regularPay,
    overtimePay,
    nightPay,
    grossSalary,
    taxCalculation,
    netSalary,
    workRecords,
  };
};
