-- 3교대 월급 계산기 데이터베이스 스키마
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- 1. 일일 근무 기록 테이블
CREATE TABLE IF NOT EXISTS daily_work_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),

  -- 날짜 (YYYY-MM-DD)
  date DATE NOT NULL UNIQUE,

  -- 근무 시간
  regular_hours DECIMAL(5, 2) DEFAULT 0,    -- 정규 근무 시간
  overtime_hours DECIMAL(5, 2) DEFAULT 0,   -- 잔업 시간
  night_hours DECIMAL(5, 2) DEFAULT 0,      -- 야간 근무 시간

  -- 메모
  memo TEXT
);

-- 2. 월별 설정 테이블 (시급, 수당률)
CREATE TABLE IF NOT EXISTS monthly_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),

  -- 년/월
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),

  -- 급여 설정
  hourly_wage DECIMAL(10, 2) NOT NULL,      -- 시급
  overtime_rate DECIMAL(5, 2) DEFAULT 1.5,  -- 잔업 수당 배율
  night_rate DECIMAL(5, 2) DEFAULT 0.5,     -- 야간 수당 배율

  -- 년/월 조합은 유니크
  UNIQUE(year, month)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_daily_work_records_date
  ON daily_work_records(date);

CREATE INDEX IF NOT EXISTS idx_monthly_settings_year_month
  ON monthly_settings(year, month);

-- Row Level Security (RLS) 활성화
ALTER TABLE daily_work_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_settings ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 접근 가능하도록 설정 (단일 사용자용)
CREATE POLICY "Enable all access for daily_work_records"
  ON daily_work_records
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for monthly_settings"
  ON monthly_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger 생성
CREATE TRIGGER update_daily_work_records_updated_at
  BEFORE UPDATE ON daily_work_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_settings_updated_at
  BEFORE UPDATE ON monthly_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 테이블 설명
COMMENT ON TABLE daily_work_records IS '일일 근무 시간 기록';
COMMENT ON TABLE monthly_settings IS '월별 시급 및 수당률 설정';
