(function(){
	
	JsBarcode = function(image, content, options) {
		
		var merge = function(m1, m2) {
			for (var k in m2) {
				m1[k] = m2[k];
			}
			return m1;
		};
	
		//Merge the user options with the default
		options = merge(JsBarcode.defaults, options);

		//Create the canvas where the barcode will be drawn on
		var canvas = document.createElement('canvas');
		
		//Abort if the browser does not support HTML5canvas
		if (!canvas.getContext) {
			return image;
		}
		
		var encoder = new window[options.format](content);
		
		//Abort if the barcode format does not support the content
		if(!encoder.valid()){
			return this;
		}
		
		//Encode the content
		var binary = encoder.encoded();
		
		//Get the canvas context
		var ctx	= canvas.getContext("2d");
		
		//Set the width and height of the barcode
		canvas.width = binary.length*options.width+2*options.quite;
		canvas.height = options.height;
		
		//Paint the canvas
		ctx.clearRect(0,0,canvas.width,canvas.height);
		if(options.backgroundColor){
			ctx.fillStyle = options.backgroundColor;
			ctx.fillRect(0,0,canvas.width,canvas.height);
		}
		
		//Creates the barcode out of the encoded binary
		ctx.fillStyle = options.lineColor;
		for(var i=0;i<binary.length;i++){
			var x = i*options.width+options.quite;
			if(binary[i] == "1"){
				ctx.fillRect(x,0,options.width,options.height);
			}			
		}
		
		//Grab the dataUri from the canvas
		uri = canvas.toDataURL('image/png');
		
		//Put the data uri into the image
		if (image.attr) { //If element has attr function (jQuery element)
			return image.attr("src", uri);
		}
		else { //DOM element
			image.setAttribute("src", uri);
		}

	};
	
	JsBarcode.defaults = {
		width:	2,
		height:	100,
		quite: 10,
		format:	"CODE128",
		backgroundColor:"#fff",
		lineColor:"#000"
	};
	
	//Extend jQuery
	if (window.jQuery) {
		jQuery.fn.JsBarcode = function(content, options) {
			JsBarcode(this, content, options);
		};
	}
	
	//Add as global object
	window["JsBarcode"] = JsBarcode;

})();
function CODE128(string, code){
	code = code || "B";

	this.string128 = string+"";
	
	this.valid = valid;

	//The public encoding function
	this.encoded = function(){
		if(valid(string)){
			return calculate["code128" + code](string);
		}
		else{
			return "";
		}
	}

	//Data for each character, the last characters will not be encoded but are used for error correction
	var code128b = [
	[" ","11011001100",0],
	["!","11001101100",1],
	["\"","11001100110",2],
	["#","10010011000",3],
	["$","10010001100",4],
	["%","10001001100",5],
	["&","10011001000",6],
	["'","10011000100",7],
	["(","10001100100",8],
	[")","11001001000",9],
	["*","11001000100",10],
	["+","11000100100",11],
	[",","10110011100",12],
	["-","10011011100",13],
	[".","10011001110",14],
	["/","10111001100",15],
	["0","10011101100",16],
	["1","10011100110",17],
	["2","11001110010",18],
	["3","11001011100",19],
	["4","11001001110",20],
	["5","11011100100",21],
	["6","11001110100",22],
	["7","11101101110",23],
	["8","11101001100",24],
	["9","11100101100",25],
	[":","11100100110",26],
	[";","11101100100",27],
	["<","11100110100",28],
	["=","11100110010",29],
	[">","11011011000",30],
	["?","11011000110",31],
	["@","11000110110",32],
	["A","10100011000",33],
	["B","10001011000",34],
	["C","10001000110",35],
	["D","10110001000",36],
	["E","10001101000",37],
	["F","10001100010",38],
	["G","11010001000",39],
	["H","11000101000",40],
	["I","11000100010",41],
	["J","10110111000",42],
	["K","10110001110",43],
	["L","10001101110",44],
	["M","10111011000",45],
	["N","10111000110",46],
	["O","10001110110",47],
	["P","11101110110",48],
	["Q","11010001110",49],
	["R","11000101110",50],
	["S","11011101000",51],
	["T","11011100010",52],
	["U","11011101110",53],
	["V","11101011000",54],
	["W","11101000110",55],
	["X","11100010110",56],
	["Y","11101101000",57],
	["Z","11101100010",58],
	["[","11100011010",59],
	["\\","11101111010",60],
	["]","11001000010",61],
	["^","11110001010",62],
	["_","10100110000",63],
	["`","10100001100",64],
	["a","10010110000",65],
	["b","10010000110",66],
	["c","10000101100",67],
	["d","10000100110",68],
	["e","10110010000",69],
	["f","10110000100",70],
	["g","10011010000",71],
	["h","10011000010",72],
	["i","10000110100",73],
	["j","10000110010",74],
	["k","11000010010",75],
	["l","11001010000",76],
	["m","11110111010",77],
	["n","11000010100",78],
	["o","10001111010",79],
	["p","10100111100",80],
	["q","10010111100",81],
	["r","10010011110",82],
	["s","10111100100",83],
	["t","10011110100",84],
	["u","10011110010",85],
	["v","11110100100",86],
	["w","11110010100",87],
	["x","11110010010",88],
	["y","11011011110",89],
	["z","11011110110",90],
	["{","11110110110",91],
	["|","10101111000",92],
	["}","10100011110",93],
	["~","10001011110",94],
	[String.fromCharCode(127),"10111101000",95],
	[String.fromCharCode(128),"10111100010",96],
	[String.fromCharCode(129),"11110101000",97],
	[String.fromCharCode(130),"11110100010",98],
	[String.fromCharCode(131),"10111011110",99],
	[String.fromCharCode(132),"10111101110",100],
	[String.fromCharCode(133),"11101011110",101],
	[String.fromCharCode(134),"11110101110",102],
	//Start codes
	[String.fromCharCode(135),"11010000100",103],
	[String.fromCharCode(136),"11010010000",104],
	[String.fromCharCode(137),"11010011100",105]];

	//The end bits
	var endBin = "1100011101011";

	//This regexp is used for validation
	var regexp = /^[!-~ ]+$/;

	//Use the regexp variable for validation
	function valid(){
		if(string.search(regexp)==-1){
			return false;
		}
		return true;
	}

	//The encoder function that return a complete binary string. Data need to be validated before sent to this function
	//This is general calculate function, which is called by code specific calculate functions
	function calculateCode128(string, encodeFn, startCode, checksumFn){
		var result = "";

		//Add the start bits
		result += encodingById(startCode);

		//Add the encoded bits
		result += encodeFn(string);

		//Add the checksum
		result += encodingById(checksumFn(string, startCode));

		//Add the end bits
		result += endBin;
		
		return result;
	}
	
	//Code specific calculate functions
	var calculate = {
		code128B: function(string){
			return calculateCode128(string, encodeB, 104, checksumB);
		},
		code128C: function(string){
			string = string.replace(/ /g, "");
			return calculateCode128(string, encodeC, 105, checksumC);
		}
	}

	//Encode the characters (128 B)
	function encodeB(string){
		var result = "";
		for(var i=0;i<string.length;i++){
			result+=encodingByChar(string[i]);
		}
		return result;
	}
	
	//Encode the characters (128 C)
	function encodeC(string){
		var result = "";
		for(var i=0;i<string.length;i+=2){
			result+=encodingById(parseInt(string.substr(i, 2)));
		}
		return result;
	}

	//Calculate the checksum (128 B)
	function checksumB(string, startCode){
		var sum = 0;
		for(var i=0;i<string.length;i++){
			sum += weightByCharacter(string[i])*(i+1);
		}
		return (sum+startCode) % 103;
	}
	
	//Calculate the checksum (128 C)
	function checksumC(string, startCode){
		var sum = 0;
		var w = 1;
		for(var i=0;i<string.length;i+=2){
			sum += parseInt(string.substr(i, 2))*(w);
			w++;
		}
		return (sum+startCode) % 103;
	}

	//Get the encoded data by the id of the character
	function encodingById(id){
		for(var i=0;i<code128b.length;i++){
			if(code128b[i][2]==id){
				return code128b[i][1];
			}
		}
		return "";
	}

	//Get the id (weight) of a character
	function weightByCharacter(character){
		for(var i=0;i<code128b.length;i++){
			if(code128b[i][0]==character){
				return code128b[i][2];
			}
		}
		return 0;
	}

	//Get the encoded data of a character
	function encodingByChar(character){
		for(var i=0;i<code128b.length;i++){
			if(code128b[i][0]==character){
				return code128b[i][1];
			}
		}
		return "";
	}
}

function CODE128B(string) {
	return new CODE128(string, "B");
}
function CODE128C(string) {
	return new CODE128(string, "C");
};
(function(win, doc) {
    
    var Pankkiviivakoodi = {
        backgroundColor: "#fff",
        lineColor: "#000",
        strict: false
    };
	
	var leadingZerosNum = function(zerosStr, num) {
		var zerosLen = zerosStr.length;
		return (zerosStr.substring(0, zerosLen - (""+num).length) + num).substring(0, zerosLen);
	};
    
    var drawErrorImage = function(img, msg) {
        var canvas = doc.createElement("canvas");
        
        //Get the canvas context
		var ctx	= canvas.getContext("2d");
		
		//Set the width and height of the barcode
		canvas.width = img.offsetWidth;
		canvas.height = img.offsetHeight;
		
		//Paint the canvas
		ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = Pankkiviivakoodi.backgroundColor;
        ctx.fillRect(0,0,canvas.width,canvas.height);
		
		ctx.fillStyle = Pankkiviivakoodi.lineColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(msg, canvas.width/2, canvas.height/2);
        
		//Grab the dataUri from the canvas
		var uri = canvas.toDataURL('image/png');
        img.setAttribute("src", uri);
    };
    
    var drawGeneralErrorImage = function(img) {
        drawErrorImage(img, "Virheellinen pankkiviivakoodi");
    };
    
    /**
     * Check if parameters are valid. Print error image (and throw exception) if not valid.
     */
    var checkStrictValidity = function(img, iban, eurot, sentit, viite, paiva, kuukausi, vuosi) {
        if (viite.length > 20) {
            drawGeneralErrorImage(img);
			throw "Viitenumero liian pitkä (max. 20).";
        }
        if (viite.length < 4) {
            drawGeneralErrorImage(img);
            throw "Viitenumero liian lyhyt (min. 4).";
        }
        if (iban.length != 16) {
            drawGeneralErrorImage(img);
            throw "IBAN tilinumero virheellinen.";
        }
    };
    
    /**
     * Check if parameters are valid. Prints out warn message on console if not valid.
     * If mode "strict" is true, throw exception if not valid.
     */
    var checkLooseValidity = function(img, iban, eurot, sentit, viite, paiva, kuukausi, vuosi) {
        var giveError = function(msg, looseExtraMsg) {
            if (Pankkiviivakoodi.strict) {
                drawGeneralErrorImage(img);
                throw msg;
            }
            else {
                console.warn(msg + " " + looseExtraMsg);
            }
        };
		if ((""+eurot).length > 6) {
			eurot = 0;
			sentit = 0;
            giveError("Laskun summa on liian suuri tulostettavaksi viivakoodille.", "Tulostetaan summa 00000000.");
		}
		else if ((""+sentit).length > 2) {
			giveError("Annetut sentit ovat enemmän kuin 99.", "Tulostetaan summa 00000000.");
			eurot = 0;
			sentit = 0;
		}
    };
    
	/**
	 * Luo suomalaisen pankkiviivakoodin.
	 * img 		- HTML kuvaelementti, mihin viivakoodi piiretään
	 * iban 	- IBAN tilinumero
	 * eurot 	- Laskun summan eurot
	 * sentit 	- Laskun summan sentit
	 * viite 	- Viitenumero
	 * paiva 	- Laskun eräpäivän päivämäärä
	 * kuukausi - Laskun epäpäivän kuukausi
	 * vuosi 	- Laskun eräpäivän vuosi
	 */
    Pankkiviivakoodi.luo = function(img, iban, eurot, sentit, viite, paiva, kuukausi, vuosi) {
		img.style.height = "10mm";
		img.style.width = "105mm";
        
		iban = (""+iban).replace("FI", "").replace(/ /g, "");
        
		if (arguments.length < 8) {
            drawGeneralErrorImage(img);
			throw "Unohdit antaa kaikki function vaativat parametrit.";
		}
        
        checkStrictValidity(img, iban, eurot, sentit, viite, paiva, kuukausi, vuosi);
        checkLooseValidity(img, iban, eurot, sentit, viite, paiva, kuukausi, vuosi);
		
		eurot = leadingZerosNum("000000", eurot);
		sentit = leadingZerosNum("00", sentit);
		viite = leadingZerosNum("00000000000000000000", viite);
		vuosi = (""+vuosi).substr(-2);
		kuukausi = leadingZerosNum("00", kuukausi);
		paiva = leadingZerosNum("00", paiva);
        
		
		var data = "4" + iban + eurot + sentit + "000" + viite + vuosi + kuukausi + paiva;
		
		JsBarcode(img, data, {
			width: 4, 
			height: img.offsetHeight,
            quite: 20,
			format: "CODE128C",
            backgroundColor: Pankkiviivakoodi.backgroundColor,
            lineColor: Pankkiviivakoodi.lineColor
		});
	};
    
    win["Pankkiviivakoodi"] = Pankkiviivakoodi;
    
})(window, document);
(function(win, doc) {
    
    var bn = {};
    
    /* bn object */
    bn.O = function() {
        this.link;
        this.value;
    };
    bn.O.prototype.value = undefined;
    bn.O.prototype.linkTo = function(link) {
        this.link = link;
    };
    bn.O.prototype.onChange = undefined;
    bn.O.prototype.commitChange = function(value) {
        this.value = value;
        if (this.link) this.link.onChange(value);
    };
    bn.O.prototype.notify = function() {
        this.commitChange(this.value);
    };
    bn.O.prototype.getValue = function() {
        return this.value;
    };
    bn.O.prototype.remove = function() {
        this.link.remove(this);
    };
    
    /* bn link */
    bn.Link = function() {
        this.value = undefined;
        
        this.nextId = 0;
        this.items = [];
        
        this.addAll = function(arr) {
            for (var i=0, l=arr.length; i<l; ++i) {
                this.add(arr[i]);
            }
        };
        this.addAll(arguments);
    };
    bn.Link.prototype = Object.create(bn.O.prototype);
    bn.Link.prototype.add = function(a) {
        if (!(a instanceof bn.O)) {
            if (typeof a == "string") {
                var els = doc.querySelectorAll(a);
                for (var i=0, l=els.length; i<l; ++i) {
                    this.add(new bn.E(els[i]));
                }
            }
            else {
                this.add(new bn.E(a));
            }
            return;
        }
        a._id = this.nextId;
        a.linkTo(this);
        this.items.push(a);
        
        this.nextId++;
    };
    bn.Link.prototype.remove = function(bno) {
        this.items[bno._id] = undefined;
        this.notify();
    };
    bn.Link.prototype.setValue = function(value) {
        this.onChange(value);
        return this;
    };
    bn.Link.prototype.onChange = function(value) {
        if (this.value === value) return;    
        
        this.value = value;
        this.notify();
    };
    bn.Link.prototype.notify = function() {   
        for (var i=0, l=this.items.length; i<l; ++i) {
            if (this.items[i] == undefined) continue;
            if (this.items[i].onChange) this.items[i].onChange(this.value);
        }
        
        this.commitChange(this.value);
    };
    
    /* bn oneway */
    bn.oneway = function() {
        bn.Link.apply(this, arguments);
    };
    bn.oneway.prototype = Object.create(bn.Link.prototype);
    bn.oneway.prototype.onChange = function(value) {
        this.value = value;
    };
    
    /* bn element */
    bn.E = function(htmlElement) {
        if (htmlElement == undefined || htmlElement.tagName == undefined) return;
        
        if (htmlElement.tagName.toLowerCase() == "input") {
            if (htmlElement.type == "checkbox") {
                return new bn.ECheckbox(htmlElement);
            }
            else {
                return new bn.EInput(htmlElement);
            }
        }
        
        this.el = htmlElement;
        
        var _this = this;
        this.el.addEventListener("keyup", function() {
            _this.notify();
        }, false);
    };
    bn.E.prototype = Object.create(bn.O.prototype);
    bn.E.prototype.notify = function() {
        this.commitChange(this.el.textContent);
    };
    bn.E.prototype.onChange = function(value) {
        this.el.textContent = value;
    };
    
    /* bn element input */
    bn.EInput = function(htmlElement) {
        if (htmlElement == undefined) return;
        this.el = htmlElement;
        
        var _this = this;
        this.el.addEventListener("keyup", function() {
            _this.notify();
        }, false);
    };
    bn.EInput.prototype = Object.create(bn.O.prototype);
    bn.EInput.prototype.notify = function() {
        this.commitChange(this.el.value);
    };
    bn.EInput.prototype.onChange = function(value) {
        this.el.value = value;
    };
    
    bn.ECheckbox = function(htmlElement) {
        if (htmlElement == undefined) return;
        this.el = htmlElement;
        
        var _this = this;
        this.el.addEventListener("change", function() {
            _this.notify();
        }, false);
    };
    bn.ECheckbox.prototype = Object.create(bn.O.prototype);
    bn.ECheckbox.prototype.notify = function() {
        this.commitChange(this.el.checked);
    };
    bn.ECheckbox.prototype.onChange = function(value) {
        this.el.checked = (value && value != false && value != "false");
    };
    
    win["bn"] = bn.Link;
    win["bn"].O = bn.O;
    win["bn"].E = bn.E;
    win["bn"].oneway = bn.oneway;

})(window, document);

/***
 * BillMachine
 */

(function(win, doc) {
    
    /* 
     * Helper functions 
     */
    var text = function(el, txt) {
        if (txt != undefined) el.textContent = txt;
        else return el.textContent;
    };

    var html = function(el, h) {
        if (h) el.innerHTML = h;
        else return el.innerHTML;
    };

    var val = function(str) {
        var o = parseFloat(str);
        if (!o) o = 0;
        return o;
    };

    var elVal = function(el) {
        return bn.val(el.textContent);
    };

    var des2str = function(num) {
        return num.toFixed(2);
    };

    var dateToString = function(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        return d + "." + m + "." + y;
    };

    var stringToDate = function(str) {
        var d = new Date();
        var p = str.split(".");
        d.setDate(p[0]);
        d.setMonth(p[1]-1);
        d.setFullYear(p[2]);

        return d;
    };
    /* 
     * END
     * Helper functions 
     */
    
    /* Strings */
    var CONFIRM_DELETE      = "Haluatko varmasti poistaa kyseisen kohteen?"
    ;
    
    /* Elements */
    var billerNameEl = doc.querySelector("#biller-name");
    var paymentReceiverEl = doc.querySelector("#payment-receiver");
    var billInfoTable = doc.querySelector("#bill-info-table");
    var billIdEl = doc.querySelector("#bill-id");
    var billNameEl = doc.querySelector("#bill-name");
    var refnumEl = doc.querySelector("#refnum");
    var dateEl = doc.querySelector("#date");
    var datePayEl = doc.querySelector("#date-pay");
    var datesToPayEl = doc.querySelector("#dates-to-pay");
    var payInterestEl = doc.querySelector("#pay-interest");
    var accountNumberEl = doc.querySelector("#account-number");
    var accountShortCodeEl = doc.querySelector("#account-shortcode");
    var clientEl = doc.querySelector("#client-info");
    var additionalInfoEl = doc.querySelector("#additional-info");
    var jobsTableEl = doc.querySelector("#jobs-table");
    var novatTotalEl = doc.querySelector("#novat-total");
    var vatTotalEl = doc.querySelector("#vat-total");
    var totalEl = doc.querySelector("#total");
    var notesEl = doc.querySelector("#notes");
    var footer1El = doc.querySelector("#footer-1");    
    var footer2El = doc.querySelector("#footer-2");    
    var footer3El = doc.querySelector("#footer-3");
    var barcodeEl = doc.querySelector("#barcode");
    
    
    var jobRows = [];
    
    var JobRow = function(rowEl) { 
        this.totalBnO = new bn.O();
        this.totalBnO.isJobBn = true;

        this.el = JobRow.newJobRowEl.cloneNode(true);
        this.el.id = "";
        this.el.className = "job-row";

        JobRow.newJobRowEl.parentElement.insertBefore(this.el, JobRow.newJobRowEl);
        this.addDelEvent();

        var _this = this;
        this.el.addEventListener("contextmenu", function() {
            _this.totalBnO.remove();
            this.remove();
        }, false);

        this.descEl = this.el.querySelector(".desc");
        this.countEl = this.el.querySelector(".count");
        this.countUnitEl = this.el.querySelector(".count-unit");
        this.apriceEl = this.el.querySelector(".aprice");
        this.alvpEl = this.el.querySelector(".alvp");
        this.alveEl = this.el.querySelector(".alve");
        this.sumEl = this.el.querySelector(".sum");

        this.apriceEl.onblur = function() {
            this.textContent = bn.des2str(bn.elVal(this));
        }

        this.addBind();
    };
    JobRow.newJobRowEl = doc.querySelector("#new-job-row");
    JobRow.prototype.remove = function() {
        this.el.remove();
        this.deleted = true;
    };
    JobRow.prototype.delEvent = function(evt) {
        evt.preventDefault();
        if (confirm(CONFIRM_DELETE)) {
            this.remove();
        }
    };
    JobRow.prototype.addDelEvent = function() {
        var _this = this;
        this.el.addEventListener("contextmenu", function(evt) {
            _this.delEvent(evt);
        }, false);
    };
    JobRow.prototype.count = function() {
        var alve = bn.elVal(this.countEl) * bn.elVal(this.apriceEl) * (bn.elVal(this.alvpEl)/100);
        var sum = bn.elVal(this.countEl) * bn.elVal(this.apriceEl) + alve;

        this.alveEl.textContent = bn.des2str(alve);
        this.sumEl.textContent = bn.des2str(sum);

        this.totalBnO.vat = alve;
        this.totalBnO.total = sum;

        this.totalBnO.link.notify();
    };
    JobRow.prototype.addBind = function() {
        this.totalBnO.vat = 0;
        this.totalBnO.total = 0;

        var jobBn = new bn.oneway(this.countEl, this.apriceEl, this.alvpEl);
        var _this = this;
        jobBn.onChange = function(value) {
            _this.count();
        };
    };
    JobRow.prototype.toJSON = function() {
        var o = {
            description: bn.text(this.descEl),
            count: bn.text(this.countEl),
            count_unit: bn.text(this.countUnitEl),
            aprice: bn.text(this.apriceEl),
            alvp: bn.text(this.alvpEl),
            avle: bn.text(this.alveEl),
            sum: bn.text(this.sumEl)
        };
        return o;
    };
    JobRow.prototype.fromJSON = function(json) {
        bn.text(this.descEl, json.description);
        bn.text(this.countEl, json.count);
        bn.text(this.countUnitEl, json.count_unit);
        bn.text(this.apriceEl, json.aprice);
        bn.text(this.alvpEl, json.alvp);

        this.count();
    };
    
    var isUpdating = false;
    
    var date;
    var totalBn;
    var totalElBn = new bn(".total");

    var totalBnListener = new bn.O();
    totalBnListener.onChange = function() {
        calcRowsTotal();
    };

    var billInfoDatePayBn = new bn(".date-pay");

    var billInfoDatePayBnO = new bn.O();
    billInfoDatePayBnO.onChange = function(value) {
        this.value = getDatePay(value);
        datePayEl.textContent = this.value;
        billInfoDatePayBn.setValue(this.value);
    };

    var refNumBnO = new bn.O();
    refNumBnO.onChange = function(value) {
        this.value = calcRefNum(value);
        refnumEl.textContent = this.value;
    };

    var datesToPayElBnE = new bn.E(datesToPayEl);

    var accountNumberBn = new bn("#account-number");
    var accountShortCodeBn = new bn(".account-shortcode");
    var clientInfoBn = new bn(".client-info");
    var dateBn = new bn(billInfoDatePayBnO, datesToPayElBnE);
    var refnumBn = new bn(refNumBnO, billIdEl, ".bill-id");

    var barcodeBnListener = new bn(dateBn, refnumBn, accountNumberBn, totalElBn);
    barcodeBnListener.onChange = function() {
        var sum = (""+totalElBn.getValue()).split(".");
        var d = (""+billInfoDatePayBnO.getValue()).split(".");

        if (!isUpdating) {
            try {
                Pankkiviivakoodi.strict = true;
                Pankkiviivakoodi.luo(barcodeEl, accountNumberBn.getValue(), 
                                     sum[0], sum[1], (""+refNumBnO.getValue()), 
                                     d[0], d[1], d[2]);
            }
            catch(e) {
                console.warn(e);
                BillMachine.notification(e, BillMachine.notification.TYPE_WARN);
            }
        }
    };
    
    var dateChangeBnListener = new bn(dateEl);
    dateChangeBnListener.onChange = function() {
        date = bn.stringToDate(bn.text(dateEl));
        dateBn.notify();
    };
    
    var calcRefNum = function(billId) {
        var wc = 0;

        var weights = [7, 3, 1];
        var weightsCount = 3;
        var c = 0;
        for (var i=billId.length-1; i>=0; --i) {
            wc += bn.val(billId.charAt(i)) * weights[c%weightsCount];
            c++;
        }

        var checkNum = (Math.ceil(wc/10)*10) - wc;
        if (checkNum == "10") checkNum = 0;

        return billId +""+ checkNum;
    };
    
    var deleteAllJobRows = function() {
        for (var i=0, l=jobRows.length; i<l; ++i) {
            jobRows[i].remove();
        }
        jobRows = [];
    };

    var addJobRow = function() {
        var jobRow = new JobRow();
        jobRow.el.children[0].focus();
        jobRows.push(jobRow);
        totalBn.add(jobRow.totalBnO);
        return jobRow;
    }

    var calcRowsTotal = function() {
        var vatTotal = 0;
        var total = 0;

        for (var i=0, l=totalBn.items.length; i<l; ++i) {
            var bno = totalBn.items[i];
            if (bno == undefined || bno.isJobBn == undefined) continue;

            vatTotal += bno.vat;
            total += bno.total;
        }
        novatTotalEl.textContent = bn.des2str(total - vatTotal);
        vatTotalEl.textContent = bn.des2str(vatTotal);
        totalEl.textContent = bn.des2str(total);

        totalElBn.setValue(bn.des2str(total));
    };

    var fillDateTodays = function() {
        var dateTodays = doc.querySelectorAll(".date-today");
        var dateToday = bn.dateToString(date);
        for (var i=0, l=dateTodays.length; i<l; ++i) {
            dateTodays[i].textContent = dateToday;
        }
    };

    var getDatePay = function(datesToPay) {
        datesToPay = bn.val(datesToPay);
        var datesToPayMillis = datesToPay * 24 * 60 * 60 * 1000;
        var d = new Date(+date + datesToPayMillis);
        return bn.dateToString(d);
    };

    var BillMachine = {};
    
    BillMachine.initPage = function() {
        date = new Date();

        totalBn = new bn(totalBnListener);

        deleteAllJobRows();
    };
    BillMachine.update = function() {
        
        accountNumberBn.setValue(bn.text(accountNumberEl));
        accountShortCodeBn.setValue(bn.text(accountShortCodeEl));
        clientInfoBn.setValue(bn.text(clientEl));

        refnumBn.setValue(bn.text(billIdEl));
    
        fillDateTodays();

        datesToPayElBnE.notify();
        accountNumberBn.notify();
        
        JobRow.newJobRowEl.addEventListener("click", addJobRow, false);
    };
    
    BillMachine.init = function() {
        isUpdating = true;
        BillMachine.initPage();
        BillMachine.update();
        isUpdating = false;
    };
    
    BillMachine.addJobRow = addJobRow;

    BillMachine.getJobRows = function() {
        return jobRows;
    };

    BillMachine.getJobRowsJSON = function() {
        var arr = [];
        for (var i=0, l=jobRows.length; i<l; ++i) {
            if (!jobRows[i].deleted) {
                arr.push(jobRows[i].toJSON());
            }
        }
        return arr;
    };

    BillMachine.setJobRowsFromJSON = function(json) {
        deleteAllJobRows();
        for (var i=0, l=json.length; i<l; ++i) {
            addJobRow().fromJSON(json[i]);
        }
    };

    BillMachine.getJSON = function() {
        return {
            biller_name: bn.text(billerNameEl),
            payment_receiver: bn.text(paymentReceiverEl),
            
            bill_name: bn.text(billNameEl),
            bill_id: bn.text(billIdEl),
            ref_num: bn.text(refnumEl),

            date: bn.text(dateEl),
            date_pay: bn.text(datePayEl),
            days_to_pay: bn.text(datesToPayEl),
            pay_interest: bn.text(payInterestEl),

            client: bn.text(clientEl),
            additional_info: bn.text(additionalInfoEl),

            no_vat_total: bn.text(novatTotalEl),
            vat_total: bn.text(vatTotalEl),
            total: bn.text(totalEl),
            
            account_number: bn.text(accountNumberEl),
            account_shortcode: bn.text(accountShortCodeEl),

            job_rows: BillMachine.getJobRowsJSON(),

            footer1: bn.text(footer1El),
            footer2: bn.text(footer2El),
            footer3: bn.text(footer3El),
            
            notes: bn.text(notesEl)
        };
    };

    BillMachine.loadFromJSON = function(json) {
        isUpdating = true;
        BillMachine.initPage();
        
        bn.text(billerNameEl, json.biller_name);
        bn.text(paymentReceiverEl, json.payment_receiver);
        
        bn.text(billNameEl, json.bill_name);
        bn.text(billIdEl, json.bill_id);
        
        date = bn.stringToDate(json.date);
        bn.text(datesToPayEl, json.days_to_pay);
        bn.text(payInterestEl, json.pay_interest);
        
        bn.text(clientEl, json.client);
        bn.text(additionalInfoEl, json.additional_info);
        
        bn.text(accountNumberEl, json.account_number);
        bn.text(accountShortCodeEl, json.account_shortcode);
        
        BillMachine.setJobRowsFromJSON(json.job_rows);
        
        bn.text(footer1El, json.footer1);
        bn.text(footer2El, json.footer2);
        bn.text(footer3El, json.footer3);
        
        bn.text(notesEl, json.notes);
        
        BillMachine.update();
        isUpdating = false;
        barcodeBnListener.onChange();
    };
    
    BillMachine.notification = function(msg, type) {
        if (!type) type = BillMachine.notification.TYPE_OK;
        
        var el = doc.createElement("div");
        el.className = "notification " + type;
        el.textContent = msg;
        
        doc.body.appendChild(el);
        
        setTimeout(function() {
            el.className += " active ";
        }, 100);
        setTimeout(function() {
            el.className = el.className.replace(" active", "");
        }, 1000);
        setTimeout(function() {
            el.remove();
        }, 1300);
    };
    BillMachine.notification.TYPE_OK = "ok";
    BillMachine.notification.TYPE_WARN = "warn";
    
    win["BillMachine"] = BillMachine;
    
})(window, document);

/***
 * Control panel
 */

(function(win, doc) {
    
    /* Strings */
    var SAVE        = "Tallenna",
        SAVED       = "Tallennettu",
        LOADED      = "Ladattu",
        DELETED     = "Poistettu",
        NEW         = "Uusi",
        
        NO_SAVE_FILE_NAME_NOTIF     = "Anna tiedostonimi.",
        CONFIRM_LOST_UNSAVED        = "Tallentamattomat tiedot menetetään. Haluatko jatkaa?",
        CONFIRM_BILL_DELETE         = "Haluatko varmasti poistaa tallennetun laskun?"
    ;
    
    /* Elements */
    var body = doc.getElementsByTagName("body")[0];
    var controlPanel = doc.querySelector("#controls");
    var saveNameInputEl = doc.querySelector("#save-name");
    var saveButtonEl = doc.querySelector("#save");
    var loadButtonEl = doc.querySelector("#load");
    var newButtonEl = doc.querySelector("#new");
    var savedBillsEl = doc.querySelector("#saved-bills");
    var tilisiirtoEl = doc.querySelector("#tilisiirto");
    var showTilisiirtoEl = doc.querySelector("#show-tilisiirto");
    
    var notification = function(msg, type) {
        BillMachine.notification(msg, type);
    };
    
    var hasChanges = false;
    
    var hasChangesEvent = function() {
        hasChanges = true;
        win.removeEventListener(hasChangesEvent);
    };
    
    var setHasChangesFalse = function() {
        hasChanges = false;
        win.addEventListener("keydown", hasChangesEvent, false);
        win.addEventListener("contextmenu", hasChangesEvent, false);
    };
    
    setHasChangesFalse();
    
    var hasChangesCheck = function() {
        return !hasChanges || confirm(CONFIRM_LOST_UNSAVED);
    };
    
    var deleteSaved = function(name) {
        if (confirm(CONFIRM_BILL_DELETE)) {
            localStorage.removeItem(name);
            loadSavedList();
            notification(DELETED);
        };
    };
    
    var openSaved = function(name) {
        if (hasChangesCheck()) {
            BillMachine.loadFromJSON(JSON.parse(localStorage[name]));
            saveNameInputEl.value = name;
            setHasChangesFalse();
            notification(LOADED);
            return true;
        }
        return false;
    };
    
    var save = function(name) {
        setHasChangesFalse();
        localStorage[name] = JSON.stringify(BillMachine.getJSON());
        notification(SAVED);
    };
    
    var prevSavedSel = undefined;
    var addOpenSavedOnClickEvent = function(el) {
        el.addEventListener("click", function() {
            if (openSaved(this.textContent)) {
                if (prevSavedSel != undefined) {
                    prevSavedSel.className = prevSavedSel.className.replace(" selected", "");
                }
                prevSavedSel = this;
                this.className += " selected";
            }
        }, false);
    };
    
    var addDeleteSavedEvent = function(el) {
        el.addEventListener("contextmenu", function(evt) {
            evt.preventDefault();
            deleteSaved(this.textContent);
        }, false);
    };
    
    var loadSavedList = function() {
        var tempEl = doc.createElement("div");
        tempEl.className = "list-item";
        
        var d = doc.createDocumentFragment();
        for (var k in localStorage) {
            var el = tempEl.cloneNode(true);
            el.textContent = k;
            
            d.appendChild(el);
            addOpenSavedOnClickEvent(el);
            addDeleteSavedEvent(el);
        };
        
        savedBillsEl.innerHTML = "";
        savedBillsEl.appendChild(d);
    };
    
    var getSaveName = function() {
        var name = saveNameInputEl.value;
        if (name <= 0) {
            alert(NO_SAVE_FILE_NAME_NOTIF);
            return false;
        }
        return name;
    };
    
    saveButtonEl.addEventListener("click", function() {
        var name = getSaveName();
        if(name) {
            save(name);
        }
    }, false);
    
    if (loadButtonEl) loadButtonEl.addEventListener("click", function() {
        var name = getSaveName();
        if(name) {
            openSaved(name);
        }
    }, false);
    
    newButtonEl.addEventListener("click", function() {
        if (hasChangesCheck()) {
            location.reload();
        }
    }, false);
    
    var showTilisiirtoBn = new bn(showTilisiirtoEl);
    showTilisiirtoBn.onChange = function(value) {
        if (value) {
            tilisiirtoEl.style.display = "block";
        }
        else {
            tilisiirtoEl.style.display = "none";
        }
    };
    
    BillMachine.init();
    loadSavedList();

})(window, document);