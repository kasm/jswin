# jswin
Window library for javascript


Usage:
Install
Just include jswin.js and jswin.css to your project

Usage
Create instance of JSWIN library:
var jswin = new JSWIN()

Windows can be created in different ways:
1. Passing html code to function:
jswin.createWindow('<div>my html code</div>', 'my title', parameters)
2. Passing element or element's ID to createWindow:
var elem = document.querySelector('#myid')
jswin.createWindow(elem, 'My title', parameters)
3. Passing http link to web page you would like to load to the window:
jswin.createWindow('https://wikipedia.org', 'my title', parameters)

Parameters
Paraeters is an object which contains all additional data to created window:
{
    l: left position (in pixels)
    t: top position (in pixels)
    s: [width, height],
    trans: transition time (milliseconds)
}

DEMO:
http://jsfiddle.net/iasm/6mjq5ak8/3/