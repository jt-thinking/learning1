






// 获取元素
var banner=document.getElementById("banner");
var slide1=document.getElementById("slide1");
var slide2=document.getElementById("slide2");
var slide3=document.getElementById("slide3");
var n=1;

function changeBanner(){
	
	//用num++自增
	//用if判断重新清零
	n++;
	if (n>3){
		n=n-3;
	}
	if(n==1){
	slide1.className="banner-slide slide";
	slide2.className="banner-slide slide2 slide-active";
	}
	if(n==2){
	slide2.className="banner-slide slide2";
	slide3.className="banner-slide slide3 slide-active";
	}
	if(n==3){
	slide3.className="banner-slide slide3";
	slide1.className="banner-slide slide1 slide-active";
	}
	

}
var changeBannerId=null;

changeBannerId=setInterval(changeBanner,1000);

//鼠标离开时开始轮播
banner.onmouseout=function(){
	changeBannerId=setInterval(changeBanner,1000);
	console.log(changeBannerId);
}
//鼠标停留时暂停轮播
banner.onmouseover=function(){
	clearInterval(changeBannerId);
}

// 间歇调用