// HTMLImageElement オブジェクトを作成する
var imageGetStamp = new Image();
var imageNotStamp = new Image();

// URL を指定して、画像の読み込みを開始する
imageGetStamp.src = "./img/star1.png";
imageNotStamp.src = "./img/star2.png";


function draw(){
    var canvas = document.getElementById('stamp');
    var imagePrint;
    
    var i,j;
    
    //スタンプリスト
    var stampList = [
        [1,1,0],
        [0,0,0],
        [1,1,1],
        [1,0,1]
    ]
    
    //場所の名前
    var placeName = [
        ["東京","大阪","愛知"],
        ["福岡","広島","札幌"],
        ["仙台","京都","愛媛"],
        ["熊本","千葉","沖縄"]
    ]
    
    //画像サイズ
    var imgSize = 100;
    //四角形のサイズ
    var rectSize = 100;
    
    //localStorage.setItem("stampList", JSON.stringify("stampList"));
    //stampList = localStorage.getItem("stampListStore");
    
    if (canvas.getContext){
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#3399FF';
        ctx.strokeStyle = "white";
        ctx.font = "12px 'Sawarabi Gothic'";
                    
        for(i = 0; i < 4; i++){
            for(j = 0; j < 3; j++){
                
                if(stampList[i][j] == 0)
                    imagePrint = imageGetStamp;
                else
                    imagePrint = imageNotStamp;
                                
//              ctx.fillRect(rectSize*j,rectSize*i,rectSize,rectSize);
                ctx.drawImage(imagePrint,imgSize*j,imgSize*i,imgSize,imgSize);
                ctx.strokeText(placeName[i][j], imgSize*j+38, imgSize*i+60);
            }
        }
        
    }
}