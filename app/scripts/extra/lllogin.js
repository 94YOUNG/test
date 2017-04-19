'use strict';

/* Controllers */
// signin controller
app.controller('llloginCtrl', ['$scope', '$http', '$location', '$state', "os", "$timeout", "$filter","$localStorage", function ($scope, $http, $state, $location, os, $timeout, $filter,$localStorage) {
	// $scope.user = {};
	$scope.init=function(){
		$http.post('/Environment.json')
		.then(function (response) {
			if(response.data.DbName=="vpdb"){
				$('#check').css("display","block");
			}else{
				$('#check').css("display","none");
			}
			})
		}		
	$scope.myInterval = 5000;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
      slides.push({
        image: 'img/c' + slides.length + '.jpg',
        text: ['Carousel text #0','Carousel text #1','Carousel text #2','Carousel text #3'][slides.length % 4]
      });
    };
    for (var i=0; i<5; i++) {
      $scope.addSlide();
      //console.log($scope.slides);
    }

	$scope.flag = (os.rChrome || os.rSafari);
	if(!$scope.flag){
		ngTip.alert("尊敬的用户您好，建议使用Chrome、Safari浏览器进行访问，最优推荐使用Chrome浏览器(方便打印和导出PDF)。如有问题请发送邮件到<support@csii.com.cn>进行反馈。","vpInfo",8000);
	}
	
// var param={};
// $http.post('/logout.json', {checkLoginDoubleFlag: "vpTeam"})
	
	$scope.LoginId=localStorage.getItem("loginId");
	var text = '提交';
	$scope.commit = text;
	$scope.login = function () {
		
//	 var param={};
//	 $http.post('/logout.json', {checkLoginDoubleFlag: "vpTeam"})
		
		$scope.authError = null;
		// Try to login
		$http.post('/login.json', {loginid: $scope.LoginId, password: $scope.PassWord})
			.then(function (response) {
				//console.log(response);
				if(response&&response.data) {
					if (response.data.errcode != '0') {
						alert(response.data.errmsg)
					} else {
						localStorage.removeItem("loginId");
						localStorage.setItem("loginId",$scope.LoginId);
						localStorage.setItem("type","0");
						//登录成功后同时得到最后修改密码日期
						//判断是否需要用户修改密码，跳密码修改页
						console.log("*************************************");
						$scope.user = response.data;
						if (response.data.ModPwd == 1) {
							window.location.href = "../pwdmod/mod/index.html?type=1";
						} else {
							window.location.href = "../iframe/index.html";
						}
						//$state.go('app.dashboard-v1');
					}
				}else{
					console.log("系统没有响应");
				}

			}, function (x) {
				alert("系统错误");
			});
	};
	var flag = 1;
	$scope.test=function() {
		if(flag==1) {
			$("#flip").addClass("fanzhuan");
			flag = 0;
		}else{
			$("#flip").removeClass("fanzhuan");
			flag = 1;
		}
	};
	$scope.changeMode = function (src) {
		if($scope.isqrcode) {
			return;
		}
		var string = randomStr(), enstr,pargs1,pargs2;
		enstr = encData(string);
		pargs1 = {QRKey: string, NopType: "0"};
		pargs2 = {QRKey: string, NopType: "0"};
		qrcodeGe("qrcode_app", "http://" + window.location.host + "/timesheet/login.json?NopType=0&&QRKey=" + string);
		$http.post('/noLoginState.json', pargs1)
			.then(function (response) {
				if (response.data.errcode != "0") {
					$scope.authError = '系统错误1';
				} else {
					loginForPhone(pargs2);
				}
			}, function (x) {
				$scope.authError = '系统错误';
			});

	};

	function loginForPhone(pargs) {
		var timecount = 60;
		$scope.timecount = timecount;
		var clearTime = setInterval(function () {
			timecount--;
			$scope.$apply(function() {
				$scope.timecount = timecount;
				if (timecount == 0 || $scope.isqrcode == false) {
					clearInterval(clearTime);
					clearInterval(clearhttp);
					$scope.isqrcode = false;
					$("#flip").removeClass("fanzhuan");
					flag = 1;
				}
			});
		}, 1000);
		var clearhttp = setInterval(function () {
			$http.post('/login.json', pargs)
				.then(function (response) {
					if(response.data.ContinueType=="000000") {
						console.log("resend...");
					}else{
						clearInterval(clearTime);
						clearInterval(clearhttp);
						window.location.href = "../iframe/index.html";
					}
				}, function (x) {
					$scope.authError = '系统错误';
					$scope.$apply();
				});
		}, 3000);
	}

	function randomStr() {
		var now = new Date(), result = "CsiiVp", time, subfix;
		time = $filter('date')(now, "yyyyMMdd");
		subfix = (Math.random() + "").substring(2, 12);
		result += time;
		result += subfix;
		return result;
	}

	function qrcodeGe(div, text) {
		$('#' + div).empty();

		$('#' + div).qrcode({
			text: text,
			width: 175,
			height: 175,
			src: '../../img/VPNoplogo.png'
		});
	}
}])
;