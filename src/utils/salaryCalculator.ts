import {
  type TaxCalculation,
  type ShiftWork,
  type Allowance,
  type Deduction,
} from "../types/salary";

/**
 * 야간 근무 수당을 계산합니다
 * @param baseSalary - 기본급
 * @param nightShifts - 야간 근무 일수
 * @param nightShiftRate - 야간 수당 비율 (예: 0.5 = 50% 추가)
 * @returns 야간 수당 금액
 */
export const calculateNightShiftAllowance = (
  baseSalary: number,
  nightShifts: number,
  nightShiftRate: number,
): number => {
  // 기본급을 일할 계산 (한 달 = 30일 기준)
  const dailySalary = baseSalary / 30;
  // 야간 근무 수당 = 일급 × 야간 근무 일수 × 수당 비율
  return dailySalary * nightShifts * nightShiftRate;
};

/**
 * 4대 보험 및 세금을 계산합니다
 * @param grossSalary - 총 급여 (기본급 + 모든 수당)
 * @returns 세금 계산 결과
 */
export const calculateTax = (grossSalary: number): TaxCalculation => {
  // 1. 국민연금 (4.5%, 상한액 553만원 기준)
  const pensionBase = Math.min(grossSalary, 5530000);
  const nationalPension = Math.floor(pensionBase * 0.045);

  // 2. 건강보험 (3.545%, 소수점 이하 버림)
  const healthInsurance = Math.floor(grossSalary * 0.03545);

  // 3. 장기요양보험 (건강보험의 12.95%, 소수점 이하 버림)
  const longTermCare = Math.floor(healthInsurance * 0.1295);

  // 4. 고용보험 (0.9%, 소수점 이하 버림)
  const employmentInsurance = Math.floor(grossSalary * 0.009);

  // 5. 소득세 계산 (간이세액표 기준 - 단순화된 계산)
  // 실제로는 더 복잡하지만, 기본적인 누진세율 적용
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

  // 총 공제액 계산
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
 * 총 수당 금액을 계산합니다
 * @param allowances - 수당 목록
 * @param nightShiftAllowance - 야간 수당
 * @returns 총 수당 금액
 */
export const calculateTotalAllowances = (
  allowances: Allowance[],
  nightShiftAllowance: number,
): number => {
  const customAllowances = allowances.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  return customAllowances + nightShiftAllowance;
};

/**
 * 총 공제 금액을 계산합니다
 * @param deductions - 공제 목록
 * @param taxDeduction - 세금 공제액
 * @returns 총 공제 금액
 */
export const calculateTotalDeductions = (
  deductions: Deduction[],
  taxDeduction: number,
): number => {
  const customDeductions = deductions.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  return customDeductions + taxDeduction;
};

/**
 * 실수령액을 계산합니다
 * @param baseSalary - 기본급
 * @param totalAllowance - 총 수당
 * @param totalDeduction - 총 공제
 * @returns 실수령액
 */
export const calculateNetSalary = (
  baseSalary: number,
  totalAllowance: number,
  totalDeduction: number,
): number => {
  return baseSalary + totalAllowance - totalDeduction;
};

/**
 * 전체 월급을 계산합니다 (메인 함수)
 * @param baseSalary - 기본급
 * @param shiftWork - 교대 근무 정보
 * @param nightShiftRate - 야간 수당 비율
 * @param allowances - 추가 수당 목록
 * @param deductions - 추가 공제 목록
 * @returns 계산된 월급 정보
 */
export const calculateFullSalary = (
  baseSalary: number,
  shiftWork: ShiftWork | undefined,
  nightShiftRate: number,
  allowances: Allowance[],
  deductions: Deduction[],
) => {
  // 1. 야간 수당 계산
  const nightShiftAllowance = shiftWork
    ? calculateNightShiftAllowance(
        baseSalary,
        shiftWork.nightShifts,
        nightShiftRate,
      )
    : 0;

  // 2. 총 수당 계산
  const totalAllowance = calculateTotalAllowances(
    allowances,
    nightShiftAllowance,
  );

  // 3. 총 급여 (과세 대상) 계산
  const grossSalary = baseSalary + totalAllowance;

  // 4. 세금 계산
  const taxCalculation = calculateTax(grossSalary);

  // 5. 총 공제액 계산
  const totalDeduction = calculateTotalDeductions(
    deductions,
    taxCalculation.totalDeduction,
  );

  // 6. 실수령액 계산
  const netSalary = calculateNetSalary(
    baseSalary,
    totalAllowance,
    totalDeduction,
  );

  return {
    nightShiftAllowance,
    totalAllowance,
    grossSalary,
    taxCalculation,
    totalDeduction,
    netSalary,
  };
};
