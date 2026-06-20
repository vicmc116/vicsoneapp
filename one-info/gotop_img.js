// Get the button
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 200px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
/**
 * End go to top js code
 * By CodeTechNC (http://www.codetechnc.com)
 * Begin img js code'  
 */
$('img[data-enlargable]').addClass('img-enlargable').click(function () {
  var src = $(this).attr('src');
  $('<div>').css({
    background: 'RGBA(0,0,0,.97) url(' + src + ') no-repeat center',
    backgroundSize: 'contain',
    width: '100%', height: '100%',
    position: 'fixed',
    zIndex: '10000',
    top: '0', left: '0',
    cursor: 'zoom-out' }).
  click(function () {
    $(this).remove();
  }).appendTo('body');
});
// end img - begin search
function search(string){
window.find(string);
}
// end search - begin copytxt
copytextclipboard.init(function(thetext){
	console.log('TEXT COPIED: ' + thetext)
	// specify additional code to run whenever text contents copied to clipboard
})
