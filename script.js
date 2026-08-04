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

// カーテンと音量の連動処理
const curtainSlider = document.getElementById('curtain-slider');
const curtainLeft = document.getElementById('curtain-left');
const curtainRight = document.getElementById('curtain-right');

curtainSlider.addEventListener('input', (e) => {
  const val = e.target.value; // 0 (全開) ～ 100 (全閉)
  
  // カーテンの位置を計算 (スライド)
  // val=0 のとき -80% (開く)、val=100 のとき 0% (閉じる)
  const leftPos = -80 + (val * 0.8);
  const rightPos = 80 - (val * 0.8);
  
  curtainLeft.style.transform = `translateX(${leftPos}%)`;
  curtainRight.style.transform = `translateX(${rightPos}%)`;
  
  // 雨音の音量を計算 (1.0 ～ 0.0)
  const volume = (100 - val) / 100;
  rainSound.volume = volume;
});
