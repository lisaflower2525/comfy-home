// 時計と日時の更新
function updateClock() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
  document.getElementById('date').textContent = now.toLocaleDateString('ja-JP', options);
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock();

// 雨音の再生・停止制御
const rainSound = document.getElementById('rain-sound');
const audioBtn = document.getElementById('audio-toggle');

audioBtn.addEventListener('click', () => {
  if (rainSound.paused) {
    rainSound.play();
    audioBtn.textContent = '🔇 雨音を止める';
  } else {
    rainSound.pause();
    audioBtn.textContent = '🔊 雨音を再生する';
  }
});

// カーテンのドラッグ＆音量連動処理
const windowArea = document.getElementById('window-area');
const curtainLeft = document.getElementById('curtain-left');
const curtainRight = document.getElementById('curtain-right');

let isDragging = false;
let startX = 0;
// 0: 全開 (-80%), 100: 全閉 (0%)
let curtainPercent = 0; 

function updateCurtain(percent) {
  // 範囲を 0 ～ 100 に制限
  curtainPercent = Math.max(0, Math.min(100, percent));
  
  // 位置の計算
  const leftPos = -80 + (curtainPercent * 0.8);
  const rightPos = 80 - (curtainPercent * 0.8);
  
  curtainLeft.style.transform = `translateX(${leftPos}%)`;
  curtainRight.style.transform = `translateX(${rightPos}%)`;
  
  // 音量制御（完全に閉まったら消音）
  const volume = (100 - curtainPercent) / 100;
  rainSound.volume = volume;
}

// ドラッグ開始（マウス / タッチ）
function startDrag(e) {
  isDragging = true;
  startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
}

// ドラッグ中
function moveDrag(e) {
  if (!isDragging) return;
  
  const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  const deltaX = currentX - startX;
  const windowWidth = windowArea.clientWidth;
  
  // ドラッグ量に応じたパーセンテージの変動
  const percentChange = (deltaX / (windowWidth / 2)) * 100;
  
  updateCurtain(curtainPercent + percentChange);
  startX = currentX;
}

// ドラッグ終了
function endDrag() {
  isDragging = false;
}

// イベントリスナーの登録
windowArea.addEventListener('mousedown', startDrag);
windowArea.addEventListener('mousemove', moveDrag);
window.addEventListener('mouseup', endDrag);

windowArea.addEventListener('touchstart', startDrag, { passive: true });
windowArea.addEventListener('touchmove', moveDrag, { passive: true });
window.addEventListener('touchend', endDrag);

// 初期状態の設定（全開）
updateCurtain(0);
