// config
String.prototype.endWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length) return false;
    if (this.substring(this.length - s.length) == s) return true;
    else return false;
    return true;
};
var countSum = 0;
var sysdate="";

  var urlprefix = "http://" + window.location.host + "/timesheet";
//  var urlprefix = "http://localhost:8080/timesheet";
$.ajaxPrefilter(function (options) {

    if (options.url.endWith('.json') || options.url.endWith('.do') || options.url.indexOf('.json?') >= 0 || options.url.indexOf('.do?') >= 0) {
        options.url = urlprefix + options.url;

    }

    // console.log("after----"+options.url);
});
 $.ajaxSetup({

    xhrFields: {
        withCredentials: true
    },
    crossDomain: true
});

var initflag=0;
var app = angular.module('testApp').config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider, $compileProvider, $filterProvider, $provide) {

        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
        app.value = $provide.value;
    }
]).config(['$translateProvider',
    function ($translateProvider) {
        // Register a loader for the static files
        // So, the module will search missing translation tables under the specified urls.
        // Those urls are [prefix][langKey][suffix].
        $translateProvider.useStaticFilesLoader({
            prefix: '../../l10n/',
            suffix: '.js'
        });
        // Tell the module what language to use by default
        $translateProvider.preferredLanguage('en');
        // Tell the module to store the language in the local storage
        $translateProvider.useLocalStorage();
    }
])
.run(['ngTip', function(ngTip) {
    window.ngTip=ngTip;
}])
.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('UserInterceptor');
})

.factory('UserInterceptor',['$q','$rootScope','ngTip',
    function ($q,$rootScope,ngTip) {
	   //CreateOuterDiv();
       var urlprefix = "http://" + window.location.host + "/timesheet";
//        var urlprefix = "http://localhost:8080/timesheet";
        var interceptor = {
            'request': function (config) {
            	if(initflag==0){
            		initflag=initflag+1;
            		 $.post('/systime.json',{ChannelId:'VPPC'}).then(function(response) {
                     	$rootScope.end=response.today;
                     	//alert($rootScope.end);
                     	sysdate=$rootScope.end;
                     //	alert(sysdate);
             	    }, function(x) {
             	    	$rootScope.authError = '系统错误';
             	    });
            	}



                    if (config.url.endWith('.json') || config.url.endWith('.do') || config.url.indexOf('.json?') >= 0 || config.url.indexOf('.do?') >= 0) {
                        config.url = urlprefix + config.url;
                    }
                    var enCode = ""
                    config.data || (config.data = {})
                        //  alert(config.data.DownPath);
                    config.data.ChannelId = "VPPC";
                    config.data.sysDate=sysdate;
                    if (config.url.indexOf("Import.json") != -1) {
                        return config || $q.when(config);
                    }
                    if (!config.data.DownPath) {
                        config.data.Random = Math.random();
                       // config.data.sysDate=sysdate;
                        enCode = angular.toJson(config.data);
                        config.data = {}; //清空原请求参数

                        typeof encData == 'undefined' || !enCode || (enCode = encData(enCode));
                        config.data.ChannelId = "VPPC";
                        config.data.DATA = enCode;
                    }


                   // alert(config.data.sysDate);
                    return config || $q.when(config);
                },
                'response': function (response) {
                    if (response.data.errcode === "10000") {
                        if (response.data.errmsg == "用户未登录") {
                            console.log(countSum);
                            if(localStorage.getItem("type")=="0"){
                            	if (countSum == 0) {
                            	 countSum = countSum + 1;
                             	CreateOuterDiv();

                             }
                            }

                            /*if (countSum == 0) {
                                alert(response.data.errmsg);
                                countSum = countSum + 1;
                                top.location.href = "http://" + window.location.host;
                            }  */
                            return;
                        } else {
                        				var vpDisTpe = response.data.vpDisTpe || "vpInfo";
                        				var vpDisTimes = response.data.vpDisTimes|| 4000;
                        				vpDisTimes=parseInt(vpDisTimes,10);
                            ngTip.alert(response.data.errmsg,vpDisTpe,vpDisTimes);
                            // alert(response.data.errmsg);
                            return;
                        }
                    }
                    return response;
                },
                'requestError': function (rejection) {
                    return $q.reject(rejection);
                },
                'responseError': function (rejection) {
                    return $q.reject(rejection);
                }

        };
        return interceptor;
    }]);


var divId=1;
//var createflage=false;
var CreateOuterDiv = function()
{

	 //  if(createflage==false){
	   	localStorage.setItem("type","1");
     var obj=document.createElement("div");
     obj.id="aa";
     obj.style.zIndex="999";
     obj.style.border="3px solid gold";
     obj.style.height="350px";
     obj.style.width="500px";
     obj.style.filter="alpha(opacity=70)";
     obj.style.margin="150px 0 0 -250px";
     obj.style.cursor="hand";
     obj.style.position="fixed"
     obj.style.left="50%";
     obj.style.top="0";
     obj.style.backgroundColor = "#5DA2F2";
     document.body.appendChild(obj);


     //用户登录
     var titlee=document.createElement("h2");
     titlee.id="bb";
     titlee.style.fontFamily="微软雅黑";
     titlee.style.fontSize="30px";
     titlee.style.color="#fff";
     titlee.style.margin="10px 0 0 0";
     titlee.innerText="确认登录";
     titlee.align="center";
     titlee.className="bigintro";
     obj.appendChild(titlee);

     //邮箱DIV
     var mail=document.createElement("div");
     mail.id="cc";
     //mail.style.border="1px solid #000000";
     mail.style.height="80px";
     mail.style.width="500px";
     mail.style.margin="5px 0 0 0";
     obj.appendChild(mail);

     var div1=document.createElement("div");
     div1.id="cc1";
     div1.innerHTML="邮&nbsp;&nbsp;&nbsp;&nbsp;箱:";
     div1.className="text-label";
     div1.style.display="inline-block";
     div1.style.lineHeight="80px";
     div1.style.width="150px";
     div1.style.fontSize="20px";
     div1.align="center";
     mail.appendChild(div1);

     var div2=document.createElement("div");
     div2.id="cc2";
     div2.style.display="inline-block";
     div2.style.width="300px";
     mail.appendChild(div2);


     var inp=document.createElement("input");
     inp.id="cc4";
     inp.value=localStorage.getItem("loginId");
     inp.readOnly=true;
     inp.type="email";
     inp.className="form-control pad0 login-radius";
     div2.appendChild(inp);

     //密码DIV
     var password=document.createElement("div");
     password.id="dd";
     //password.style.border="1px solid #000000";
     password.style.height="80px";
     password.style.width="500px";
     password.style.margin="5px 0 0 0";
     obj.appendChild(password);

     var div3=document.createElement("div");
     div3.id="dd1";
     div3.innerHTML="密&nbsp;&nbsp;&nbsp;&nbsp;码:";
     div3.className="text-label";
     div3.style.display="inline-block";
     div3.style.lineHeight="80px";
     div3.style.width="150px";
     div3.style.fontSize="20px";
     div3.align="center";
     password.appendChild(div3);

     var div4=document.createElement("div");
     div4.id="dd2";
     div4.style.display="inline-block";
     div4.style.width="300px";
     password.appendChild(div4);


     var inp2=document.createElement("input");
     inp2.id="dd4";
     inp2.type="password";
     inp2.className="form-control pad0 login-radius";
     div4.appendChild(inp2);

     //登录按钮DIV
     var butt=document.createElement("div");
     butt.id="ee";
     //butt.style.border="1px solid #000000";
     butt.style.height="65px";
     butt.style.width="500px";
     butt.style.margin="5px 0 0 0";
     obj.appendChild(butt);

     var butto=document.createElement("button");
     butto.id="dengru"
     butto.type="submit";
     butto.className="btn btn-info login-radius";
     butto.innerHTML="<span >&nbsp;登&nbsp;录</span>";
     butto.style.backgroundColor = "#9999FF";
     butto.style.border="#23B7E5";
     butto.style.width="300px";
     butto.style.margin="20px 0 0 150px";
     butto.style.fontSize="20px";
     butto.style.fontWeight="bold";
     butt.appendChild(butto);

     //错误提示
     var tip=document.createElement("div");
     tip.id="ff";
     tip.style.height="40px";
     tip.style.width="500px";
     tip.style.margin="12px 0 0 0";
     tip.align="center";
     tip.style.display="none";
     obj.appendChild(tip);

     document.getElementById(butto.id).onclick=function(){login();};
     document.getElementById(inp2.id).focus();
     document.getElementById(inp2.id).onkeypress=function(){getKey();};
      // }

}
 //INPUT内按下回车触发
function getKey(){
    if(event.keyCode==13)
    {
        document.getElementById("dengru").click();
        return false;
    }
}

function login()
{

  var none=document.getElementById("aa")
		var loginid=localStorage.getItem("loginId");
  var password= document.getElementById("dd4").value;
  $.post('/loginRepeat.json', {loginid: loginid, password: password})
		.then(function(response) {
				if (response.errcode!='0') {
					if(response.errcode=='1100'){
						//alert(response.errmsg);
                        var tip1=document.getElementById("ff");
                        tip1.innerText=response.errmsg;
                        tip1.style.display="block";
                        window.setInterval("skipUrl()",2000);

					}else{
						//alert(response.errmsg);
                        var tip1=document.getElementById("ff");
                        tip1.innerText=response.errmsg;
                        tip1.style.display="block";
					}
				//	createflage=false;
					localStorage.removeItem("type");
					localStorage.setItem("type","0");
				} else {
					none.style.display="none";
					//createflage=false;
					localStorage.removeItem("type");
					localStorage.setItem("type","0");
				}

		}, function (x) {
			alert("系统错误");
		});

}

function skipUrl(){
	var f_url='http://vp.csii.com.cn';
	top.location.href =  f_url;

	}
















function encData(data) {
    var key1 = "111"; //密钥1
    var key2 = "111"; //密钥2
    var key3 = "111"; //密钥3
    return strEnc(data, key1, key2, key3); //加密
}

function deString() {
    var data = desform.dedata.value; //要解密的字符串
    var key1 = desform.keydata1.value; //密钥1
    var key2 = desform.keydata2.value; //密钥2
    var key3 = desform.keydata3.value; //密钥3
    var dechex = strDec(data, key1, key2, key3); //解密
    detext.innerText = dechex; //解密后的字符串
}

function comfun() {
    var Code = ran(13) + Math.random() * 10000000;
    var enCode = strEnc(Code + "-CSII-" + "@-" + "1601-", "CsII1o11", "ZYHGYZTTLYY", "l0k9j8h7OIe4r5");
    return enCode;
}

function ran(m) {
    m = m > 13 ? 13 : m;
    var num = new Date().getTime();
    return num.toString().substring(13 - m);
}

/**
 * DES加密/解密
 * @Copyright Copyright (c) 2006
 * @author Guapo
 * @see DESCore
 */

/*
 * encrypt the string to string made up of hex
 * return the encrypted string
 */
function strEnc(data, firstKey, secondKey, thirdKey) {

    var leng = data.length;
    var encData = "";
    var firstKeyBt, secondKeyBt, thirdKeyBt, firstLength, secondLength, thirdLength;
    if (firstKey != null && firstKey != "") {
        firstKeyBt = getKeyBytes(firstKey);
        firstLength = firstKeyBt.length;
    }
    if (secondKey != null && secondKey != "") {
        secondKeyBt = getKeyBytes(secondKey);
        secondLength = secondKeyBt.length;
    }
    if (thirdKey != null && thirdKey != "") {
        thirdKeyBt = getKeyBytes(thirdKey);
        thirdLength = thirdKeyBt.length;
    }

    if (leng > 0) {
        if (leng < 4) {
            var bt = strToBt(data);
            var encByte;
            if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "" && thirdKey != null && thirdKey != "") {
                var tempBt;
                var x, y, z;
                tempBt = bt;
                for (x = 0; x < firstLength; x++) {
                    tempBt = enc(tempBt, firstKeyBt[x]);
                }
                for (y = 0; y < secondLength; y++) {
                    tempBt = enc(tempBt, secondKeyBt[y]);
                }
                for (z = 0; z < thirdLength; z++) {
                    tempBt = enc(tempBt, thirdKeyBt[z]);
                }
                encByte = tempBt;
            } else {
                if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "") {
                    var tempBt;
                    var x, y;
                    tempBt = bt;
                    for (x = 0; x < firstLength; x++) {
                        tempBt = enc(tempBt, firstKeyBt[x]);
                    }
                    for (y = 0; y < secondLength; y++) {
                        tempBt = enc(tempBt, secondKeyBt[y]);
                    }
                    encByte = tempBt;
                } else {
                    if (firstKey != null && firstKey != "") {
                        var tempBt;
                        var x = 0;
                        tempBt = bt;
                        for (x = 0; x < firstLength; x++) {
                            tempBt = enc(tempBt, firstKeyBt[x]);
                        }
                        encByte = tempBt;
                    }
                }
            }
            encData = bt64ToHex(encByte);
        } else {
            var iterator = parseInt(leng / 4);
            var remainder = leng % 4;
            var i = 0;
            for (i = 0; i < iterator; i++) {
                var tempData = data.substring(i * 4 + 0, i * 4 + 4);
                var tempByte = strToBt(tempData);
                var encByte;
                if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "" && thirdKey != null && thirdKey != "") {
                    var tempBt;
                    var x, y, z;
                    tempBt = tempByte;
                    for (x = 0; x < firstLength; x++) {
                        tempBt = enc(tempBt, firstKeyBt[x]);
                    }
                    for (y = 0; y < secondLength; y++) {
                        tempBt = enc(tempBt, secondKeyBt[y]);
                    }
                    for (z = 0; z < thirdLength; z++) {
                        tempBt = enc(tempBt, thirdKeyBt[z]);
                    }
                    encByte = tempBt;
                } else {
                    if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "") {
                        var tempBt;
                        var x, y;
                        tempBt = tempByte;
                        for (x = 0; x < firstLength; x++) {
                            tempBt = enc(tempBt, firstKeyBt[x]);
                        }
                        for (y = 0; y < secondLength; y++) {
                            tempBt = enc(tempBt, secondKeyBt[y]);
                        }
                        encByte = tempBt;
                    } else {
                        if (firstKey != null && firstKey != "") {
                            var tempBt;
                            var x;
                            tempBt = tempByte;
                            for (x = 0; x < firstLength; x++) {
                                tempBt = enc(tempBt, firstKeyBt[x]);
                            }
                            encByte = tempBt;
                        }
                    }
                }
                encData += bt64ToHex(encByte);
            }
            if (remainder > 0) {
                var remainderData = data.substring(iterator * 4 + 0, leng);
                var tempByte = strToBt(remainderData);
                var encByte;
                if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "" && thirdKey != null && thirdKey != "") {
                    var tempBt;
                    var x, y, z;
                    tempBt = tempByte;
                    for (x = 0; x < firstLength; x++) {
                        tempBt = enc(tempBt, firstKeyBt[x]);
                    }
                    for (y = 0; y < secondLength; y++) {
                        tempBt = enc(tempBt, secondKeyBt[y]);
                    }
                    for (z = 0; z < thirdLength; z++) {
                        tempBt = enc(tempBt, thirdKeyBt[z]);
                    }
                    encByte = tempBt;
                } else {
                    if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "") {
                        var tempBt;
                        var x, y;
                        tempBt = tempByte;
                        for (x = 0; x < firstLength; x++) {
                            tempBt = enc(tempBt, firstKeyBt[x]);
                        }
                        for (y = 0; y < secondLength; y++) {
                            tempBt = enc(tempBt, secondKeyBt[y]);
                        }
                        encByte = tempBt;
                    } else {
                        if (firstKey != null && firstKey != "") {
                            var tempBt;
                            var x;
                            tempBt = tempByte;
                            for (x = 0; x < firstLength; x++) {
                                tempBt = enc(tempBt, firstKeyBt[x]);
                            }
                            encByte = tempBt;
                        }
                    }
                }
                encData += bt64ToHex(encByte);
            }
        }
    }
    return encData;
}

/*
 * decrypt the encrypted string to the original string
 *
 * return  the original string
 */
function strDec(data, firstKey, secondKey, thirdKey) {
        var leng = data.length;
        var decStr = "";
        var firstKeyBt, secondKeyBt, thirdKeyBt, firstLength, secondLength, thirdLength;
        if (firstKey != null && firstKey != "") {
            firstKeyBt = getKeyBytes(firstKey);
            firstLength = firstKeyBt.length;
        }
        if (secondKey != null && secondKey != "") {
            secondKeyBt = getKeyBytes(secondKey);
            secondLength = secondKeyBt.length;
        }
        if (thirdKey != null && thirdKey != "") {
            thirdKeyBt = getKeyBytes(thirdKey);
            thirdLength = thirdKeyBt.length;
        }

        var iterator = parseInt(leng / 16);
        var i = 0;
        for (i = 0; i < iterator; i++) {
            var tempData = data.substring(i * 16 + 0, i * 16 + 16);
            var strByte = hexToBt64(tempData);
            var intByte = new Array(64);
            var j = 0;
            for (j = 0; j < 64; j++) {
                intByte[j] = parseInt(strByte.substring(j, j + 1));
            }
            var decByte;
            if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "" && thirdKey != null && thirdKey != "") {
                var tempBt;
                var x, y, z;
                tempBt = intByte;
                for (x = thirdLength - 1; x >= 0; x--) {
                    tempBt = dec(tempBt, thirdKeyBt[x]);
                }
                for (y = secondLength - 1; y >= 0; y--) {
                    tempBt = dec(tempBt, secondKeyBt[y]);
                }
                for (z = firstLength - 1; z >= 0; z--) {
                    tempBt = dec(tempBt, firstKeyBt[z]);
                }
                decByte = tempBt;
            } else {
                if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "") {
                    var tempBt;
                    var x, y, z;
                    tempBt = intByte;
                    for (x = secondLength - 1; x >= 0; x--) {
                        tempBt = dec(tempBt, secondKeyBt[x]);
                    }
                    for (y = firstLength - 1; y >= 0; y--) {
                        tempBt = dec(tempBt, firstKeyBt[y]);
                    }
                    decByte = tempBt;
                } else {
                    if (firstKey != null && firstKey != "") {
                        var tempBt;
                        var x, y, z;
                        tempBt = intByte;
                        for (x = firstLength - 1; x >= 0; x--) {
                            tempBt = dec(tempBt, firstKeyBt[x]);
                        }
                        decByte = tempBt;
                    }
                }
            }
            decStr += byteToString(decByte);
        }
        return decStr;
    }
    /*
     * chang the string into the bit array
     *
     * return bit array(it's length % 64 = 0)
     */

function getKeyBytes(key) {
    var keyBytes = new Array();
    var leng = key.length;
    var iterator = parseInt(leng / 4);
    var remainder = leng % 4;
    var i = 0;
    for (i = 0; i < iterator; i++) {
        keyBytes[i] = strToBt(key.substring(i * 4 + 0, i * 4 + 4));
    }
    if (remainder > 0) {
        keyBytes[i] = strToBt(key.substring(i * 4 + 0, leng));
    }
    return keyBytes;
}

/*
 * chang the string(it's length <= 4) into the bit array
 *
 * return bit array(it's length = 64)
 */
function strToBt(str) {
    var leng = str.length;
    var bt = new Array(64);
    if (leng < 4) {
        var i = 0,
            j = 0,
            p = 0,
            q = 0;
        for (i = 0; i < leng; i++) {
            var k = str.charCodeAt(i);
            for (j = 0; j < 16; j++) {
                var pow = 1,
                    m = 0;
                for (m = 15; m > j; m--) {
                    pow *= 2;
                }
                bt[16 * i + j] = parseInt(k / pow) % 2;
            }
        }
        for (p = leng; p < 4; p++) {
            var k = 0;
            for (q = 0; q < 16; q++) {
                var pow = 1,
                    m = 0;
                for (m = 15; m > q; m--) {
                    pow *= 2;
                }
                bt[16 * p + q] = parseInt(k / pow) % 2;
            }
        }
    } else {
        for (i = 0; i < 4; i++) {
            var k = str.charCodeAt(i);
            for (j = 0; j < 16; j++) {
                var pow = 1;
                for (m = 15; m > j; m--) {
                    pow *= 2;
                }
                bt[16 * i + j] = parseInt(k / pow) % 2;
            }
        }
    }
    return bt;
}

/*
 * chang the bit(it's length = 4) into the hex
 *
 * return hex
 */
function bt4ToHex(binary) {
    var hex;
    switch (binary) {
    case "0000":
        hex = "0";
        break;
    case "0001":
        hex = "1";
        break;
    case "0010":
        hex = "2";
        break;
    case "0011":
        hex = "3";
        break;
    case "0100":
        hex = "4";
        break;
    case "0101":
        hex = "5";
        break;
    case "0110":
        hex = "6";
        break;
    case "0111":
        hex = "7";
        break;
    case "1000":
        hex = "8";
        break;
    case "1001":
        hex = "9";
        break;
    case "1010":
        hex = "A";
        break;
    case "1011":
        hex = "B";
        break;
    case "1100":
        hex = "C";
        break;
    case "1101":
        hex = "D";
        break;
    case "1110":
        hex = "E";
        break;
    case "1111":
        hex = "F";
        break;
    }
    return hex;
}

/*
 * chang the hex into the bit(it's length = 4)
 *
 * return the bit(it's length = 4)
 */
function hexToBt4(hex) {
    var binary;
    switch (hex) {
    case "0":
        binary = "0000";
        break;
    case "1":
        binary = "0001";
        break;
    case "2":
        binary = "0010";
        break;
    case "3":
        binary = "0011";
        break;
    case "4":
        binary = "0100";
        break;
    case "5":
        binary = "0101";
        break;
    case "6":
        binary = "0110";
        break;
    case "7":
        binary = "0111";
        break;
    case "8":
        binary = "1000";
        break;
    case "9":
        binary = "1001";
        break;
    case "A":
        binary = "1010";
        break;
    case "B":
        binary = "1011";
        break;
    case "C":
        binary = "1100";
        break;
    case "D":
        binary = "1101";
        break;
    case "E":
        binary = "1110";
        break;
    case "F":
        binary = "1111";
        break;
    }
    return binary;
}

/*
 * chang the bit(it's length = 64) into the string
 *
 * return string
 */
function byteToString(byteData) {
    var str = "";
    for (i = 0; i < 4; i++) {
        var count = 0;
        for (j = 0; j < 16; j++) {
            var pow = 1;
            for (m = 15; m > j; m--) {
                pow *= 2;
            }
            count += byteData[16 * i + j] * pow;
        }
        if (count != 0) {
            str += String.fromCharCode(count);
        }
    }
    return str;
}

function bt64ToHex(byteData) {
    var hex = "";
    for (i = 0; i < 16; i++) {
        var bt = "";
        for (j = 0; j < 4; j++) {
            bt += byteData[i * 4 + j];
        }
        hex += bt4ToHex(bt);
    }
    return hex;
}

function hexToBt64(hex) {
    var binary = "";
    for (i = 0; i < 16; i++) {
        binary += hexToBt4(hex.substring(i, i + 1));
    }
    return binary;
}

/*
 * the 64 bit des core arithmetic
 */

function enc(dataByte, keyByte) {
    var keys = generateKeys(keyByte);
    var ipByte = initPermute(dataByte);
    var ipLeft = new Array(32);
    var ipRight = new Array(32);
    var tempLeft = new Array(32);
    var i = 0,
        j = 0,
        k = 0,
        m = 0,
        n = 0;
    for (k = 0; k < 32; k++) {
        ipLeft[k] = ipByte[k];
        ipRight[k] = ipByte[32 + k];
    }
    for (i = 0; i < 16; i++) {
        for (j = 0; j < 32; j++) {
            tempLeft[j] = ipLeft[j];
            ipLeft[j] = ipRight[j];
        }
        var key = new Array(48);
        for (m = 0; m < 48; m++) {
            key[m] = keys[i][m];
        }
        var tempRight = xor(pPermute(sBoxPermute(xor(expandPermute(ipRight), key))), tempLeft);
        for (n = 0; n < 32; n++) {
            ipRight[n] = tempRight[n];
        }

    }


    var finalData = new Array(64);
    for (i = 0; i < 32; i++) {
        finalData[i] = ipRight[i];
        finalData[32 + i] = ipLeft[i];
    }
    return finallyPermute(finalData);
}

function dec(dataByte, keyByte) {
    var keys = generateKeys(keyByte);
    var ipByte = initPermute(dataByte);
    var ipLeft = new Array(32);
    var ipRight = new Array(32);
    var tempLeft = new Array(32);
    var i = 0,
        j = 0,
        k = 0,
        m = 0,
        n = 0;
    for (k = 0; k < 32; k++) {
        ipLeft[k] = ipByte[k];
        ipRight[k] = ipByte[32 + k];
    }
    for (i = 15; i >= 0; i--) {
        for (j = 0; j < 32; j++) {
            tempLeft[j] = ipLeft[j];
            ipLeft[j] = ipRight[j];
        }
        var key = new Array(48);
        for (m = 0; m < 48; m++) {
            key[m] = keys[i][m];
        }

        var tempRight = xor(pPermute(sBoxPermute(xor(expandPermute(ipRight), key))), tempLeft);
        for (n = 0; n < 32; n++) {
            ipRight[n] = tempRight[n];
        }
    }


    var finalData = new Array(64);
    for (i = 0; i < 32; i++) {
        finalData[i] = ipRight[i];
        finalData[32 + i] = ipLeft[i];
    }
    return finallyPermute(finalData);
}

function initPermute(originalData) {
    var ipByte = new Array(64);
    for (i = 0, m = 1, n = 0; i < 4; i++, m += 2, n += 2) {
        for (j = 7, k = 0; j >= 0; j--, k++) {
            ipByte[i * 8 + k] = originalData[j * 8 + m];
            ipByte[i * 8 + k + 32] = originalData[j * 8 + n];
        }
    }
    return ipByte;
}

function expandPermute(rightData) {
    var epByte = new Array(48);
    for (i = 0; i < 8; i++) {
        if (i == 0) {
            epByte[i * 6 + 0] = rightData[31];
        } else {
            epByte[i * 6 + 0] = rightData[i * 4 - 1];
        }
        epByte[i * 6 + 1] = rightData[i * 4 + 0];
        epByte[i * 6 + 2] = rightData[i * 4 + 1];
        epByte[i * 6 + 3] = rightData[i * 4 + 2];
        epByte[i * 6 + 4] = rightData[i * 4 + 3];
        if (i == 7) {
            epByte[i * 6 + 5] = rightData[0];
        } else {
            epByte[i * 6 + 5] = rightData[i * 4 + 4];
        }
    }
    return epByte;
}

function xor(byteOne, byteTwo) {
    var xorByte = new Array(byteOne.length);
    for (i = 0; i < byteOne.length; i++) {
        xorByte[i] = byteOne[i] ^ byteTwo[i];
    }
    return xorByte;
}

function sBoxPermute(expandByte) {

    var sBoxByte = new Array(32);
    var binary = "";
    var s1 = [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
    ];

    /* Table - s2 */
    var s2 = [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
    ];

    /* Table - s3 */
    var s3 = [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
    ];
    /* Table - s4 */
    var s4 = [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
    ];

    /* Table - s5 */
    var s5 = [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
    ];

    /* Table - s6 */
    var s6 = [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
    ];

    /* Table - s7 */
    var s7 = [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
    ];

    /* Table - s8 */
    var s8 = [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
    ];

    for (m = 0; m < 8; m++) {
        var i = 0,
            j = 0;
        i = expandByte[m * 6 + 0] * 2 + expandByte[m * 6 + 5];
        j = expandByte[m * 6 + 1] * 2 * 2 * 2 + expandByte[m * 6 + 2] * 2 * 2 + expandByte[m * 6 + 3] * 2 + expandByte[m * 6 + 4];
        switch (m) {
        case 0:
            binary = getBoxBinary(s1[i][j]);
            break;
        case 1:
            binary = getBoxBinary(s2[i][j]);
            break;
        case 2:
            binary = getBoxBinary(s3[i][j]);
            break;
        case 3:
            binary = getBoxBinary(s4[i][j]);
            break;
        case 4:
            binary = getBoxBinary(s5[i][j]);
            break;
        case 5:
            binary = getBoxBinary(s6[i][j]);
            break;
        case 6:
            binary = getBoxBinary(s7[i][j]);
            break;
        case 7:
            binary = getBoxBinary(s8[i][j]);
            break;
        }
        sBoxByte[m * 4 + 0] = parseInt(binary.substring(0, 1));
        sBoxByte[m * 4 + 1] = parseInt(binary.substring(1, 2));
        sBoxByte[m * 4 + 2] = parseInt(binary.substring(2, 3));
        sBoxByte[m * 4 + 3] = parseInt(binary.substring(3, 4));
    }
    return sBoxByte;
}

function pPermute(sBoxByte) {
    var pBoxPermute = new Array(32);
    pBoxPermute[0] = sBoxByte[15];
    pBoxPermute[1] = sBoxByte[6];
    pBoxPermute[2] = sBoxByte[19];
    pBoxPermute[3] = sBoxByte[20];
    pBoxPermute[4] = sBoxByte[28];
    pBoxPermute[5] = sBoxByte[11];
    pBoxPermute[6] = sBoxByte[27];
    pBoxPermute[7] = sBoxByte[16];
    pBoxPermute[8] = sBoxByte[0];
    pBoxPermute[9] = sBoxByte[14];
    pBoxPermute[10] = sBoxByte[22];
    pBoxPermute[11] = sBoxByte[25];
    pBoxPermute[12] = sBoxByte[4];
    pBoxPermute[13] = sBoxByte[17];
    pBoxPermute[14] = sBoxByte[30];
    pBoxPermute[15] = sBoxByte[9];
    pBoxPermute[16] = sBoxByte[1];
    pBoxPermute[17] = sBoxByte[7];
    pBoxPermute[18] = sBoxByte[23];
    pBoxPermute[19] = sBoxByte[13];
    pBoxPermute[20] = sBoxByte[31];
    pBoxPermute[21] = sBoxByte[26];
    pBoxPermute[22] = sBoxByte[2];
    pBoxPermute[23] = sBoxByte[8];
    pBoxPermute[24] = sBoxByte[18];
    pBoxPermute[25] = sBoxByte[12];
    pBoxPermute[26] = sBoxByte[29];
    pBoxPermute[27] = sBoxByte[5];
    pBoxPermute[28] = sBoxByte[21];
    pBoxPermute[29] = sBoxByte[10];
    pBoxPermute[30] = sBoxByte[3];
    pBoxPermute[31] = sBoxByte[24];
    return pBoxPermute;
}

function finallyPermute(endByte) {
    var fpByte = new Array(64);
    fpByte[0] = endByte[39];
    fpByte[1] = endByte[7];
    fpByte[2] = endByte[47];
    fpByte[3] = endByte[15];
    fpByte[4] = endByte[55];
    fpByte[5] = endByte[23];
    fpByte[6] = endByte[63];
    fpByte[7] = endByte[31];
    fpByte[8] = endByte[38];
    fpByte[9] = endByte[6];
    fpByte[10] = endByte[46];
    fpByte[11] = endByte[14];
    fpByte[12] = endByte[54];
    fpByte[13] = endByte[22];
    fpByte[14] = endByte[62];
    fpByte[15] = endByte[30];
    fpByte[16] = endByte[37];
    fpByte[17] = endByte[5];
    fpByte[18] = endByte[45];
    fpByte[19] = endByte[13];
    fpByte[20] = endByte[53];
    fpByte[21] = endByte[21];
    fpByte[22] = endByte[61];
    fpByte[23] = endByte[29];
    fpByte[24] = endByte[36];
    fpByte[25] = endByte[4];
    fpByte[26] = endByte[44];
    fpByte[27] = endByte[12];
    fpByte[28] = endByte[52];
    fpByte[29] = endByte[20];
    fpByte[30] = endByte[60];
    fpByte[31] = endByte[28];
    fpByte[32] = endByte[35];
    fpByte[33] = endByte[3];
    fpByte[34] = endByte[43];
    fpByte[35] = endByte[11];
    fpByte[36] = endByte[51];
    fpByte[37] = endByte[19];
    fpByte[38] = endByte[59];
    fpByte[39] = endByte[27];
    fpByte[40] = endByte[34];
    fpByte[41] = endByte[2];
    fpByte[42] = endByte[42];
    fpByte[43] = endByte[10];
    fpByte[44] = endByte[50];
    fpByte[45] = endByte[18];
    fpByte[46] = endByte[58];
    fpByte[47] = endByte[26];
    fpByte[48] = endByte[33];
    fpByte[49] = endByte[1];
    fpByte[50] = endByte[41];
    fpByte[51] = endByte[9];
    fpByte[52] = endByte[49];
    fpByte[53] = endByte[17];
    fpByte[54] = endByte[57];
    fpByte[55] = endByte[25];
    fpByte[56] = endByte[32];
    fpByte[57] = endByte[0];
    fpByte[58] = endByte[40];
    fpByte[59] = endByte[8];
    fpByte[60] = endByte[48];
    fpByte[61] = endByte[16];
    fpByte[62] = endByte[56];
    fpByte[63] = endByte[24];
    return fpByte;
}

function getBoxBinary(i) {
        var binary = "";
        switch (i) {
        case 0:
            binary = "0000";
            break;
        case 1:
            binary = "0001";
            break;
        case 2:
            binary = "0010";
            break;
        case 3:
            binary = "0011";
            break;
        case 4:
            binary = "0100";
            break;
        case 5:
            binary = "0101";
            break;
        case 6:
            binary = "0110";
            break;
        case 7:
            binary = "0111";
            break;
        case 8:
            binary = "1000";
            break;
        case 9:
            binary = "1001";
            break;
        case 10:
            binary = "1010";
            break;
        case 11:
            binary = "1011";
            break;
        case 12:
            binary = "1100";
            break;
        case 13:
            binary = "1101";
            break;
        case 14:
            binary = "1110";
            break;
        case 15:
            binary = "1111";
            break;
        }
        return binary;
    }
    /*
     * generate 16 keys for xor
     *
     */

function generateKeys(keyByte) {
        var key = new Array(56);
        var keys = new Array();

        keys[0] = new Array();
        keys[1] = new Array();
        keys[2] = new Array();
        keys[3] = new Array();
        keys[4] = new Array();
        keys[5] = new Array();
        keys[6] = new Array();
        keys[7] = new Array();
        keys[8] = new Array();
        keys[9] = new Array();
        keys[10] = new Array();
        keys[11] = new Array();
        keys[12] = new Array();
        keys[13] = new Array();
        keys[14] = new Array();
        keys[15] = new Array();
        var loop = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

        for (i = 0; i < 7; i++) {
            for (j = 0, k = 7; j < 8; j++, k--) {
                key[i * 8 + j] = keyByte[8 * k + i];
            }
        }

        var i = 0;
        for (i = 0; i < 16; i++) {
            var tempLeft = 0;
            var tempRight = 0;
            for (j = 0; j < loop[i]; j++) {
                tempLeft = key[0];
                tempRight = key[28];
                for (k = 0; k < 27; k++) {
                    key[k] = key[k + 1];
                    key[28 + k] = key[29 + k];
                }
                key[27] = tempLeft;
                key[55] = tempRight;
            }
            var tempKey = new Array(48);
            tempKey[0] = key[13];
            tempKey[1] = key[16];
            tempKey[2] = key[10];
            tempKey[3] = key[23];
            tempKey[4] = key[0];
            tempKey[5] = key[4];
            tempKey[6] = key[2];
            tempKey[7] = key[27];
            tempKey[8] = key[14];
            tempKey[9] = key[5];
            tempKey[10] = key[20];
            tempKey[11] = key[9];
            tempKey[12] = key[22];
            tempKey[13] = key[18];
            tempKey[14] = key[11];
            tempKey[15] = key[3];
            tempKey[16] = key[25];
            tempKey[17] = key[7];
            tempKey[18] = key[15];
            tempKey[19] = key[6];
            tempKey[20] = key[26];
            tempKey[21] = key[19];
            tempKey[22] = key[12];
            tempKey[23] = key[1];
            tempKey[24] = key[40];
            tempKey[25] = key[51];
            tempKey[26] = key[30];
            tempKey[27] = key[36];
            tempKey[28] = key[46];
            tempKey[29] = key[54];
            tempKey[30] = key[29];
            tempKey[31] = key[39];
            tempKey[32] = key[50];
            tempKey[33] = key[44];
            tempKey[34] = key[32];
            tempKey[35] = key[47];
            tempKey[36] = key[43];
            tempKey[37] = key[48];
            tempKey[38] = key[38];
            tempKey[39] = key[55];
            tempKey[40] = key[33];
            tempKey[41] = key[52];
            tempKey[42] = key[45];
            tempKey[43] = key[41];
            tempKey[44] = key[49];
            tempKey[45] = key[35];
            tempKey[46] = key[28];
            tempKey[47] = key[31];
            switch (i) {
            case 0:
                for (m = 0; m < 48; m++) {
                    keys[0][m] = tempKey[m];
                }
                break;
            case 1:
                for (m = 0; m < 48; m++) {
                    keys[1][m] = tempKey[m];
                }
                break;
            case 2:
                for (m = 0; m < 48; m++) {
                    keys[2][m] = tempKey[m];
                }
                break;
            case 3:
                for (m = 0; m < 48; m++) {
                    keys[3][m] = tempKey[m];
                }
                break;
            case 4:
                for (m = 0; m < 48; m++) {
                    keys[4][m] = tempKey[m];
                }
                break;
            case 5:
                for (m = 0; m < 48; m++) {
                    keys[5][m] = tempKey[m];
                }
                break;
            case 6:
                for (m = 0; m < 48; m++) {
                    keys[6][m] = tempKey[m];
                }
                break;
            case 7:
                for (m = 0; m < 48; m++) {
                    keys[7][m] = tempKey[m];
                }
                break;
            case 8:
                for (m = 0; m < 48; m++) {
                    keys[8][m] = tempKey[m];
                }
                break;
            case 9:
                for (m = 0; m < 48; m++) {
                    keys[9][m] = tempKey[m];
                }
                break;
            case 10:
                for (m = 0; m < 48; m++) {
                    keys[10][m] = tempKey[m];
                }
                break;
            case 11:
                for (m = 0; m < 48; m++) {
                    keys[11][m] = tempKey[m];
                }
                break;
            case 12:
                for (m = 0; m < 48; m++) {
                    keys[12][m] = tempKey[m];
                }
                break;
            case 13:
                for (m = 0; m < 48; m++) {
                    keys[13][m] = tempKey[m];
                }
                break;
            case 14:
                for (m = 0; m < 48; m++) {
                    keys[14][m] = tempKey[m];
                }
                break;
            case 15:
                for (m = 0; m < 48; m++) {
                    keys[15][m] = tempKey[m];
                }
                break;
            }
        }
        return keys;
    }
    //end-------------------------------------------------------------------------------------------------------------

function test() {

    var msg = "abcdefgh";
    var bt = strToBt(msg);

    var key = "12345678";
    var keyB = strToBt(key);

    var encByte = enc(bt, keyB);

    var enchex = bt64ToHex(encByte);
    endata.value = enchex;

    var encStr = hexToBt64(enchex);
    alert("encStr=" + encStr);
    var eByte = new Array();
    for (m = 0; m < encStr.length; m++) {
        eByte[m] = parseInt(encStr.substring(m, m + 1));
    }
    var decbyte = dec(eByte, keyB)
    var decmsg = byteToString(decbyte);
    alert("decbyte=" + decbyte);
    alert("decmsg=" + decmsg);
}
