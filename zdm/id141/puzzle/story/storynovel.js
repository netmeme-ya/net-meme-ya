//ストーリーモードノベルパート用ｊｓ
document.addEventListener("DOMContentLoaded", function () {
	//エリアナンバーをローカルストレージに保存
	function fc_getStoryNumber(mojiURL1) {
	    const match = mojiURL1.match(/\/story\/(\d+)/);
	    return match ? parseInt(match[1], 10) : null;
	}
	let mojiURL1 = window.location.href;
	const areaNumber = fc_getStoryNumber(mojiURL1);
	//現在のゲーム番号
	localStorage.setItem('nowarea', areaNumber);
});
