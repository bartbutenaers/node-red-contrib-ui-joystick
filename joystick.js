/**
 * Copyright 2021 Bart Butenaers
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    var settings = RED.settings;
    const fs = require('fs');
    
    // -------------------------------------------------------------------------------------------------
    // Determining the path to the files in the dependent nipplejs module once.
    // See https://discourse.nodered.org/t/use-files-from-dependent-npm-module/17978/5?u=bartbutenaers
    // -------------------------------------------------------------------------------------------------
    var nipplejsPath = require.resolve("nipplejs");

    if (!fs.existsSync(nipplejsPath)) {
        console.log("Javascript file " + nipplejsPath + " does not exist");
        nipplejsPath = null;
    }

     function HTML(config) { 
        // The configuration is a Javascript object, which needs to be converted to a JSON string
        var configAsJson = JSON.stringify(config);

        // Make sure to set the width and height via CSS style (instead of the width and height html element attributes).
        // This way the dashboard can calculate the size of the div correctly.  See:
        // https://discourse.nodered.org/t/custom-ui-node-layout-problems/7731/21?u=bartbutenaers)
        var html = String.raw`
        <script src="ui_joystick/js/nipplejs.js"></script>
        <div id="joystickContainer_` + config.id.replace(".","_") + `" style="width:100%; height:100%; position:relative;" ng-init='init(` + configAsJson + `)'></div>
        `;
        
        return html;
    };

    function checkConfig(node, conf) {
        if (!conf || !conf.hasOwnProperty("group")) {
            node.error("No group has been specified");
            return false;
        }
        return true;
    }
    
    var ui = undefined;
    
    function JoystickNode(config) {
         try {
            var node = this;
            if(ui === undefined) {
                ui = RED.require("node-red-dashboard")(RED);
            }
            
            if (config.useThemeColor) {
                if(ui.getTheme){
                    // When specified to use the theme color, replace the custom color in the config by the theme base color
                    var theme = ui.getTheme();
                    config.color = theme["base-color"].value;
                }
                else {
                    node.warn("ui.getTheme() not available. Check dashboard version is up to date");
                }
            } 
            
            RED.nodes.createNode(this, config);

            if (checkConfig(node, config)) { 
                var html = HTML(config);
                var done = ui.addWidget({
                    node: node,
                    group: config.group,
                    order: config.order, 
                    width: config.width,
                    height: config.height,
                    format: html,
                    templateScope: "local",
                    emitOnlyNewValues: false,
                    forwardInputMessages: false,
                    storeFrontEndInputAsState: false,
                    convertBack: function (value) {
                        return value;
                    },
                    beforeEmit: function(msg, value) {
                        // ******************************************************************************************
                        // Server side validation of input messages.
                        // ******************************************************************************************
                        // Would like to ignore invalid input messages, but that seems not to possible in UI nodes:
                        // See https://discourse.nodered.org/t/custom-ui-node-not-visible-in-dashboard-sidebar/9666
                        // We will workaround it by sending a 'null' payload to the dashboard.
                        
                        return { msg: msg };
                    },
                    beforeSend: function (msg, orig) {
                        if (orig) {
                            return orig.msg;
                        }
                    },
                    initController: function($scope, events) {
                        $scope.flag = true;
                        
                        function sendOutputMsg(evt, data) {
                            // Don't send the entire data object (incl. instance) because then we get:
                            // "Uncaught RangeError: Maximum call stack size exceeded" ...
                            // Moreover some data fields are confusing, so we will skip those in the output msg.
                            $scope.send({
                                payload: {
                                    angle: {
                                        radian: data.angle.radian,
                                        degree: data.angle.degree
                                    },
                                    direction: {
                                        x: data.direction.x,
                                        y: data.direction.y,
                                        angle: data.direction.angle
                                    },
                                    // The distance - from the center (0) - to the outer circle (50px = unscaled radius).
                                    // We will multiply the distance * 2 to convert the pixels to a percentage.
                                    distance: data.distance * 2,
                                    vector: {
                                        x: data.vector.x,
                                        y: data.vector.y
                                    }
                                },
                                topic: evt
                            });
                        }
                
                        $scope.init = function (config) {
                            $scope.config = config;
                            $scope.lastData = null;;
                            $scope.timer = null;

                            $scope.containerDiv = $('#joystickContainer_' + $scope.config.id.replace(".","_"));
                            
                            // Create the nipple widget delayed, similar to their demo (https://github.com/yoannmoinet/nipplejs/blob/master/example/codepen-demo.html).
                            // Otherwise we can only move the inner circle around the contour of the outer circle ...
                            setTimeout(() => {
                                var options = {
                                    zone: $scope.containerDiv[0],               // active zone where mouse and touch events are captured
                                    color: config.color,                        // the background CSS color of the nipple
                                    size: 100,                                  // size (in pixels) of the outer circle
                                    threshold: parseFloat(config.threshold),    // minimum strength needed to trigger a directional event (0 = center / 1 = outer diameter)
                                    fadeTime: 250,                              // time it takes for joystick to fade-out and fade-in, when (de)activated
                                    multitouch: false,                          // whether it should be possible to have multiple nipples in a single zone
                                    maxNumberOfNipples: 1,                      // we only allow 1 nipple in a single zone
                                    dataOnly: false,                            // we don't want only data (i.e. nothing would be visualised via the DOM)*/
                                    position: {left:'50%', top:'50%'},          // preset position for 'static' mode, can be used to center the nipple in the middle
                                    mode: "static",                             // 'static' mode because the joystick always needs to be visible
                                    restJoystick: config.centerAtRelease,       // reset the joystick's position when it enters the rest state
                                    restOpacity: 1,                             // opacity when the joystick is in a rest position, shouldn't be applied in our case
                                    catchDistance: 200,                         // at which distance we recycle the previous joystick (only useful in the 'semi' mode)
                                    shape: config.shape,                        // shape of region within which joystick can move
                                    dynamicPage: false                          // if the page has dynamically visible elements
                                };  
                                
                                // Set lockX (= only move on the X axis) and lockX (= only move on the X axis)
                                switch(config.directions) {
                                    case "hor":
                                        options.lockX = true;
                                        options.lockY = false;
                                        break;
                                    case "ver":
                                        options.lockX = false;
                                        options.lockY = true;                                
                                        break;
                                    case "all":
                                        options.lockX = false;
                                        options.lockY = false;                                
                                        break;
                                }

                                $scope.manager = nipplejs.create(options);
                                
                                // To make sure that the nipple fits into the parent div, we will set it's size (in pixels) to 65% of the minimum
                                // dimension (width or height) of that parent div element.  We can't make it larger, because then the small moving 
                                // circle doesn't fit into the parent div area.  Correction: we need to set the size - for some reason - smaller than
                                // 50%, otherwise the small circle will jump away from the mouse position ;-(
                                $scope.scaleFactor = Math.min($scope.containerDiv[0].clientWidth, $scope.containerDiv[0].clientHeight) / 150;
                                $scope.containerDiv.children(":first").css({ transform: 'scale(' + $scope.scaleFactor + ')' });
                                
                                $scope.outerCircle = $scope.containerDiv.find(".back");
                                /*scope.outerCircle.css("border-width", "3px");
                                scope.outerCircle.css("border-color", "blue");
                                scope.outerCircle.css("border-style", "solid");*/

                                // Fortunately there is an (undocumented) event "rested", which is called when the joystick is releaved an goes
                                // back to the center point automatically ...
                                $scope.manager.on('rested', function (evt, data) {
                                    // Stop the current timer, when available
                                    if ($scope.timer) {
                                        clearInterval($scope.timer);
                                        $scope.timer = null;
                                    }
                                    
                                    // The previous last data is not relevant anymore, when the joystick is activated again ...
                                    $scope.lastData = null;
                                    
                                    // Send a dummy message when rested
                                    sendOutputMsg(evt.type, {
                                        angle: {
                                            radian: 0,
                                            degree: 0
                                        },
                                        direction: {
                                            x: null,
                                            y: null,
                                            angle: null
                                        },
                                        distance: 0,
                                        vector: {
                                            x: 0,
                                            y: 0
                                        }
                                    });
                                });
                                
                                $scope.$on("$destroy", function() {
                                    if ($scope.manager) {
                                        $scope.manager.destroy();
                                    }
                                    
                                    // Stop the current timer, when available.
                                    // Because the timer might be still running, when the flow is being deployed
                                    if ($scope.timer) {
                                        clearInterval($scope.timer);
                                        $scope.timer = null;
                                    }
                                });
                                
                                // Map our event to a nipplejs event
                                var nipplejsEvent;
                                switch(config.trigger) {
                                    case "all":
                                        nipplejsEvent = "move";
                                        break;
                                    case "d45":
                                        nipplejsEvent = "dir";
                                        break;
                                    case "d90":
                                        nipplejsEvent = "plain";
                                        break;
                                }

                                // Start listening to the specified event
                                $scope.manager.on(nipplejsEvent, function (evt, data) {
                                    // Remember the last data (for each event type)
                                    $scope.lastData = data;
                                    
                                    if (config.timeInterval > 0) {
                                        // Create a timer when it doesn't exist yet
                                        if (!$scope.timer) {
                                            $scope.timer = setInterval(function() {
                                                // Resend the last output message again
                                                sendOutputMsg(evt.type, $scope.lastData);
                                            }, config.timeInterval);                                        
                                        }
                                    }
                                    else {
                                        // When no interval has been specified, the event will be send immediately as an output message.
                                        sendOutputMsg(evt, data);
                                    }
                                });
                            }, 200);
                        }

                        $scope.$watch('msg', function(msg) {
                            // Ignore undefined messages.
                            if (!msg) {
                                return;
                            }
                        });
                    }
                });
            }
        }
        catch (e) {
            // Server side errors 
            node.error(e);
            console.trace(e); // stacktrace
        }
		
        node.on("close", function() {
            if (done) {
                done();
            }
        });
    }

    RED.nodes.registerType("ui_joystick", JoystickNode);
    
    // By default the UI path in the settings.js file will be in comment:
    //     //ui: { path: "ui" },
    // But as soon as the user has specified a custom UI path there, we will need to use that path:
    //     ui: { path: "mypath" },
    var uiPath = (RED.settings.ui || {}).path;

    // When there was no ui path specified (i.e. '//ui: { path: "ui" }' not commented out in the settings.js file), then
    // we need to apply the default 'ui' path.  However, when an empty ui path has been specified (i.e. '//ui: { path: "" }'), then
    // we should also use an empty ui path...  See https://github.com/bartbutenaers/node-red-contrib-ui-svg/issues/86
    if (uiPath == undefined) {
        uiPath = 'ui';
    }

    // Create the complete server-side path
    uiPath = '/' + uiPath + '/ui_joystick/js/*';
    
    // Replace a sequence of multiple slashes (e.g. // or ///) by a single one
    uiPath = uiPath.replace(/\/+/g, '/');
	
    // Make all the static resources from this node public available (i.e. nipplejs.js files).
    RED.httpNode.get(uiPath, function(req, res){

        // Send the requested file to the client (in this case it will be nipplejs.js)
        res.sendFile(nipplejsPath)
    });
}
