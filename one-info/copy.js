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
//  copy js below
