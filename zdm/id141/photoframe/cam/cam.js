//cam用
//■フォトフレームの設定
let allframePass = "../frame/kihon.webp";
let satueiflg=false;//撮影したflg(trueがした)
let dlflg=false;//ＤＬしたflg
let alflg=false;//未DLアラートが出てない
let camOKflg=false;//カメラ準備できたらtrue
let camErrorflg=false;//カメラエラーのとき
//ブラウザ縦横サイズ取得
let iw = window.innerWidth;
let ih = window.innerHeight;
window.onload=function(){
  // URLからクエリパラメータを取得
  let queryStr = window.location.search;
  // クエリパラメータが存在する場合
  if (queryStr) {
    // クエリパラメータからファイル名を抽出
    // ?以降の文字列を抽出
    let fileName = queryStr.substring(1);
    // クエリに応じたファイルパスを入れる
    allframePass= "../frame/" + fileName + ".webp"
    // img要素のsrc属性にファイルパスを設定
    document.getElementById("photoframe").src = allframePass;
  }else{
    //クエリがない場合はkihon.pngが利用される
  }
  //■■番外編
  //このページに3分以上滞在すると強制BACK
    setTimeout(function(){
        //indexへ
        window.location.href = '../index.html';
    }, 180*1000);
  //カメラ準備前のピンチズーム禁止
  	document.body.addEventListener("touchstart", function(e){
	  if(camOKflg==false && camErrorflg==false){e.preventDefault();}
	}, {passive: false});
	document.body.addEventListener("touchmove", function(e){
	  if(camOKflg==false && camErrorflg==false){e.preventDefault();}
	}, {passive: false});
  
}
//■戻るBACKボタン
document.getElementById('back_a').addEventListener('click', function() {
    if(satueiflg && dlflg == false && alflg == false){//撮影したけどDLしてなくて、アラートが出てないとき
        alflg=true;
        //撮影したけどＤＬしてないよ警告
        document.getElementById('back_keikoku').style.display="block";
    }else{
    	//２回目ボタン押したら戻る
       window.location.href = '../sentaku.html';
    }
});
//-----------------
//■カメラの設定
// Webカメラのビデオ要素を取得
let video = document.getElementById('webcam-video');
//ブラウザ縦横サイズ取得
iw = window.innerWidth;
//フォトフレームの画像の縦幅を横幅と同じにする
document.getElementById('photoframe').style.height = iw + "px";
//★★★★★★★★
// カメラのストリームを取得してビデオに表示
let streamV;
//リアカメラかどうかの判別（最初はフロント）
let rearcamflg=false;
let tmpfc = localStorage.getItem("eeopf_rearcam");
//localstrageのeeopf_rearcamが1のとき
if(tmpfc === "1"){
    rearcamflg=true;//リアカメラ確定
}
async function setupWebcam() {
    try {
        //ビデオを1080・rearcamflgがtrueならリアカメラ使う・falseならフェイスカメラ
        streamV = await navigator.mediaDevices.getUserMedia({
         audio:false,
         video: {
         	width: 1080, height: 1080,            
            facingMode: rearcamflg ? 'environment' : 'user'
     	}     		 
     	});
        //メディアデバイスの内容をvideoオブジェクトに入れる
        video.srcObject = streamV;
        //ブラウザが1080以上の時は画像を強制1080サイズにする
        if(iw>1080){iw=1080;}
       	// ビデオの下にフォトフレームを配置し、フォトフレームの高さを調整
        document.getElementById('video-container').style.height = iw + "px";  
        //videoタグ左端表示指定
        video.style.left = "0px";
        //一部端末でカメラの位置がずれるため、一旦body要素を1px小さくして0.5秒後に元に戻す
        //（css読み込み前にカメラが起動できてしまったとき用）
        if(spflg || iPhoneflg || iPadflg || androidflg){
	        document.body.style.width = (window.innerWidth - 1) + 'px';
	        setTimeout(function(){         
	            document.body.style.width =window.innerWidth + 'px';
	            document.getElementById('capture-button').style.opacity = "1";
	            camOKflg=true;//カメラ起動前にスマホが横向きだった時ＮＧ対応=強制移動用
			    // img要素のsrc属性にファイルパスを設定
			    document.getElementById("photoframe").src = allframePass; 
	        }, 0.5*1000);
    	}else{
    		document.getElementById('capture-button').style.opacity = "1";
	        camOKflg=true;
			document.getElementById("photoframe").src = allframePass; 
    	}
    } catch (error) {
    	camErrorflg = true;
        //error状態なので8秒後にindexに戻る
        setTimeout(function(){
                window.location.href = '../index.html';
        }, 8*1000);
        console.error('カメラのアクセスが拒否されました:', error); 
        document.getElementById('errormoji').style.display="block";
       document.getElementById('wrap').style.opacity = '0';       
    }
}
// ページが読み込まれたときにカメラをセットアップ
window.addEventListener('DOMContentLoaded', setupWebcam);

// ページが非アクティブになったときに選択ページに戻る
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") {
   // stream.getTracks().forEach(track => track.stop());
   window.location.href = '../sentaku.html';
  } 
});
// ★撮影ボタンをクリックしたときの処理
document.getElementById('capture-button').addEventListener('click', function() {
     // シャッター音のURL
    document.getElementById('btn_audio').currentTime = 0; //連続クリックに対応
    document.getElementById('btn_audio').play(); //クリックしたら音を再生
    if(snsflg){//snsボタンがtrueのときはボタン表示
        document.getElementById('sns_oya').style.display="flex";
    }
    //クリックした瞬間半透明ですぐに元に戻す
    document.getElementById('wrap').style.opacity = '0.5';
    setTimeout(function(){
    	document.getElementById('wrap').style.opacity = '1';    
    }, 0.5*1000);
    //撮影したフラグ
    satueiflg = true;
    //カメラのキャプチャ機能を動作
    captureAndDisplay();
});
//-----------------
//■カメラ回転
//カメラ回転ボタンのときの関数
function fc_kaiten(){
    if(rearcamflg){
        localStorage.setItem("eeopf_rearcam", "0");
    }else{
        localStorage.setItem("eeopf_rearcam", "1");
    }
    location.hash = "";//もしかしたらすでにハッシュがあるかもしれないのでそれを消す
    location.hash = "a_top";//ＴＯＰへ行く
    //カメラボタン一瞬半透明
    document.getElementById('kaiten-button').style.opacity = '0.5';
    //loading表示
    document.getElementById('kaiaten-load').style.display="block";
    setTimeout(function(){
        window.location.reload();//リロード
    }, 0.5*1000);
}
// カメラ回転ボタンをクリックしたときの処理
document.getElementById('kaiten-button').addEventListener('click', function() {
    //上にfc記載
    fc_kaiten();
});
//----------------
//■撮影画像の表示とＤＬ
// カメラの映像をキャプチャして表示
async function captureAndDisplay() {
    //主に撮影後の処理を記述（撮影前はクリック指示の「★撮影ボタン」に記載）
    const canvas = document.createElement('canvas');
    const aspectRatio = 1; // 正方形のアスペクト比
    const size = 1080; // 画像のサイズを1080x1080に設定
    //canvasは1080固定
    canvas.width = size;
    canvas.height = size;
    //命令セットを入れる
    const ctx = canvas.getContext('2d');
    // ビデオの縦横比を計算
    const videoAspectRatio = video.videoWidth / video.videoHeight;
    // キャプチャ範囲の計算用の変数宣言
    let captureWidth, captureHeight;
    //videoトリミング設定
    if (videoAspectRatio > aspectRatio) {
        // ビデオがより横長の場合
        captureWidth = video.videoHeight * aspectRatio;
        captureHeight = video.videoHeight;
    } else {
        // ビデオがより縦長の場合
        captureWidth = video.videoWidth;
        captureHeight = video.videoWidth / aspectRatio;
    }
    //トリミングする場合の位置設定
    const xOffset = (video.videoWidth - captureWidth) / 2;
    const yOffset = (video.videoHeight - captureHeight) / 2;   
    // キャプチャ領域を正方形に切り取る
    ctx.drawImage(video, xOffset, yOffset, captureWidth, captureHeight, 0, 0, size, size);
    // フォトフレームを合成
    const frameImage = new Image();
    frameImage.src = allframePass;
    //フレームが準備できたら
    frameImage.onload = function() {
        //合成した画像をカンバスにセットする
        ctx.drawImage(frameImage, 0, 0, size, size);
        // キャンバスのデータをJPEG形式のURLに変換（画質を90に設定）
        const captureDataURL = canvas.toDataURL('image/jpeg', 0.9);
        // キャプチャ画像を表示
        const capturedImage = document.getElementById('captured-image');
        capturedImage.src = captureDataURL;
        capturedImage.style.display = 'block';
        //ダミー画像を非表示
        document.getElementById('dammy-image').style.display = 'none';
        //↓矢印表示
        document.getElementById('dlmark').style.display = 'inline';
        document.getElementById('dlmark_a').style.display = 'inline';
        //1秒後に自動で出来上がり画面へスクロール
		setTimeout(function(){ 
        	window.location.hash = 'captured-image-container';
            history.pushState(null, null, null);//スクロールした分発生するLINK履歴削除
		}, 1*1000);
        // ダウンロード時のファイル名を生成(24_0130_1405_12.jpgみたいに)
        const now = new Date();
        const formattedDate = `${String(now.getFullYear()).slice(-2)}_${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}_${String(now.getSeconds()).padStart(2, '0')}`;
        const fileName = `${formattedDate}.jpg`;
        // ダウンロードボタンを設定
        const downloadButton = document.getElementById('download-button');
        downloadButton.style.display = 'block'; //DLボタン表示
        downloadButton.download = fileName; // ファイル名を設定
        downloadButton.href = captureDataURL;//a href生成
    };
}
// DLボタンをクリックしたときの処理
document.getElementById('download-button').addEventListener('click', function() {
    //ＤＬ先についての警告（iOSとAndroidで違いアリ）
    if(iPhoneflg || iPadflg){
        document.getElementById('dl_iphone').style.display="block";
    }
    if(androidflg){
        document.getElementById('dl_android').style.display="block";
    }
    //撮影したけどDLしてない警告を消す
    document.getElementById('back_keikoku').style.display="none";
    dlflg=true;//ダウンロードしたflg  
    //警告文を見やすくするため下へスクロール移動
    location.hash='downloadBtn';
});
//
//■カメラ起動前スマホ回転の対処
// ページが読み込まれるまでの時間を計測するための変数を宣言
let startTime = performance.now();
let matiTime = 3*1000;//待ち時間3秒より前に回転させると強制BACK
//console.log("st:"+startTime);
//まだカメラ準備前段階でスマホを回転させたとき
window.addEventListener("orientationchange", function() {
let nowTime = performance.now()
//console.log("now:"+nowTime);
if(startTime+matiTime >= nowTime || camOKflg==false){
    //ページ表示3秒以下の素早い回転や、カメラが準備前のときは強制移動    
    window.location.href = '../sentaku.html';
}else{
    //ブラウザ縦横サイズ取得
    iw = window.innerWidth;
    ih = window.innerHeight;
    if(iw<ih){//縦が大きいとき
    //フォトフレームの画像の縦幅を横幅と同じにする
    document.getElementById('video-container').style.height = iw + "px";
    document.getElementById('photoframe').style.height = iw + "px";
    }
}
});
/*
//履歴を全部消す
window.addEventListener("popstate", function (e) {
    history.pushState(null, null, null);
    return;
});
//DL終えてないのに他所のページに移動しようとすると警告
window.addEventListener('beforeunload', function (e) {
    if(satueiflg){
        if(alflg==false){
            alflg=true;
            e.preventDefault(); 
            e.returnValue = ''; 
        }
    }
});
//戻るボタンを押した場合の移動先をsentaku.htmlにする*/
