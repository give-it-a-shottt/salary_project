import React from "react";
import type { MonthlySalary } from "../types/salary";

interface MonthlySummaryProps {
  monthlySalary: MonthlySalary | null;
  onSettingsClick: () => void;
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  monthlySalary,
  onSettingsClick,
}) => {
  if (!monthlySalary) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 shadow-lg border border-white/60 text-center">
          <p className="text-gray-500">근무 기록이 없습니다</p>
          <button
            onClick={onSettingsClick}
            className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold hover:from-cyan-600 hover:to-violet-600 transition-all shadow-lg"
          >
            시급 설정하기
          </button>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ko-KR").format(Math.floor(num));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      {/* 실수령액 강조 */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/90 to-violet-600/90 rounded-3xl p-6 shadow-2xl border border-white/60">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white/90 font-medium">이번 달 예상 실수령액</h3>
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <p className="text-5xl font-bold text-white mb-1">
          {formatNumber(monthlySalary.netSalary)}
          <span className="text-2xl ml-1">원</span>
        </p>
        <p className="text-white/80 text-sm">
          총 급여 {formatNumber(monthlySalary.grossSalary)}원 - 공제 {formatNumber(monthlySalary.taxCalculation.totalDeduction)}원
        </p>
      </div>

      {/* 근무 통계 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="backdrop-blur-xl bg-white/40 rounded-2xl p-4 shadow-lg border border-white/60">
          <div className="text-sm text-gray-600 mb-1">근무 일수</div>
          <div className="text-3xl font-bold text-gray-800">
            {monthlySalary.totalWorkDays}
            <span className="text-lg ml-1 text-gray-600">일</span>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/40 rounded-2xl p-4 shadow-lg border border-white/60">
          <div className="text-sm text-gray-600 mb-1">정규 근무</div>
          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-700 bg-clip-text text-transparent">
            {monthlySalary.totalRegularHours}
            <span className="text-lg ml-1">h</span>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/40 rounded-2xl p-4 shadow-lg border border-white/60">
          <div className="text-sm text-gray-600 mb-1">잔업</div>
          <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent">
            {monthlySalary.totalOvertimeHours}
            <span className="text-lg ml-1">h</span>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/40 rounded-2xl p-4 shadow-lg border border-white/60">
          <div className="text-sm text-gray-600 mb-1">야간</div>
          <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
            {monthlySalary.totalNightHours}
            <span className="text-lg ml-1">h</span>
          </div>
        </div>
      </div>

      {/* 급여 상세 */}
      <div className="backdrop-blur-xl bg-white/40 rounded-2xl p-6 shadow-lg border border-white/60">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">급여 상세</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">정규 근무</span>
            <span className="font-semibold text-cyan-600">
              +{formatNumber(monthlySalary.regularPay)}원
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">잔업 수당</span>
            <span className="font-semibold text-violet-600">
              +{formatNumber(monthlySalary.overtimePay)}원
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">야간 수당</span>
            <span className="font-semibold text-indigo-600">
              +{formatNumber(monthlySalary.nightPay)}원
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-gray-800">총 급여 (세전)</span>
            <span className="font-bold text-gray-800 text-lg">
              {formatNumber(monthlySalary.grossSalary)}원
            </span>
          </div>
        </div>
      </div>

      {/* 공제 내역 */}
      <div className="backdrop-blur-xl bg-white/40 rounded-2xl p-6 shadow-lg border border-white/60">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">공제 내역</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">국민연금 (4.5%)</span>
            <span className="text-red-600">
              -{formatNumber(monthlySalary.taxCalculation.nationalPension)}원
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">건강보험 (3.545%)</span>
            <span className="text-red-600">
              -{formatNumber(monthlySalary.taxCalculation.healthInsurance)}원
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">장기요양 (건보의 12.95%)</span>
            <span className="text-red-600">
              -{formatNumber(monthlySalary.taxCalculation.longTermCare)}원
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">고용보험 (0.9%)</span>
            <span className="text-red-600">
              -{formatNumber(monthlySalary.taxCalculation.employmentInsurance)}원
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">소득세</span>
            <span className="text-red-600">
              -{formatNumber(monthlySalary.taxCalculation.incomeTax)}원
            </span>
          </div>
          <div className="flex justify-between pb-3 border-b border-gray-200">
            <span className="text-gray-600">지방소득세</span>
            <span className="text-red-600">
              -{formatNumber(monthlySalary.taxCalculation.localIncomeTax)}원
            </span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="font-bold text-gray-800">총 공제</span>
            <span className="font-bold text-red-600">
              -{formatNumber(monthlySalary.taxCalculation.totalDeduction)}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;
