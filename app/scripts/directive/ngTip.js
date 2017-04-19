'use strict';
/**
 * ngTip - simple tip service
 * http://github.com/savokiss/ngTip
 */
angular.module('testApp')
  .directive('ngTip', ngTipDirective)
  .provider('ngTip', ngTipProvider);

ngTipDirective.$inject = ['ngTip','$timeout'];
function ngTipDirective(ngTip,$timeout) {
  return {
    restrict: 'EA',
    template: '<div class="alert alert-{{ngTip.type || \'vpInfo\'}} ngTip" ng-show="ngTip.msgFlag"  ng-click="hideAlert()" ng-class="{true:\'on\',false:\'off\'}[ngTip.msgFlag!=null]">' +
    '<button type="button" class="close"  ng-click="hideAlert()">' +
    '<span class=""></span></button>{{ngTip.msg}}</div>',

    link: function (scope, element, attrs) {
      scope.ngTip = ngTip;
      scope.hideAlert = function () {
        $timeout(function(){
//          ngTip.msg = null;
        },1000)
//        ngTip.msg = null;
        ngTip.msgFlag = null;
        // ngTip.type = null;
      };
    }
  };
}

function ngTipProvider() {
  var self = this;
  var flag=true;
  self.timeout = 4000;
  self.setDefaultTimeout = function(defaultTimeout){
    self.timeout = defaultTimeout;
  };

  self.$get = ['$timeout',function($timeout){
    var cancelTimeout = null;

    return {
      msg: null,
      msgFlag: null,
      // type: null,
      alert: alert,
      clear: clear
    };

    /**
     * set msg
     * default last 3s
     * @param msg
     * @param type
     */

    function alert(msg,type,timer) {
    	window.scrollTo(0,0);
    	window.parent.scrollTo(0,0);
      if(flag==true){
      var that = this;
      this.msg = msg;
      this.msgFlag = msg;
      this.type = type||"vpInfo";
         var timer=timer|| self.timeout;
      if(cancelTimeout || flag==false){
        $timeout.cancel(cancelTimeout);
      }
      flag=false;
      cancelTimeout = $timeout(function () {
        flag=true;
        that.clear();
      }, timer);
      }

    }

    /**
     * clear msg
     */
    function clear() {
      var that=this;
      $timeout(function(){

//         that.msg = null;
      }, 1000);

//      that.msg = null;
      that.msgFlag = null;
      // this.type = null;
    }
  }];

}


