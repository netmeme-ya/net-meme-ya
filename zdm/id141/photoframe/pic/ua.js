//<!--©ねとみむや 閲覧状況監視中。ソースコードは日本国の著作権法で守られています。-->
console.log("不正アクセス監視中 Unauthorized Access Monitoring 监控未经授权的访问");
console.log(window.navigator.userAgent.toLowerCase());
// デバイス判別
let testflg = true;//確認用(公開時false)
//現在のURLを取得
let currentURL = window.location.href;
//URLチェッカー（利用しているページのＵＲＬを記載）
//ＳＮＳボタンの表示非表示(true=表示)
snsflg=false;
//----------------
//■■■ユーザーエージェント情報取得■■■
let ua = window.navigator.userAgent.toLowerCase();
//document.write(ua); //確認用
let pcflg =true;
let spflg =false;
let iPadflg =false;
let iPhoneflg= false;
let androidflg = false;
//iPad判別２種類
if (ua.indexOf("ipad") >= 0) {
  pcflg =false;
  spflg=true;
  iPadflg=true;
}
if (ua.indexOf("macintosh") >= 0 && "ontouchend" in document){
  pcflg =false;
  spflg=true;
  iPadflg=true;
}
//iPhone判別
if(ua.indexOf('iphone') >= 0 || ua.indexOf('ipod') >= 0){
	pcflg =false;
	spflg=true;
	iPhoneflg=true;
}
//Android判別
if(ua.indexOf('android') >= 0){
	pcflg =false;
	spflg=true;
	androidflg=true;
}
//PC判別
if(ua.indexOf("windows") >= 0){
	//windowsでの処理	
	pcflg = true;	
}else{
	pcflg = false;
}
//mac判別はすでに最初からpcflgはtrueなので何もしなくてもＰＣと判別。
//winも本来はそうだが検出するコードが書きやすかったので念のため
//
//■■■PCで版元様確認用■■■
let fstflg=true;//初回フラグ

if(pcflg){
	function fc_check(){	
		// index.htmlにてＰＣでのブラウザ横幅を最小にせよという画像表示のためのコード
		let imgElement = document.createElement('img');
		let a_top = document.getElementById('a_top');
		imgElement.src = './pic/test_pc.jpg';
		imgElement.id = 'id_img';		
		if(fstflg){
			//生成するのは初回だけ
			fstflg=false;
			a_top.appendChild(imgElement);
		}
		// 1400px以上になるとid=a_top要素の直下に画像を追加
		var id_img = document.getElementById('id_img');
		var no_yoko = document.getElementById('no_yoko')
		if(window.innerWidth > 1367 || pcflg){
			if(id_img){
				id_img.style.margin = '10px auto';
				id_img.style.width = 'auto';
				id_img.style.height = '99vh';
				id_img.style.display = 'block';
			}
			//横向き禁止は表示しない	
			if(no_yoko){no_yoko.style.display = 'none';}
			/*document.getElementById('wrap').style.display = 'none';//カメラ・アルバムボタン削除*/
		}else{
			id_img.style.display = 'none';
		}
		

	}
	window.onload=function(){
		fc_check();		
	}
	window.addEventListener("resize", ()=>{
		fc_check();
	}, false);
}
//
//■■■PCユーザー禁止対応■■■
if(pcflg && testflg == false){
	window.addEventListener('DOMContentLoaded', ()=>{
	// URLからファイル名部分を抽出
	let filename = currentURL.substring(currentURL.lastIndexOf('/') + 1);
    // 下記HTMLファイル名は除外する
	let isNoPCHTML = (filename === 'no_pc.html');
	let isKiyakuHTML = (filename === 'kiyaku.html');
	//強制移動先ＵＲＬ
	let tmpURLName = 'no_pc.html';
	//「cam/index.html」と「alb/index.html」は強制移動先が「../no_pc.html」になる。
	if(currentURL.indexOf("/cam/")>0 || currentURL.indexOf("/alb/")>0){
		tmpURLName = '../'+tmpURLName;
	}
	//上に列記されたファイル名は何もしない
	if(isNoPCHTML || isKiyakuHTML){
		//何もしない
	}else{
		//除外されたページ以外はeeo非会員ページへ強制移動
		document.body.style.opacity = '0';//ページも一瞬映るので消す
		window.location.href = tmpURLName;
	}	
	});
}
//
//■■■eeoユーザーの場合■■■
let eeoCookieflg=false;//eeoのUser-IDクッキーがあるか否か
// クッキーから指定した名前の値を取得する関数
function getCookieValue(cookieName) {
  // クッキーの文字列を取得
  const cookies = document.cookie.split(';');
  // クッキーを一つずつチェック
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();

    // クッキーが指定した名前で始まるかどうかをチェック
    if (cookie.startsWith(cookieName + '=')) {
      // クッキーの値を取得して返す
      return cookie.substring(cookieName.length + 1);
    }
  }
  // 指定した名前のクッキーが存在しない場合はnullを返す
  return null;
}
// クッキーからUser-IDを取得
const userID = getCookieValue('User-ID');
var eeoflg = false;
//ページ読み込み時
window.addEventListener('DOMContentLoaded', ()=>{
	if(eeoflg && userID === null){//eeo会員限定なのにuserIDないとき
		// URLからファイル名部分を抽出
		let filename = currentURL.substring(currentURL.lastIndexOf('/') + 1);
		// 下記HTMLファイル名は除外する
		let isAllindexHTML = (filename === '');//フォルダ名で終えてるＵＲＬのとき
		let isNoPCHTML = (filename === 'no_pc.html');
		let isKiyakuHTML = (filename === 'kiyaku.html');
		let isNoeeoHTML = (filename === 'no_eeo.html');
		//強制移動先ＵＲＬ
		let tmpURLName = 'no_eeo.html';
		//「cam/index.html」と「alb/index.html」は強制移動先が「../no_eeo.html」になる。
		if(currentURL.indexOf("/cam/")>0 || currentURL.indexOf("/alb/")>0){
			tmpURLName = '../'+ tmpURLName;
		}
		//上に列記された除外ファイル名は何もしない		
		if(isNoPCHTML || isKiyakuHTML || isNoeeoHTML || isAllindexHTML){
			//console.log("なにもしない");
		}else{
			//除外されたページ以外はeeo非会員ページへ強制移動
			document.body.style.opacity = '0';//ページも一瞬映るので消す
			window.location.href = tmpURLName;
		}	
	}else{
		eeoCookieflg = true;
	}
});
/*//Google Tag Manager 
(function (w, d, s, l, i) {
 w[l] = w[l] || []; w[l].push({
  'gtm.start': new Date().getTime(), event: 'gtm.js'
}); 
var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
j.async = true;
j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f); })(window, document, 'script', 'dataLayer', 'GTM-WB4ZVKG');
window.dataLayer = window.dataLayer || [];
dataLayer.push({ 'uid': 'guest' });
*/