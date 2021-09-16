let ui;
let net;
window.addEventListener("load", function () {
    net = new Net(); // utworzenie obiektu klasy Net
    ui = new UI(); // utworzenie obiektu klasy Ui
    music = new Music(true);
});