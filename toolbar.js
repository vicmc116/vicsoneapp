var viewportwidth;
var viewportheight;
// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
if (typeof window.innerWidth != 'undefined')
{
      viewportwidth = window.innerWidth,
      viewportheight = window.innerHeight
}
// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0)
{
       viewportwidth = document.documentElement.clientWidth,
       viewportheight = document.documentElement.clientHeight
}
// older versions of IE
else
{
       viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
       viewportheight = document.getElementsByTagName('body')[0].clientHeight
}
document.write('<span>'+viewportwidth+'x'+viewportheight+'</span>');
((w,d)=>{w.addEventListener('DOMContentLoaded',()=>{var size={w:screen.width,h:screen.height,};var or=screen.orientation&&screen.orientation.type?screen.orientation.type:'landscape-primary';if('portrait-primary'===or&&size.w>size.h||w.orientation&&Math.abs(w.orientation)===90){[size.w,size.h]=[size.h,size.w]}
d.getElementById('ctncss').innerHTML=d.body.classList.contains('rtl')?`${size.h} X ${size.w}`:`${size.w} X ${size.h}`})})(window,document)
$.getJSON("https://api.ipify.org?format=json", function(data) {
// Setting text of element P with id ip
$("#ip").html(data.ip);
    })
function display_ct7() {
var x = new Date()
var ampm = x.getHours( ) >= 12 ? ' PM' : ' AM';
hours = x.getHours( ) % 12;
hours = hours ? hours : 12;
hours=hours.toString().length==1? 0+hours.toString() : hours;

var minutes=x.getMinutes().toString()
minutes=minutes.length==1 ? 0+minutes : minutes;

var seconds=x.getSeconds().toString()
seconds=seconds.length==1 ? 0+seconds : seconds;

var month=(x.getMonth() +1).toString();
month=month.length==1 ? 0+month : month;

var dt=x.getDate().toString();
dt=dt.length==1 ? 0+dt : dt;

var x1=month + "/" + dt + "/" + x.getFullYear(); 
x1 = x1 + "<br>" +  hours + ":" +  minutes + ":" +  seconds + " " + ampm;
document.getElementById('ct7').innerHTML = x1;
display_c7();
 }
 function display_c7(){
var refresh=1000; // Refresh rate in milli seconds
mytime=setTimeout('display_ct7()',refresh)
}
display_c7()
// begin slide abbacus?
$(document).ready(function(){
    $('#show').click(function() {
      $('.hide').toggle("slide");
    });
});