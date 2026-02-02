-- 월급 계산기 데이터베이스 스키마
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- 월급 기록 테이블 생성
CREATE TABLE IF NOT EXISTS salary_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),

  -- 기본 정보
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),

  -- 급여 정보
  base_salary DECIMAL(10, 2) NOT NULL,  -- 기본급
  night_shift_rate DECIMAL(5, 2) DEFAULT 0.5,  -- 야간 수당 비율

  -- 3교대 근무 정보
  day_shifts INTEGER DEFAULT 0,
  evening_shifts INTEGER DEFAULT 0,
  night_shifts INTEGER DEFAULT 0,

  -- 수당 및 공제 (JSONB 형태로 저장)
  allowances JSONB DEFAULT '[]'::jsonb,
  deductions JSONB DEFAULT '[]'::jsonb,

  -- 세금 계산 결과
  tax_calculation JSONB NOT NULL,

  -- 합계
  total_allowance DECIMAL(10, 2) NOT NULL,
  total_deduction DECIMAL(10, 2) NOT NULL,
  net_salary DECIMAL(10, 2) NOT NULL,  -- 실수령액

  -- 인덱스를 위한 제약 조건
  UNIQUE(year, month)
);

-- 인덱스 생성 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_salary_records_year_month
ON salary_records(year, month);

-- Row Level Security (RLS) 활성화
-- 나중에 다중 사용자를 지원하려면 사용자별로 데이터를 분리해야 합니다
ALTER TABLE salary_records ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 자신의 데이터만 볼 수 있도록 설정
-- 지금은 단일 사용자이므로 모든 데이터에 접근 가능하도록 설정
CREATE POLICY "Enable all access for all users"
ON salary_records
FOR ALL
USING (true)
WITH CHECK (true);

-- 테이블 설명 추가
COMMENT ON TABLE salary_records IS '월급 계산 기록을 저장하는 테이블';
COMMENT ON COLUMN salary_records.base_salary IS '기본급';
COMMENT ON COLUMN salary_records.night_shift_rate IS '야간 수당 비율 (예: 0.5 = 50% 추가)';
COMMENT ON COLUMN salary_records.net_salary IS '실수령액 (세금 및 공제 후)';
