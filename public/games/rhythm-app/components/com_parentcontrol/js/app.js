function getParentControlMessageBox(msgObj)
{
	var div = document.createElement('div');
	div.className = 'alert ' + msgObj.style;
	div.innerHTML = '<div><div class="alert-message">' + msgObj.text + '</div></div>';
				
	return div;
};

document.addEventListener('DOMContentLoaded', function(){
	try
	{
		var parentBox = document.querySelector('#system-message-container');
		
		if(!document.querySelector('#system-message'))
			parentBox.innerHTML = '<div id="system-message"></div>';
			
		var newMsg = getParentControlMessageBox(parentControlCustomMessage);
		
		document.querySelector('#system-message').append(newMsg);
	}
	catch(e)
	{
	//	console.log('Input data or Parent box for Custom messages are not found!');
	};	
});
	
