# node-red-contrib-ui-joystick
A Node-RED widget node to show a virtual joystick in the Node-RED dashboard

Thanks to [Stephen McLaughlin](https://github.com/Steve-Mcl) for pointing me to the [nipplejs](https://github.com/yoannmoinet/nipplejs) library, and thanks to [Dave Conway-Jones](https://github.com/dceejay) for extensive testing and lots of useful feedback!

## Install
Run the following npm command in your Node-RED user directory (typically ~/.node-red):
```
npm install node-red-contrib-ui-joystick
```

## Support my Node-RED developments

Please buy my wife a coffee to keep her happy, while I am busy developing Node-RED stuff for you ...

<a href="https://www.buymeacoffee.com/bartbutenaers" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy my wife a coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## Usage
Using this simple flow:

![image](https://user-images.githubusercontent.com/14224149/103476621-cd152100-4db7-11eb-8ec2-a0dec21edae3.png)
```
[{"id":"6b54698e.ed4b28","type":"ui_joystick","z":"42b7b639.325dd8","name":"","group":"a434ad35.e8a6b","order":2,"width":"4","height":"4","trigger":"all","timeInterval":"1000","useThemeColor":true,"color":"#7b73c9","threshold":"0.1","directions":"all","shape":"circle","centerAtRelease":false,"x":890,"y":1100,"wires":[["3848d99a.8b6756"]]},{"id":"3848d99a.8b6756","type":"debug","z":"42b7b639.325dd8","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":1060,"y":1100,"wires":[]},{"id":"a434ad35.e8a6b","type":"ui_group","z":"","name":"Joystick demo","tab":"77a8be2.16f914","order":1,"disp":true,"width":"12","collapse":false},{"id":"77a8be2.16f914","type":"ui_tab","z":"","name":"Joystick","icon":"dashboard","disabled":false,"hidden":false}]
```

This flow will display a joystick in the dashboard, which sends messages to your Node-RED flow.  

The following demo sends a message everytime a (45° angle based) direction is detected:

![joystick_demo](https://user-images.githubusercontent.com/14224149/103476760-ccc95580-4db8-11eb-8f09-e6639fc9e2ec.gif)

Such an output message looks like this:

![output msg](https://user-images.githubusercontent.com/14224149/103705569-90aa1680-4fab-11eb-8573-715caea6edf1.png)

Remark: the angle is `0` when the joystick is at the right, and it goes anti-clockwise.

## Node configuration

### Interval
Specify at which interval (milliseconds) the output messages should be send.  The sending starts when the threshold is exceeded, and stops when the joystick is released (and returns to its center automatically or manually).  

Note: When the interval is `0`, this means that no timer will be started.  In that case, the *"Trigger"* property determines which joystick events will cause the messages to be sent.
    
#### Trigger
When no interval has been specified (i.e. interval = 0), you need to specify which joystick events will trigger sending output messages (after crossing the threshold):

+ *All*: send a message for every move event.  
   
   Caution: a lot of messages will be sent to the Node-RED flow, when the joystick is being moved!

+ *45° crossings*: send a message only when crossing a 45° angle boundary.

   ![45 degrees](https://user-images.githubusercontent.com/14224149/103476549-2fb9ed00-4db7-11eb-99be-4d5bb2724fb6.png)
   
   Every time the joystick goes from one quadrant to another (outside the threshold), a message is being sent:

   ![joystick_45_demo](https://user-images.githubusercontent.com/14224149/103481566-22fbc000-4ddc-11eb-80b5-b4c220f1ea31.gif)
   
+ *90° crossings*: send a message only when crossing a 90° degree boundary.

   ![90 degrees](https://user-images.githubusercontent.com/14224149/103476600-9e974600-4db7-11eb-858a-2367cc0a1031.png)
   
   Every time the joystick goes from one quadrant to another (outside the threshold), a message is being sent:
   
   ![joystick_90_demo](https://user-images.githubusercontent.com/14224149/103481620-7837d180-4ddc-11eb-8d0b-f3fd11357c71.gif)

### Directions
Specify in which directions the joystick can be moved:

+ *All*: the joystick can be moved in all directions.

+ *Only vertical*: the joystick can only be moved vertically.

+ *Only horizontal*: the joystick can only be moved horizontally.
  
### Shape:
Specify whether the shape of region - within which joystick can move - needs to be a circle or a square.

![Shapes](https://user-images.githubusercontent.com/14224149/103475945-e9ae5a80-4db1-11eb-9b96-52ac94b035e4.png)

### Threshold
Specify the minimum distance needed to trigger an output message.  This is a value between 0 and 1:

+ `0`: the center of the joystick, so the output message will always be sent (since joystick will exceed the threshold value everywhere).

+ `1`: the outer boundary of the joystick, which means that only an output message will be send when the joystick reaches the outer circle boundary.

![Threshold](https://user-images.githubusercontent.com/14224149/103476432-bcfc4200-4db5-11eb-9deb-b8028350b920.png)

### Use the Node-RED theme base color
When activated, the base color of the Node-RED dashboard theme will be used.  Otherwise a custom color needs to be specified.

The following image shows the colors for the two standard Node-RED themes:

![image](https://user-images.githubusercontent.com/14224149/103480965-1d9c7680-4dd8-11eb-9716-52cc506b1e48.png)

### Color
Specify a custom CSS color of the joystick's center circle.  The outer circle will get automatically a reduced color:

![image](https://user-images.githubusercontent.com/14224149/103476126-5f66f600-4db3-11eb-8d05-906fe3789252.png)

Remark: this property will only be displayed when the checkbox *"Use the Node-RED theme base color"* is not activated.

### Move joystick to its center when released
When activated, the joystick will automatically move back to its center when it is released.  Otherwise the joystick will remain at the position where it has been released.

When the joystick goes back to the center (either automatically or manually), the joystick status goes into rest status.  In that case, it will send a last message (containing zero values).

## Use case

### PTZ camera control

The joystick node can be used to control a PTZ camera, e.g. via Onvif using my [PTZ node](https://github.com/bartbutenaers/node-red-contrib-onvif-nodes#ptz-node).

1. The first part of the flow is used to capture snapshot images from my IP camera, and display them on the dashboard via a Template node:

   ![snapshot flow](https://user-images.githubusercontent.com/14224149/103487963-5ef94a00-4e09-11eb-8396-699fb8250b5c.png)
   ```
   [{"id":"9222487b.a42538","type":"inject","z":"42b7b639.325dd8","name":"Get snapshot image","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"1","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":240,"y":660,"wires":[["d2721583.b94c08"]]},{"id":"d2721583.b94c08","type":"onvif-media","z":"42b7b639.325dd8","name":"","deviceConfig":"e6c78b2e.fe4dc8","profileToken":"","profileName":"JPEG_640x480","videoEncoderConfigToken":"","videoEncoderConfigName":"","videoEncoderConfigEncoding":"","action":"getSnapshot","protocol":"HTTP","stream":"RTP-Unicast","x":470,"y":660,"wires":[["6535feb.cbf33"]]},{"id":"6535feb.cbf33","type":"base64","z":"42b7b639.325dd8","name":"Encode","x":640,"y":660,"wires":[["fb64a032.e945b"]]},{"id":"fb64a032.e945b","type":"ui_template","z":"42b7b639.325dd8","group":"a434ad35.e8a6b","name":"Display image","order":1,"width":"6","height":"6","format":"<img width=\"16\" height=\"16\" src=\"data:image/jpg;base64,{{msg.payload}}\" />\n","storeOutMessages":true,"fwdInMessages":true,"resendOnRefresh":false,"templateScope":"local","x":820,"y":660,"wires":[[]]},{"id":"e6c78b2e.fe4dc8","type":"onvif-config","z":"","xaddress":"192.168.1.200","port":"80","name":"MyCamKitchen"},{"id":"a434ad35.e8a6b","type":"ui_group","z":"","name":"Joystick demo","tab":"77a8be2.16f914","order":1,"disp":true,"width":"12","collapse":false},{"id":"77a8be2.16f914","type":"ui_tab","z":"","name":"Joystick","icon":"dashboard","disabled":false,"hidden":false}]
   ```

   Remarks:
      + This flow requires that the [node-red-node-base64](https://flows.nodered.org/node/node-red-node-base64) node has been installed.
      + This way of working is not optimal, but it is out of scope of this readme page to describe better ways to capture and show images ...
      
2. The second part of the flow uses the joystick output direction (up/down/left/right) to control the PTZ node:

   ![ptz flow](https://user-images.githubusercontent.com/14224149/103488060-19894c80-4e0a-11eb-82c0-6fcfc003000d.png)
   ```
   [{"id":"8d529ac3.447d98","type":"change","z":"42b7b639.325dd8","name":"Right","rules":[{"t":"set","p":"pan_speed","pt":"msg","to":"0.5","tot":"num"},{"t":"set","p":"action","pt":"msg","to":"continuousMove","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":790,"y":2020,"wires":[["1e91b9a5.21fa16"]]},{"id":"ba57d28b.46f04","type":"change","z":"42b7b639.325dd8","name":"Left","rules":[{"t":"set","p":"pan_speed","pt":"msg","to":"-0.5","tot":"num"},{"t":"set","p":"action","pt":"msg","to":"continuousMove","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":790,"y":1980,"wires":[["1e91b9a5.21fa16"]]},{"id":"58d89ce0.62c5d4","type":"change","z":"42b7b639.325dd8","name":"Up","rules":[{"t":"set","p":"tilt_speed","pt":"msg","to":"0.5","tot":"num"},{"t":"set","p":"action","pt":"msg","to":"continuousMove","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":790,"y":1900,"wires":[["1e91b9a5.21fa16"]]},{"id":"946906ee.380ac8","type":"change","z":"42b7b639.325dd8","name":"Down","rules":[{"t":"set","p":"tilt_speed","pt":"msg","to":"-0.5","tot":"num"},{"t":"set","p":"action","pt":"msg","to":"continuousMove","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":790,"y":1940,"wires":[["1e91b9a5.21fa16"]]},{"id":"1e91b9a5.21fa16","type":"onvif-ptz","z":"42b7b639.325dd8","name":"","deviceConfig":"e6c78b2e.fe4dc8","profileName":"","action":"","panSpeed":0,"tiltSpeed":0,"zoomSpeed":0,"panPosition":0,"tiltPosition":0,"zoomPosition":0,"panTranslation":0,"tiltTranslation":0,"zoomTranslation":0,"time":1,"preset":"","presetName":"","stopPanTilt":true,"stopZoom":true,"configurationToken":"","x":978,"y":1900,"wires":[[]]},{"id":"42a1fd91.6f6d44","type":"ui_joystick","z":"42b7b639.325dd8","name":"","group":"a434ad35.e8a6b","order":2,"width":"4","height":"4","trigger":"all","timeInterval":"250","useThemeColor":true,"color":"#7b73c9","threshold":"0.1","directions":"all","shape":"circle","centerAtRelease":true,"x":320,"y":1920,"wires":[["326a58dd.81fb68"]]},{"id":"326a58dd.81fb68","type":"switch","z":"42b7b639.325dd8","name":"payload.direction.angle","property":"payload.direction.angle","propertyType":"msg","rules":[{"t":"eq","v":"up","vt":"str"},{"t":"eq","v":"down","vt":"str"},{"t":"eq","v":"left","vt":"str"},{"t":"eq","v":"right","vt":"str"}],"checkall":"true","repair":false,"outputs":4,"x":550,"y":1920,"wires":[["58d89ce0.62c5d4"],["946906ee.380ac8"],["ba57d28b.46f04"],["8d529ac3.447d98"]],"outputLabels":["up","down","left","right"]},{"id":"e6c78b2e.fe4dc8","type":"onvif-config","z":"","xaddress":"192.168.1.200","port":"80","name":"MyCamKitchen"},{"id":"a434ad35.e8a6b","type":"ui_group","z":"","name":"Joystick demo","tab":"77a8be2.16f914","order":1,"disp":true,"width":"12","collapse":false},{"id":"77a8be2.16f914","type":"ui_tab","z":"","name":"Joystick","icon":"dashboard","disabled":false,"hidden":false}]
   ```
   
   Remark: This flow requires that the [node-red-contrib-onvif-nodes](https://github.com/bartbutenaers/node-red-contrib-onvif-nodes) node has been installed directly from my Github account (since it is not published on NPM yet).  And you need to configure your username and password in the Onvif config node...

3. This is the final result:

   ![ptz_demo](https://user-images.githubusercontent.com/14224149/103488198-e4c9c500-4e0a-11eb-988d-212cf75567a3.gif)
