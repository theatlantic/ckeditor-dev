(function() {

	var $ = (typeof CKEDITOR == 'object' && CKEDITOR.jQuery == 'object')
		  ? CKEDITOR.jQuery
		  : (typeof django == 'object' && typeof django.jQuery == 'object')
			? django.jQuery : window.jQuery;

	var DEFAULTS = {
		allowedCopyTags: [
			'A', 'ABBR', 'ACRONYM', 'BLOCKQUOTE', 'BR', 'DIV', 'HR', 'I',
			'IFRAME', 'IMG', 'LI', 'OL', 'P', 'Q', 'S', 'STRIKE', 'SUB',
			'SUP', 'TABLE', 'TR', 'TD', 'TH', 'UL'
		],
		removeAttrs: []
	};

	CKEDITOR.plugins.add('smartcopy',
	{
		init: function(editor)
		{
			// Determine what tags and attributes are allowed
			var allowedCopyTags, removeAttrs;
			if ( editor.config.smartCopyAllowedTags !== undefined ) {
				allowedCopyTags = editor.config.smartCopyAllowedTags.map(function(x) {
					return x.toUpperCase();
				});
			} else {
				allowedCopyTags = DEFAULTS.allowedCopyTags;
			}
			if (editor.config.smartCopyRemoveAttrs !== undefined) {
				removeAttrs = editor.config.smartCopyRemoveAttrs;
			} else {
				removeAttrs = DEFAULTS.smartCopyRemoveAttrs;
			}

			var removeStyles = (removeAttrs && $.inArray('style', removeAttrs));

			editor.on('paste', function (evt) {
				var data = evt.data,
					copiedHtml = data.dataValue;

				var wrapper = document.createElement('div');
				wrapper.innerHTML = copiedHtml;
				var $wrapper = $(wrapper);

				// Remove disallowed tags
				$wrapper.find('*').each(function(i, el) {
					$el = $(el);
					// Is the current element in our list of allowed tags
					if (el.nodeType === Node.ELEMENT_NODE && $.inArray(el.nodeName, allowedCopyTags) === -1) {
						if (el.innerHTML) {
							// If the node contains text, remove its surrounding tag
							$el.contents().unwrap();
						} else {
							// If the node doesn't contain text, remove it
							el.parentNode.removeChild(el);
						}
					} else {
						// Remove any disallowed attributes
						if (removeAttrs) {
							for (var i in removeAttrs) {
								$el.removeAttr(removeAttrs[i]);
							}
						}

						// // If we aren't removing all styles, then remove font styles
						// if (!removeStyles && el.style !== undefined) {
						// el.style.removeProperty('font');
						// el.style.removeProperty('color');
						// }
					 }
				});

				data.dataValue = $wrapper.html();
			});
		},
	});
})();