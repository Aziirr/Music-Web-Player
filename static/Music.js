class Music {
    constructor(pause) {
        this.pause = pause;
        this.playerDefaultVolume();
    }
    playerDefaultVolume(){
        let player = document.getElementById("audio");
        player.volume = 0.4;
    }
    tr_click_action(album_name, song_name) {
        let player = document.getElementById("audio");
        player.src = "/" + encodeURIComponent(album_name) + "/" + encodeURIComponent(song_name);
        let play_pause_img = document.getElementById("play_pause");
        play_pause_img.src = "/icons/play.svg";
        this.pause = true;
        ui.audioTime();
    }

    tr_dclick_action() {
        let player = document.getElementById("audio");
        let play_pause_img = document.getElementById("play_pause");
        play_pause_img.src = "/icons/pause.svg";
        this.pause = false;
        player.play()
    }

    playPause() {
        let player = document.getElementById("audio");
        if(player.src !="") {
            let play_pause_img = document.getElementById("play_pause");
            this.pause = !this.pause;
            if (this.pause) {
                play_pause_img.src = "/icons/play.svg";
                player.pause();
            } else {
                play_pause_img.src = "/icons/pause.svg";
                player.play();
            }
        }
    }

    previousSong(current_song, all_songs) {
        let decoded_current_song = decodeURIComponent(current_song.split("/")[4]);
        let previous_song_index = all_songs.findIndex(element => {
            return element.name == decoded_current_song
        }) - 1;
        if (previous_song_index == -1)
            previous_song_index = all_songs.length - 1;
        let current_song_tr_index = previous_song_index + 1;
        let current_song_tr = document.querySelector("table > tr:nth-child(" + current_song_tr_index + ")");
        ui.highlightCurrentSong(current_song_tr);
        return all_songs[previous_song_index].name;
    }

    nextSong(current_song, all_songs) {
        let decoded_current_song = decodeURIComponent(current_song.split("/")[4]);
        let next_song_index = all_songs.findIndex(element => {
            return element.name == decoded_current_song
        }) + 1;
        if (next_song_index == all_songs.length)
            next_song_index = 0;
        let current_song_tr_index = next_song_index + 1;
        let current_song_tr = document.querySelector("table > tr:nth-child(" + current_song_tr_index + ")");
        ui.highlightCurrentSong(current_song_tr);
        return all_songs[next_song_index].name;
    }

}