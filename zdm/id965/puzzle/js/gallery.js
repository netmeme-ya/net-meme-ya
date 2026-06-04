/*■lighthouse表示■*/
// pic_div内の全imgにクリックイベントを設定
const popupDiv = document.getElementById('popup_div');
const popupImg = document.getElementById('popup_img');
const popupX = document.getElementById('popup_x');
const popupPrev = document.getElementById('popup_prev');
const popupNext = document.getElementById('popup_next');
const popupTitle = document.getElementById('popup_title');
let folderId="";
let titleText="";
// 全pic_div内imgを配列で保持
const allImgs = [...document.querySelectorAll('.pic_div img')];
let currentIndex = 0;

function openPopup(index) {
  currentIndex = index;
  popupImg.src = allImgs[currentIndex].src;
  popupDiv.style.display = 'flex';
  closeMenu();
}

// 各imgクリックで開く
allImgs.forEach((img, index) => {
  img.addEventListener('click', () => openPopup(index));
});

// このままでa0→a1→a2...と連続して移動できる
popupPrev.addEventListener('click', () => {
  if (currentIndex > 0) openPopup(currentIndex - 1);
    folderId = popupImg.src.split('/').slice(-2)[0];
    console.log("folderID:"+folderId);
    titleText = document.getElementById(folderId).querySelector('p').textContent;
    popupTitle.textContent = titleText;
});

popupNext.addEventListener('click', () => {
  if (currentIndex < allImgs.length - 1) openPopup(currentIndex + 1);
  folderId = popupImg.src.split('/').slice(-2)[0];
  console.log("folderID:"+folderId);
  titleText = document.getElementById(folderId).querySelector('p').textContent;
  popupTitle.textContent = titleText;
});

// 閉じる
popupX.addEventListener('click', () => {
  popupDiv.style.display = 'none';
  closeMenu();
});

document.querySelectorAll('.pic_div img').forEach(img => {
  img.addEventListener('click', function() {
    folderId = this.src.split('/').slice(-2)[0];
    console.log("folderID:"+folderId);
    titleText = document.getElementById(folderId).querySelector('p').textContent;
    popupTitle.textContent = titleText; 
  });
});

