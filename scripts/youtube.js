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
var buttonVisible = true;

var timeslider = $("#timeslider");
// var bodyelem = $("#pagebody")[0];
var firstvideonum = '1';

function onYouTubeIframeAPIReady() {
    youtubeReady = true;
}
function initiallizeVideo(){
    $("#greeting").hide();
    var waitForYoutubeReady = setInterval(function(){
        if (youtubeReady==true){
            $("#currentvideo").remove();
            $("#choice1video").remove();
            $("#choice2video").remove();
            $("#videoholder").append("<div id='currentvideo'></div>");
            player = new YT.Player('currentvideo', {
                videoId: flow[firstvideonum].videoid,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                },
                playerVars: {'controls': 1, 'fs': 0, 'showinfo': 0, 'rel': 0, 'playsinline': 1, 'modestbranding': 1, 'iv_load_policy': 3}
            });
            currentvideonum = firstvideonum;

            if(flow[firstvideonum].isEnding == false)
                waitForCurrentReady();
            loadChoices(currentvideonum);
            clearInterval(waitForYoutubeReady);
        }
    }, 100);
}
function initiallizePage(){
    $("#greeting").show();
    $("#ending").hide();
    $("#currentvideo").remove();
    $("#choice1video").remove();
    $("#choice2video").remove();
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
                    makeCurrent(1);
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
                    makeCurrent(1);
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
    if(buttonVisible == false){
        timeslider.width('100%');
        $("#buttonsholder").fadeIn();
        buttonVisible = true;
    }
}

function hideButtons(){
    if(buttonVisible == true){
        $("#buttonsholder").fadeOut();
        buttonVisible = false;
    }
}

function onPlayerReady(event){ 
    targets[event.target.i.id] = event.target;
    event.target.playVideo();
}

function onPlayerStateChange(event){
    if(event.data == -1){
        event.target.playVideo();
    }
    else if(event.data == 3){
        if(event.target != targets['currentvideo']){
            event.target.pauseVideo();
        }
        else{
            event.target.playVideo();
        }
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
    targets['currentvideo'].stopVideo();
    targets['currentvideo'].clearVideo();
    $("#currentvideo").remove();

    if(flow[currentvideonum].isEnding == true){
        $("#ending").show();
        return;
    }

    var selected;
    if(choicenum == 1){
        selected = $("#choice1video");
        targets['choice2video'].stopVideo();
        targets['choice2video'].clearVideo();
        $("#choice2video").remove();
        targets['currentvideo'] = targets['choice1video'];
        currentvideonum = choice1videonum;
    }
    else if(choicenum == 2){
        selected = $("#choice2video");
        targets['choice1video'].stopVideo();
        targets['choice1video'].clearVideo();
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

    $("#videoholder").append("<div id='choice1video' class='choicevideos'></div>");
    $("#choicebutton1").text(flow[num].choice1text);
    $("#videoholder").append("<div id='choice2video' class='choicevideos'></div>");
    $("#choicebutton2").text(flow[num].choice2text);

    player = new YT.Player('choice1video', {
        // height: '0',
        // width: '0',
        videoId: flow[flow[num].choice1].videoid,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        playerVars: {'controls': 1, 'fs': 0, 'showinfo': 0, 'rel': 0, 'playsinline': 1, 'modestbranding': 1, 'iv_load_policy': 3}
    });
    player = new YT.Player('choice2video', {
        // height: '0',
        // width: '0',
        videoId: flow[flow[num].choice2].videoid,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        playerVars: {'controls': 1, 'fs': 0, 'showinfo': 0, 'rel': 0, 'playsinline': 1, 'modestbranding': 1, 'iv_load_policy': 3}
    });
}

function choiceButtonClick(event){
    if (event.target.id == 'choicebutton1'){
        makeCurrent(1);
        clearInterval(checkInt);
    }
    else if(event.target.id == 'choicebutton2'){
        makeCurrent(2);
        clearInterval(checkInt);
    }
}

function toggleFullscreen() {
    var doc = window.document;
    var docEl = document.documentElement;
    console.log(docEl);
  
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
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
initiallizePage();