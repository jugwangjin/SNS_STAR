var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementById('youtubescript');

firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var currentvideonum;
var choice1videonum;
var choice2videonum;
var choiceShown;
var currentDuration;

function onYouTubeIframeAPIReady() {
    $("#videoholder").append("<div id=currentvideo></div>");
    player = new YT.Player('currentvideo', {
        height: '360',
        width: '640',
        videoId: flow[0].videoid,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        playerVars: {'controls': 1, 'fs': 0}
    });
    currentvideonum = 0;
    choiceShown = false;
    
    if(flow[0].isEnding == false)
        waitForCurrentReady();
    loadChoices(currentvideonum);
}

var targets = [];
var checkInt;
var buttonVisible = true;

function checkPlayTime(){
    var currenttarget = targets['currentvideo'];
    var currentDuration = currenttarget.getDuration();
    var timeToShowButton = currentDuration - 10;
    var timeToChangeVideo = currentDuration - 1;
    checkInt = setInterval(function(){
        if (currenttarget.getCurrentTime() >= timeToShowButton){
            showButtons();
            if(currenttarget.getCurrentTime() >= timeToChangeVideo){
                makeCurrent(1);
                clearInterval(checkInt); 
            }
        }else{
            hideButtons();
        }
    }, 1000);
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
        $("#buttonsholder").show();
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
    event.target.playVideo();
}

function onPlayerStateChange(event){
    if(event.data == -1){
        event.target.playVideo();
    }
    else if(event.data == 3){
        event.target.pauseVideo();
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
    if(flow[currentvideonum].isEnding == true){
        return;
    }
    targets['currentvideo'].stopVideo();
    targets['currentvideo'].clearVideo();
    $("#currentvideo").remove();
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
    $("#currentvideo").attr('width', '640');
    $("#currentvideo").attr('height', '360');
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

    $("#videoholder").append("<div id=choice1video></div>");
    $("#videoholder").append("<div id=choice2video></div>");

    player = new YT.Player('choice1video', {
        height: '110',
        width: '110',
        videoId: flow[flow[num].choice1].videoid,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        playerVars: {'controls': 1, 'fs': 0}
    });
    player = new YT.Player('choice2video', {
        height: '110',
        width: '110',
        videoId: flow[flow[num].choice2].videoid,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        playerVars: {'controls': 1, 'fs': 0}
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

hideButtons();
var choicebuttons = $(".choicebutton");
for (var i=0; i<choicebuttons.length; i++){
    choicebuttons[i].addEventListener('click', choiceButtonClick);
}

