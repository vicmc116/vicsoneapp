// Get the button
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 200px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
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
//  begin search
function search(string){
window.find(string);
}
// end search - begin copytxt
jQuery(document).ready(function($) {
	$('body').on('click', '.js-click-to-copy-text', function(e) {
		var range = document.createRange();
		var sel = window.getSelection();
		range.setStartBefore(this.firstChild);
		range.setEndAfter(this.lastChild);
		sel.removeAllRanges();
		sel.addRange(range);
		try {  
			var successful = document.execCommand('copy');  
		} catch(err) {  
			console.error('Unable to copy'); 
		} 		
	});
	function copy_input( $input ) {
		$input.focus();
		$input.select();
		try {  
			var successful = document.execCommand('copy');  
		} catch(err) {  
			console.error('Unable to copy'); 
		}		
	}	
});
