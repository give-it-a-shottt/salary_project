import React, { useState, useEffect } from "react";
import type { MonthlySettings } from "../types/salary";

interface SettingsModalProps {
  isOpen: boolean;
  settings: MonthlySettings;
  onClose: () => void;
  onSave: (settings: MonthlySettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSave,
}) => {
  const [hourlyWage, setHourlyWage] = useState(settings.hourlyWage);
  const [overtimeRate, setOvertimeRate] = useState(settings.overtimeRate);
  const [nightRate, setNightRate] = useState(settings.nightRate);
  const [holidayRate, setHolidayRate] = useState(settings.holidayRate);

  useEffect(() => {
    setHourlyWage(settings.hourlyWage);
    setOvertimeRate(settings.overtimeRate);
    setNightRate(settings.nightRate);
    setHolidayRate(settings.holidayRate);
  }, [settings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...settings,
      hourlyWage,
      overtimeRate,
      nightRate,
      holidayRate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/60">
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
              급여 설정
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100/50 transition-colors">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 시급 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              시급
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="10"
                value={hourlyWage || ""}
                onChange={(e) => setHourlyWage(Number(e.target.value))}
                className="w-full px-4 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100/50 border-2 border-cyan-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200/50 transition-all outline-none"
                placeholder="예: 10000"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-600 font-bold">
                원
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              2026년 최저시급: 10,320원
            </p>
          </div>

          {/* 잔업 수당 배율 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              잔업 수당 배율
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="3"
                step="0.1"
                value={overtimeRate || ""}
                onChange={(e) => setOvertimeRate(Number(e.target.value))}
                className="w-full px-4 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100/50 border-2 border-violet-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-200/50 transition-all outline-none"
                placeholder="예: 1.5"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-600 font-bold">
                배
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              1.5배 = 시급의 150% (법정 기준)
            </p>
          </div>

          {/* 야간 수당 배율 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              야간 수당 배율
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={nightRate || ""}
                onChange={(e) => setNightRate(Number(e.target.value))}
                className="w-full px-4 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-2 border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/50 transition-all outline-none"
                placeholder="예: 0.5"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-600 font-bold">
                배
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              0.5배 = 시급의 50% 추가 (법정 기준)
            </p>
          </div>

          {/* 휴일 수당 배율 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              휴일 수당 배율
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="3"
                step="0.1"
                value={holidayRate || ""}
                onChange={(e) => setHolidayRate(Number(e.target.value))}
                className="w-full px-4 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100/50 border-2 border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-200/50 transition-all outline-none"
                placeholder="예: 1.5"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-600 font-bold">
                배
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              1.5배 = 시급의 150% (법정 기준)
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl bg-gray-200/80 hover:bg-gray-300/80 text-gray-700 font-semibold transition-all active:scale-95">
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold transition-all active:scale-95 shadow-lg">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
