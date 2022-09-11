<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>pixi-game</title>
        <link rel="stylesheet" href="./assets/bundle.css">

				<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.3.0/pixi.js"></script>
  </head>
  <body>
    <h1>pixi-game</h1>
    <canvas class="stage" id="stage"></canvas>

	<p><a href="#" id="downloadlink" style="display:none;">ダウンロード</a></p>
    <script>
      let action = {{.Action}};
      let element = {{.Element}};
      let username = {{.UserName}};
      let date = {{.Date}};
      </script> 
        <script>
		
const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const suffix = ".png";
async function record()
{
	var recorder;
	//canvasの取得
	canvas = document.getElementsByTagName('canvas')[0];
	ctx = canvas.getContext('2d');
	//canvasからストリームを取得
	var stream = canvas.captureStream();
	//ストリームからMediaRecorderを生成
	recorder = new MediaRecorder(stream, {mimeType:'video/webm;codecs=vp9'});
	//ダウンロード用のリンクを準備
	var anchor = document.getElementById('downloadlink');
	//録画終了時に動画ファイルのダウンロードリンクを生成する処理
	 recorder.ondataavailable = function(e) {
			var videoBlob = new Blob([e.data], { type: e.data.type });
			blobUrl = window.URL.createObjectURL(videoBlob);
			anchor.download = username + date +'webm';
			anchor.href = blobUrl;
			anchor.style.display = 'block';
			var videoFile = new File([e.data], anchor.download, { type: e.data.type });
			console.log("url: ", blobUrl);
			console.log("find me3");
			var oReq = new XMLHttpRequest();
			console.log("file_name: ", videoFile.name);
			oReq.open("POST", "/thumbnail", true);
			oReq.onload = function (oEvent) {
  // Uploaded.
};
oReq.send(videoFile);
			//録画開始
	}
	recorder.start();
	console.log("record: start");
	return(recorder);
}
function makeCharactor(name)
{
	let json;
return fetch("/img/" + name + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
console.log(json);
let ttCharactor = [];
for(let i = 1; i <= json.length; i++)
{
ttCharactor.push(PIXI.Texture.fromImage('./img/' + json.name + '/' +json.name + i + suffix));
}
var return_obj;
let mvCharactor = new PIXI.extras.AnimatedSprite(ttCharactor);

console.log(mvCharactor);
mvCharactor.play();
mvCharactor.animationSpeed = 0.1;
mvCharactor.height = 100;
mvCharactor.width = 100;
mvCharactor.position.set(100, 100);
return mvCharactor;
});
};
async function MoveOnCurve(sprite, deltax, deltay, height, num)
{
	let median = (num - 1) / 2;
	let starty = sprite.position.y;
	for (let i = 0; i < num; i++)
	{
		await _sleep(50);
		sprite.position.x += deltax / num;
		sprite.position.y = deltay / num  -(height / (median * median) ) * (i - median) * (i - median) + height + starty;
		console.log("i", i, "y", sprite.position.y);
	}
}
async function MoveOnCircle(sprite, deltax, deltay, height, num)
{
	rotate_theta = Math.atan(deltay / deltax);
	let x = (theta) => height * Math.cos(theta);
	let y = (theta) => Math.sqrt(Math.pow(deltax, 2)  + Math.pow(deltay, 2)) / 2 * Math.sin(theta);
	let X = (theta) => Math.cos(rotate_theta) * x(theta) - Math.sin(rotate_theta) * y(theta);
	let Y = (theta) => Math.sin(rotate_theta) * x(theta) + Math.cos(rotate_theta) * y(theta);
	let startx = sprite.position.x;
	let starty = sprite.position.y;
	for (let i = 0; i < num; i++)
	{
		let theta = - Math.PI / num * i;
		await _sleep(50);

		sprite.position.x = startx + X(theta);
		sprite.position.y = starty + Y(theta);

	}
}
async function Move(sprite, deltax, deltay, num)
{
	for (let i = 0; i < num; i++)
	{
		await _sleep(50);
		sprite.position.x += deltax / num;
		sprite.position.y += deltay / num;
	}
}
async function MoveOnZigzag(sprite, deltax, deltay, num)
{
	let startx = sprite.position.x;
	let starty = sprite.position.y;
	
	for(let i = 0;i < num; i++)
	{
	await Move(sprite, deltax, 0, 15);
	await Move(sprite, -deltax, deltay / num, 15);
	}
	await Move(sprite, deltax, 0, 15);
}
async function Rotate(sprite, deltaangle, num)
{
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
	let startx = sprite.position.x;
	let starty = sprite.position.y;
	let starttheta = sprite.rotation;
	let deltatheta = deltaangle / 360 * 2 * Math.PI;
	for(let i = 0; i < num; i++)
	{
		sprite.rotation += deltatheta / num;
		await _sleep(50);
	}
}
async function fadeOut(sprite, cb) {
	sprite.alpha = sprite.alpha - 0.05;
	if (sprite.alpha <= 0) {
			sprite.visible = false;
			return cb && cb(null);
	}
	await _sleep(50);
	await fadeOut(sprite, cb);
	/*
	setTimeout(() => {
			fadeOut(sprite, cb);
	}, 100);
	*/
}
async function fadeIn(sprite, cb) {
	sprite.alpha = sprite.alpha + 0.05;
	console.log(sprite.alpha);
	sprite.visible = true;
	if (sprite.alpha >= 1) {
			return cb && cb(null);
	}
	await _sleep(50);
	await fadeIn(sprite, cb);
	/*
	setTimeout(() => {
			fadeOut(sprite, cb);
	}, 100);
	*/
}
async function Swap(sprite1, sprite2, cb) {
	sprite1.alpha = sprite1.alpha - 0.1;
	//sprite2.alpha = 1 - sprite1.aplha;
	if (sprite1.alpha <= 0) {
			sprite1.visible = false;
			sprite2.visible = true;
			return cb && cb(null);
	}
	await _sleep(300);
	await Swap(sprite1, sprite2, cb);
	/*
	setTimeout(() => {
			Swap(sprite1, sprite2, cb);
	}, 300);
	*/
}

async function Ride(args, stage)
{
	let element = args[0];
	let json;
	await fetch("/img/materials_png/" + "girl" + "/config.json")
	.then(response => response.json())
	.then(data => {
			json = data;
	});
	
	let ttCharactor = [];
	
	for(let i = 1; i <= json.length; i++)
	{
	ttCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + suffix));
	}
	
	let mvCharactor = new PIXI.extras.AnimatedSprite(ttCharactor);
	mvCharactor.play();
	mvCharactor.animationSpeed = 0.1;
	mvCharactor.height = 100;
	mvCharactor.width = 100;
	mvCharactor.position.set(200, 100);
	
	await fetch("/img/materials_png/" + element + "/config.json")
	.then(response => response.json())
	.then(data => {
			json = data;
	});
	
	let tteleCharactor = [];
	for(let i = 1; i <= json.length; i++)
	{
	tteleCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
	}
	
	let eleCharactor = new PIXI.extras.AnimatedSprite(tteleCharactor);
	//eleCharactor.play();
	eleCharactor.animationSpeed = 0.1;
	eleCharactor.height = 100;
	eleCharactor.width = 100;

	mvCharactor.position.set(160, 120);
	eleCharactor.position.set(420, 120);


	stage.addChild(eleCharactor, mvCharactor);

/*キャラの移動*/
/*
for (let i = 0; i < 5; i++)
{
	await _sleep(500);
	mvCharactor.position.x += 30;
}
*/
await Move(mvCharactor, 200, 0, 50);
await fadeOut(mvCharactor, );
await eleCharactor.play();
await Move(eleCharactor, -300, 0, 50);
await fadeOut(eleCharactor, );

}

async function Run(args, stage)
{
	let json;
await fetch("/img/materials_png/" + "girl" + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let ttCharactor = [];

for(let i = 1; i <= json.length; i++)
{
ttCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + suffix));
}

let mvCharactor = new PIXI.extras.AnimatedSprite(ttCharactor);
mvCharactor.play();
mvCharactor.animationSpeed = 0.1;
mvCharactor.height = 100;
mvCharactor.width = 100;
mvCharactor.position.set(200, 100);

stage.addChild(mvCharactor);

/*キャラの移動*/
await Move(mvCharactor, 300, 0, 50);
await fadeOut(mvCharactor);
}

async function Eat(args, stage)
{
	let element = args[0];
	let json;
	await fetch("/img/materials_png/" + "girl" + "/config.json")
	.then(response => response.json())
	.then(data => {
			json = data;
	});
	
	let ttCharactor = [];
	
	for(let i = 1; i <= json.length; i++)
	{
	ttCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + suffix));
	}
	
	let mvCharactor = new PIXI.extras.AnimatedSprite(ttCharactor);
	//mvCharactor.play();
	mvCharactor.animationSpeed = 0.1;
	mvCharactor.height = 100;
	mvCharactor.width = 100;
	
	await fetch("/img/materials_png/" + element + "/config.json")
	.then(response => response.json())
	.then(data => {
			json = data;
	});
	
	let tteleCharactor = [];
	for(let i = 1; i <= json.length; i++)
	{
	tteleCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
	}
	
	let eleCharactor = new PIXI.extras.AnimatedSprite(tteleCharactor);
	eleCharactor.play();
	eleCharactor.animationSpeed = 0.1;
	eleCharactor.height = 100;
	eleCharactor.width = 100;

mvCharactor.position.set(160, 120);
eleCharactor.position.set(420, 120);


stage.addChild(eleCharactor, mvCharactor);

await MoveOnCurve(eleCharactor, -240, 0, -100, 50);
await fadeOut(eleCharactor, );

}

async function Debug(args, stage)
{
let element = args[0];
let json;
await fetch("/img/materials_png/" + "girl" + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let ttCharactor = [];

for(let i = 1; i <= json.length; i++)
{
ttCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + suffix));
}

let mvCharactor = new PIXI.extras.AnimatedSprite(ttCharactor);
mvCharactor.play();
mvCharactor.animationSpeed = 0.1;
mvCharactor.height = 100;
mvCharactor.width = 100;

await fetch("/img/materials_png/" + element + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let tteleCharactor = [];
for(let i = 1; i <= json.length; i++)
{
tteleCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
}

let eleCharactor = new PIXI.extras.AnimatedSprite(tteleCharactor);
eleCharactor.play();
eleCharactor.animationSpeed = 0.1;
eleCharactor.height = 100;
eleCharactor.width = 100;
eleCharactor.visible = false;

mvCharactor.position.set(240, 120);
eleCharactor.position.set(240, 120);
stage.addChild(mvCharactor, eleCharactor);


await Swap(mvCharactor, eleCharactor, );
}
async function Draw(args, stage)
{
	let json;
await fetch("/img/materials_png/" + "girl" + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let ttCharactor = [];

for(let i = 1; i <= json.length; i++)
{
ttCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + suffix));
}

let mvCharactor = new PIXI.extras.AnimatedSprite(ttCharactor);
//mvCharactor.play();
mvCharactor.animationSpeed = 0.1;
mvCharactor.height = 100;
mvCharactor.width = 100;


await fetch("/img/materials_png/" + element + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let tteleCharactor = [];
for(let i = 1; i <= json.length; i++)
{
tteleCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
}

let eleCharactor = new PIXI.extras.AnimatedSprite(tteleCharactor);
eleCharactor.play();
eleCharactor.animationSpeed = 0.1;
eleCharactor.height = 100;
eleCharactor.width = 100;


let effect = "pencil";
await fetch("/img/materials_png/" + effect + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let tteffCharactor = [];
for(let i = 1; i <= json.length; i++)
{
tteffCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
}

let effCharactor = new PIXI.extras.AnimatedSprite(tteffCharactor);
effCharactor.play();
effCharactor.animationSpeed = 0.1;
effCharactor.height = 100;
effCharactor.width = 100;

mvCharactor.position.set(160, 120);
eleCharactor.position.set(420, 120);
effCharactor.position.set(420, 40);
eleCharactor.alpha = 0;

stage.addChild(mvCharactor, eleCharactor, effCharactor);
//await MoveOnCircle(effCharactor,100, 200, -30, 50);
await MoveOnZigzag(effCharactor, 100, 100, 3);
await fadeOut(effCharactor,);
await fadeIn(eleCharactor,);
}
async function Play(args, stage)
{
	let json;
await fetch("/img/materials_png/" + "girl" + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let ttCharactor = [];

for(let i = 1; i <= json.length; i++)
{
ttCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + suffix));
}

let mvCharactor = new PIXI.extras.AnimatedSprite(ttCharactor);
mvCharactor.play();
mvCharactor.animationSpeed = 0.1;
mvCharactor.height = 100;
mvCharactor.width = 100;


await fetch("/img/materials_png/" + element + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let tteleCharactor = [];
for(let i = 1; i <= json.length; i++)
{
tteleCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
}

let eleCharactor = new PIXI.extras.AnimatedSprite(tteleCharactor);
eleCharactor.play();
eleCharactor.animationSpeed = 0.1;
eleCharactor.height = 100;
eleCharactor.width = 100;

mvCharactor.position.set(240, 120);
eleCharactor.position.set(240, 120);
eleCharactor.visible = false;


stage.addChild(mvCharactor, eleCharactor);
await Swap(mvCharactor, eleCharactor, );
}
async function GetUp(args, stage)
{
//主人公オブジェクト生成部
let json;
await fetch("/img/materials_png/" + "girl" + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let ttCharactor = [];

for(let i = 1; i <= json.length; i++)
{
ttCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + suffix));
}
let mvCharactor = new PIXI.extras.AnimatedSprite(ttCharactor);
//mvCharactor.play();
mvCharactor.animationSpeed = 0.1;
mvCharactor.height = 100;
mvCharactor.width = 100;
//主人公オブジェクト生成部終了
//kiraオブジェクト生成部開始
let kira = "kirakira";
await fetch("/img/materials_png/" + kira + "/config.json")
	.then(response => response.json())
	.then(data => {
			json = data;
	});
	
	let ttkiraCharactor = [];
	for(let i = 1; i <= json.length; i++)
	{
	ttkiraCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
	}
	
	let kiraCharactor = new PIXI.extras.AnimatedSprite(ttkiraCharactor);
	kiraCharactor.play();
	kiraCharactor.animationSpeed = 0.1;
	kiraCharactor.height = 100;
	kiraCharactor.width = 100;
//kiraオブジェクト生成部終了

//clockオブジェクト生成部開始
let clock = "wake-up_watch";
await fetch("/img/materials_png/" + clock + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let ttclockCharactor = [];
for(let i = 1; i <= json.length; i++)
{
ttclockCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
}

let clockCharactor = new PIXI.extras.AnimatedSprite(ttclockCharactor);
clockCharactor.play();
clockCharactor.animationSpeed = 0.1;
clockCharactor.height = 100;
clockCharactor.width = 100;
//clockオブジェクト生成部終了

//zzzオブジェクト生成部開始
let zzz = "zzz";
await fetch("/img/materials_png/" + zzz + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let ttzzzCharactor = [];
for(let i = 1; i <= json.length; i++)
{
ttzzzCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
}

let zzzCharactor = new PIXI.extras.AnimatedSprite(ttzzzCharactor);
zzzCharactor.play();
zzzCharactor.animationSpeed = 0.1;
zzzCharactor.height = 100;
zzzCharactor.width = 100;
//zzオブジェクト生成部終了

mvCharactor.position.set(240, 180);
kiraCharactor.position.set(120, 100);
clockCharactor.position.set(360, 10);
zzzCharactor.position.set(200, 30);
kiraCharactor.alpha = 0;
clockCharactor.alpha = 0;

stage.addChild(mvCharactor, kiraCharactor, clockCharactor, zzzCharactor);

//アニメーション
mvCharactor.anchor.x = 0.5;
mvCharactor.anchor.y = 0.5;
mvCharactor.rotation -= Math.PI / 2;
await fadeIn(clockCharactor, );
await fadeOut(zzzCharactor,);
await Rotate(mvCharactor, 90, 20);
clockCharactor.stop();
await fadeIn(kiraCharactor, );
}
async function Sleep(args, stage)
{
//主人公オブジェクト生成部
let json;
await fetch("/img/materials_png/" + "girl" + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let ttCharactor = [];

for(let i = 1; i <= json.length; i++)
{
ttCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + suffix));
}
let mvCharactor = new PIXI.extras.AnimatedSprite(ttCharactor);
//mvCharactor.play();
mvCharactor.animationSpeed = 0.1;
mvCharactor.height = 100;
mvCharactor.width = 100;
//主人公オブジェクト生成部終了
//kiraオブジェクト生成部開始
let kira = "kirakira";
await fetch("/img/materials_png/" + kira + "/config.json")
	.then(response => response.json())
	.then(data => {
			json = data;
	});
	
	let ttkiraCharactor = [];
	for(let i = 1; i <= json.length; i++)
	{
	ttkiraCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
	}
	
	let kiraCharactor = new PIXI.extras.AnimatedSprite(ttkiraCharactor);
	kiraCharactor.play();
	kiraCharactor.animationSpeed = 0.1;
	kiraCharactor.height = 100;
	kiraCharactor.width = 100;
//kiraオブジェクト生成部終了

//clockオブジェクト生成部開始
let clock = "wake-up_watch";
await fetch("/img/materials_png/" + clock + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let ttclockCharactor = [];
for(let i = 1; i <= json.length; i++)
{
ttclockCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
}

let clockCharactor = new PIXI.extras.AnimatedSprite(ttclockCharactor);
clockCharactor.play();
clockCharactor.animationSpeed = 0.1;
clockCharactor.height = 100;
clockCharactor.width = 100;
//clockオブジェクト生成部終了

//zzzオブジェクト生成部開始
let zzz = "zzz";
await fetch("/img/materials_png/" + zzz + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let ttzzzCharactor = [];
for(let i = 1; i <= json.length; i++)
{
ttzzzCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
}

let zzzCharactor = new PIXI.extras.AnimatedSprite(ttzzzCharactor);
zzzCharactor.play();
zzzCharactor.animationSpeed = 0.1;
zzzCharactor.height = 100;
zzzCharactor.width = 100;
//zzオブジェクト生成部終了

mvCharactor.position.set(240, 180);
kiraCharactor.position.set(120, 100);
clockCharactor.position.set(360, 10);
zzzCharactor.position.set(200, 30);
kiraCharactor.alpha = 0;
clockCharactor.alpha = 0;
zzzCharactor.alpha = 0;

stage.addChild(mvCharactor, kiraCharactor, clockCharactor, zzzCharactor);

//アニメーション
mvCharactor.anchor.x = 0.5;
mvCharactor.anchor.y = 0.5;
mvCharactor.stop();
await Rotate(mvCharactor, -90, 20);
clockCharactor.stop();
await fadeIn(zzzCharactor, );
}
async function Watch(args, stage)
{
	let element = args[0];
	let json;
	await fetch("/img/materials_png/" + "girl" + "/config.json")
	.then(response => response.json())
	.then(data => {
			json = data;
	});
	
	let ttCharactor = [];
	
	for(let i = 1; i <= json.length; i++)
	{
	ttCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + suffix));
	}
	
	let mvCharactor = new PIXI.extras.AnimatedSprite(ttCharactor);
	//mvCharactor.play();
	mvCharactor.animationSpeed = 0.1;
	mvCharactor.height = 100;
	mvCharactor.width = 100;
	mvCharactor.position.set(200, 100);
	
	await fetch("/img/materials_png/" + element + "/config.json")
	.then(response => response.json())
	.then(data => {
			json = data;
	});
	
	let tteleCharactor = [];
	for(let i = 1; i <= json.length; i++)
	{
	tteleCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
	}
	
	let eleCharactor = new PIXI.extras.AnimatedSprite(tteleCharactor);
	eleCharactor.play();
	eleCharactor.animationSpeed = 0.1;
	eleCharactor.height = 100;
	eleCharactor.width = 100;

	let tv = "tv";
	await fetch("/img/materials_png/" + tv + "/config.json")
	.then(response => response.json())
	.then(data => {
			json = data;
	});
	
	let tttvCharactor = [];
	for(let i = 1; i <= json.length; i++)
	{
	tttvCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
	}
	
	let tvCharactor = new PIXI.extras.AnimatedSprite(tttvCharactor);
	tvCharactor.play();
	tvCharactor.animationSpeed = 0.1;
	tvCharactor.height = 240;
	tvCharactor.width = 240;

	mvCharactor.position.set(160, 120);
	tvCharactor.position.set(380, 60);
	eleCharactor.position.set(440, 90);

	


	stage.addChild(mvCharactor, tvCharactor, eleCharactor);

/*キャラの移動*/
/*
for (let i = 0; i < 5; i++)
{
	await _sleep(500);
	mvCharactor.position.x += 30;
}
*/

}
async function Buy(args, stage)
{
	let json;
await fetch("/img/materials_png/" + "girl" + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let ttCharactor = [];

for(let i = 1; i <= json.length; i++)
{
ttCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + suffix));
}

let mvCharactor = new PIXI.extras.AnimatedSprite(ttCharactor);
//mvCharactor.play();
mvCharactor.animationSpeed = 0.1;
mvCharactor.height = 100;
mvCharactor.width = 100;


await fetch("/img/materials_png/" + element + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let tteleCharactor = [];
for(let i = 1; i <= json.length; i++)
{
tteleCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
}

let eleCharactor = new PIXI.extras.AnimatedSprite(tteleCharactor);
eleCharactor.play();
eleCharactor.animationSpeed = 0.1;
eleCharactor.height = 100;
eleCharactor.width = 100;


let effect = "money2";
await fetch("/img/materials_png/" + effect + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let tteffCharactor = [];
for(let i = 1; i <= json.length; i++)
{
tteffCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
}

let effCharactor = new PIXI.extras.AnimatedSprite(tteffCharactor);
//effCharactor.play();
effCharactor.animationSpeed = 0.1;
effCharactor.height = 100;
effCharactor.width = 100;

mvCharactor.position.set(160, 120);
eleCharactor.position.set(420, 120);
effCharactor.position.set(180, 120);
eleCharactor.alpha = 0;

stage.addChild(mvCharactor, eleCharactor, effCharactor);
//await MoveOnCircle(effCharactor,100, 200, -30, 50);
await MoveOnCurve(effCharactor, 270, 120, -100, 50);
await fadeOut(effCharactor,);
await fadeIn(eleCharactor,);
}

async function Study(args, stage)
{
	let json;
await fetch("/img/materials_png/" + "girl" + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let ttCharactor = [];

for(let i = 1; i <= json.length; i++)
{
ttCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + suffix));
}

let mvCharactor = new PIXI.extras.AnimatedSprite(ttCharactor);
//mvCharactor.play();
mvCharactor.animationSpeed = 0.1;
mvCharactor.height = 100;
mvCharactor.width = 100;


await fetch("/img/materials_png/" + element + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let tteleCharactor = [];
for(let i = 1; i <= json.length; i++)
{
tteleCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
}

let eleCharactor = new PIXI.extras.AnimatedSprite(tteleCharactor);
eleCharactor.play();
eleCharactor.animationSpeed = 0.1;
eleCharactor.height = 100;
eleCharactor.width = 100;


let hatena = "hatena";
await fetch("/img/materials_png/" + hatena + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let tthateCharactor = [];
for(let i = 1; i <= json.length; i++)
{
tthateCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
}

let hateCharactor = new PIXI.extras.AnimatedSprite(tthateCharactor);
//effCharactor.play();
hateCharactor.animationSpeed = 0.1;
hateCharactor.height = 100;
hateCharactor.width = 100;

mvCharactor.position.set(160, 120);
eleCharactor.position.set(420, 120);
hateCharactor.position.set(180, 120);

let bikkuri = "bikkuri";
await fetch("/img/materials_png/" + bikkuri + "/config.json")
.then(response => response.json())
.then(data => {
		json = data;
});

let ttbikkuCharactor = [];
for(let i = 1; i <= json.length; i++)
{
ttbikkuCharactor.push(PIXI.Texture.fromImage('./img/materials_png/' + json.name + '/' +json.name + i + ".png"));
}

let bikkuCharactor = new PIXI.extras.AnimatedSprite(ttbikkuCharactor);
//effCharactor.play();
bikkuCharactor.animationSpeed = 0.1;
bikkuCharactor.height = 100;
bikkuCharactor.width = 100;
bikkuCharactor.alpha = 0;

mvCharactor.position.set(160, 120);
eleCharactor.position.set(420, 120);
hateCharactor.position.set(160, 20);
bikkuCharactor.position.set(160, 20);

stage.addChild(mvCharactor, eleCharactor, hateCharactor, bikkuCharactor);
//await MoveOnCircle(effCharactor,100, 200, -30, 50);
await fadeOut(hateCharactor,);
await fadeIn(bikkuCharactor,);


}

(async function () {
  // ここにコアな処理
  // ここにコアな処理
  // ここにコアな処理
	/**
		* STEP.1 元となるコンテナを用意。画面に描画される要素は全てこの下にぶら下がる
		*/
	var stage = new PIXI.Container();

	/**
		* STEP.2 描画するためのレンダラーを用意。引数は描画領域の幅、高さ、オプション
		*/
	var renderer = PIXI.autoDetectRenderer(640, 480, {
			antialias:        true,     // アンチエイリアスをONに
			backgroundColor : 0x00ffd4, // 背景色
			//  transparent:      true,     // 背景を透過にしたい場合はこちらを指定
	});

	/**
		* STEP.3 #stage のDOM要素に view を追加
		*/
document.getElementById('stage').appendChild(renderer.view);

	/**
		* animation関数を定義
		*/
	var animation = function () {
			// 再帰的に次のアニメーションフレームで animation関数を呼び出す
			requestAnimationFrame(animation);

			// 描画
			renderer.render(stage);
	};

	/**
		* animation関数を呼び出す
		*/
	animation();

	var recorder;
	//canvasの取得
	canvas = document.getElementsByTagName('canvas')[0];
	ctx = canvas.getContext('2d');
	//canvasからストリームを取得
	var stream = canvas.captureStream();
	//ストリームからMediaRecorderを生成
	recorder = new MediaRecorder(stream, {mimeType:'video/webm;codecs=vp9'});
	//ダウンロード用のリンクを準備
	var anchor = document.getElementById('downloadlink');
	console.log("anchor: ", anchor);
	//録画終了時に動画ファイルのダウンロードリンクを生成する処理
	 recorder.ondataavailable = function(e) {
			console.log("終了時の処理 start");
			var videoBlob = new Blob([e.data], { type: e.data.type });
			console.log("type = ", e.data.type);
			blobUrl = window.URL.createObjectURL(videoBlob);
			console.log("url: ", blobUrl);
			anchor.download = username + date +'.webm';
			anchor.href = blobUrl;
			anchor.style.display = 'block';
			var videoFile = new File([anchor.download.length + 2,anchor.download, e.data], anchor.download, { type: e.data.type });
			var oReq = new XMLHttpRequest();
			oReq.open("POST", "/save-movie", true);
			oReq.onload = function (oEvent) {
  // Uploaded.
};
console.log("check:",["header",videoFile]);
oReq.send(videoFile);
console.log("send successfully videos");
			//録画開始
	}
	recorder.start();
	console.log("record: start");
	const action_l = action.split(",");
	const element_l= element.split(",");

	console.log("action: start");

for(let i = 0; i < action_l.length; i++)
{
	console.log(action_l[i]);
	switch(action_l[i])
	{
		case "run":
			await Run([], stage);
			break;
		case "ride":
			await Ride([element_l[i]], stage);
			break;
		case "play":
			await Play([element_l[i]], stage);
			break;
		case "debug":
				await Debug([element_l[i]], stage);
				break;
		case "eat":
			await Eat([element_l[i]], stage);
			break;
		case "draw":
			await Draw([element_l[i]], stage);
			break;
		case "getup":
			await GetUp([element_l[i]], stage);
			break;
		case "sleep":
			await Sleep([element_l[i]], stage);
			break;
		case "watch":
			await Watch([element_l[i]], stage);
			break;
		case "buy":
			await Buy([element_l[i]], stage);
			break;
		case "practice":
			await Play([element_l[i]], stage);
			break;
		case "study":
			await Study([element_l[i]], stage);
			break;
	}
}
console.log("record: stop");
recorder.stop();
}());
</script>
  </body>
</html>
