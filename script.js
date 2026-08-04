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

// 雨音の再生・停止
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

// タップでカーテン開閉＆音量切り替え
const windowArea = document.getElementById('window-area');
const curtainLeft = document.getElementById('curtain-left');
const curtainRight = document.getElementById('curtain-right');

let isOpen = true; // 最初は開いている状態

windowArea.addEventListener('click', () => {
  if (isOpen) {
    // カーテンを閉じる
    curtainLeft.style.transform = 'translateX(0%)';
    curtainRight.style.transform = 'translateX(0%)';
    rainSound.volume = 0; // 音を消す
    isOpen = false;
  } else {
    // カーテンを開ける
    curtainLeft.style.transform = 'translateX(-85%)';
    curtainRight.style.transform = 'translateX(85%)';
    rainSound.volume = 1.0; // 音を出す
    isOpen = true;
  }
});
