class UI {
    constructor() {
        this.progressBarClick();
        this.volumeBarClick();
    }

    createAlbums(albums) {
        let albums_div = document.getElementById("albums_list");
        albums.forEach(element => {
            let album_div = document.createElement("div");
            album_div.classList.add("album_div");
            album_div.style.backgroundImage = "url(/" + encodeURIComponent(element) + "/cover.jpg)";
            album_div.addEventListener("click", function () {
                net.nextAlbum(element);
            });
            albums_div.appendChild(album_div);
        });
        let favourites_div = document.createElement("div");
        favourites_div.classList.add("album_div");
        favourites_div.style.backgroundImage = "url(/icons/star.svg)";
        favourites_div.addEventListener("click", function () {
            net.showFavouritesSongs();
        });
        albums_div.appendChild(favourites_div);
    }

    createSongsList(songs, album) {
        let songs_div = document.getElementById("songs_list");
        songs_div.innerHTML = "";
        let songs_table = document.createElement("table");
        songs.forEach(element => {
            let song_tr = document.createElement("tr");
            let song_name = document.createElement("td");
            let song_size = document.createElement("td");
            song_name.innerHTML = element.name.split(".")[0];
            song_size.innerHTML = element.size;
            let album_name = document.createElement("td");
            album_name.innerHTML = album;
            let add_to_playlist = document.createElement("td");
            add_to_playlist.addEventListener("click", function (e) {
                e.stopImmediatePropagation();
                net.addToFavourites(album, element.name, element.size);
            });
            song_tr.addEventListener("click", function () {
                music.tr_click_action(album, element.name);
                ui.highlightCurrentSong(song_tr);
                document.getElementById("current_song_name").innerHTML = album_name.innerText + " - " + song_name.innerText;
            });
            song_tr.addEventListener("dblclick", function () {
                music.tr_dclick_action();
                music.pause = false;
            });
            song_tr.appendChild(album_name);
            song_tr.appendChild(song_name);
            song_tr.appendChild(song_size);
            song_tr.appendChild(add_to_playlist);
            for (const element of song_tr.childNodes) {
                element.classList.add("unselectable")
            }
            songs_table.appendChild(song_tr);
        });
        songs_div.appendChild(songs_table);
    }

    createButtonsClicks(songs) {
        document.getElementById("play_pause").onclick = function () {
            music.playPause()
        };
        document.getElementById("previous").onclick = function () {
            let current_song = document.getElementById("audio").src;
            let all_songs = songs;
            let current_album = current_song.split("/")[3];
            let previous_song = music.previousSong(current_song, all_songs);
            document.getElementById("audio").src = "/" + current_album + "/" + decodeURIComponent(previous_song);
            if (!music.pause)
                document.getElementById("audio").play();
            document.getElementById("current_song_name").innerHTML = current_album + " - " + decodeURIComponent(previous_song);
        };
        document.getElementById("next").onclick = function () {
            let current_song = document.getElementById("audio").src;
            let all_songs = songs;
            let current_album = current_song.split("/")[3];
            let next_song = music.nextSong(current_song, all_songs);
            document.getElementById("audio").src = "/" + encodeURIComponent(current_album) + "/" + encodeURIComponent(next_song);
            if (!music.pause)
                document.getElementById("audio").play();
            document.getElementById("current_song_name").innerHTML = decodeURIComponent(current_album) + " - " + decodeURIComponent(next_song);
        };
    }

    highlightCurrentSong(current_song_tr) {
        let all_trs = document.getElementsByTagName("tr");
        for (const element of all_trs) {
            element.style.backgroundColor = "#112a28"
        }
        current_song_tr.style.backgroundColor = "black"
    }

    audioTime() {
        let player = document.getElementById("audio");
        let time_div = document.getElementById("time");
        player.onloadedmetadata = function () {
            let duration = player.duration | 0;
            let min_duration = duration / 60 | 0;
            let sec_duration = duration % 60;
            if (sec_duration < 10)
                sec_duration = "0" + sec_duration;
            player.addEventListener("timeupdate", () => {
                let current_time = player.currentTime | 0;
                let current_min = current_time / 60 | 0;
                let current_sec = current_time % 60;
                if (current_sec < 10)
                    current_sec = "0" + current_sec;
                time_div.innerHTML = current_min + ":" + current_sec + " / " + min_duration + ":" + sec_duration;
                ui.progressBarSelfUpdate(current_time, duration)
            });
        }
    }

    progressBarSelfUpdate(current_time, duration) {
        let progress = current_time / duration * 100;
        let progress_div = document.getElementById("actual_progress");
        progress_div.style.width = progress + "%";
    }

    progressBarClick() {
        let mousedown = false;
        let progress_div = document.getElementById("actual_progress");
        let progress_click_div = document.getElementById("progress_bar");
        let player = document.getElementById("audio");
        let progress_bar_max_width = (35 / 100) * window.innerWidth | 0;
        progress_click_div.addEventListener("mousedown", function (e) {
            mousedown = true;
            progress_div.style.width = e.offsetX;
            let current_time = e.offsetX / progress_bar_max_width * player.duration;
            player.currentTime = current_time;
            progress_click_div.addEventListener("mousemove", function (e) {
                if (mousedown) {
                    player.pause();
                    progress_div.style.width = e.offsetX;
                    let current_time = e.offsetX / progress_bar_max_width * player.duration;
                    player.currentTime = current_time;
                }
            });
        });
        document.body.addEventListener("mouseup", function () {
            if (mousedown) {
                mousedown = false;
                player.play();
            }
        });
    }

    volumeBarClick() {
        let mousedown = false;
        let volume_div = document.getElementById("actual_volume_bar");
        let volume_click_div = document.getElementById("volume_bar");
        let player = document.getElementById("audio");
        volume_click_div.addEventListener("mousedown", function (e) {
            let volume_bar_max_height = (16 / 100) * window.innerHeight | 0;
            mousedown = true;
            let current_volume = (volume_bar_max_height - e.offsetY) / volume_bar_max_height;
            if (current_volume > 1)
                current_volume = 1;
            else if (current_volume < 0)
                current_volume = 0;
            volume_div.style.height = 100 - (current_volume * 100) + "%";
            player.volume = current_volume;
            volume_click_div.addEventListener("mousemove", function (e) {
                if (mousedown) {
                    let current_volume = (volume_bar_max_height - e.offsetY) / volume_bar_max_height;
                    if (current_volume > 1)
                        current_volume = 1;
                    else if (current_volume < 0)
                        current_volume = 0;
                    volume_div.style.height = 100 - (current_volume * 100) + "%";
                    player.volume = current_volume;
                }
            });
        });
        document.body.addEventListener("mouseup", function () {
            if (mousedown) {
                mousedown = false;
            }
        });
    }

    createFavouritesSongsList(data) {
        let songs_div = document.getElementById("songs_list");
        songs_div.innerHTML = "";
        let songs_table = document.createElement("table");
        data.forEach(element => {
            let song_tr = document.createElement("tr");
            let album_name = document.createElement("td");
            let song_name = document.createElement("td");
            let song_size = document.createElement("td");
            album_name.innerHTML = element.album;
            song_name.innerHTML = element.song.split(".")[0];
            song_size.innerHTML = element.size;
            song_tr.addEventListener("click", function () {
                music.tr_click_action(element.album, element.song);
                ui.highlightCurrentSong(song_tr);
                document.getElementById("current_song_name").innerHTML = album_name.innerText + " - " + song_name.innerText;
            });
            song_tr.addEventListener("dblclick", function () {
                music.tr_dclick_action();
                music.pause = false;
            });
            song_tr.appendChild(album_name);
            song_tr.appendChild(song_name);
            song_tr.appendChild(song_size);
            for (const element of song_tr.childNodes) {
                element.classList.add("unselectable")
            }
            songs_table.appendChild(song_tr);
        });
        songs_div.appendChild(songs_table);
    }

    createButtonsClicksWhenFavourites(favourites) {
        document.getElementById("play_pause").onclick = function () {
            music.playPause()
        };
        document.getElementById("previous").onclick = function () {
            let current_song = decodeURIComponent(document.getElementById("audio").src.split("/")[4]);
            let all_songs = favourites;
            let previous_song_index = favourites.findIndex(element => element.song === current_song);
            previous_song_index--;
            if (previous_song_index < 0)
                previous_song_index = all_songs.length - 1;
            let previous_album = encodeURIComponent(all_songs[previous_song_index].album);
            let previous_song = encodeURIComponent(all_songs[previous_song_index].song);
            document.getElementById("audio").src = "/" + previous_album + "/" + previous_song;
            let current_song_tr = document.querySelector("table > tr:nth-child(" + (previous_song_index + 1) + ")");
            ui.highlightCurrentSong(current_song_tr);
            if (!music.pause)
                document.getElementById("audio").play();
            document.getElementById("current_song_name").innerHTML = decodeURIComponent(previous_album) + " - " + decodeURIComponent(previous_song);
        };
        document.getElementById("next").onclick = function () {
            let current_song = decodeURIComponent(document.getElementById("audio").src.split("/")[4]);
            let all_songs = favourites;
            let previous_song_index = favourites.findIndex(element => element.song === current_song);
            previous_song_index++;
            if (previous_song_index === all_songs.length)
                previous_song_index = 0;
            let previous_album = encodeURIComponent(all_songs[previous_song_index].album);
            let previous_song = encodeURIComponent(all_songs[previous_song_index].song);
            document.getElementById("audio").src = "/" + previous_album + "/" + previous_song;
            let current_song_tr = document.querySelector("table > tr:nth-child(" + (previous_song_index + 1) + ")");
            ui.highlightCurrentSong(current_song_tr);
            if (!music.pause)
                document.getElementById("audio").play();
            document.getElementById("current_song_name").innerHTML = decodeURIComponent(previous_album) + " - " + decodeURIComponent(previous_song);
        };
    }
}

