// ==========================================
// 1. 時計機能
// ==========================================
function updateClock() {
  const now = new Date();

  // 時・分・秒を取得して2桁に揃える
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // 年・月・日を取得
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');

  // 画面に反映
  document.getElementById('clock-time').textContent = `${hours}:${minutes}:${seconds}`;
  document.getElementById('clock-date').textContent = `${year}.${month}.${date}`;
}

// 1秒（1000ミリ秒）ごとに時計を更新
setInterval(updateClock, 1000);
updateClock(); // 起動時に即実行


// ==========================================
// 2. Web Audio APIを使った雨音生成機能
// ==========================================
let audioCtx = null;
let noiseNode = null;
let isPlaying = false;

const rainBtn = document.getElementById('rain-btn');
const btnText = document.getElementById('btn-text');

// 雨音（ピンクノイズ＋フィルター）を生成・再生する関数
function startRainSound() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // 5秒間のノイズバッファを作成
  const bufferSize = audioCtx.sampleRate * 5;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  // 雨音に近い「ピンクノイズ」の数学的生成
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    data[i] *= 0.04; // 音量を抑えめに調整
    b6 = white * 0.115926;
  }

  noiseNode = audioCtx.createBufferSource();
  noiseNode.buffer = buffer;
  noiseNode.loop = true;

  // こもり感を出すフィルター（ローパスフィルター）
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800; // 周波数を調整して柔らかい雨音に

  // 接続: ノイズ -> フィルター -> 出力
  noiseNode.connect(filter);
  filter.connect(audioCtx.destination);

  noiseNode.start();
}

// ボタンのクリックイベント設定
rainBtn.addEventListener('click', () => {
  if (!isPlaying) {
    startRainSound();
    isPlaying = true;
    btnText.textContent = '雨の音を止める';
    rainBtn.classList.add('playing');
  } else {
    if (noiseNode) {
      noiseNode.stop();
      audioCtx.close();
    }
    isPlaying = false;
    btnText.textContent = '雨の音を流す';
    rainBtn.classList.remove('playing');
  }
});
