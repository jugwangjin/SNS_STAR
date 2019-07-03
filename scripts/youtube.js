var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementById('youtubescript');

firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var currentvideonum;
var choice1videonum;
var choice2videonum;
var currentDuration;
var youtubeReady = false;

var targets = [];
var checkInt;
var buttonchosen = false;
var buttonVisible = true;

var timeslider = $("#timeslider");
// var bodyelem = $("#pagebody")[0];
var firstvideonum = '1';

function onYouTubeIframeAPIReady() {
    youtubeReady = true;
}
function initiallizeVideo(){
    $("#greeting").hide();
    makeCurrent(1);
    // $("#greeting").fadeOut(function(){
        // makeCurrent(1);
    // });
// console.log("H");
//     var waitForYoutubeReady = setInterval(function(){
//         if (youtubeReady==true){
//             $("#currentvideo").remove();

//             $("#choice1video").remove();
//             $("#choice2video").remove();
//             // $("#videoholder").append("<div id='choice1video' class='choicevideos'></div>");
//             // player = new YT.Player('choice1video', {
//             $("#videoholder").append("<div id='currentvideo'></div>");
//             player = new YT.Player('currentvideo', {
//                 height: '1080',
//                 videoId: flow[firstvideonum].videoid,
//                 events: {
//                     'onReady': onPlayerReady,
//                     'onStateChange': onPlayerStateChange
//                 },
//                 playerVars: {'controls': 0, 'fs': 0, 'showinfo': 0, 'rel': 0, 'playsinline': 1, 'modestbranding': 1, 'iv_load_policy': 3, 'disablekb': 1}
//             });
//             // choice1videonum = firstvideonum;
//             currentvideonum = firstvideonum;

//             if(flow[firstvideonum].isEnding == false)
//                 waitForCurrentReady();
//             loadChoices(currentvideonum);
//             clearInterval(waitForYoutubeReady);
//         }
//     }, 100);   
}
function initiallizePage(){
    $("#greeting").show();
    $("#ending").hide();
    $("#currentvideo").remove();
    $("#choice1video").remove();
    $("#choice2video").remove();
    var waitForYoutubeReady = setInterval(function(){
        if (youtubeReady==true){
            clearInterval(waitForYoutubeReady);
            loadChoices(-1);
        }
    }, 100);  
}

function checkPlayTime(){
    var currenttarget = targets['currentvideo'];
    var currentDuration = currenttarget.getDuration();
    var timeToShowButton = currentDuration - 11;
    var timeToChangeVideo = currentDuration - 1;
    if(flow[currentvideonum].isEnding==false && flow[currentvideonum].isChoice==true){
        checkInt = setInterval(function(){
            var curtime = currenttarget.getCurrentTime();
            if (curtime >= timeToShowButton){
                showButtons();
                timeslider.width(((timeToChangeVideo-curtime)*10)+'%');
                if(curtime >= timeToChangeVideo){
                    makeCurrent(choicenum);
                    clearInterval(checkInt); 
                }
            }else{
                hideButtons();
            }
        }, 40);
    }
    else{
        checkInt = setInterval(function(){
            var curtime = currenttarget.getCurrentTime();
            if(curtime >= timeToChangeVideo){
                    makeCurrent(choicenum);
                    clearInterval(checkInt); 
            }
        }, 500);
    }
}

function waitForCurrentReady(){
    hideButtons();
    var waitForReady = setInterval(function(){
        if (targets['currentvideo'] != undefined && targets['currentvideo'].getPlayerState() == YT.PlayerState.PLAYING){
            checkPlayTime();
            clearInterval(waitForReady);
        }
    }, 100);
}

function showButtons(){
    if(buttonVisible == false && buttonchosen == false){
        timeslider.width('100%');
        $("#buttonsholder").fadeIn();
        buttonVisible = true;
    }
}

function hideButtons(){
    if(buttonVisible == true){
        $("#buttonsholder").hide();
        buttonVisible = false;
    }
}

function onPlayerReady(event){ 
    targets[event.target.i.id] = event.target;
    event.target.setPlaybackQuality('hd720');
    event.target.setPlaybackQuality('720p');
    // event.target.setPlaybackQuality('hd1080');
    // event.target.setPlaybackQuality('1080p');
    event.target.playVideo();
}

function onPlayerStateChange(event){
    if(event.data == -1){
        event.target.playVideo();
    }
    else if(event.data == YT.PlayerState.PLAYING){
        if(event.target != targets['currentvideo']){
            event.target.setPlaybackQuality('hd720');
            event.target.setPlaybackQuality('720p');
            // event.target.setPlaybackQuality('hd1080');
            // event.target.setPlaybackQuality('1080p');
            event.target.pauseVideo();
        }
    }
    else if(event.data == 3){
        if(event.target != targets['currentvideo']){
            event.target.setPlaybackQuality('hd720');
            event.target.setPlaybackQuality('720p');
            // event.target.setPlaybackQuality('hd1080');
            // event.target.setPlaybackQuality('1080p');
            // event.target.pauseVideo();
        }
        // else{
        //     event.target.playVideo();
        // }
    }
    else if(event.data == YT.PlayerState.PAUSED){
        if(event.target == targets['currentvideo'] && buttonVisible == true){
            event.target.playVideo();
        }
    }
    else if(event.data == 0){
        event.target.clearVideo();
        if(flow[currentvideonum].isEnding == false){
            makeCurrent(1);
            clearInterval(checkInt); 
        }
    }
}

function makeCurrent(choicenum){
    hideButtons();
    if(targets['currentvideo'] != undefined){
        targets['currentvideo'].stopVideo();
        targets['currentvideo'].clearVideo();
        if(flow[currentvideonum].isEnding == false){
            $("#currentvideo").remove();
        }
        else{
            $("#currentvideo").fadeOut(function(){
                $("#ending").fadeIn();
            });
            return;
        }
    }
    var selected;
    if(choicenum == 1){
        selected = $("#choice1video");
        if(targets['choice2video']!=undefined){
            targets['choice2video'].stopVideo();
            targets['choice2video'].clearVideo();
        }
        $("#choice2video").remove();
        targets['currentvideo'] = targets['choice1video'];
        currentvideonum = choice1videonum;
    }
    else if(choicenum == 2){
        selected = $("#choice2video");
        if(targets['choice1video']!=undefined){
            targets['choice1video'].stopVideo();
            targets['choice1video'].clearVideo();
        }
        $("#choice1video").remove();
        targets['currentvideo'] = targets['choice2video'];
        currentvideonum = choice2videonum;
    }

    selected.attr('id', 'currentvideo');
    // $("#currentvideo").attr('width', '95%');
    // $("#currentvideo").attr('height', '90%');
    // $("#videoholder").append($("#currentvideo"));
    loadChoices(currentvideonum);
    targets['currentvideo'].playVideo();
    waitForCurrentReady();
}

function loadChoices(num){
    if(num==-1) { 
        choice1videonum = firstvideonum;
        choice2videonum = firstvideonum;
    }
    else{
        if(flow[num].isEnding == true){
            return;
        }
        var choiceelem;
        choiceelem = $("#choice1video");
        if(choiceelem != undefined){
            choiceelem.remove();
        }
        choiceelem = $("#choice2video");
        if(choiceelem != undefined){
            choiceelem.remove();
        }

        choice1videonum = flow[currentvideonum].choice1;
        choice2videonum = flow[currentvideonum].choice2;
    }

    buttonchosen = false;
    choicenum = 1;

    $("#videoholder").append("<div id='choice1video' class='choicevideos'></div>");
    $("#videoholder").append("<div id='choice2video' class='choicevideos'></div>");
    if(num != -1){
        $("#choicebutton1").text(flow[num].choice1text);
        $("#choicebutton2").text(flow[num].choice2text);
    }
    if(num == -1){
        player = new YT.Player('choice1video', {
            height: '1080',
            // width: '0',
            videoId: flow[firstvideonum].videoid,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            },
            playerVars: {'controls': 1, 'fs': 0, 'showinfo': 0, 'rel': 0, 'playsinline': 1, 'modestbranding': 1, 'iv_load_policy': 3, 'disablekb': 1}
        });
        player = new YT.Player('choice2video', {
            height: '1080',
            // width: '0',
            videoId: flow[firstvideonum].videoid,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            },
            playerVars: {'controls': 1, 'fs': 0, 'showinfo': 0, 'rel': 0, 'playsinline': 1, 'modestbranding': 1, 'iv_load_policy': 3, 'disablekb': 1}
        });
    }
    else{
        player = new YT.Player('choice1video', {
            height: '1080',
            // width: '0',
            videoId: flow[flow[num].choice1].videoid,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            },
            playerVars: {'controls': 1, 'fs': 0, 'showinfo': 0, 'rel': 0, 'playsinline': 1, 'modestbranding': 1, 'iv_load_policy': 3, 'disablekb': 1}
        });
        player = new YT.Player('choice2video', {
            height: '1080',
            // width: '0',
            videoId: flow[flow[num].choice2].videoid,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            },
            playerVars: {'controls': 1, 'fs': 0, 'showinfo': 0, 'rel': 0, 'playsinline': 1, 'modestbranding': 1, 'iv_load_policy': 3, 'disablekb': 1}
        });
    }   
}

function choiceButtonClick(event){
    if (event.target.id == 'choicebutton1'){
        choicenum = 1;
        buttonchosen = true;
        hideButtons();
        // makeCurrent(1);
        // clearInterval(checkInt);
    }
    else if(event.target.id == 'choicebutton2'){
        choicenum = 2;
        buttonchosen = true;
        hideButtons();
        // makeCurrent(2);
        // clearInterval(checkInt);
    }
}

function toggleFullscreen() {
    var doc = window.document;
    var docEl = document.documentElement;
    console.log(docEl);
  
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var requestFullScreenDE = document.documentElement.requestFullscreen || document.documentElement.mozRequestFullScreen || document.documentElement.webkitRequestFullScreen || document.documentElement.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
      requestFullScreenDE.call(document.documentElement);
      document.documentElement.requestFullscreen;
      document.documentElement.requestFullscreenDE;
    }
    else {
      cancelFullScreen.call(doc);
    }
  }

var choicebuttons = $(".choicebutton");
for (var i=0; i<choicebuttons.length; i++){
    choicebuttons[i].addEventListener('click', choiceButtonClick);
}
$("#startbutton")[0].addEventListener('click', initiallizeVideo);
$("#restartbutton")[0].addEventListener('click', initiallizePage);
$("#fullscreenbutton")[0].addEventListener('click', toggleFullscreen);
// if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
//     $("#mobilenotice").show();
// }
// else{
//     $("#mobilenotice").hide();
// }
initiallizePage();
