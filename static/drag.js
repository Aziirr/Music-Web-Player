function prevent(e) {
    e.preventDefault();
    e.stopPropagation();
}

window.addEventListener("load", function () {
    document.addEventListener("dragover", function (e) {
        prevent(e);
    });
    document.addEventListener("drop", function (e) {
        prevent(e);
    });
    const drag_div = document.getElementById("drag");
    drag_div.addEventListener("dragenter", function (e) {
        prevent(e);
    });
    drag_div.addEventListener("dragover", function (e) {
        prevent(e);
        drag_div.innerHTML = "Upuść teraz"
    });
    drag_div.addEventListener("dragleave", function (e) {
        prevent(e);
        drag_div.innerHTML = "Upuść tu pliki"
    });
    drag_div.addEventListener("drop", function (e) {
        prevent(e);
        let files = e.dataTransfer.files;
        let unknown_format = false;
        for (const element of files) {
            if (element.type === "") {
                unknown_format = true;
            }
        }
        if(unknown_format){
            drag_div.innerHTML = "Upuść pliki zamiast folderu"
        }
        else {
            let fd = new FormData();
            for (const element of files) {
                fd.append("file", element)
            }
            $.ajax({
                url: "/songs_upload",
                data: fd,
                type: "POST",
                contentType: false,
                processData: false,
                success: function (data) {
                    drag_div.innerHTML = "Pliki przesłane";
                    const recived_data = JSON.parse(data);
                    let files_div = document.getElementById("files_list");
                    files_div.innerHTML = "";
                    let table = document.createElement("table");
                    for (const element of recived_data) {
                        let tr = document.createElement("tr");
                        let td_img = document.createElement("td");
                        let td_name = document.createElement("td");
                        td_name.innerHTML = element.name;
                        if (element.mp3)
                            td_img.style.backgroundImage = "url(/icons/mp3.svg)";
                        else if (element.jpg)
                            td_img.style.backgroundImage = "url(/icons/jpg.svg)";
                        tr.appendChild(td_img);
                        tr.appendChild(td_name);
                        table.appendChild(tr);
                        files_div.appendChild(table);
                    }
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                },
            });
        }
    });
});