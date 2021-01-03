# node-red-contrib-ui-joystick
A Node-RED widget node to show a virtual joystick in the Node-RED dashboard

Thanks to [Stephen McLaughlin](https://github.com/Steve-Mcl) for pointing me to the [nipplejs](https://github.com/yoannmoinet/nipplejs) library!

## Install
Run the following npm command in your Node-RED user directory (typically ~/.node-red):
```
npm install node-red-contrib-ui-joystick
```

## Introduction to SVG
Scalable Vector Graphics (SVG) is an XML-based vector image format for two-dimensional graphics with support for interactivity and animation. We won't explain here how it works, because the internet is full of information about it. 

## Support my Node-RED developments

Please buy my wife a coffee to keep her happy, while I am busy developing Node-RED stuff for you ...

<a href="https://www.buymeacoffee.com/bartbutenaers" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy my wife a coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## Usage
Using this simple flow:

![image](https://user-images.githubusercontent.com/14224149/103476621-cd152100-4db7-11eb-8ec2-a0dec21edae3.png)
```
[{"id":"6b7eddec.472ed4","type":"ui_joystick","z":"7f1827bd.8acfe8","group":"28a39865.fa3608","order":2,"width":"6","height":"6","name":"","color":"#ff1900","threshold":"1","directions":"all","shape":"circle","sendMovements":false,"send45Directions":true,"send90Directions":false,"x":1160,"y":780,"wires":[["1dba6d92.cd0762"]]},{"id":"1dba6d92.cd0762","type":"debug","z":"7f1827bd.8acfe8","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":1340,"y":780,"wires":[]},{"id":"28a39865.fa3608","type":"ui_group","name":"Default","tab":"d8520920.0128d8","order":1,"disp":true,"width":"6","collapse":false},{"id":"d8520920.0128d8","type":"ui_tab","name":"Home","icon":"dashboard","disabled":false,"hidden":false}]
```

You will get a joystick in the dashboard, which sends messages to your Node-RED flow.  The following demo sends a message everytime a (45° angle based) direction is detected:

![joystick_demo](https://user-images.githubusercontent.com/14224149/103476760-ccc95580-4db8-11eb-8f09-e6639fc9e2ec.gif)

## Node configuration

### Directions
Specify in which directions the joystick can be moved:
+ *All*: the joystick can be moved in all directions.
+ *Only vertical*: the joystick can only be moved vertically.</li>
+ *Only horizontal*: the joystick can only be moved horizontally.</li>
  
### Shape:
Specify whether the shape of region - within which joystick can move - needs to be a circle or a square.

![Shapes](https://user-images.githubusercontent.com/14224149/103475945-e9ae5a80-4db1-11eb-9b96-52ac94b035e4.png)

### Threshold
Specify the minimum distance needed to trigger an output message.  This is a value between 0 and 1:
+ `0`: the center of the joystick, so the output message will always be sent.
+ `1`: the outer boundary of the joystick, which means that only an output message will be send when the joystick reaches the boundaries.

![Threshold](https://user-images.githubusercontent.com/14224149/103476432-bcfc4200-4db5-11eb-9deb-b8028350b920.png)

### Use the Node-RED theme base color
When activated, the base color of the Node-RED dashboard theme will be used.  Otherwise a custom color needs to be specified.

The following image shows the colors for the two standard Node-RED themes:

![image](https://user-images.githubusercontent.com/14224149/103480965-1d9c7680-4dd8-11eb-9716-52cc506b1e48.png)

### Color
Specify a custom CSS color of the joystick's center circle.  The outer circle will get automatically a reduced color:

![image](https://user-images.githubusercontent.com/14224149/103476126-5f66f600-4db3-11eb-8d05-906fe3789252.png)

Remark: this property will only be displayed when the checkbox *"Use the Node-RED theme base color"* is not activated.

### Send output msg at every change
When activated, output messages will be send for every moment.

As in the following example flow:

![every change](https://user-images.githubusercontent.com/14224149/103482260-242eec00-4de0-11eb-827a-9419c51a81f4.png)
```
[{"id":"6b7eddec.472ed4","type":"ui_joystick","z":"7f1827bd.8acfe8","group":"a434ad35.e8a6b","order":2,"width":"6","height":"6","name":"","useThemeColor":false,"color":"#ff0400","threshold":"1","directions":"all","shape":"circle","sendMovements":true,"send45Directions":false,"send90Directions":false,"x":1100,"y":620,"wires":[["762cb5c1.d2c2ac"]]},{"id":"762cb5c1.d2c2ac","type":"debug","z":"7f1827bd.8acfe8","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","statusVal":"","statusType":"auto","x":1290,"y":620,"wires":[]},{"id":"a434ad35.e8a6b","type":"ui_group","z":"","name":"Joystick demo","tab":"77a8be2.16f914","order":1,"disp":true,"width":"6","collapse":false},{"id":"77a8be2.16f914","type":"ui_tab","z":"","name":"Joystick","icon":"dashboard","disabled":false,"hidden":false}]
```

![joystick_all_demo](https://user-images.githubusercontent.com/14224149/103482318-7c65ee00-4de0-11eb-91ac-65f8b921bf93.gif)

CAUTION: a lot of messages will be sent!

### Send output msg at 45° direction change
When activated, output messages will be send as soon as a direction has been determined (after reaching the threshold).  In this case the directions are split with a 45° angle:

![45 degrees](https://user-images.githubusercontent.com/14224149/103476549-2fb9ed00-4db7-11eb-99be-4d5bb2724fb6.png)

As in the following example flow:

![45 degrees flow](https://user-images.githubusercontent.com/14224149/103481520-d4e6bc80-4ddb-11eb-8a97-fe2f367fcbcc.png)
```
[{"id":"6b7eddec.472ed4","type":"ui_joystick","z":"7f1827bd.8acfe8","group":"a434ad35.e8a6b","order":2,"width":"6","height":"6","name":"","useThemeColor":false,"color":"#ff1900","threshold":"1","directions":"all","shape":"circle","sendMovements":false,"send45Directions":true,"send90Directions":false,"x":1100,"y":620,"wires":[["1dba6d92.cd0762"]]},{"id":"1dba6d92.cd0762","type":"debug","z":"7f1827bd.8acfe8","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload.direction.angle","targetType":"msg","statusVal":"","statusType":"auto","x":1320,"y":620,"wires":[]},{"id":"a434ad35.e8a6b","type":"ui_group","z":"","name":"Joystick demo","tab":"77a8be2.16f914","order":1,"disp":true,"width":"6","collapse":false},{"id":"77a8be2.16f914","type":"ui_tab","z":"","name":"Joystick","icon":"dashboard","disabled":false,"hidden":false}]
```

![joystick_45_demo](https://user-images.githubusercontent.com/14224149/103481566-22fbc000-4ddc-11eb-80b5-b4c220f1ea31.gif)

### Interval (45)
Specify at which interval (seconds) the same (45°) direction should be repeated, as long as the threshold is exceeded.  When interval is 0, the messages won't be repeated.

In the following example flow the interval is set to 1 second, which means the same directions will be repeated every second.  This repeation wil stop when the direction changes or when the joystick is released (and goes back to its center):

![joystick_timer](https://user-images.githubusercontent.com/14224149/103483512-06fe1b80-4de8-11eb-9b1b-1547d0c31453.gif)

### Send output msg at 90° direction change
When activated, output messages will be send as soon as a plain direction has been determined (after reaching the threshold).  In this case the directions are split with a 90° angle:

![90 degrees](https://user-images.githubusercontent.com/14224149/103476600-9e974600-4db7-11eb-858a-2367cc0a1031.png)

As in the following example flow:

![image](https://user-images.githubusercontent.com/14224149/103481634-930a4600-4ddc-11eb-9dd2-07f96d28bee7.png)
```
[{"id":"6b7eddec.472ed4","type":"ui_joystick","z":"7f1827bd.8acfe8","group":"a434ad35.e8a6b","order":2,"width":"6","height":"6","name":"","useThemeColor":false,"color":"#ff1900","threshold":"1","directions":"all","shape":"circle","sendMovements":false,"send45Directions":false,"send90Directions":true,"x":1100,"y":620,"wires":[["1dba6d92.cd0762"]]},{"id":"1dba6d92.cd0762","type":"debug","z":"7f1827bd.8acfe8","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload.direction.angle","targetType":"msg","statusVal":"","statusType":"auto","x":1320,"y":620,"wires":[]},{"id":"a434ad35.e8a6b","type":"ui_group","z":"","name":"Joystick demo","tab":"77a8be2.16f914","order":1,"disp":true,"width":"6","collapse":false},{"id":"77a8be2.16f914","type":"ui_tab","z":"","name":"Joystick","icon":"dashboard","disabled":false,"hidden":false}]
```

![joystick_90_demo](https://user-images.githubusercontent.com/14224149/103481620-7837d180-4ddc-11eb-8d0b-f3fd11357c71.gif)

### Interval (90)
Specify at which interval (seconds) the same (90°) direction should be repeated, as long as the threshold is exceeded.  When interval is 0, the messages won't be repeated.

See the section *"Interval (45)"* above for a similar demo.

### Move joystick to its center when released
When activated, the joystick will automatically move back to its center when it is released.  Otherwise the joystick will remain at the position where it has been released.

Remark: when this option is disabled, it is not possible to set *"Interval (45)"* or *"Interval (90)"*.  Because those timers are automatically stopped when the joystick is reset back to the center.  But when automatic centering is disabled, the timers would keep running...

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
   [{"id":"b0e29a85.ddadd8","type":"change","z":"42b7b639.325dd8","name":"Right","rules":[{"t":"set","p":"pan_speed","pt":"msg","to":"0.5","tot":"num"},{"t":"set","p":"action","pt":"msg","to":"continuousMove","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":630,"y":900,"wires":[["ae6ba1c6.feaca"]]},{"id":"cb460270.dd29a","type":"change","z":"42b7b639.325dd8","name":"Left","rules":[{"t":"set","p":"pan_speed","pt":"msg","to":"-0.5","tot":"num"},{"t":"set","p":"action","pt":"msg","to":"continuousMove","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":630,"y":860,"wires":[["ae6ba1c6.feaca"]]},{"id":"ba7642a3.669b","type":"change","z":"42b7b639.325dd8","name":"Up","rules":[{"t":"set","p":"tilt_speed","pt":"msg","to":"0.5","tot":"num"},{"t":"set","p":"action","pt":"msg","to":"continuousMove","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":630,"y":780,"wires":[["ae6ba1c6.feaca"]]},{"id":"26d9a08c.8af38","type":"change","z":"42b7b639.325dd8","name":"Down","rules":[{"t":"set","p":"tilt_speed","pt":"msg","to":"-0.5","tot":"num"},{"t":"set","p":"action","pt":"msg","to":"continuousMove","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":630,"y":820,"wires":[["ae6ba1c6.feaca"]]},{"id":"ae6ba1c6.feaca","type":"onvif-ptz","z":"42b7b639.325dd8","name":"","deviceConfig":"e6c78b2e.fe4dc8","profileName":"","action":"","panSpeed":0,"tiltSpeed":0,"zoomSpeed":0,"panPosition":0,"tiltPosition":0,"zoomPosition":0,"panTranslation":0,"tiltTranslation":0,"zoomTranslation":0,"time":1,"preset":"","presetName":"","stopPanTilt":true,"stopZoom":true,"configurationToken":"","x":818,"y":780,"wires":[[]]},{"id":"2b63418.49e47be","type":"ui_joystick","z":"42b7b639.325dd8","group":"a434ad35.e8a6b","order":2,"width":"4","height":"4","name":"","useThemeColor":true,"color":"#00ffd0","threshold":"0.1","directions":"all","shape":"circle","sendMovements":false,"send45Directions":false,"send90Directions":true,"timeInterval45":"1","timeInterval90":"1","x":180,"y":800,"wires":[["5c2f97d4.c84738"]]},{"id":"5c2f97d4.c84738","type":"switch","z":"42b7b639.325dd8","name":"payload.direction.angle","property":"payload.direction.angle","propertyType":"msg","rules":[{"t":"eq","v":"up","vt":"str"},{"t":"eq","v":"down","vt":"str"},{"t":"eq","v":"left","vt":"str"},{"t":"eq","v":"right","vt":"str"}],"checkall":"true","repair":false,"outputs":4,"x":390,"y":800,"wires":[["ba7642a3.669b"],["26d9a08c.8af38"],["cb460270.dd29a"],["b0e29a85.ddadd8"]],"outputLabels":["up","down","left","right"]},{"id":"e6c78b2e.fe4dc8","type":"onvif-config","z":"","xaddress":"192.168.1.200","port":"80","name":"MyCamKitchen"},{"id":"a434ad35.e8a6b","type":"ui_group","z":"","name":"Joystick demo","tab":"77a8be2.16f914","order":1,"disp":true,"width":"12","collapse":false},{"id":"77a8be2.16f914","type":"ui_tab","z":"","name":"Joystick","icon":"dashboard","disabled":false,"hidden":false}]
   ```
   
   Remark: This flow requires that the [node-red-contrib-onvif-nodes](https://github.com/bartbutenaers/node-red-contrib-onvif-nodes) node has been installed directly from my Github account (since it is not published on NPM yet).  And you need to configure your username and password in the Onvif config node...

3. This is the final result:

   ![ptz_demo](https://user-images.githubusercontent.com/14224149/103488198-e4c9c500-4e0a-11eb-988d-212cf75567a3.gif)
