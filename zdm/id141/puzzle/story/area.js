//ストーリーモードメニュー用ｊｓ
let nextAreaNum = 1;
document.addEventListener("DOMContentLoaded", function () {
//クリアしたエリア情報の取得
let clearareaNum = Number(localStorage.getItem('cleararea') ?? "0");
console.log("clearareaNum:"+clearareaNum);
//現在のエリア情報の取得
let nowAreaNum = Number(localStorage.getItem('nowarea') ?? "0");
//全クリア数
let fullClearArea = 65;
//リプレイ初期化
localStorage.setItem('replay', "0");
//次のエリアボタンをONにする
//クリアしたエリアが1のとき次ゲームの2のボタンもONになり次の挑戦ができる。(ただし65まで)
nextAreaNum = clearareaNum + 1;
//リミッター・66面より大きくならない
if(nextAreaNum>=66){
	clearareaNum=66;
}
//クリアしたボタンが表示される
for (let i = 0; i <= clearareaNum; i++) {
  let area_p = document.getElementById("a" + i);
  if (area_p) {
    area_p.style.display = "block";
  }
}
//次の面のリンクも表示し色変え対応
let nextBtn =  document.querySelector('#a' + nextAreaNum +" p");
if(nextBtn){
	document.getElementById("a" + nextAreaNum).style.display = "block";
    nextBtn.style.display = "block";
    nextBtn.style.backgroundColor = "#00e64c";
    nextBtn.style.border = "2px solid #FFF";
}
//上部ボタン設定
document.querySelectorAll('.area_btn div').forEach(function(el) {
  el.addEventListener('click', function() {    
      const clickID = this.id.replace('a', '');
      localStorage.setItem('nowarea', clickID);
      if(clickID <= clearareaNum){
        localStorage.setItem('replay', "1");
      }
      console.log("clickID"+clickID);
	  //ノベルパートだった場合用
	  nextAreaNum = clickID;	  
      fc_links();
    });
});

//■■■フッターボタンの設定■■■
let footer_next_p = document.getElementById('footer_next_p');
//65面クリアで下の文字がENDINGに変わる
if(nextAreaNum >= 66){
	footer_next_p.textContent = "ENDING";
}
footer_next_p.addEventListener("click", function () {	
	if(nextAreaNum >= 66){
		//ステージが65クリアされてたらエンディングパートへ		
		fc_goEnding();		
	}else{
		//次の挑戦エリア番号をlocalstrageに保存
		localStorage.setItem('nowarea', String(nextAreaNum));		
	}
	fc_links();
});

let tmpnextBtn = "../game_e/index.html";
function fc_links(){	
	//ノベルパート選択画面
	if(nextAreaNum == 0 || nextAreaNum == 1 || nextAreaNum == 3 || nextAreaNum == 7 || nextAreaNum == 17 || nextAreaNum == 31 || nextAreaNum == 63 || nextAreaNum == 64 || nextAreaNum == 65){
	   	tmpnextBtn = nextAreaNum　+ "/index.html";
	}else if(nextAreaNum >= 66){		
		fc_goEnding();//全クリ
	}
	//ゲームページに移動
	location.href = tmpnextBtn;	 	
}

function fc_goEnding(){
		console.log("next1");
		tmpnextBtn = "66a/index.html";	
}

//■■■フッターボタンの点滅設定■■■
if(clearareaNum >= 4){
	const footer_blink = document.querySelector('.footer_blink');
	if (footer_blink) {
	  footer_blink.classList.remove('footer_blink');
	}
}

});
