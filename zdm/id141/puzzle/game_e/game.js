//★★ゲームパート★★
//「〇TEST用対応」は後で消す。実験で値を作ったりしたら必ず「//〇TEST用」を入れる。
//
//パネルの数=難易度(1辺の数4*4=16など)
let ippenNum = 2; // 3,4,5,6 のみ許可
let isTimer = false;//タイマーの有無
let isTest = false;//TEST用のときはture
//以下は調整なし
//ippenNumは3～6まで・整数以外は強制2
if (ippenNum < 2 || ippenNum > 6 || !Number.isInteger(ippenNum) || isNaN(ippenNum)) {
    ippenNum = 2;
}
//エリア情報の取得（無いときには0=チュートリアルが入る）
let nowAreaNum = Number(localStorage.getItem('nowarea') ?? "0");
if(nowAreaNum == 0){localStorage.setItem('nowarea', "0");}
//クリア済エリア情報の取得（無いときには0=チュートリアルが入る）
let clearareaNum = Number(localStorage.getItem('cleararea') ?? "0");
if(clearareaNum == 0){localStorage.setItem('cleararea', "0");}
//このゲームがリプレイかどうか?1がリプレイ
let replayNum = Number((localStorage.getItem('replay') ?? "0"));
if(replayNum == 0){localStorage.setItem('replay', "0");}
let nextAreaNum = clearareaNum + 1;
//エリアクリア後の次へボタン。基本はarea.html。fc_areaClear()で指定
let nextURL = "../story/area.html";
if(nowAreaNum >= 4){
	nextURL = "../story/area.html#next";
}
//難易度設定
//1ステージのクリア”面”数・3f=18、3n=16、4f=10、4n=6、5f=5、5n=4、6f=3、6n=1(3分で攻略できる目安)
let clearAreaMenMax = 16;
//ラスト３ステージ以降は9マス
if (nowAreaNum >= 63) {
    ippenNum = 3;
}
//ラストステージは4マスの6面
if(nowAreaNum == 65){
	ippenNum = 4;
	clearAreaMenMax = 6;
}
//アフターノベル対応
if (nowAreaNum == 24) {
    nextURL = "../story/24a/index.html";
}else if(nowAreaNum == 40){
	nextURL = "../story/40a/index.html";
}else if(nowAreaNum == 65){	
	nextURL = "../story/66a/index.html";
}
//ステージ数の例外
//〇TEST用対応
function fc_testqlBTN() {//強制TEST化
    nowAreaNum = 0;
    nextAreaNum = 0;
    isTest = true;
    let test_id_p = document.getElementById('test_id_p');
    if (test_id_p) { test_id_p.style.opacity = "0.1"; }
}
if (isTest) {
    // 練習のとき動くコード
    ippenNum = 3;
    clearAreaMenMax = 3;
    nextURL = "../story/1save/index.html";
    isTimer = true;
    fc_testqlBTN();
}
//
//パネル総数：9or16or25or36 (3*3=9ということ)
let panelNum = ippenNum * ippenNum;
//イラスト保管フォルダ＝現在のステージ面を示す初期値(最後に/をいれること)
let picName = 'pic/';
let picMode = "story/";
let picArea = "a" + nowAreaNum + "/";

//現在のモード（ストーリーかヤリコミか）
const nowMode = localStorage.getItem('nowmode') ?? "";
if (nowMode == "story") {
    picMode = "story/";
} else if (nowMode == "yarikomi") {
    picMode = "yarikomi/";
} else {
    //何もないときには動かない設定なので下記は消す
    picMode = "story/";
}
//
//タイマーナシなら数字消す
if (isTimer) {
    document.getElementById('timer_p').style.display = "block";
} else{
    document.getElementById('timer_p').style.display = "none";
}
//イラスト番号
let picNum = 1;
//拡張子
let picWebp = '.webp';
//1枚絵の設置
let imgSrc = picName + picMode + picArea + picNum + picWebp;
document.getElementById('baffer_img1').src = imgSrc;
//htmlのゲームの表示箇所
let gameContainer = document.getElementById('game');
//クリア時フラグ
let isClear = false;
//クリアした数
let clearCount = 0;
//ゲームオーバー時
let isGameover = false;
//タイル並び配列化
let tiles = [];
//選んだタイル番号変数
let selectedTile = null;
//タイマー設定
//ゲームスタート時
let timer;
let startTime;
//初期化
function fc_syokika() {
    isClear = false;
    isGameover = false;
    tiles = [];
    selectedTile = null;
}
//ギブアップボタンのIDまとめ
let giveUpButton = document.getElementById('giveUpButton');
//URLがHttpで始まるか否か
let isHttp = window.location.href.startsWith("http");
//このステージをクリアしたかどうかフラグ
let allclearflg = false;
//一番最初のスタートボタン
function fc_start() {
    //オーディオファイル・画像1枚目がDLされないとスタートボタンが聞かない
    if (isBufferComp && isImg1Loaded) {
        //GameStartのパネル除去
        document.getElementById('start_anime').style.display = "none";
        giveUpButton.style.display = "block";
        //★●スタート音声を鳴らす
        if (isHttp) {
            if (!audioContext) {
                loadAudio().then(() => {
                    playAudio();
                    playBGM();
                });
            } else {
                playAudio();
                playBGM();
            }
        }
        //タイマーありのとき
        if (isTimer) {
            // 高精度の時間計測を開始
            startTime = performance.now();
            // 既存のタイマーをクリア
            clearInterval(timer);
            //タイマーを33ミリ秒ごとに更新（33msec=30fps）
            timer = setInterval(updateTimer, 33);
        }
    }
    //2枚目の画像先読み
    document.getElementById('baffer_img0').src = picName + picMode + picArea + 2 + picWebp;
}
//タイルをシャッフルする。
function shuffle(array) {
    do {
        // 配列の末尾から先頭に向かって1つずつ処理する
        for (let i = array.length - 1; i > 0; i--) {
            // 0 〜 i の範囲でランダムな整数 j を選ぶ
            let j = Math.floor(Math.random() * (i + 1));
            // i番目とj番目の要素を入れ替える（分割代入による swap）
            [array[i], array[j]] = [array[j], array[i]];
        }
    // every()で「全要素が正位置(val===idx)」かチェック。trueなら揃っているので再ループ
    } while (array.every((val, idx) => val === idx));
}
//タイル配置
function createTiles() {
    //タイル1辺から全枚数を構築
    let gridClassName = 'game_grid' + ippenNum;
    gameContainer.classList.add(gridClassName);
    //クリック箇所位置を決め0～15の数値を配置するときの番号をランダム生成
    let positions = [...Array(panelNum).keys()];
    //それをランダムにする
    shuffle(positions);
    for (let i = 0; i < panelNum; i++) {
        //タイル用のdivを生成
        let tile = document.createElement('div');
        //１辺の数に対応したcssをあてはめる
        let tileClassName = 'tile' + ippenNum;
        tile.classList.add(tileClassName);
        //画像のURL
        let imgSrc = picName + picMode + picArea + picNum + picWebp;
        //画像URLを背景画像に適応
        tile.style.backgroundImage = `url(${imgSrc})`;
        //背景画像の位置をビタ合わせする
        tile.style.backgroundPosition = `${(positions[i] % ippenNum) * -100}% ${(Math.floor(positions[i] / ippenNum)) * -100}%`;
        //ランダムの番号をタイル用divに割り振る
        tile.dataset.index = positions[i];
        //クリック箇所を生成
        tile.addEventListener('click', () => selectTile(tile));
        //タイルの並びを配列に順番に入れる
        tiles.push(tile);
        //game-containerにタイルを配置
        gameContainer.appendChild(tile);
    }
}
//タイルをクリックしたときの関数
function selectTile(tile) {
    if (isClear === false && isGameover === false && isgiveupwindow === false) {
        //1回目の選択
        if (!selectedTile) {
            //選択したタイル番号を記録
            selectedTile = tile;
            //青枠を出す
            tile.classList.add('selected');
        } else {
            //選んだタイル番号を
            let tempIndex = selectedTile.dataset.index;
            //選択タイル→入れ替え対象タイルへ番号入れ替え
            selectedTile.dataset.index = tile.dataset.index;
            //入れ替え対象タイル→選択タイルへ番号入れ替え
            tile.dataset.index = tempIndex;
            //タイル番号と同様に絵柄自体も入れ替え
            selectedTile.style.backgroundPosition = tile.style.backgroundPosition;
            tile.style.backgroundPosition = getBackgroundPosition(tempIndex);
            //青枠を消す
            selectedTile.classList.remove('selected');
            //選択を初期化
            selectedTile = null;
            //選択先に赤枠を出す
            tile.classList.add('replaced');
            window.setTimeout(function () {
                tile.classList.remove('replaced');
            }, 500);
            //クリアか否かをチェック
            checkWin();
        }
    }
}
//パネル背景画像の表示位置を入れ替える用
function getBackgroundPosition(index) {
    return `${(index % ippenNum) * -100}% ${(Math.floor(index / ippenNum)) * -100}%`;
}
//■■■スワイプ操作■■■
//2枚のパネルを直接入れ替える（アニメーション付き）
function swapTiles(tileA, tileB) {
    if (!tileA || !tileB || tileA === tileB) return;
    let tempIndex = tileA.dataset.index;
    tileA.dataset.index = tileB.dataset.index;
    tileB.dataset.index = tempIndex;
    let tempPos = tileA.style.backgroundPosition;
    tileA.style.backgroundPosition = tileB.style.backgroundPosition;
    tileB.style.backgroundPosition = tempPos;
    tileB.classList.add('replaced');
    window.setTimeout(function () {
        tileB.classList.remove('replaced');
    }, 500);
    checkWin();
}
let swipeTouchStartX = 0;
let swipeTouchStartY = 0;
let swipeTouchStartTile = null;
let isSwiping = false;
// スワイプ開始
gameContainer.addEventListener('touchstart', function (e) {
    if (isClear || isGameover || isgiveupwindow) return;
    let touch = e.touches[0];
    swipeTouchStartX = touch.clientX;
    swipeTouchStartY = touch.clientY;
    swipeTouchStartTile = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('[data-index]');
    isSwiping = false;
}, { passive: true });
// スワイプ中（一定距離を超えたらスワイプと判定）
gameContainer.addEventListener('touchmove', function (e) {
    if (!swipeTouchStartTile) return;
    let touch = e.touches[0];
    let dx = touch.clientX - swipeTouchStartX;
    let dy = touch.clientY - swipeTouchStartY;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        isSwiping = true;
    }
}, { passive: true });
// スワイプ終了
gameContainer.addEventListener('touchend', function (e) {
    if (isClear || isGameover || isgiveupwindow) return;
    if (!isSwiping || !swipeTouchStartTile) {
        // スワイプ距離が短い場合はタップとして処理（既存のclickに任せる）
        swipeTouchStartTile = null;
        isSwiping = false;
        return;
    }
    let touch = e.changedTouches[0];
    let dx = touch.clientX - swipeTouchStartX;
    let dy = touch.clientY - swipeTouchStartY;

    // スワイプ角度から8方向を判定（斜め含む）
    // atan2で角度を求め、45度刻みで8方向に分類
    let angle = Math.atan2(dy, dx) * 180 / Math.PI; // -180 ~ 180
    // 方向をdx/dyの符号と比率で判定
    // 斜め判定：abs(dx)とabs(dy)の比が0.4～2.5の範囲なら斜め
    let absDx = Math.abs(dx);
    let absDy = Math.abs(dy);
    let ratio = absDx > 0 ? absDy / absDx : 999;

    // グリッド上の現在タイルの位置(行・列)を取得
    let startIdx = Array.from(tiles).indexOf(swipeTouchStartTile);
    let startRow = Math.floor(startIdx / ippenNum);
    let startCol = startIdx % ippenNum;

    // 方向を決定（行・列の差分）
    let dirRow = 0, dirCol = 0;
    if (ratio < 0.4) {
        // ほぼ水平：左右
        dirCol = dx > 0 ? 1 : -1;
    } else if (ratio > 2.5) {
        // ほぼ垂直：上下
        dirRow = dy > 0 ? 1 : -1;
    } else {
        // 斜め
        dirCol = dx > 0 ? 1 : -1;
        dirRow = dy > 0 ? 1 : -1;
    }

    // 移動先の行・列を計算（グリッド範囲内かチェック）
    let targetRow = startRow + dirRow;
    let targetCol = startCol + dirCol;
    let endTile = null;
    if (targetRow >= 0 && targetRow < ippenNum && targetCol >= 0 && targetCol < ippenNum) {
        endTile = tiles[targetRow * ippenNum + targetCol];
    }

    if (endTile && endTile !== swipeTouchStartTile) {
        // タップ選択中の青枠をリセット
        if (selectedTile) {
            selectedTile.classList.remove('selected');
            selectedTile = null;
        }
        swapTiles(swipeTouchStartTile, endTile);
    }
    swipeTouchStartTile = null;
    isSwiping = false;
}, { passive: true });
//クリアチェッカー
let clMessage = document.getElementById('clMessage');
//見本の１枚目
let mihon1 = document.getElementById('mihon1');
//Good＆NEXTへ ウインドウ
let next_div = document.getElementById('next_div');
//全面クリア・ウインドウ
let allnext_div = document.getElementById('allnext_div');

function checkWin() {
    //everyで指定通りの並びになっているかチェック
    if (tiles.every((tile, index) => tile.dataset.index == index)) {
        //クリアフラグをtrue
        isClear = true;
        //クリアカウントを追加
        clearCount++;
        //ステージ数に反映
        clear_count_span.textContent = clearCount + " / " + clearAreaMenMax;
        //クリアカウントが全クリ数を超えたら面クリア
        //次のゲームの準備
        //黒枠線をなくす
        gameContainer.style.borderColor = 'rgba(0,0,0,0)';
        tiles.forEach(tile => tile.style.borderColor = 'rgba(0,0,0,0)');
        //見本の一枚絵を表示
        mihon1.style.display = "block";
        mihon1.src = picName + picMode + picArea + picNum + picWebp;
        if (picNum >= clearAreaMenMax) {
            //クリアー！          
            //SEを流す
            //BGMを止める
            if (isHttp) {
                bgmSource.stop();
                bgmSource = null;
            }
            //タイマーストップ
            fc_tStop();
            //次のエリアやステージへの処理          
            //ステージクリア！             
            //現在のステージがクリアステージより大きいとき（最前線プレイ）            
            if (replayNum == 0) {
                localStorage.setItem('cleararea', String(nowAreaNum));//このステージがクリア
            } else {
                //リプレイのときはreplayを0に戻しておく
                localStorage.setItem('replay', "0");
                replayNum = 0;                                               
            }
            bgm_allclear.currentTime = 0;            
            bgm_allclear.play();
            allclearflg = true;
            setTimeout(function(){
    			allnext_div.style.display = "block";
			}, 1000);  
            giveUpButton.style.display = "none";
        } else {
            //全面クリアじゃないときは次の面へ
           for (let i = 1; i <= clearAreaMenMax; i++) {
    			document.getElementById('baffer_img' + i).src = picName + picMode + picArea + i + picWebp;
			}
            //SEを流す          
            new Audio("bgm/clear.mp3").play().catch(() => {});
            //NEXTゲーム・クリア画面とNEXTボタン
            setTimeout(function(){
    			next_div.style.display = "block";
			}, 1000);           
        }
    }
}
//■■■AreaClear NEXTボタン■■■
function fc_areaClear() {
	document.getElementById('bt_oto').style.display="none";
    location.href = nextURL;
}

//■■■NEXTボタン（ネクストボタン）■■■
function fc_next() {
    // 画像番号を更新（ここでは 1 から 2 に変更）
    picNum++;   
    // 黒枠線を復活させる
    gameContainer.style.borderColor = '#000';
    tiles.forEach(tile => tile.style.borderColor = '#000');
    next_div.style.display = "none";
    mihon1.style.display = "none";
    // gameContainer 内の古いタイルを削除
    gameContainer.innerHTML = "";
    // 初期化処理（フラグやタイル配列のリセット）
    fc_syokika();
    // 新たにタイルを作成し、盤面に配置
    createTiles();
}
//タイル配置の作成
createTiles();
//
//★★補足要素パート★★
//■■■ギブアップ対応■■■
let isgiveupwindow = false;//ギブアップウインドウの有true無false
function fc_giveup_window() {
    if (isgiveupwindow == false) {
        isgiveupwindow = true;
        document.getElementById('giveup_div').style.display = "block";
    } else {
        isgiveupwindow = false;
        document.getElementById('giveup_div').style.display = "none";
    }
}
function fc_giveup_no() {
    isgiveupwindow = false;
    document.getElementById('giveup_div').style.display = "none";
}
function fc_giveUp() {
    isGameover = true;
    isgiveupwindow = false;
    fc_tKeshi();
    //音声消す
    isOto = true;
    fc_oto();
    giveUpButton.style.display = "none";
    document.getElementById('giveup_div').style.display = "none";
    document.getElementById('gameover_div').style.display = "block";
}
//
//■■■画面上部の表示■■■
//上部ステージカウンター表示
//
let clear_count_span = document.getElementById('clear_count_span');
clear_count_span.textContent = 0 + " / " + clearAreaMenMax;
//上部エリアカウンター
document.getElementById('area_count_p').textContent = "AREA：" + nowAreaNum;
if(replayNum==1){
document.getElementById('area_count_p').textContent = "RETRY・AREA：" + nowAreaNum;    
}
//■■■タイマー関連（fc_start();にもアリ）■■■
//タイマー停止
function fc_tStop() {
    clearInterval(timer); // タイマーを停止
}
//タイマー数値の連続入力
function updateTimer() {
    let elapsedTime = performance.now() - startTime;
    let minutes = Math.floor(elapsedTime / 60000);
    let seconds = Math.floor((elapsedTime % 60000) / 1000);
    let centiseconds = Math.floor((elapsedTime % 1000) / 10); // 10ms単位

    if (minutes >= 99 && seconds >= 99 && centiseconds >= 99) {
        clearInterval(timer); // タイマーを停止        
        document.getElementById("timer_p").textContent = "99:99:99";
        return;
    }
    document.getElementById("timer_p").textContent =
        String(minutes).padStart(2, '0') + ":" +
        String(seconds).padStart(2, '0') + ":" +
        String(centiseconds).padStart(2, '0');
}
//タイマーを0に戻す
function fc_tKeshi() {
    clearInterval(timer);
    document.getElementById("timer_p").textContent = "00:00:00";
}
//★★音声周り★★
//■■■音のON・OFF(fc_start()にもあり)■■■
let isOto = true;//音は最初からアリ
let audioList = []; // 全ての効果音を格納するリスト
// Audioオブジェクトを作成したら自動的にリストに追加
(function () {
    const OriginalAudio = window.Audio;
    window.Audio = function (...args) {
        const audio = new OriginalAudio(...args);
        audioList.push(audio);
        return audio;
    };
})();
//音声のプリロード
let audioContext;
let audioBuffer;
let bgmBuffer;
let isBufferComp = false;
//ミュージック番号
let mmNumBefore = Number(localStorage.getItem('mmNum') ?? "0");
let mmNum = mmNumBefore + 1;
if(mmNum >= 3){mmNum = 0;}
localStorage.setItem('mmNum', String(mmNum));
//ラスボスパート以降は独自音声
if(nowAreaNum >= 63){
    mmNum = nowAreaNum;
}
async function loadAudio() {
    if (!isHttp) {
        //ローカル環境のため音はなし。
        // フィルター解除
        document.getElementById('start_anime').style.filter = "none";
        isBufferComp = true;
        // ここで処理終了（これ以降のコードは実行されない）
        return;
    }
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // SE音声のロード
    const responseSE = await fetch("bgm/zdm_start.mp3");
    //ロードした音声がDLされたらバイナリ(01010111...)で保管する
    const arrayBufferSE = await responseSE.arrayBuffer();
    //バイナリ化された音声を再構築してwavにする（こうすることでpreloadできる）
    audioBuffer = await audioContext.decodeAudioData(arrayBufferSE);
    // BGM音声のロード(SEと同じなんで省略)  
    const responseBGM = await fetch("bgm/mm" + mmNum + ".mp3");
    const arrayBufferBGM = await responseBGM.arrayBuffer();
    bgmBuffer = await audioContext.decodeAudioData(arrayBufferBGM);
    //バッファー完了
    isBufferComp = true;
    //startボタンのグレーアウトを解除
    document.getElementById('start_anime').style.filter = "none";
}
// playAudio()とplayBGM()の音量管理用ゲイン
let masterGain;
async function loadAudio() {
    if (!isHttp) {
        // ローカル環境の場合は音なし
        document.getElementById('start_anime').style.filter = "none";
        isBufferComp = true;
        return;
    }
    // AudioContextの作成
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // masterGainを作成してdestinationに接続
    masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);

    // SE音声のロード
    const responseSE = await fetch("bgm/zdm_start.mp3");
    const arrayBufferSE = await responseSE.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBufferSE);

    // BGM音声のロード
    const responseBGM = await fetch("bgm/mm" + mmNum + ".mp3");
    const arrayBufferBGM = await responseBGM.arrayBuffer();
    bgmBuffer = await audioContext.decodeAudioData(arrayBufferBGM);

    // バッファ完了
    isBufferComp = true;
    document.getElementById('start_anime').style.filter = "none";
}

// playAudio()の変更：masterGainに接続
let source;
function playAudio() {
    source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    // destinationではなくmasterGainに接続
    source.connect(masterGain);
    source.start(0);
}

// playBGM()の変更：masterGainに接続
let bgmSource;
function playBGM() {
    bgmSource = audioContext.createBufferSource();
    bgmSource.buffer = bgmBuffer;
    bgmSource.loop = true;
    // masterGainに接続
    bgmSource.connect(masterGain);
    bgmSource.start(1); // 少し遅延させてBGM開始
}

// 事前ロード
loadAudio();

//クリア！などの音声のプリロード
let bgm_clear = new Audio("bgm/clear.mp3");
bgm_clear.preload = "auto";
bgm_clear.currentTime = 0;
//クリア時のヤッター！の音声プリロード
let bgm_allclear = new Audio("bgm/allclear1.mp3");
bgm_allclear.preload = "auto";
bgm_allclear.currentTime = 0;
//画像１枚目のプリロード
let isImg1Loaded = false;
const preloadImg1 = new Image();
preloadImg1.src = imgSrc;
preloadImg1.onload = function() { isImg1Loaded = true; };

// ■■■音のONOFFトグルボタン■■■
function fc_oto() {
    let bt_oto = document.getElementById("bt_oto");
    if (isOto) {
        // ミュートする場合
        isOto = false;
        bt_oto.src = "gazo/otonasi.png";
        // HTML5 Audio要素（audioList）の音量を0に
        audioList.forEach(audio => audio.volume = 0);
        // Web Audio APIの音量も0に
        if (masterGain) {
            masterGain.gain.value = 0;
        }
    } else {
        // 音を戻す場合（音量100％）
        isOto = true;
        bt_oto.src = "gazo/otoari.png";
        audioList.forEach(audio => audio.volume = 1);
        if (masterGain) {
            masterGain.gain.value = 1;
        }
    }
}
//■■■途中で画面を切り替えたときの対策■■■
// ミュート専用の関数
function muteAudio() {
    isOto = false;
    const bt_oto = document.getElementById("bt_oto");
    if (bt_oto) {
        bt_oto.src = "gazo/otonasi.png";
    }
    // HTML5 Audio要素の音量を0に
    audioList.forEach(audio => audio.volume = 0);
    // Web Audio APIの音量も0に
    if (masterGain) {
        masterGain.gain.value = 0;
    }
}

// アンミュート専用の関数（以前オンだった場合のみ）
function unmuteAudio() {
    isOto = true;
    const bt_oto = document.getElementById("bt_oto");
    if (bt_oto) {
        bt_oto.src = "gazo/otoari.png";
    }
    audioList.forEach(audio => audio.volume = 1);
    if (masterGain) {
        masterGain.gain.value = 1;
    }
}

// ページが隠れる前にオーディオがオンだったかどうかを記憶するフラグ
let wasAudioOn = false;
// visibilitychangeイベントの処理
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
        // ページが非表示になる前に、音がオンならその状態を記憶してミュート
        wasAudioOn = isOto;
        muteAudio();
        if(Androidflg && allclearflg == false && isGameover == false){
            location.href = "wait.html";
        }
    } else if (document.visibilityState === "visible") {
        // ページが再び表示されたとき、もともとオンだったならアンミュートして音量を全開にする
        if (wasAudioOn) {
            unmuteAudio();
        }
    }
});

// ブラウザが閉じられる際もミュートする
window.addEventListener("beforeunload", function (event) {
    muteAudio();
    if(Androidflg && allclearflg == false && isGameover == false){
        location.href = "wait.html";
    }
});

//■■■PCでのプレイ対策■■■
//iPhone・iPad判別はall.jsにあり
//iPadでは上部が見切れるので消す
if (iPadflg) {
    document.getElementById('clear_count_p').style.opacity = '0';
    document.getElementById('area_count_p').style.opacity = '0';
}