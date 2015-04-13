var Camera = function () {
    this.width = 320;
    this.height = 240;

    this.processing = false;
    this.camFeed = null;
    this.canvas = null;
    this.localStream = null;
    this.callback = null;

    this.init();
};

Camera.prototype.init = function () {
    if(!navigator.webkitGetUserMedia) {
        throw "No support";
        console.log("error");
    }

    this.camFeed = document.createElement("video");
    this.camFeed.width = this.width;
    this.camFeed.height = this.height;
    this.camFeed.autoplay = true;

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');
};

Camera.prototype.takePhoto = function (callback) {
    if (this.processing) {
        return false;
    }
    
    this.callback = callback;
    this.processing = true;

    navigator.webkitGetUserMedia ({ video: true }, this.onStream.bind(this), function (){
        throw "Error";
        console.log("error");
    });
};

Camera.prototype.onStream = function (stream) {
    this.camFeed.src = URL.createObjectURL(stream);
    this.localStream = stream;

    this.waitStream();
};

Camera.prototype.waitStream = function () {
    var self = this,
        imgData = null;

    var checkImage = window.setInterval(function (){
        self.ctx.drawImage(self.camFeed, 0, 0, self.width, self.height);
        imgData = self.ctx.getImageData(0, 0, 1, 1);

        if(imgData.data[0] !== 0 || imgData.data[1] !== 0 || imgData.data[2] !== 0) {
            window.clearInterval(checkImage);

            //it turns out that some recent iSight make a fade from black at the beginning
            window.setTimeout(function(){
                self.ctx.drawImage(self.camFeed, 0, 0, self.width, self.height);
                self.localStream.stop();

                self.callback( self.canvas.toDataURL() );
                self.cleanCanvas();
                self.processing = false;
            }, 500);
        }

    }, 100);
};

Camera.prototype.cleanCanvas = function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
};

module.exports = new Camera();
