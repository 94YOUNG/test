'use strict';

/**
 * 0.1.1
 * Deferred load js/css file, used for ui-jq.js and Lazy Loading.
 * 
 * @ flatfull.com All Rights Reserved.
 * Author url: #user/flatfull
 */

angular.module('ui.load', [])
	.service('uiLoad', ['$document', '$q', '$timeout', function ($document, $q, $timeout) {

		var loaded = [];
		var promise = false;
		var deferred = $q.defer();

		/**
		 * Chain loads the given sources
		 * @param srcs array, script or css
		 * @returns {*} Promise that will be resolved once the sources has been loaded.
		 */
		this.load = function (srcs) {
			srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
			var self = this;
			if(!promise){
				promise = deferred.promise;
			}
      angular.forEach(srcs, function(src) {
      	promise = promise.then( function(){
      		return src.indexOf('.css') >=0 ? self.loadCSS(src) : self.loadScript(src);
      	} );
      });
      deferred.resolve();
      return promise;
		}

		/**
		 * Dynamically loads the given script
		 * @param src The url of the script to load dynamically
		 * @returns {*} Promise that will be resolved once the script has been loaded.
		 */
		this.loadScript = function (src) {
			if(loaded[src]) return loaded[src].promise;

			var deferred = $q.defer();
			var script = $document[0].createElement('script');
			script.src = src;
			script.onload = function (e) {
				$timeout(function () {
					deferred.resolve(e);
				});
			};
			script.onerror = function (e) {
				$timeout(function () {
					deferred.reject(e);
				});
			};
			$document[0].body.appendChild(script);
			loaded[src] = deferred;

			return deferred.promise;
		};

		/**
		 * Dynamically loads the given CSS file
		 * @param href The url of the CSS to load dynamically
		 * @returns {*} Promise that will be resolved once the CSS file has been loaded.
		 */
		this.loadCSS = function (href) {
			if(loaded[href]) return loaded[href].promise;

			var deferred = $q.defer();
			var style = $document[0].createElement('link');
			style.rel = 'stylesheet';
			style.type = 'text/css';
			style.href = href;
			style.onload = function (e) {
				$timeout(function () {
					deferred.resolve(e);
				});
			};
			style.onerror = function (e) {
				$timeout(function () {
					deferred.reject(e);
				});
			};
			$document[0].head.appendChild(style);
			loaded[href] = deferred;

			return deferred.promise;
		};
}])

/**
*获取设备会浏览器信息服务 os
*os.ios:是否是ios系统
*os.iphone：是否是iphone设备
*/
.factory("os",function() {
    var userAgent = navigator.userAgent;
    var os = {
        webkit: userAgent.match(/WebKit\/([\d.]+)/) ? true: false,
        android: userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) ? true: false,
        androidICS: this.android && userAgent.match(/(Android)\s4/) ? true: false,
        android2:userAgent.match(/(Android)\s2/i)? true: false,
        androidFF:userAgent.match(/Android/i)? true: false,
        ipad: userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true: false,
        iphone: !(userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true: false) && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true: false,
        ios: (userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true: false) || (!(userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true: false) && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true: false),
        wphone: userAgent.match(/Windows Phone/i) ? true: false,
        firefox: userAgent.match(/Firefox/i) ? true: false,
        rMsie : userAgent.toLowerCase().match(/.*(msie) ([\w.]+).*/) ? true: false, // ie  
		rFirefox : userAgent.toLowerCase().match(/.*(firefox)\/([\w.]+).*/) ? true: false, // firefox  
		rOpera : userAgent.toLowerCase().match(/(opera).+version\/([\w.]+)/) ? true: false, // opera  
		rChrome : userAgent.toLowerCase().match(/.*(chrome)\/([\w.]+).*/) ? true: false, // chrome  
		rSafari : userAgent.toLowerCase().match(/.*(safari).*/) ? true: false,// safari
		rQQBrowser : userAgent.toLowerCase().match(/.*(qqbrowser).*/) ? true: false// QQBrowser  
		
    };
    return os;
})




	;