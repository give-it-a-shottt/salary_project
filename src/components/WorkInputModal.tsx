import React, { useState, useEffect, useMemo } from "react";
import { calculateDailyPay } from "../utils/salaryCalculator";
import type { DailyWorkRecord, MonthlySettings } from "../types/salary";

interface WorkInputModalProps {
  isOpen: boolean;
  date: string;
  existingRecord?: DailyWorkRecord;
  settings: MonthlySettings;
  onClose: () => void;
  onSave: (record: DailyWorkRecord) => void;
  onDelete?: () => void;
}

const WorkInputModal: React.FC<WorkInputModalProps> = ({
  isOpen,
  date,
  existingRecord,
  settings,
  onClose,
  onSave,
  onDelete,
}) => {
  const [regularHours, setRegularHours] = useState(0);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [nightHours, setNightHours] = useState(0);
  const [holidayHours, setHolidayHours] = useState(0);
  const [memo, setMemo] = useState("");

  // 기존 기록이 있으면 폼에 채우기
  useEffect(() => {
    if (existingRecord) {
      setRegularHours(existingRecord.regularHours);
      setOvertimeHours(existingRecord.overtimeHours);
      setNightHours(existingRecord.nightHours);
      setHolidayHours(existingRecord.holidayHours);
      setMemo(existingRecord.memo || "");
    } else {
      setRegularHours(0);
      setOvertimeHours(0);
      setNightHours(0);
      setHolidayHours(0);
      setMemo("");
    }
  }, [existingRecord, date]);

  // 실시간 급여 계산
  const calculatedPay = useMemo(() => {
    const tempRecord: DailyWorkRecord = {
      date,
      regularHours,
      overtimeHours,
      nightHours,
      holidayHours,
    };
    return calculateDailyPay(tempRecord, settings);
  }, [date, regularHours, overtimeHours, nightHours, holidayHours, settings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const record: DailyWorkRecord = {
      id: existingRecord?.id,
      date,
      regularHours,
      overtimeHours,
      nightHours,
      holidayHours,
      memo: memo.trim() || undefined,
    };

    onSave(record);
  };

  // 날짜를 읽기 쉽게 포맷
  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    return `${year}년 ${month}월 ${day}일 (${dayNames[date.getDay()]})`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/60 animate-slide-up">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
              {formatDisplayDate(date)}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100/50 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 정규 근무 시간 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              정규 근무 시간
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={regularHours || ""}
                onChange={(e) => setRegularHours(Number(e.target.value))}
                className="w-full px-4 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100/50 border-2 border-cyan-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200/50 transition-all outline-none"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-600 font-bold">
                시간
              </span>
            </div>
          </div>

          {/* 잔업 시간 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              잔업 시간
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={overtimeHours || ""}
                onChange={(e) => setOvertimeHours(Number(e.target.value))}
                className="w-full px-4 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100/50 border-2 border-violet-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-200/50 transition-all outline-none"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-600 font-bold">
                시간
              </span>
            </div>
          </div>

          {/* 야간 근무 시간 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              야간 근무 시간
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={nightHours || ""}
                onChange={(e) => setNightHours(Number(e.target.value))}
                className="w-full px-4 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-2 border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/50 transition-all outline-none"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-600 font-bold">
                시간
              </span>
            </div>
          </div>

          {/* 휴일 근무 시간 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              휴일 근무 시간
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={holidayHours || ""}
                onChange={(e) => setHolidayHours(Number(e.target.value))}
                className="w-full px-4 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100/50 border-2 border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-200/50 transition-all outline-none"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-600 font-bold">
                시간
              </span>
            </div>
          </div>

          {/* 메모 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              메모 (선택)
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-gray-400 focus:ring-4 focus:ring-gray-200/50 transition-all outline-none resize-none"
              placeholder="특이사항을 기록하세요"
            />
          </div>

          {/* 예상 급여 */}
          {(regularHours > 0 || overtimeHours > 0 || nightHours > 0 || holidayHours > 0) && (
            <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border-2 border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-emerald-800">💰 예상 급여</span>
                <span className="text-xs text-emerald-600">시급: {settings.hourlyWage.toLocaleString()}원</span>
              </div>

              <div className="space-y-2 text-sm mb-3">
                {calculatedPay.regularPay > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>정규 근무 ({regularHours}h)</span>
                    <span className="font-semibold">{calculatedPay.regularPay.toLocaleString()}원</span>
                  </div>
                )}
                {calculatedPay.overtimePay > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>잔업 ({overtimeHours}h × {settings.overtimeRate}배)</span>
                    <span className="font-semibold">{calculatedPay.overtimePay.toLocaleString()}원</span>
                  </div>
                )}
                {calculatedPay.nightPay > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>야간 ({nightHours}h × {settings.nightRate}배)</span>
                    <span className="font-semibold">{calculatedPay.nightPay.toLocaleString()}원</span>
                  </div>
                )}
                {calculatedPay.holidayPay > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>휴일 ({holidayHours}h × {settings.holidayRate}배)</span>
                    <span className="font-semibold">{calculatedPay.holidayPay.toLocaleString()}원</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t-2 border-emerald-200 flex justify-between items-center">
                <span className="text-base font-bold text-emerald-900">총 급여</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  {calculatedPay.totalPay.toLocaleString()}원
                </span>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            {existingRecord && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="px-6 py-4 rounded-2xl bg-red-500/90 hover:bg-red-600 text-white font-semibold transition-all active:scale-95 shadow-lg"
              >
                삭제
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl bg-gray-200/80 hover:bg-gray-300/80 text-gray-700 font-semibold transition-all active:scale-95"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold transition-all active:scale-95 shadow-lg"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkInputModal;
