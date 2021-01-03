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

### Send output msg at 90° direction change
When activated, output messages will be send as soon as a plain direction has been determined (after reaching the threshold).  In this case the directions are split with a 90° angle:

![90 degrees](https://user-images.githubusercontent.com/14224149/103476600-9e974600-4db7-11eb-858a-2367cc0a1031.png)

As in the following example flow:

![image](https://user-images.githubusercontent.com/14224149/103481634-930a4600-4ddc-11eb-9dd2-07f96d28bee7.png)
```
[{"id":"6b7eddec.472ed4","type":"ui_joystick","z":"7f1827bd.8acfe8","group":"a434ad35.e8a6b","order":2,"width":"6","height":"6","name":"","useThemeColor":false,"color":"#ff1900","threshold":"1","directions":"all","shape":"circle","sendMovements":false,"send45Directions":false,"send90Directions":true,"x":1100,"y":620,"wires":[["1dba6d92.cd0762"]]},{"id":"1dba6d92.cd0762","type":"debug","z":"7f1827bd.8acfe8","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload.direction.angle","targetType":"msg","statusVal":"","statusType":"auto","x":1320,"y":620,"wires":[]},{"id":"a434ad35.e8a6b","type":"ui_group","z":"","name":"Joystick demo","tab":"77a8be2.16f914","order":1,"disp":true,"width":"6","collapse":false},{"id":"77a8be2.16f914","type":"ui_tab","z":"","name":"Joystick","icon":"dashboard","disabled":false,"hidden":false}]
```

![joystick_90_demo](https://user-images.githubusercontent.com/14224149/103481620-7837d180-4ddc-11eb-8d0b-f3fd11357c71.gif)

## Use case

A possible ***use case*** could be controlling a PTZ camera, e.g. via the [PTZ node](https://github.com/bartbutenaers/node-red-contrib-onvif-nodes#ptz-node).
Note that I don't have an example flow for this yet.  So if anybody exceeds in implementing this, please share your flow with me!!!
