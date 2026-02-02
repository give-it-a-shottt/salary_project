/**
 * 날짜 관련 유틸리티 함수
 */

/**
 * 특정 월의 일수를 반환합니다
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

/**
 * 특정 월의 첫 날이 무슨 요일인지 반환합니다 (0 = 일요일)
 */
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month - 1, 1).getDay();
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 반환합니다
 */
export const formatDate = (year: number, month: number, day: number): string => {
  const m = month.toString().padStart(2, "0");
  const d = day.toString().padStart(2, "0");
  return `${year}-${m}-${d}`;
};

/**
 * YYYY-MM-DD 형식의 문자열을 파싱합니다
 */
export const parseDate = (
  dateString: string,
): { year: number; month: number; day: number } => {
  const [year, month, day] = dateString.split("-").map(Number);
  return { year, month, day };
};

/**
 * 오늘 날짜를 반환합니다
 */
export const getToday = (): { year: number; month: number; day: number } => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
};

/**
 * 요일 이름을 반환합니다
 */
export const getDayName = (dayIndex: number): string => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[dayIndex];
};

/**
 * 달력 그리드를 생성합니다 (7x6 배열)
 */
export const generateCalendarGrid = (
  year: number,
  month: number,
): (number | null)[][] => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const grid: (number | null)[][] = [];
  let currentDay = 1;

  for (let week = 0; week < 6; week++) {
    const weekDays: (number | null)[] = [];

    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      if ((week === 0 && dayOfWeek < firstDay) || currentDay > daysInMonth) {
        weekDays.push(null);
      } else {
        weekDays.push(currentDay);
        currentDay++;
      }
    }

    grid.push(weekDays);

    // 모든 날짜를 채웠으면 종료
    if (currentDay > daysInMonth) break;
  }

  return grid;
};
