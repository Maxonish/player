var PlayerApp = angular.module('PlayerApp', []);

PlayerApp.controller('MainCtrl', function ($scope,$interval,$timeout,$document) {
    var play = document.getElementById('play');
    var pause = document.getElementById('pause');
    var pause2 = document.getElementById('pause2');
    var audio = document.getElementById('audio');
    var durationwidth = document.getElementById('updateduration');
    var volumewidth = document.getElementById('change');
    var player = document.getElementById('player');
    var startduration;
    var width=0;
    var x;
    var y;
    var left;
    var top;
    $scope.currentminute=0;
    $scope.currentsec=0;
    $scope.currentsec2=0;
    pause.style.opacity = 0;
    pause2.style.opacity = 0;
    $scope.index=0;
    $scope.strangevolume='volume_up';
    $scope.movevolume=false;
    $scope.musics = [{name: 'DNCE', url: 'DNCE.mp3',time: '3:38'},{name: 'Hans Zimmer', url: 'Hans.mp3', time: '4:08'}];
    audio.src=$scope.musics[0].url;
    $scope.Play = function() {
        if(audio.paused){
            audio.play();
            $scope.maxduration=audio.duration;
            play.style.opacity = 0;
            pause.style.opacity = 1;
            pause2.style.opacity = 1;
            startduration=$interval($scope.Updaterange,500);
        }else {
            audio.pause();  
            play.style.opacity = 1;
            pause.style.opacity = 0;
            pause2.style.opacity = 0;
            $interval.cancel(startduration);
            startduration = undefined;
        }
    };
    
     
    $scope.Updaterange=function() {
        width = audio.currentTime * (200/($scope.maxduration));
        durationwidth.style.width = width+'px';
        $scope.Currenttime();
        if (width==200){
            $scope.Next(); 
        };        
    };
    
    $scope.Prev = function() {
        if($scope.index!==0){
            $scope.currentminute=0;
            $scope.currentsec=0;
            $scope.currentsec2=0;
            $interval.cancel(startduration);
            startduration = undefined;
            $scope.index--;
            audio.src=$scope.musics[$scope.index].url;
            $scope.duration=0;
            durationwidth.style.width='0px';
            $interval.cancel(startduration);
            startduration = undefined;
            $timeout($scope.Play,1000);
        }
    };
    $scope.Next = function() {
        if($scope.index<$scope.musics.length-1){
            $scope.currentminute=0;
            $scope.currentsec=0;
            $scope.currentsec2=0;
            $interval.cancel(startduration);
            startduration = undefined;
            $scope.index++;
            audio.src=$scope.musics[$scope.index].url;
            durationwidth.style.width='0px';
            $interval.cancel(startduration);
            startduration = undefined;
            $timeout($scope.Play,1000);
            
        }
    };
    $scope.Mute = function() {
        if(audio.volume>0){
           audio.volume=0;
           $scope.strangevolume='volume_off';
           volumewidth.style.width='0px';
        }else if(audio.volume==0){
           audio.volume = 1;
           volumewidth.style.width='80px';
           $scope.strangevolume='volume_up';
        }
    };
    
    
    $scope.Startmove=function(e){
        if(e.which==1 && !audio.paused){
            $scope.Currenttime();
            $interval.cancel(startduration);
            startduration = undefined;
            $scope.change= true;
            $scope.move=true;
            durationwidth.style.width= e.offsetX +'px';
        }
    };
    $scope.Cursorposition2=function(e) {
        if(e.which==1 && !audio.paused){
            $scope.Currenttime();
            width = e.offsetX;
            var margin=e.offsetX;
            var time=(margin*2*$scope.maxduration)/200;
            audio.currentTime=time/2;
            $scope.move=false;
            if(!audio.paused){
                startduration=$interval($scope.Updaterange,500);
            }
        }
    };
    $scope.Volumemove = function (e){
        if(e.which==1){
            $scope.movevolume=true;
            volumewidth.style.width= e.offsetX +'px';
            
        }
    };
    $scope.Volumeposition = function(e){
        if(e.which==1){
            if($scope.movevolume==true){
                volumewidth.style.width= e.offsetX +'px';
                audio.volume=(1/80)*e.offsetX;
                if(e.offsetX==0){
                  $scope.strangevolume='volume_off';  
                }else if(e.offsetX>=65){
                    $scope.strangevolume='volume_up';
                } else if (e.offsetX<65 && e.offsetX>=35){
                    $scope.strangevolume='volume_down';
                }else if(e.offsetX<35 && e.offsetX>0) {
                    $scope.strangevolume='volume_mute';
                }
            }
        }
    };
    $scope.Volumeposition2 = function(e){
        if(e.which==1){
            $scope.movevolume=false;
            audio.volume=(1/80)*e.offsetX;
            if(e.offsetX==0){
                  $scope.strangevolume='volume_off';  
            }else if(e.offsetX>=65){
                    $scope.strangevolume='volume_up';
            } else if (e.offsetX<65 && e.offsetX>=35){
                    $scope.strangevolume='volume_down';
            }else if(e.offsetX<35 && e.offsetX>0) {
                    $scope.strangevolume='volume_mute';
            }
        }
    };
    $scope.Playerstartmove = function(e){
        if(e.which==1){
            player.style.cursor='move';
            $scope.startplayermove=true;
            $document.bind('mousemove', function (e) {
                x = e.pageX;
                y = e.pageY;
                left = player.offsetLeft;
                top = player.offsetTop;
                left = x-left;
                top = y-top;
            });
        }
    };
    
    $scope.Playermove=function(e) {
        if($scope.startplayermove==true && $scope.movevolume==false){
            x = e.pageX;
            y = e.pageY;
            player.style.left = x-left+'px';
            player.style.top = y-top+'px';
        }
    };
    
    $document.bind('mouseup', function () {
        $document.unbind('mousemove');
        $scope.startplayermove=false;
        $scope.movevolume=false;
        left = undefined;
        top = undefined;
        player.style.cursor='default';
    });
    $scope.Currenttime = function() {
        var current = audio.currentTime;
        current = String(current);
        var current2 = current.split('.',2);
        current2=+current2[0];
        if(current2!==0 && current2!==undefined){
            $scope.currentminute=current2/60|0;  
            if((current2 % 60)<10){
                $scope.currentsec=current2 % 60;
                $scope.currentsec2=0;
           }else {
                $scope.currentsec=current2 % 60;
                $scope.currentsec2=undefined;
           }
       }
    };
    
});
