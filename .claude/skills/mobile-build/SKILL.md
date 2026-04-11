---
name: mobile-build
description: "쓰잉 앱의 iOS/Android 빌드와 앱스토어 제출을 자동화하는 스킬. EAS Build 설정, 빌드 에러 해결, 앱스토어 업로드, 인증서 관리를 수행한다. '빌드', '빌드 에러', 'EAS', '앱스토어 제출', '인증서', 'SDK 업그레이드', '앱 올리기', '앱 배포' 요청 시 사용."
---

# Mobile Build — iOS 빌드 & 앱스토어 제출

쓰잉 앱의 EAS Build, 앱스토어 제출, 인증서 관리를 수행한다.

## 프로젝트 정보

- 앱: 쓰잉 (com.ssuing.app)
- 프레임워크: React Native + Expo SDK 51
- 빌드 도구: EAS CLI (`npx eas-cli`)
- App Store Connect App ID: 6762038684

## 빌드 워크플로우

### Step 1: 사전 점검
1. `app.json` 확인 — 버전, bundleIdentifier, 아이콘/스플래시 경로
2. `eas.json` 확인 — 빌드 프로필, iOS image 설정
3. TypeScript 에러 확인: `npx tsc --noEmit`
4. git 상태 확인: 모든 변경사항 커밋되어야 함

### Step 2: 빌드
```bash
# 프로덕션 빌드 (앱스토어용)
npx eas-cli build --platform ios --profile production

# Apple 로그인이 필요하면 사용자에게 interactive 실행 요청:
# ! cd /Users/jj/Documents/하네스설치 && npx eas-cli build --platform ios --profile production
```

### Step 3: 제출
```bash
# 최신 빌드를 앱스토어에 업로드
npx eas-cli submit --platform ios --latest --non-interactive
```

### Step 4: 검증
- App Store Connect에서 빌드 처리 완료 확인 (5~10분)
- TestFlight에 빌드 표시되는지 확인

## 자주 발생하는 빌드 에러

| 에러 | 해결 |
|------|------|
| `SDK version issue (90725)` | eas.json에 `"ios": { "image": "latest" }` 추가 |
| `Missing script: "build"` | Root Directory 확인, package.json 위치 확인 |
| TypeScript TS2552 등 | 코드 에러 수정 후 재빌드 |
| `git repository required` | `git init && git add -A && git commit` |
| `ascAppId required` | eas.json submit 섹션에 App ID 추가 |

## 앱 버전 관리

- app.json의 `version`: 사용자에게 보이는 버전 (1.0.0, 1.1.0 등)
- eas.json의 `autoIncrement`: 빌드 번호 자동 증가
- 기능 추가 시: minor 버전 올림 (1.0.0 → 1.1.0)
- 버그 수정 시: patch 버전 올림 (1.0.0 → 1.0.1)
