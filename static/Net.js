class Net {
    constructor() {
        this.loadAlbums()
    }

    loadAlbums() {
        $.ajax({
            url: "/first",
            data: {},
            type: "POST",
            success: function (data) {
                const recived_data = JSON.parse(data);
                const albums = recived_data.albums;
                const album = recived_data.albums[0];
                const songs = recived_data.songs;
                ui.createAlbums(albums);
                ui.createSongsList(songs, album);
                ui.createButtonsClicks(songs);
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }

    nextAlbum(album_name) {
        $.ajax({
            url: "/" + album_name,
            data: {},
            type: "POST",
            success: function (data) {
                const recived_data = JSON.parse(data);
                const album = album_name;
                const songs = recived_data.songs;
                ui.createSongsList(songs, album);
                ui.createButtonsClicks(songs);
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }

    addToFavourites(album, song, size) {
        $.ajax({
            url: "/add_to_favourites",
            data: {
                album: album,
                song: song,
                size:size,
                add_date: new Date()
            },
            type: "POST",
            success: function (data) {
                let received_data = JSON.parse(data);
                if (received_data.exists) {
                    alert("Wybrany utwór jest już dodany do ulubionych")
                } else {
                    alert("Utwór został dodany do ulubionych")
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }

    showFavouritesSongs() {
        $.ajax({
            url: "/show_favourites",
            data: {},
            type: "POST",
            success: function (data) {
                let recived_data = JSON.parse(data);
                ui.createFavouritesSongsList(recived_data);
                ui.createButtonsClicksWhenFavourites(recived_data);
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
}
