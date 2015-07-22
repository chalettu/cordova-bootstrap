angular.module('cordova', [])

  .provider('cordovaApp', function() {
    var app = {};


    var _is_cordova_available = function() {

      console.log('Searching for cordova.js');

      try {
        if (window.cordova || cordova) {
          console.log('Cordova.js has already been loaded');
          return true;
        }
      } catch(e) {}

      var scripts = document.getElementsByTagName('script');
      var len = scripts.length;
      for(var i = 0; i < len; i++) {
        var script = scripts[i].getAttribute('src');
        if(script) {
          var parts = script.split('/');
          var partsLength = 0;
          try {
            partsLength = parts.length;
            if (parts[partsLength-1] === 'cordova.js') {
              console.log('cordova.js has previously been included.');
              return true;
            }
          } catch(e) {}
        }
      }

      return false;
    };


    this.$get = [function() {
      return {
        /**
         * Get the registered app for all commands.
         */
        getApp: function() {
          return app;
        },

        getDeviceTypeByNavigator: function() {
          return (navigator.userAgent.match(/iPad/i))  == "iPad" ? "ipad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iphone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "blackberry" : "unknown";
        },

        loadCordova: function() {
          if(!_is_cordova_available()) {
            var cordova_script = document.createElement('script');
            var cordova_src = 'cordova.js';
            switch(this.getDeviceTypeByNavigator()) {
              case 'android':
                if (window.location.href.substring(0, 4) === "file") {
                  cordova_src = 'file:///android_asset/www/cordova.js';
                }
                break;

              case 'ipad':
              case 'iphone':
                try {
                  var resource = window.location.search.match(/cordova_js_bootstrap_resource=(.*?)(&|#|$)/i);
                  if (resource) {
                    cordova_src = decodeURI(resource[1]);
                  }
                } catch(e) {
                  console.log('Could not find cordova_js_bootstrap_resource query param');
                  console.log(e);
                }
                break;

              case 'unknown':
                return false;

              default:
                break;
            }
            cordova_script.setAttribute('src', cordova_src);
            document.head.appendChild(cordova_script);
            console.log('Injecting cordova.js');
          }
        },

        bootstrap: function() {
          this.loadCordova();
        }
      }
    }];
  })
  .run(['cordovaApp', function(cordovaApp) {
    console.log('Cordova Core: init');
    cordovaApp.bootstrap();
  }]);
