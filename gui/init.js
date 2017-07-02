$(document).ready(function() {
  const remote = require('electron').remote;
  var window = remote.getCurrentWindow();

  $('#pulse').jRoll({
    radius: 100,
    animation: 'pulse'
  });

  GetAppConf(inititalWalletLoading);

  $('#loading_status_text').text('Starting Wallet. Please wait...');

  function inititalWalletLoading(appConf) {
    // run iguana-less mode with no daemons startup
    if (appConf && appConf.iguanaLessMode) {
      window.createWindow('open');
      window.hide();
    } else { // run normal mode with 2 iguana instances started prior loading GUI
      if (appConf && !appConf.manualIguanaStart) {
        StartIguana();
      }

      var portcheck;

      function startcheck() {
        portcheck = setInterval(function(){
          Iguana_activehandle(appConf).then(function(result){
            console.log(result);

            if (result !== 'error') {
              stopcheck();

              if (appConf && appConf.useBasiliskInstance) {
                StartIguana_Cache();
              }

              $('#loading_status_text').text('Connecting to Basilisk Network...');
              EDEX_DEXgetinfoAll(appConf.skipBasiliskNetworkCheck, appConf.minNotaries, appConf);
            }
          })
        }, 2000);
      }

      function stopcheck() {
        clearInterval(portcheck);
      }

      startcheck();
    }
  }
});