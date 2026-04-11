# PracticeScreen UI 개선 디자인 가이드

> 참고: DanielClass 미니학습지 앱 스타일 기반, 200줄 이내 디자인 스펙 전용

---

## 1. 레이아웃 전략

| 항목 | 값 |
|------|-----|
| 최대 너비 | `max-width: 430px` |
| 중앙 정렬 | `margin: 0 auto` |
| 최소 높이 | `min-height: 100vh` |
| 외부 배경 | `#F0F2F5` (웹에서 양 옆 여백 색상) |
| 내부 배경 | `#FFFFFF` (카드 영역) |
| 다크 헤더 높이 | 화면의 약 30%, `min-height: 240px` |
| SwipeableCards 컨테이너 | `width: 100%` (부모의 max-width를 따름, SCREEN_WIDTH 제거) |
| 모든 카드/입력 가로폭 | `width: calc(100% - 40px)`, `margin: 0 auto` (좌우 20px) |

### 웹 래퍼 구조
```
<MobileFrame>         ← max-width:430px, margin:0 auto, bg:#FFFFFF
  <DarkHeader />      ← 그라데이션 상단
  <ContentArea />     ← 화이트 배경 카드 영역
</MobileFrame>
```

---

## 2. 색상 스펙

### 다크 헤더 그라데이션
| 항목 | 값 |
|------|-----|
| 시작 | `#0A0A1A` (검정에 가까운 남색) |
| 끝 | `#1A2744` (진남색) |
| 방향 | `180deg` (위→아래) |

### 배지/라벨 색상
| 요소 | 배경 | 텍스트 |
|------|------|--------|
| 날짜 pill | `#2563EB` | `#FFFFFF` |
| KOR 라벨 | `#EF4444` | `#FFFFFF` |
| ENG 1 라벨 | `#2563EB` | `#FFFFFF` |
| ENG 2 라벨 | `#16A34A` | `#FFFFFF` |
| 번호 배지 | `#2563EB` | `#FFFFFF` |

### 카드 배경/보더 색상
| 카드 | 배경 | 좌측 보더 |
|------|------|-----------|
| KOR 카드 | `#FFF8F0` (연한 크림) | `#EF4444` (빨간색) |
| ENG 1 카드 | `#EFF6FF` (연한 파랑) | `#2563EB` (파란색) |
| ENG 2 카드 | `#F0FDF4` (연한 초록) | `#16A34A` (초록색) |

### KEY VOCABULARY 박스
| 항목 | 값 |
|------|-----|
| 보더 | `1px solid #E5E7EB` |
| 배경 | `#FFFFFF` |
| 영어 단어 | `#2563EB`, bold, 밑줄 |
| 한글 뜻 | `#9CA3AF` |

### 점수 색상 (기존 유지)
| 범위 | 색상 |
|------|------|
| 8-10 | `#16A34A` |
| 5-7 | `#F59E0B` |
| 1-4 | `#EF4444` |

### Dot Indicator
| 상태 | 색상 |
|------|------|
| 활성 | `#2563EB` |
| 비활성 | `#D1D5DB` |

---

## 3. 간격/사이즈 스펙

### 다크 헤더 내부
| 요소 | 값 |
|------|-----|
| 상단 safe area | `padding-top: 48px` |
| 날짜 배지 상단 여백 | `margin-top: 16px` |
| 서브타이틀 상단 여백 | `margin-top: 12px` |
| 한글 제목 상단 여백 | `margin-top: 8px` |
| 영문 제목 상단 여백 | `margin-top: 6px` |
| 하단 여백 | `padding-bottom: 32px` |

### 카드 영역 (화이트 배경)
| 요소 | 값 |
|------|-----|
| 카드 영역 시작 | 헤더와 `-20px` 오버랩 (둥근 모서리 효과) |
| 카드 영역 상단 radius | `border-radius: 20px 20px 0 0` |
| 번호 배지 상단 여백 | `margin-top: 24px` |
| 라벨과 카드 간격 | `margin-top: 8px` |
| 카드 간 간격 | `margin-bottom: 20px` |
| 카드 내부 패딩 | `padding: 16px 20px` |
| KEY VOCAB 상하 여백 | `margin: 20px 0` |
| KEY VOCAB 내부 패딩 | `padding: 16px` |
| VOCAB 그리드 gap | `row-gap: 12px`, `column-gap: 16px` |
| 하단 dot indicator 여백 | `margin: 24px 0 32px` |
| dot 크기 | `8px` |
| dot 간격 | `gap: 8px` |

### 좌측 보더 카드
| 항목 | 값 |
|------|-----|
| 보더 두께 | `3px` (좌측만) |
| border-radius | `0 12px 12px 0` |

---

## 4. 전체 화면 흐름 (위→아래)

```
1. [다크 헤더] 그라데이션 배경
   - 뒤로 버튼 (좌상단)
   - 페이지 표시 "1 / 3" (우상단)
   - 날짜 pill 배지 (중앙)
   - 서브타이틀 "오늘의 일상 영어" (중앙)
   - 한글 제목 (중앙, 큰 볼드)
   - 영문 부제 (중앙, 회색)

2. [화이트 카드 영역] 둥근 모서리로 오버랩
   - 번호 배지 (파란 원 + 흰 숫자)
   - KOR 라벨 + KOR 카드 (크림 배경, 빨간 보더)
   - KEY VOCABULARY 박스 (2열 그리드)
   - ENG 1 라벨 + 입력 카드 (파란 배경, 파란 보더)
   - 제출 버튼
   - (제출 후) 점수 표시
   - ENG 1 라벨 + 교정 결과 카드
   - ENG 2 라벨 + 모범 답안 카드 (초록 배경, 초록 보더)
   - Dot indicator
   - 크레딧 라인
```

---

## 5. 폰트 스펙

| 요소 | fontSize | fontWeight | color | 정렬 |
|------|----------|------------|-------|------|
| 뒤로 버튼 아이콘 | 24px | - | `#FFFFFF` | - |
| 페이지 표시 | 15px | 500 | `rgba(255,255,255,0.7)` | 우측 |
| 날짜 pill 텍스트 | 13px | 600 | `#FFFFFF` | 중앙 |
| 서브타이틀 | 14px | 400 | `rgba(255,255,255,0.6)` | 중앙 |
| 한글 제목 | 26px | 700 | `#FFFFFF` | 중앙 |
| 영문 부제 | 16px | 400 | `rgba(255,255,255,0.5)` | 중앙 |
| 번호 배지 숫자 | 14px | 700 | `#FFFFFF` | 중앙 |
| 라벨 텍스트 (KOR/ENG) | 13px | 600 | `#FFFFFF` | - |
| KOR 카드 본문 | 18px | 600 | `#1A1A2E` | 좌측 |
| VOCAB 헤더 | 14px | 700 | `#374151` | 좌측 |
| VOCAB 영어 | 15px | 700 | `#2563EB` | 좌측 |
| VOCAB 한글 | 13px | 400 | `#9CA3AF` | 좌측 |
| 입력 placeholder | 16px | 400 | `#D1D5DB` | 좌측 |
| 입력 텍스트 | 16px | 400 | `#1A1A2E` | 좌측 |
| 제출 버튼 | 16px | 600 | `#FFFFFF` | 중앙 |
| 점수 숫자 | 28px | 700 | 점수별 색상 | 중앙 |
| 교정 문장 | 16px | 500 | `#1A1A2E` | 좌측 |
| 교정 설명 | 14px | 400 | `#374151` | 좌측 |
| 크레딧 라인 | 12px | 400 | `#9CA3AF` | 중앙 |

---

## 6. 그림자/보더 스펙

### 카드 그림자
| 카드 유형 | shadow |
|-----------|--------|
| 화이트 카드 영역 전체 | `0 -4px 20px rgba(0,0,0,0.08)` |
| KOR/ENG 개별 카드 | 없음 (좌측 보더로 구분) |
| KEY VOCAB 박스 | 없음 (보더로 구분) |
| 교정 결과 카드 | `0 2px 12px rgba(0,0,0,0.06)` |
| 제출 버튼 | `0 2px 8px rgba(37,99,235,0.25)` |

### 보더 스펙
| 요소 | 보더 |
|------|------|
| KOR 카드 좌측 | `3px solid #EF4444` |
| ENG 1 카드 좌측 | `3px solid #2563EB` |
| ENG 2 카드 좌측 | `3px solid #16A34A` |
| KEY VOCAB 박스 | `1px solid #E5E7EB`, `border-radius: 12px` |
| 입력 필드 기본 | `1.5px solid #D1D5DB`, `border-radius: 12px` |
| 입력 필드 포커스 | `1.5px solid #2563EB` |
| 날짜 pill | 없음, `border-radius: 20px` |
| 라벨 pill (KOR/ENG) | 없음, `border-radius: 12px` |
| 번호 배지 | 없음, `border-radius: 50%`, `width: 28px`, `height: 28px` |
| Dot indicator | 없음, `border-radius: 50%`, `width: 8px`, `height: 8px` |

### Border Radius 정리
| 요소 | radius |
|------|--------|
| 화이트 카드 영역 상단 | `20px 20px 0 0` |
| 개별 카드 (KOR/ENG) | `0 12px 12px 0` (좌측 보더 있으므로) |
| KEY VOCAB 박스 | `12px` |
| 입력 필드 | `12px` |
| 제출 버튼 | `12px` |
| 날짜 pill | `20px` |
| 라벨 pill | `12px` |
| 번호 배지 | `50%` |

---

## 핵심 변경 요약

1. **SwipeableCards**: `width: SCREEN_WIDTH` 제거, 부모 `max-width: 430px` 상속
2. **MobileFrame 래퍼**: 웹에서 `max-width: 430px; margin: 0 auto` 적용
3. **모든 내부 카드**: `width: calc(100% - 40px)` 통일 (좌우 20px 마진)
4. **다크 헤더 추가**: 기존 라이트 헤더를 그라데이션 다크 헤더로 교체
5. **카드 색상 구분**: KOR(빨강), ENG1(파랑), ENG2(초록) 좌측 보더+배경 색상
6. **KEY VOCAB**: 힌트를 2열 그리드 박스로 재구성
