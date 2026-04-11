const { execSync } = require('fs');
const { execSync: exec } = require('child_process');
const path = require('path');

const TARGET_W = 1284;
const TARGET_H = 2778;
const DIR = path.resolve(__dirname, '../screenshots');

for (let i = 1; i <= 5; i++) {
  const file = path.join(DIR, `SC_0.${i}.png`);

  // 원본 사이즈 가져오기
  const info = exec(`sips -g pixelWidth -g pixelHeight "${file}"`).toString();
  const origW = parseInt(info.match(/pixelWidth:\s*(\d+)/)[1]);
  const origH = parseInt(info.match(/pixelHeight:\s*(\d+)/)[1]);

  // 비율 유지하면서 타겟에 맞는 스케일 계산
  const scale = Math.min(TARGET_W / origW, TARGET_H / origH);
  const newW = Math.round(origW * scale);
  const newH = Math.round(origH * scale);

  // 1. 비율 유지하면서 리사이즈
  exec(`sips -z ${newH} ${newW} "${file}"`);

  // 2. 타겟 사이즈 캔버스에 중앙 배치 (흰 배경 패딩)
  const padLeft = Math.round((TARGET_W - newW) / 2);
  const padTop = Math.round((TARGET_H - newH) / 2);

  exec(`sips -p ${TARGET_H} ${TARGET_W} --padColor FFFFFF "${file}"`);

  // 최종 확인
  const finalInfo = exec(`sips -g pixelWidth -g pixelHeight "${file}"`).toString();
  const finalW = finalInfo.match(/pixelWidth:\s*(\d+)/)[1];
  const finalH = finalInfo.match(/pixelHeight:\s*(\d+)/)[1];

  console.log(`SC_0.${i}.png: ${origW}x${origH} → ${finalW}x${finalH} (비율 유지)`);
}
