// 월급 계산에 필요한 타입 정의

// 근무 교대 타입
export type ShiftType = "day" | "evening" | "night";

// 수당 항목
export interface Allowance {
  id: string;
  name: string;
  amount: number;
}

// 공제 항목
export interface Deduction {
  id: string;
  name: string;
  amount: number;
}

// 3교대 근무 정보
export interface ShiftWork {
  dayShifts: number; // 주간 근무 일수
  eveningShifts: number; // 저녁 근무 일수
  nightShifts: number; // 야간 근무 일수
}

// 세금 계산 결과
export interface TaxCalculation {
  nationalPension: number; // 국민연금 (4.5%)
  healthInsurance: number; // 건강보험 (3.545%)
  longTermCare: number; // 장기요양보험 (건강보험의 12.95%)
  employmentInsurance: number; // 고용보험 (0.9%)
  incomeTax: number; // 소득세
  localIncomeTax: number; // 지방소득세 (소득세의 10%)
  totalDeduction: number; // 총 공제액
}

// 월급 정보 (데이터베이스에 저장될 데이터)
export interface SalaryRecord {
  id?: string;
  created_at?: string;
  year: number;
  month: number;
  baseSalary: number; // 기본급
  shiftWork?: ShiftWork; // 교대 근무 정보
  nightShiftRate: number; // 야간 수당 비율 (예: 0.5 = 50%)
  allowances: Allowance[]; // 추가 수당 목록
  deductions: Deduction[]; // 추가 공제 목록
  taxCalculation: TaxCalculation; // 세금 계산 결과
  totalAllowance: number; // 총 수당
  totalDeduction: number; // 총 공제
  netSalary: number; // 실수령액
}
