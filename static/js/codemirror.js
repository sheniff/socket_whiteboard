// Editor instance
var editor = CodeMirror(document.getElementById('whiteboard'), {
	tabSize: 2,
	lineNumbers: true,
	theme: 'ambiance'
});

// Line highlighting
var hlLine = editor.addLineClass(0, 'background', 'activeline');
enableLineHl();

function enableLineHl(){
	editor.addLineClass(hlLine, 'background', 'activeline');
	editor.on('cursorActivity', function() {
	  var cur = editor.getLineHandle(editor.getCursor().line);
	  if (cur != hlLine) {
	    editor.removeLineClass(hlLine, 'background', 'activeline');
	    hlLine = editor.addLineClass(cur, 'background', 'activeline');
	  }
	});
};

function disableLineHl(){
	editor.removeLineClass(hlLine, 'background', 'activeline');
	editor.off('cursorActivity');
};

// Changing theme
function selectTheme() {
	var input = document.getElementById('select'),
			theme = input.options[input.selectedIndex].innerHTML;

	if(theme == 'ambiance') enableLineHl();
	else disableLineHl();

	editor.setOption('theme', theme);
};

function updateEditor(status) {
	switch(status.origin){
		case 'input':
		case 'paste':
		case 'undo':
		case 'redo':
			if(status.text.length == 1)
				editor.replaceRange(status.text[0], status.from, status.to);
			else {
				var str = '', i;
				for(i = 0; i < status.text.length; i++){
					if(i > 0) str += '\n';
					str += status.text[i];
				}
				editor.replaceRange(str, status.from, status.to);
			}
		break;

		case 'delete':
			editor.replaceRange('', status.from, status.to);
		break;
	}

	if(status.next)
		updateEditor(status.next);
};

(function(){
	var choice = document.location.search && decodeURIComponent(document.location.search.slice(1)),
			input = document.getElementById('select');

	if (choice) {
		input.value = choice;
		if(choice == 'ambiance') enableLineHl();
		else disableLineHl();
		editor.setOption('theme', choice);
	}
})();
