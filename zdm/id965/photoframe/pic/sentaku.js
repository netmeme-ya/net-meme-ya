//<!--©ねとみむや 閲覧状況監視中。ソースコードは日本国の著作権法で守られています。-->
//sentaku.html用
let urlName="cam/index.html";//基本はcameraへ誘導
let alName ="alb/index.html";
let fstcamflg = "0";

window.addEventListener('DOMContentLoaded',function(){
    //アコーディオンメニュー
    const acbuttons = document.querySelectorAll('.fr_btn');
    //fr_btnボタンのclass取得
    acbuttons.forEach(button => {
        //ボタンをクリックしたら
        button.addEventListener('click', () => {            
            //fr_btnの次の要素を取得
            const content = button.nextElementSibling;            
            //トグルアイコンを変更する
            const toggleIcon = button.querySelector('b');
            //次の要素が非表示以外なら
            if (content.style.display == "flex" || content.style.display == "block") {
              //非表示にする
                content.style.display = "none";
                toggleIcon.textContent = "+";
                button.style.borderRadius = '10px';
            } else {
                //今押したボタン直下のdivを表示状態に
                content.style.display = "flex";
                toggleIcon.textContent = "-";
                button.style.borderRadius = '10px 10px 0px 0px';
            }
        });
        // ページ内のすべての img タグを取得
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          // loading="lazy" を loading="eager" に変更
          if (img.getAttribute('loading') === 'lazy') {
            img.setAttribute('loading', 'eager');
          }
        });
    });
    //画像の右クリック禁止
    document.body.oncontextmenu = function () {return false;}
    //-----------
    //今のページのクエリを調べる
  let queryStr = window.location.search;
  // クエリパラメータが存在する場合
  if (queryStr) {
    // 文字列から?の位置を取得
    let hatenaMoji = queryStr.indexOf("?");
    // ?以降の文字列を抽出（3文字分）
    let fldName = queryStr.substr(hatenaMoji + 1, 3);
    // クエリがalb(albam)だったときだけＵＲＬを変える
    if(fldName === "alb"){
      urlName = alName;
      document.getElementById("alb_top").style.display="block";
      document.getElementById("cam_top").style.display="none";
      document.title = "アルバムDEフォトフレーム｜選択画面";
    }
  }
    //---------
    // classが"fr_ko"にクリックイベントを追加
    let elements = document.querySelectorAll(".fr_ko");    
    //fr_koに全部にクリックイベントを付加
    elements.forEach(function(element) {
      element.addEventListener("click", function() {
        // クリックされた要素内のimg要素を取得
        let img = element.querySelector("img");        
          // img要素のsrc属性からファイル名を取得
          let src = img.getAttribute("src");
          let fileName = src.substring(src.lastIndexOf("/") + 1, src.lastIndexOf("."));          
          // ファイル名をクエリパラメータとしてURLに追加して移動
          let newUrl = urlName + "?" + fileName;
          window.location.href = newUrl;     
      }); 
    }); 
});
//
//■前のＵＲＬがTOP以外だったら「TOPへ戻るボタン」再上段に表示
/*
const maeURL = document.referrer;
console.log("不正アクセス監視:Unauthorized Access Monitoring:" + maeURL);
if(maeURL.indexOf("/cam/")>=0 || maeURL.indexOf("/alb/")>=0){
	document.getElementById("backbt_top").style.display="block";
}
*/