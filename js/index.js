// set and cache variables
var w, container, carousel, item, radius, itemLength, rY, ticker, fps, debug;
var rtHold = (window.innerHeight * .5) * .007
var mouseX = 0;
var mouseY = 0;
var mouseZ = 0;
var scaleZ = -1200;
var addX = 0,addY=0;
var currentType= -1;

// fps counter created by: https://gist.github.com/sharkbrainguy/1156092,
// no need to create my own :)
var fps_counter = {

    tick: function () {
        // this has to clone the array every tick so that
        // separate instances won't share state 
        this.times = this.times.concat(+new Date());
        var seconds, times = this.times;

        if (times.length > this.span + 1) {
            times.shift(); // ditch the oldest time
            seconds = (times[times.length - 1] - times[0]) / 1000;
            return Math.round(this.span / seconds);
        }
        else return null;
    },

    times: [],
    span: 20
};
var counter = Object.create(fps_counter);



$(document).ready(begininit)

var datas = [".avatars", ".warriors", ".paladins", ".archers", ".hunters", ".wizards", ".priests"];
function begininit() {
    var hash = window.location.hash;
    var search = window.location.search;
    if (hash == "" || hash == "#") {
        if (search == "" || search == "?") {
            hash = ".warriors";
        } else {
            hash = "." + search.substr(0, search.length - 1);
        }
    } else {
        hash = "." + hash.substr(1, hash.length - 1);
    }
    var suc=false;
    for (var i = 0; i < datas.length;i++) {
        if (hash == datas[i]) {
            afocus(i);
            suc=true;
            break;
        }
    }
    if(!suc){
        afocus(1);
    }
    // if (hash == datas[0]) {
    //     reinit(null, true);
    // } else {
    //     reinit($(hash));
    // }
}
function reinit(heros, all) {
    if (all) {
        var ihtml = "";
        for (var i = 1; i < datas.length;i++){
            ihtml+=$(datas[i]).html();
        }
        scaleZ = -7200;
        $('#carouselContainer').html(ihtml);
        init(datas[0]);
    } else {
        scaleZ = -1200;
        $('#carouselContainer').html(heros[0].innerHTML);
        var search = "." + heros[0].className;
        init(search.substr(0, search.length - 1));
    }
}

function init(cla) {
    w = $(window);
    container = $('#contentContainer');
    carousel = $('#carouselContainer');
    item = $(cla);
    itemLength = item.length / 2;
    fps = $('#fps');
    debug = $('#debug');
    rY = 360 / itemLength;
    radius = Math.round((250) / Math.tan(Math.PI / itemLength));
    radius = radius;
    // set container 3d props
    TweenMax.set(container, { perspective: 600 })
    TweenMax.set(carousel, { z: -(radius) })

    // create carousel item props

    for (var i = 0; i < itemLength; i++) {
        var $item = item.eq(i);
        var $block = $item.find('.carouselItemInner');

        //thanks @chrisgannon!        
        TweenMax.set($item, { rotationY: rY * i, z: radius, transformOrigin: "50% 50% " + -radius + "px" });

        animateIn($item, $block)
    }

    // set mouse x and y props and looper ticker
    window.onmousewheel = onMouseWheel;
    window.onmousedown = onMouseDown;
    window.onmousemove = onMouseMove;
    window.onmouseup = onMouseUp;
    if (window.addEventListener) {
        document.addEventListener('DOMMouseScroll', onMouseWheel, false);
    } 
    window.ontouchstart=onMouseDown;
    window.ontouchmove=onMouseMove;
    window.ontouchend=onMouseUp;   
    ticker = setInterval(looper, 1000 / 60);
    v = 0.075;
}

function animateIn($item, $block) {
    var $nrX = 360 * getRandomInt(2);
    var $nrY = 360 * getRandomInt(2);

    var $nx = -(2000) + getRandomInt(4000);
    var $ny = -(2000) + getRandomInt(4000);
    var $nz = -4;
    000 + getRandomInt(4000);

    var $s = 1.5 + (getRandomInt(10) * .1);
    var $d = 1 - (getRandomInt(8) * .1);

    TweenMax.set($item, { autoAlpha: 1, delay: $d })
    TweenMax.set($block, { z: $nz, rotationY: $nrY, rotationX: $nrX, x: $nx, y: $ny, autoAlpha: 0 })
    TweenMax.to($block, $s, { delay: $d, rotationY: 0, rotationX: 0, z: 0, ease: Expo.easeInOut })
    TweenMax.to($block, $s - .5, { delay: $d, x: 0, y: 0, autoAlpha: 1, ease: Expo.easeInOut })
}
var md = false, changeType = false;
var mdx = 0, mdy = 0, xx = 0, yy = 0, v = 0.05;
var mdms;
function onMouseDown(event) {
    md = true;
    mdx = event.pageX;
    mdy = event.pageY;
    mdms = new Date();
    v = 0;
    //onMouseMove(event);
}
function onMouseUp(event) {
    md = false;
    mdx = 0;
    if (!changeType) {
        mouseX += xx;
        mouseY += yy;
        v = (xx / (new Date() - mdms) * 10);
        if (isNaN(v)) {
            v = 100;
        }
    }
    changeType = false;
    xx = 0;
    yy = 0;
}
function onMouseMove(event) {
    if (!changeType) {
        if (md) {
            //mouseX = -(-(window.innerWidth * .5) + event.pageX) * .000075;
            var t = event.pageX - mdx;
            //sinA=A/2R;
            t = Math.asin(t / (2 * (scaleZ)));
            xx = (2 * 3.14 * scaleZ * t / 360) * 1.5 * 3;
            t = event.pageY - mdy;
            t = Math.asin(t / (2 * (scaleZ)));
            yy = -(2 * 3.14 * scaleZ * t / 360) * 3 * 3;
            addY = yy;
            //mouseY = 2 *(window.innerHeight * .5) * .007;
            //if (event.pageX < window.innerWidth / 8) {
            //    mouseZ = -(-(window.innerHeight * .5) + event.pageY) * .08;
            //}
            //else if (event.pageX > window.innerWidth * 7 / 8) {
            //    mouseZ = (-(window.innerHeight * .5) + event.pageY) * .08;
            //} else {
            //    mouseY = -(-(window.innerHeight * .5) + event.pageY) * .02;
            //}
            //yy = -(-(window.innerHeight * .5) + event.pageY) * .07;
            
        }
    }
    //scaleZ = -(radius) - (Math.abs(-(window.innerHeight * .5) + event.pageY) - 200);
}
function onMouseWheel(event) {
    var del = event.wheelDelta, fix = 100;
    if (del) {
        if (del < 0)
            del = -fix;
        else {
            del = fix;
        }
    } else {
        del = event.detail;
        if (del < 0)
            del = fix;
        else {
            del = -fix;
        }
    }
    scaleZ += del;
}
function afocus(type) {
    if(currentType==type){
        return false;
    }
    currentType=type;
    changeType = true;
    var items=$(".avatar_type li a");
    var len= items.length;
    for(var i=0;i<len;i++){
        var item = items.eq(i);
        item[0].className="";
        if((type+6)%7==i){
            item[0].className="on";
        }
    }
    if (type > 0) {
        reinit($(datas[type]));
    } else {
        reinit(null, true);
    }
    changeType = false;
}
// loops and sets the carousel 3d properties
function looper() {
    mouseX += v;
    if (!md) {
        var hold = 0.075;
        if (v > hold) {
            v -= 0.0005*(Math.abs(v)/hold);//速度衰减
            if (v < hold)
                v = hold;
        } else if (v < -hold) {
            v += 0.0005 * (Math.abs(v) / hold);
            if (v > -hold) {
                v = -hold;
            }
        } else {
            //旋转不许停止
            //if (v > 0)
            //    v = hold;
            //else
            //    v = -hold;
        }
    }
    if (isNaN(mouseX))
    {
        mouseX = 0;
    }
    addX = mouseX + xx;    
    //addY = mouseY + yy;
    if (!md) {
        //mouseY = -Math.cos(addX * 3.14159 / 180) * rtHold;
        //mouseZ = -Math.sin(addX * 3.14159 / 180) * rtHold;
    }
    /*addX= 当前位置 + 相对偏移 */
    TweenMax.to(carousel, 1, { rotationY: addX, rotationX: addY, rotationZ: mouseZ, ease: Quint.easeOut })
    TweenMax.set(carousel, { z: scaleZ })
    fps.text('Framerate: ' + counter.tick() + '/60 FPS')
    debug.html('X: ' + addX.toFixed(5) + '<br />' + 'Y: ' + mouseY.toFixed(5) + '<br />' + 'Z: ' + mouseZ.toFixed(5) + '<br />' + 'V: ' + v.toFixed(5) + '<br />scaleZ:' + scaleZ);
}

function getRandomInt($n) {
    return Math.floor((Math.random() * $n) + 1);
}
window.onload = function () {
    with (document.body) {
        oncontextmenu = function () { return false }
        ondragstart = function () { return false }
        onselectstart = function () { return false }
        onbeforecopy = function () { return false }
        onselect = function () { document.selection.empty() }
        oncopy = function () { document.selection.empty() }
    }
}
