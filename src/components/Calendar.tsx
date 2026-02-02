import React from "react";
import { generateCalendarGrid, getDayName, formatDate } from "../utils/dateUtils";
import type { DailyWorkRecord } from "../types/salary";

interface CalendarProps {
  year: number;
  month: number;
  workRecords: DailyWorkRecord[];
  onDateClick: (date: string) => void;
  onMonthChange: (year: number, month: number) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  year,
  month,
  workRecords,
  onDateClick,
  onMonthChange,
}) => {
  const grid = generateCalendarGrid(year, month);

  // 날짜별 근무 기록을 맵으로 저장
  const recordMap = new Map<string, DailyWorkRecord>();
  workRecords.forEach((record) => {
    recordMap.set(record.date, record);
  });

  // 이전/다음 달로 이동
  const handlePrevMonth = () => {
    if (month === 1) {
      onMonthChange(year - 1, 12);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      onMonthChange(year + 1, 1);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  // 오늘 날짜 확인
  const today = new Date();
  const isToday = (day: number) => {
    return (
      today.getFullYear() === year &&
      today.getMonth() + 1 === month &&
      today.getDate() === day
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* 헤더: 월 선택 */}
      <div className="mb-6 flex items-center justify-between backdrop-blur-xl bg-white/40 rounded-2xl p-4 shadow-lg border border-white/60">
        <button
          onClick={handlePrevMonth}
          className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 active:scale-95 transition-all shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
          {year}년 {month}월
        </h2>

        <button
          onClick={handleNextMonth}
          className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:from-violet-600 hover:to-violet-700 active:scale-95 transition-all shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
          <div
            key={dayIndex}
            className="text-center py-3 font-semibold text-gray-600 text-sm"
          >
            {getDayName(dayIndex)}
          </div>
        ))}
      </div>

      {/* 달력 그리드 */}
      <div className="grid grid-cols-7 gap-2">
        {grid.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            if (day === null) {
              return <div key={`${weekIndex}-${dayIndex}`} className="aspect-square" />;
            }

            const dateString = formatDate(year, month, day);
            const record = recordMap.get(dateString);
            const hasWork = record && (
              record.regularHours > 0 ||
              record.overtimeHours > 0 ||
              record.nightHours > 0
            );

            return (
              <button
                key={dateString}
                onClick={() => onDateClick(dateString)}
                className={`
                  aspect-square rounded-2xl p-2 backdrop-blur-xl transition-all duration-200
                  border border-white/60 shadow-lg hover:shadow-xl active:scale-95
                  ${isToday(day)
                    ? "bg-gradient-to-br from-cyan-400/50 to-violet-400/50 ring-2 ring-cyan-500"
                    : hasWork
                    ? "bg-gradient-to-br from-violet-300/40 to-cyan-300/40"
                    : "bg-white/30 hover:bg-white/50"
                  }
                `}
              >
                <div className="flex flex-col h-full">
                  {/* 날짜 */}
                  <div className={`text-sm font-bold mb-1 ${
                    dayIndex === 0 ? "text-red-500" : dayIndex === 6 ? "text-blue-500" : "text-gray-700"
                  }`}>
                    {day}
                  </div>

                  {/* 근무 정보 표시 */}
                  {hasWork && record && (
                    <div className="flex-1 flex flex-col justify-center text-xs space-y-0.5">
                      {record.regularHours > 0 && (
                        <div className="bg-cyan-500/80 text-white rounded-md px-1 py-0.5">
                          {record.regularHours}h
                        </div>
                      )}
                      {record.overtimeHours > 0 && (
                        <div className="bg-violet-500/80 text-white rounded-md px-1 py-0.5">
                          잔업 {record.overtimeHours}h
                        </div>
                      )}
                      {record.nightHours > 0 && (
                        <div className="bg-indigo-600/80 text-white rounded-md px-1 py-0.5">
                          야간 {record.nightHours}h
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Calendar;
