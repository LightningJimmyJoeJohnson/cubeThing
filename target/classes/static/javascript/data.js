var xmlhttp = new XMLHttpRequest();
var url = "/users/user/jhoeller/times";
class Data {

	constructor(data, ctx, canvas) {
		this.x = -1;
		this.y = -1;
		this.hovered;
		this.ctx = ctx;
		this.canvas = canvas;
		this.data = data;
		
		this.data.push = function() {
			ao();
			return Array.prototype.push.apply(this, arguments);
		}
		
		this.leftLable = true;
		this.bottomLable = true;
		this.lines = 20;
		this.lineWidth = 1;

		this.heightPerc = 100;

		this.barSpace = 5;
		this.xSpace = 50;
		this.ySpace = 20;

		this.barColor = "black";

		//this.largest = largest;
		this.lastHover = -1;
		this.newHover = -1;
	}

	get largest() {
		var largest = 0;
		for (var w = 0; w < this.data.length; w++) {
			if (this.data[w] > largest) {
				largest = this.data[w];
			}
		}
		return largest;
	}

	drawBar(bar) { //draws the bars
		var barInc = ((this.canvas.width - this.xSpace) + this.barSpace) / this.data.length; //how far the bar should start from the last bar starting point
		var barWidth = (this.canvas.width - this.xSpace) / this.data.length - this.barSpace; //how wide the bar should be
		var height = ((this.data[bar] / this.largest) * this.canvas.height) - this.ySpace; //how high the bar should be
		this.ctx.fillStyle = this.barColor; //the color
		if (bar === this.newHover) {
			ctx.fillStyle = "#21f948";
		}
		this.ctx.fillRect(this.xSpace + (bar * barInc), ((this.canvas.height - this.ySpace) - height * (this.heightPerc / 100)) + this.ySpace, barWidth, height * (this.heightPerc / 100)); //draws bar
	}

	drawLines() { //draws the dashed lines
		if (this.lines > 0) {
			var lineInc = (this.canvas.height - this.ySpace) / this.lines;

			//console.log(lineInc);
			for (var i = 0; i < this.lines; i++) {
				this.ctx.fillStyle = "#999";
				var amount = 100;
				var graphWidth = this.canvas.width - this.xSpace;
				var dashSize = graphWidth / (amount * 2);
				for (var j = 0; j < amount; j++) {
					var dashX = j * dashSize * 2;
					this.ctx.fillRect(dashX + this.xSpace, lineInc * i + this.ySpace, dashSize, this.lineWidth); //draws line 
				}
			}
		}
	}

	drawText() { //draws the numbers
		if (this.lines > 0) {
			var lineInc = (this.canvas.height - this.ySpace) / this.lines;

			for (var i = 0; i < this.lines; i++) {
				this.ctx.fillStyle = "#999";
				var amount = 100;
				var graphWidth = this.canvas.width - this.xSpace;
				this.ctx.font = "13px Nirmala UI";
				this.ctx.textAlign = "center";
				this.ctx.textBaseline = "middle";
				this.ctx.fillText(Math.round((this.largest - (lineInc * i) / (this.canvas.height - this.ySpace) * this.largest) * 100)/100, this.xSpace / 2, lineInc * i + this.ySpace);
			}
		}
	}
	hover(x, y) {
		this.hovered = false;
		this.newHover = -1;
		for (var i = 0; i < this.data.length; i++) {
			var barInc = ((this.canvas.width - this.xSpace) + this.barSpace) / this.data.length;
			var barWidth = (this.canvas.width - this.xSpace) / this.data.length - this.barSpace;
			var height = ((this.data[i] / this.largest) * this.canvas.height) - this.ySpace;
			if (x > this.xSpace + (i * barInc) && x < barWidth + this.xSpace + (i * barInc)) {
				this.hovered = true;
				this.newHover = i;
			}


		}
		if (this.hovered) {

			this.x = x;
			this.y = y;
			if (this.lastHover !== this.newHover) {
				//console.log(this.data[this.newHover]);
				this.lastHover = this.newHover;
			}
			return this.lastHover;
		}
		return -1;
	}

	/*pushToDataBase(time, cube){
        var data = cube.concat(time.toString);
        this.sendPostJson("/users/user/jhoeller/times", data);

	}

    //https://gist.github.com/Zirak/3151454
    //Thank you based Zirak
	sendPostJson ( url, data) {
    	var xhr = new XMLHttpRequest();
    	xhr.responseJSON = null;

    	xhr.open( 'POST', url );
    	xhr.setRequestHeader( 'Content-Type', 'application/json' );

    	xhr.addEventListener( 'load',  function () {
    		//my old man once told me "Zirak, sometimes, you must face the dangers
    		// of life head on". he then threw me in a shark tank. but I'm sure it
    		// applies here too.
    		//...I was only 7
    		xhr.responseJSON = JSON.parse( xhr.responseText );

    	});

    	console.log(JSON.stringify(data));
    	xhr.send( JSON.stringify(data));

    }*/

    getUserData(){
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var myArr = JSON.parse(this.responseText);
                myFunction(myArr);
            }
        };
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function myFunction(arr) {
        var out = "";
        var i;
        for(i = 0; i < arr.length; i++) {
            out += '<a href="' + arr[i].url + '">' +
            arr[i].display + '</a><br>';
        }
        document.getElementById("id01").innerHTML = out;
    }
    getData();
}