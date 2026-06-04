//<!--©ねとみむや 閲覧状況監視中。ソースコードは日本国の著作権法で守られています。-->
//localStorage.clear();
//同意チェッカー
let agreeflg="0";
agreeflg="1";//同時無効化
localStorage.setItem("pf_agree1", "1");//同意無効化

agreeflg = localStorage.getItem("pf_agree1");
function fc_douibt(){
	localStorage.setItem("pf_agree1", "1");
	agreeflg = "1";
	fc_doui();
}
function fc_doui(){
    var doui_syokai = document.getElementById("doui_syokai");
    var a_btn_syokai = document.getElementById("a_btn_syokai");
    var a_btn = document.getElementById("a_btn");
    if(agreeflg !== "1"){
		//0=初回規約表示がON
		if(doui_syokai){doui_syokai.style.display="block";}
		if(a_btn_syokai){a_btn_syokai.style.display="flex";}
		//if(a_btn){a_btn.style.display="none";}
    }else{
		//1=合意済み・初回規約表示がOFF
		localStorage.setItem("pf_agree1", "1");
		if(doui_syokai){doui_syokai.style.display="none";}
		if(a_btn_syokai){a_btn_syokai.style.display="none";}
		if(a_btn){a_btn.style.display="flex";}
    }
}
fc_doui();

//------------------    


