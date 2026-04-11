---
name: app-develop
description: "EngWrite 앱의 기능을 구현하고 버그를 수정하는 스킬. React Native 프론트엔드와 Node.js 백엔드 모두 다룬다. '기능 구현', '버그 수정', '화면 추가', 'API 수정', '코드 수정' 요청 시 사용."
---

# App Develop — 기능 구현 및 버그 수정

EngWrite 앱의 프론트엔드와 백엔드 코드를 구현/수정한다.

## 프로젝트 구조
```
/Users/jj/Documents/하네스설치/
├── src/                    # React Native 프론트엔드
│   ├── app/                # Expo Router 화면
│   ├── components/         # 공유 컴포넌트
│   ├── hooks/              # 커스텀 훅
│   ├── stores/             # zustand 상태
│   ├── services/           # API 클라이언트
│   ├── constants/          # 색상, 타이포
│   └── types/              # TypeScript 타입
├── server/                 # Node.js 백엔드
│   ├── prisma/             # DB 스키마 + 시드
│   └── src/
│       ├── routes/         # Express 라우트
│       ├── services/       # 비즈니스 로직
│       ├── middleware/      # 인증, 에러 핸들러
│       └── validators/     # zod 스키마
```

## 구현 규칙

### 프론트엔드
- 웹 호환 필수: GestureDetector/Gesture.Pan 사용 금지
- 새 화면 추가 시 `src/app/_layout.tsx`에 Stack.Screen 등록
- expo-secure-store 대신 Platform 분기 (웹=localStorage)
- API 훅은 `src/hooks/use*.ts` 패턴

### 백엔드
- 모든 라우트에 `optionalAuthMiddleware` 적용 (게스트 유저 지원)
- API 응답: 성공 `{ data: T }`, 에러 `{ error: { code, message } }`
- DB 변경 시: schema.prisma 수정 → rm dev.db → migrate dev → seed
- LLM 호출: `claude -p --model haiku` (API 키 불필요)

### 타입 동기화
API 응답 shape 변경 시 반드시:
1. `server/src/types/index.ts` 백엔드 타입
2. `src/types/index.ts` 프론트 타입
두 곳 모두 업데이트

## 서버 실행
```bash
# 백엔드: cd server && npm run dev
# 프론트: cd /Users/jj/Documents/하네스설치 && npx expo start --web
```
