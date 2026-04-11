import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'seed-sentences.json');
const data: any[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

console.log('=== EngWrite 콘텐츠 품질 수정 스크립트 ===\n');
console.log(`총 문장 수: ${data.length}`);

// ============================================================
// 수정 1: 난이도 오분류 재분류
// 주식/투자 및 기업동향/뉴스 카테고리의 beginner 문장 중
// 30자 이상이면서 전문 용어를 포함하는 문장을 intermediate로 변경
// ============================================================

const targetCategories = ['주식/투자', '기업동향/뉴스'];

// 30자 이상인 beginner 문장은 모두 전문 용어나 전문 내용을 포함
// (시가총액, 배당금, 재무제표, 분할 매수, 차익실현, 유니콘 기업, 공급망,
//  손절매, 기준금리, 인플레이션, 반독점, 리쇼어링, 옴니채널, 벤처 캐피탈,
//  탄소중립, 메타버스, AI, 개인정보, 전기차 배터리 등)
const specialistTerms = [
  '시가총액', '배당금', '재무제표', '분할 매수', '차익실현', '유니콘 기업', '공급망',
  '손절매', '기준금리', '인플레이션', '반독점', '리쇼어링', '옴니채널', '벤처 캐피탈',
  '탄소중립', '메타버스', '개인정보 보호', '전기차 배터리',
  '매수', '수급', '주주', '발행주식', '투자자', '거래량',
  'AI', '스타트업', '비즈니스',
  '위험도', '옴니채널',
];

let reclassifyCount = 0;
const reclassified: string[] = [];

data.forEach((s) => {
  if (
    targetCategories.includes(s.category) &&
    s.difficulty === 'beginner' &&
    s.koreanText.length >= 30
  ) {
    // Check if it contains any specialist term
    const hasSpecialist = specialistTerms.some((t) => s.koreanText.includes(t));
    if (hasSpecialist) {
      s.difficulty = 'intermediate';
      reclassifyCount++;
      reclassified.push(`  ${reclassifyCount}. [${s.koreanText.length}자] ${s.koreanText}`);
    }
  }
});

console.log(`\n[수정 1] 난이도 재분류: beginner → intermediate: ${reclassifyCount}개`);
reclassified.forEach((r) => console.log(r));

// ============================================================
// 수정 2: hintWords 기본 단어 제거
// ============================================================

const basicWords = ['I', 'is', 'am', 'are', 'was', 'were', 'the', 'a', 'an', 'it', 'my', 'this', 'that'];
let removedHintCount = 0;

data.forEach((s) => {
  if (!s.hintWords || s.hintWords.length === 0) return;

  const toKeep = s.hintWords.filter((h: any) => !basicWords.includes(h.english));
  const toRemoveCount = s.hintWords.length - toKeep.length;

  if (toRemoveCount === 0) return;

  // 최소 2개 유지
  if (toKeep.length >= 2) {
    removedHintCount += toRemoveCount;
    s.hintWords = toKeep;
  }
  // toKeep < 2이면 제거하지 않음
});

console.log(`\n[수정 2] 기본 hintWords 제거: ${removedHintCount}개 단어 제거`);

// ============================================================
// 수정 3: 교과서체 문장 개선 (상위 10개만)
// beginner 문장 중 ~합니다/~것입니다/~됩니다 어미 → 구어체로 변경
// ============================================================

// Only target sentences that are still beginner (after reclassification)
const formalEndings = [
  { pattern: /합니다\.$/, check: '합니다.' },
  { pattern: /것입니다\.$/, check: '것입니다.' },
  { pattern: /됩니다\.$/, check: '됩니다.' },
];

// Mapping: formal → casual conversions
const conversions: Record<string, string> = {
  // 가장 부자연스러운 것 우선 (일상 주제의 교과서체)
  '나는 영화를 좋아합니다.': '나는 영화를 좋아해.',
  '아침에 운동을 합니다.': '아침에 운동을 해.',
  '이번 주에 특가 행사를 합니다.': '이번 주에 특가 행사를 해.',
  '피드백 주셔서 감사합니다.': '피드백 주셔서 고마워.',
  '주문해주셔서 감사합니다.': '주문해주셔서 고마워.',
  '당신의 피드백을 감사합니다.': '당신의 피드백에 감사해.',
  '이 가격은 정말 저렴합니다.': '이 가격은 정말 저렴해.',
  '온라인 주문이 가능합니다.': '온라인 주문이 가능해.',
  '문의는 언제든 환영합니다.': '문의는 언제든 환영해.',
  '배송이 내일 도착합니다.': '배송이 내일 도착해.',
};

let convertedCount = 0;
const converted: string[] = [];

data.forEach((s) => {
  if (convertedCount >= 10) return;
  if (s.difficulty !== 'beginner') return;

  const hasFormal = formalEndings.some((e) => s.koreanText.endsWith(e.check));
  if (!hasFormal) return;

  if (conversions[s.koreanText]) {
    const before = s.koreanText;
    s.koreanText = conversions[s.koreanText];
    convertedCount++;
    converted.push(`  ${convertedCount}. "${before}" → "${s.koreanText}"`);
  }
});

console.log(`\n[수정 3] 교과서체 → 구어체 변환: ${convertedCount}개`);
converted.forEach((c) => console.log(c));

// ============================================================
// 저장
// ============================================================

fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');

// 최종 통계
const afterDiffs: Record<string, number> = {};
data.forEach((s) => {
  afterDiffs[s.difficulty] = (afterDiffs[s.difficulty] || 0) + 1;
});

console.log('\n=== 수정 결과 요약 ===');
console.log(`난이도 재분류: ${reclassifyCount}개`);
console.log(`hintWords 기본 단어 제거: ${removedHintCount}개`);
console.log(`교과서체 → 구어체: ${convertedCount}개`);
console.log(`\n수정 후 난이도 분포:`);
console.log(`  beginner: ${afterDiffs['beginner'] || 0}개`);
console.log(`  intermediate: ${afterDiffs['intermediate'] || 0}개`);
console.log('\n파일 저장 완료: seed-sentences.json');
