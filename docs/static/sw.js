(function(){'use strict';importScripts('sw-toolbox.js'); toolbox.precache(["/index.html","css/app.ca1543a62d8c5a2b60ff8db88eb15b68.css","css/app.ca1543a62d8c5a2b60ff8db88eb15b68.css.map","icons/Icon-144.png","icons/Icon-16.png","icons/Icon-192.png","icons/Icon-36.png","icons/Icon-48.png","icons/Icon-512.png","icons/Icon-72.png","icons/Icon-96.png","js/app.6a40c66caad42783fdf2.js","js/app.6a40c66caad42783fdf2.js.map","js/manifest.37a2ecbb1d1b7e6c9ada.js","js/manifest.37a2ecbb1d1b7e6c9ada.js.map","js/vendor.3da9b63239f15810b9ac.js","js/vendor.3da9b63239f15810b9ac.js.map","manifest.json","sw-toolbox.js","vendor/chord-plus/dist/chord-plus.min.js"]); toolbox.router.get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 5});})();