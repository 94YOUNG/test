angular.module('testApp')
  .directive('uiModule', ['MODULE_CONFIG','uiLoad', '$compile', function(MODULE_CONFIG, uiLoad, $compile) {
    return {
      restrict: 'A',
      compile: function (el, attrs) {
        var contents = el.contents().clone();
        return function(scope, el, attrs){
          el.contents().remove();
          uiLoad.load(MODULE_CONFIG[attrs.uiModule])
          .then(function(){
            $compile(contents)(scope, function(clonedElement, scope) {
              el.append(clonedElement);
            });
          });
        }
      }
    };
  }])
  .directive('uiTpl', ['uiLoad','$compile','$filter',function(uiLoad,$compile,$filter) {
    return {
      restrict: 'AE',
      scope: {
                "uiTpl": "=",
                "data":"=",
                "dataList":"="
            },
      link:function($scope,element,attrs,ctrl){
        $scope.item=$scope.data;
        var ss='<div ng-include="'+"'"+$scope.uiTpl+"'"+'">';
        element.append(ss);
        $compile(element.children())($scope);
      }
    };
  }])
.directive('uiGetheight', [function() {
    return {
      restrict: 'AE',
      scope: {
                "data":"="
            },
      link:function($scope,element,attrs,ctrl){
        setTimeout(function(){
          var height=element.outerHeight();
       var onePage=1020;//default:842
       var realHeight=Math.ceil(height/900)*onePage;
       element.css("min-height",realHeight+"px");
       console.log("realHeight"+realHeight);
     }
          , 1000);

      }
    };
  }])
.directive('uiGetheightOne', [function() {
    return {
      restrict: 'AE',
      scope: {
                "data":"="
            },
      link:function($scope,element,attrs,ctrl){
        setTimeout(function(){
          var height=element.outerHeight();
       var onePage=842;//default:842
       var realHeight=Math.ceil(height/900)*onePage;
       element.css("min-height",realHeight+"px");
       console.log("realHeight"+realHeight);
     }
          , 1000);

      }
    };
  }])



/**
 *  directive   key-allow
 *  value   symbol(default)  允许输入数字、字母、特殊字符
 *  value   number  允许输入数字
 *  value word  允许输入数字、字母
 *  value   tel     允许输入数字、-
 *  value   amount  允许输入数字和小数点
 *  usage    key-allow   key-allow="number|word|symbol"
 */

  .directive("keyAllow", [ function(){
    return {
      require: "^?ngModel",
      link: function(scope, element, attr, ctrl){
        var keyAllow = attr.keyAllow || "symbol";
        ctrl.$render = function(){
          element.val(ctrl.$modelValue);
        };
        element.bind("input", function(event){
          scope.$apply(function(){
            var value = element.val();
            if(keyAllow === "number" || keyAllow==="account"){
              value = value.match(/^[0-9]*/);
            	//value = value.match(/^[1-9][0-9]*|0*/);^(0|[1-9][0-9]*)$
            } else if(keyAllow === "word"){
              value = value.match(/^[0-9a-zA-Z]*/);
            } else if(keyAllow === "symbol"){
              value = value.match(/^[!-~]*/);
            } else if(keyAllow === "tel"){
              value = value.match(/^[0-9-]*/);
            } else if(keyAllow === "amount"){
              value = value.match(/^([1-9][0-9]*|0)(\.[0-9]{0,2})?/);
            } else if(keyAllow === "daycount"){
              value = value.match(/^([1-9][0-9]*|0)(\.[5]{0,1})?/);
            } else if(keyAllow === "noc"){
              return value;
            }

            element.val(value ? value[0] : null);
            ctrl.$setViewValue(value ? value[0] : null)
          });
        });
      //}
    }
  };
}]);

  ;
