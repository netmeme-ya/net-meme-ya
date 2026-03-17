let allframePass = "../frame/kihon.webp";
let iw = window.innerWidth;
let ih = window.innerHeight;
let upflg=false;//画像をＵＰしたフラグ
let dlflg=false;//DLしたフラグ
let alflg=false;//ＤＬしてないよ警告
window.addEventListener('DOMContentLoaded', function(){
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
    iw = window.innerWidth;//ブラウザ縦横サイズ取得
    if(iw>1080){iw=1080;}
    //divの囲み枠とフォトフレームを横幅縦幅を同じ大きさに
    document.getElementById('pic_con_div').style.height = iw + "px";
    document.getElementById('photoframe').style.height = iw + "px";
    document.getElementById('sentakuPic').style.height = iw + "px";
    //■このページに3分以上滞在すると強制BACK
    setTimeout(function(){
        window.location.href = '../index.html';
    }, 180*1000); 
});
document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('imageInput').click();
});

//画像表示
document.getElementById('imageInput').addEventListener('change', function(e) {
    //１つだけ画像選択
    const file = e.target.files[0];
    if (!file) {//何のファイルも選択してないときは何もしない
        return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            //CANVASタグ生成
            const canvas = document.getElementById('imageCanvas');
            //canvas上に画像などを表示させる命令セットを格納
            const ctx = canvas.getContext('2d');
            // 画像のアスペクト比とCanvasのアスペクト比を比較(縦基準)
            const imgAspectRatio = img.width / img.height;
            const canvasAspectRatio = canvas.width / canvas.height;
            //変数宣言
            let renderWidth, renderHeight, offsetX, offsetY;            
            if (imgAspectRatio > canvasAspectRatio) {
                // 横長の画像: 縦を縮小し、横をトリミング
                renderHeight = canvas.height;
                renderWidth = img.width * (renderHeight / img.height);
                offsetX = (canvas.width - renderWidth) / 2;
                offsetY = 0;
            } else {
                // 縦長の画像: 横を縮小し、縦をトリミング
                renderWidth = canvas.width;
                renderHeight = img.height * (renderWidth / img.width);
                offsetX = 0;
                offsetY = (canvas.height - renderHeight) / 2;
            }
            // Canvasにトリミングなどをした画像を描画させる
            ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
            // 下にある関数を動かす
            addPhotoFrame(canvas, ctx);
        }
        //imgオブジェクトの中に上の関数が格納された
        img.src = event.target.result;
    }
    //画像データをBase-64(文字列データ)化する
    reader.readAsDataURL(file);
    //確認用フォトフレームは消す
    document.getElementById('pic_con_div').style.display = "none"; 
    document.getElementById('photoframe').style.display = "none";
    document.getElementById('sentakuPic').style.display = "none";
    //canvas表示
    document.getElementById('imageCanvas').style.display = "block"; 
    //DLボタン表示
    document.getElementById('downloadBtn').style.display = "block"; 
    upflg=true;//画像をＵＰしたフラグ
});
//ＵＰした写真とフォトフレームの合成をする関数
function addPhotoFrame(canvas, ctx) {
    const frameImg = new Image();
    frameImg.onload = function() {
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
    }
    frameImg.src = allframePass; // フォトフレームのファイルパス
}
//ファイル名の生成（年_月日_時分_秒.jpg）
function getFormattedFilename() {
    const now = new Date();
    const year = now.getFullYear().toString().substr(-2);
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const hour = ('0' + now.getHours()).slice(-2);
    const minute = ('0' + now.getMinutes()).slice(-2);
    const second = ('0' + now.getSeconds()).slice(-2);
    return `${year}_${month}${day}_${hour}${minute}_${second}.jpg`;
}
// 画像をダウンロードする関数
function downloadImage() {
    const canvas = document.getElementById('imageCanvas');
    // JPEG形式で画質90で画像を取得
    const image = canvas.toDataURL("image/jpeg", 0.9);
    
    const link = document.createElement('a');
    link.download = getFormattedFilename(); // 生成されたファイル名を使用
    link.href = image;
    link.click();
    //警告の記載
    if(iPhoneflg || iPadflg){
        document.getElementById('dl_iphone').style.display="block";
    }
    if(androidflg){
        document.getElementById('dl_android').style.display="block";
    }
    document.getElementById('back_keikoku').style.display="none";//撮影したけどDLしてない警告を消す
    dlflg=true;//ダウンロードしたフラグ
    //警告文を見やすくするためのハッシュ移動
    location.hash='downloadBtn';
}
document.getElementById('downloadBtn').addEventListener('click', function() {
    downloadImage();
});
//
//■戻るボタン
document.getElementById('back_a').addEventListener('click', function() {
    if(upflg && dlflg == false && alflg == false){//撮影したけどDLしてなくて、アラートが出てないとき
        alflg=true;
        //撮影したけどＤＬしてないよ警告
        document.getElementById('back_keikoku').style.display="block";
    }else{
        //２回目ボタン押したら戻る
       window.location.href = '../sentaku.html?alb';
    }
});