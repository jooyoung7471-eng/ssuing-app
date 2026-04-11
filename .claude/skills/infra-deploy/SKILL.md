---
name: infra-deploy
description: "쓰잉 앱의 Railway 서버 배포, PostgreSQL DB 관리, 환경변수 설정, Prisma 마이그레이션, 서버 모니터링을 수행하는 스킬. '서버 배포', 'Railway 배포', 'DB 마이그레이션', '환경변수', '서버 에러', '서버 다운', '502 에러', '배포 실패', 'DB 연결', '서버 확인' 요청 시 사용."
---

# Infra Deploy — Railway 서버 배포 & 관리

쓰잉 앱의 백엔드 서버를 Railway에 배포하고 관리한다.

## 인프라 현황

| 항목 | 값 |
|------|-----|
| 서버 URL | https://ssuing-app-production.up.railway.app |
| Railway 프로젝트 | giving-liberation |
| 서비스 이름 | ssuing-app |
| DB | PostgreSQL (Railway 제공) |
| GitHub 서버 저장소 | jooyoung7471-eng/ssuing-server |
| 로컬 서버 코드 | /Users/jj/Documents/하네스설치/server/ |
| 임시 서버 저장소 | /tmp/ssuing-server/ |

## 환경변수

| 변수 | 용도 |
|------|------|
| DATABASE_URL | PostgreSQL Public URL (gondola.proxy.rlwy.net) |
| ANTHROPIC_API_KEY | Claude API 키 (AI 교정) |
| JWT_SECRET | JWT 서명 시크릿 |
| PORT | 서버 포트 (8081) |

## 배포 워크플로우

### 방법 1: GitHub 자동 배포 (권장)
```bash
# 서버 코드 수정 후 ssuing-server 저장소에 반영
cp -r /Users/jj/Documents/하네스설치/server/src/* /tmp/ssuing-server/src/
cp /Users/jj/Documents/하네스설치/server/package.json /tmp/ssuing-server/package.json
cd /tmp/ssuing-server
git add -A && git commit -m "설명" && git push
# Railway가 자동으로 재배포
```

### 방법 2: Railway CLI 직접 업로드
```bash
cd /tmp/ssuing-server
npx @railway/cli up --service ssuing-app --detach
```

### 배포 후 검증
```bash
# 헬스체크
curl -s https://ssuing-app-production.up.railway.app/api/health

# API 테스트
curl -s "https://ssuing-app-production.up.railway.app/api/sentences/daily?theme=daily&difficulty=beginner"
```

## DB 마이그레이션

```bash
# Railway DB에 직접 마이그레이션 (로컬에서)
cd /Users/jj/Documents/하네스설치/server
DATABASE_URL="postgresql://postgres:PASSWORD@gondola.proxy.rlwy.net:12626/railway" npx prisma migrate deploy

# 시드 데이터
DATABASE_URL="postgresql://..." npx tsx prisma/seed.ts
```

## 장애 대응 가이드

### 502 Bad Gateway
1. `curl` 헬스체크로 서버 상태 확인
2. Railway Deployments 탭에서 ACTIVE/CRASHED 확인
3. View logs에서 런타임 에러 확인
4. PORT 환경변수와 서버 코드 포트 일치 확인
5. 포트 불일치면 `npx @railway/cli variables set PORT="8081" --service ssuing-app`

### DATABASE_URL: NOT SET
1. Railway Variables 탭 확인
2. Public URL 사용 (internal이 아닌 proxy.rlwy.net)
3. `railway up`으로 재배포 시 Variables가 초기화될 수 있음 → 재설정

### 서버 코드가 Expo로 빌드됨
1. ssuing-server 저장소에 .expo 파일이 없는지 확인
2. GitHub 연동이 ssuing-server (ssuing-app이 아닌)를 가리키는지 확인
3. `railway up`으로 서버 코드만 직접 업로드

### Prisma 마이그레이션 실패
1. 빌드 시: 더미 URL로 generate만 실행 (`DATABASE_URL=postgresql://dummy:...`)
2. 시작 시: 실제 URL로 migrate deploy 실행
3. 스키마 변경 시: 로컬에서 먼저 `prisma migrate dev`로 마이그레이션 파일 생성

## Railway CLI 환경변수 관리

```bash
# 로그인
npx @railway/cli login

# 프로젝트 연결
npx @railway/cli link --project "012bf235-649f-4eda-bf8c-a82b5d4dab50" --environment production

# 변수 확인
npx @railway/cli variables --service ssuing-app

# 변수 설정
npx @railway/cli variables set KEY="value" --service ssuing-app
```
