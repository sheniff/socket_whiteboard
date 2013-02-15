// Editor Class

var CodeHeroWhiteBoard = (function(){
	// Private
	var options = {
				tabSize: 2,
				lineNumbers: true,
				theme: 'ambiance'
			};

	return {
		// Public methods
		create: function(elem, extra_options){
			extra_options = extra_options || {};
			return CodeMirror(elem, $.extend(options, extra_options));
		},

		enableLineHl: function(editor){
			editor.off('cursorActivity').on('cursorActivity', function() {
			  var cur = editor.getLineHandle(editor.getCursor().line);
			  if (cur != editor.hlLine) {
			    editor.removeLineClass(editor.hlLine, 'background', 'activeline');
			    editor.hlLine = editor.addLineClass(cur, 'background', 'activeline');
			  }
			});
		},

		disableLineHl: function(editor){
			editor.removeLineClass(editor.hlLine, 'background', 'activeline');
			editor.off('cursorActivity');
		},

		selectTheme: function(editor, theme) {
			if(theme == 'ambiance') enableLineHl(editor);
			else disableLineHl(editor);

			editor.setOption('theme', theme);
		},

		update: function(editor, status) {
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
			};

			if(status.next)
				this.update(editor, status.next);
		}
	}
})();
