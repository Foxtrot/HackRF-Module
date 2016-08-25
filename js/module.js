registerController('HackRFController', ['$api', '$scope', '$interval', function($api, $scope, $interval) {
    $scope.foundBoard       = false;
    $scope.availableHackRFs = "";
    $scope.running          = false;
    $scope.installed        = false;
    $scope.installling      = false;


    $scope.hackrfInfo = (function() {
        $api.request({
            module: 'HackRF',
            action: 'hackrfInfo'
        }, function(response) {
            $scope.foundBoard = response.foundBoard;

            if (response.foundBoard === true) {
                $scope.availableHackRFs = response.availableHackRFs;
            }
        });
    });

    $scope.hackrfChecker = (function() {
        $api.request({
            module: 'HackRF',
            action: 'hackrfChecker'
        }, function(response) {
            if(response.installed === true) {
                $scope.installed = true;
                $scope.installing = false;
                $scope.hackrfInfo();
                $interval.cancel($scope.install_interval);
            } else {
                $scope.installed = false;
            }
        });
    });

    $scope.hackrfInstall = (function() {
        $api.request({
            module: 'HackRF',
            action: 'hackrfInstall'
        }, function(response) {
            if(response.installing === true) {
                $scope.installing = true;
                $scope.install_interval = $interval(function(){
                    $scope.hackrfChecker();
                }, 1000);
            }
        });
    });

    $scope.hackrfUninstall = (function() {
        $api.request({
            module: 'HackRF',
            action: 'hackrfUninstall'
        }, function(response) {
            if(response.success === true) {
                $scope.hackrfChecker();
                $scope.gethackrfInfo();
            }
        });
    });

    $scope.hackrfChecker();
    $scope.hackrfInfo();

    $scope.$on('$destroy', function() {
        $interval.cancel($scope.install_interval);
    });
}]);

registerController('HackRFSettingsController', ['$api', '$scope', '$timeout', function($api, $scope, $timeout) {
    $scope.mode            = "rx";
    $scope.sampleRate      = "";
    $scope.centerFreq      = "";
    $scope.filename        = "";
    $scope.amp             = false;
    $scope.antpower        = false;
    $scope.sampleRateError = false;


    $scope.hackrfTransfer = (function() {
        $api.request({
            module: 'HackRF',
            action: 'hackrfTransfer',
            mode: $scope.mode,
            sampleRate: $scope.sampleRate,
            centerFreq: $scope.centerFreq,
            filename: $scope.filename,
            amp: $scope.amp,
            antpower: $scope.antpower
        }, function(response) {
            if(response.success === true) {
                $scope.running = true;
            } else if(response.success === false) {
                $scope.sampleRateError = true;
                $timeout(function() {
                    $scope.sampleRateError = false;
                }, 3000);
            }
        });
    });

    
    $scope.hackrfStop = (function() {
        $api.request({
            module: 'HackRF',
            action: 'hackrfStop'
        }, function(response) {
            if (response.success === true) {
                $scope.running = false;
            }
        });
    });
}]);

registerController('HackRFLoggingController', ['$api', '$scope', function($api, $scope) {
    $scope.log = "";

    $scope.hackrfLog = (function() {
        $api.request({
            module: 'HackRF',
            action: 'hackrfLog'
        }, function(response) {
            if (response.success === true) {
                $scope.log = response.log;
            }
        });
    });

    $scope.hackrfLog();

}]);