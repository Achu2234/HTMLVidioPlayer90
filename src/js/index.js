class Player{
    constructor(){
        this.container = document.getElementById('video_container');
        this.timeline_container = document.getElementById('timeline');
        this.timeline = document.getElementById('timeline_line');
        this.buffer_timeline = document.getElementById('middle_line');
        this.back_timeline = document.getElementById('back_timeline');
        this.audio_range = document.getElementById('audio_input');
        this.source_player = null;
        this.play_object = null;
        this.is_paused = true;
        this.is_fullscreen = false;
        this.is_mouse_stops = 0;
    }
    
    secondsToHms = (d) => {
        d = Number(d);
        var h = Math.floor(d / 3600) < 10 ? "0" + Math.floor(d / 3600) : Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60) < 10 ? "0" + Math.floor(d % 3600 / 60) : Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60) < 10 ? "0" + Math.floor(d % 3600 % 60) : Math.floor(d % 3600 % 60);
    
        var hDisplay = h > 0 ? h + ":" : "00:";
        var mDisplay = m > 0 ? m + ":" : "00:";
        var sDisplay = s > 0 ? s + "" : "00";

        return hDisplay > 0 ? hDisplay : "" + mDisplay + sDisplay; 
    }

    init = () => {
        this.source_player = document.getElementById("source_player");
        this.play_object = document.getElementById("play_stop_icon");
        this.source_player.controls = false;
        this.audio_range.value = this.source_player.volume * 100;
        this.source_player.addEventListener('timeupdate', this.current, false);
        this.source_player.addEventListener('progress', this.download, false);
        this.container.addEventListener('dblclick', this.fullscreen, false);
        this.container.addEventListener('fullscreenchange', this.set_fullscreen_state, false);
        this.container.addEventListener('mousemove', this.receive_mouse_event, false);
        this.timeline_container.addEventListener('click', this.set_video_current_duration, false);
        this.audio_range.addEventListener("change", this.set_volume, false);
    }

    toggle_play = () => {
        if(this.is_paused === true){
            this.play_object.className = "fa fa-pause";
            this.source_player.play();
            this.is_paused = false;
        }else{
            this.play_object.className = "fa fa-play";
            this.source_player.pause();
            this.is_paused = true;
        }
    }

    current = () => {
        this.timeline.style.width = `${(100 / this.source_player.duration) * this.source_player.currentTime}%`;
        document.getElementById('duration').style.setProperty('--timeDuration', `'${this.secondsToHms(this.source_player.currentTime)} / ${this.secondsToHms(this.source_player.duration)}'`);
    }

    download = () => {
        this.buffer_timeline.style.width = `${(100 / this.source_player.duration) * this.source_player.buffered.end(0)}%`;
    }

    fullscreen = async () => {
        if(this.is_fullscreen === false){
            await this.container.requestFullscreen();
        }else{
            await document.exitFullscreen();
        }
    }

    set_fullscreen_state = () => {
        this.is_fullscreen = !this.is_fullscreen;
    }

    set_video_current_duration = (e) => {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var percentage = (x / this.back_timeline.clientWidth) * 100;
        this.source_player.currentTime = (percentage * this.source_player.duration) / 100;
        this.timeline.style.width = `${(100 / this.source_player.duration) * this.source_player.currentTime}%`;
    }
    
    set_classes_hover = (value) => {
        var current = this.is_mouse_stops;
        var received = value;
        if(current === received){
            this.is_mouse_stops = ++this.is_mouse_stops;
            const dark_back = document.getElementById('dark_back');
            const controls = document.getElementById('controls');

            if(dark_back.classList.contains('hover_dark_back') === true && controls.classList.contains('hover_controls') === true){
                dark_back.classList.remove('hover_dark_back');
                controls.classList.remove('hover_controls');
            }
        }
    }

    receive_mouse_event = () => {
        var current = ++this.is_mouse_stops;
        this.is_mouse_stops = current;
        if(dark_back.classList.contains('hover_dark_back') === false && controls.classList.contains('hover_controls') === false){
            dark_back.classList.add('hover_dark_back');
            controls.classList.add('hover_controls');
        }
        setTimeout(() => {
            this.set_classes_hover(current);
            return;
        }, 2000)
    }

    set_volume = () => {
        this.source_player.volume = this.audio_range.value / 100;
    }

    mute_volume = () => {
        if(this.source_player > 0){
            document.getElementById('volume_icon')
            this.source_player.volume = 0;
            this.audio_range.value = 0;
        }
    }

}

const player = new Player();

document.addEventListener("DOMContentLoaded", () => {
    player.init();
}, false);