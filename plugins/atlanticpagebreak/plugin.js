/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Horizontal Page Break
 */

// Register a plugin named "atlanticpagebreak".
(function() {

    var pagebreakCmd = function pagebreakCmd( editor, name ) {
    	this.editor = editor;
    	this.name = name;
    	this.context = 'div';
    	this.cssClassName = editor.config.atlanticpagebreak_className;
    	this.requiredContent = 'div(' + this.cssClassName + ')';
    	this.allowedContent = 'div(' + this.cssClassName + ')';
    };

    pagebreakCmd.prototype = {
    	exec: function( editor ) {
    		var label = editor.lang.atlanticpagebreak.alt;

    		// Create read-only element that represents a print break.
    		var pagebreak = CKEDITOR.dom.element.createFromHtml( '<div style="' +
    			'page-break-after: always;"' +
    			'contenteditable="false" ' +
    			'title="' + label + '" ' +
    			'aria-label="' + label + '" ' +
    			'data-cke-display-name="atlanticpagebreak" ' +
    			'class="' + this.cssClassName + '">' +
    			'</div>', editor.document );

    		editor.insertElement( pagebreak );
    	}
    };

    CKEDITOR.plugins.add( 'atlanticpagebreak', {
    	requires: 'fakeobjects',
    	lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en-au,en-ca,en-gb,en,eo,es,et,eu,fa,fi,fo,fr-ca,fr,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt-br,pt,ro,ru,sk,sl,sq,sr-latn,sr,sv,th,tr,ug,uk,vi,zh-cn,zh', // %REMOVE_LINE_CORE%
    	icons: 'atlanticpagebreak', // %REMOVE_LINE_CORE%
    	onLoad: function() {
    		var className = CKEDITOR.config.atlanticpagebreak_className;
    		// Add the styles that renders our placeholder.
    		CKEDITOR.addCss( 'div.' + className + [
    			'{',
    				'border-left: 0;',
    				'border-right: 0;',
    				'background: #e5e5e5;',
    				'width: 773px;',
    				'margin: 50px -101px;',
    				'height: 50px;',
    				'line-height: 0px;',
    			'}'
    			].join( '' ).replace( /;/g, ' !important;' ));

    		CKEDITOR.addCss( 'div.' + className + ':before, div.' + className + ':after' + [
    			'{',
    				'content: "";',
    				'display: block;',
    				'background: transparent;',
    				'width: 772px;',
    				'height: 0px;',
    				'margin: 0 auto;',
    				'position: relative;',
    				'z-index: 70;',
    				'border-top: 1px solid #ccc;',
    			'}'
    			].join( '' ).replace( /;/g, ' !important;' ));

    		CKEDITOR.addCss( 'div.' + className + ':after' + [
    			'{',
    				'top: 48px;',
    			'}'
    			].join( '' ).replace( /;/g, ' !important;' ));
    	},
    	init: function( editor ) {
    		if ( editor.blockless )
    			return;

    		// Register the command.
    		editor.addCommand( 'atlanticpagebreak', new pagebreakCmd( editor, "atlanticpagebreak" ) );

    		// Register the toolbar button.
    		editor.ui.addButton && editor.ui.addButton( 'AtlanticPageBreak', {
    			label: editor.lang.atlanticpagebreak.toolbar,
    			command: 'atlanticpagebreak',
    			toolbar: 'insert,70'
    		});

    		// Opera needs help to select the page-break.
    		CKEDITOR.env.opera && editor.on( 'contentDom', function() {
    			editor.document.on( 'click', function( evt ) {
    				var target = evt.data.getTarget();
    				if ( target.is( 'div' ) && target.hasClass( CKEDITOR.config.atlanticpagebreak_className ) )
    					editor.getSelection().selectElement( target );
    			});
    		});
    	},

    	afterInit: function( editor ) {
    		var label = editor.lang.atlanticpagebreak.alt;

    		// Register a filter to displaying placeholders after mode change.
    		var dataProcessor = editor.dataProcessor,
    			dataFilter = dataProcessor && dataProcessor.dataFilter,
    			htmlFilter = dataProcessor && dataProcessor.htmlFilter;

    		if ( htmlFilter ) {
    			htmlFilter.addRules( {
    				attributes : {
    					'class' : function( value, element ) {
    						if ( value == editor.config.atlanticpagebreak_className ) {
    							element.children.length = 0;
    							var attrs = element.attributes;
    							delete attrs[ 'aria-label' ];
    							delete attrs.contenteditable;
    							delete attrs.title;
    							delete attrs.style;
    							return value;
    						}
    					}
    				}
    			}, 5 );
    		}

    		if ( dataFilter ) {
    			dataFilter.addRules( {
    				elements : {
    					div : function( element ) {
    						var attributes = element.attributes;
    						if ( attributes['class'] == CKEDITOR.config.atlanticpagebreak_className) {
    							attributes.contenteditable = "false";
    							attributes[ 'data-cke-display-name' ] = "atlanticpagebreak";
    							attributes[ 'aria-label' ] = label;
    							attributes[ 'title' ] = label;
    							element.children.length = 0;
    						}
    					}
    				}
    			});
    		}

    	}
    });

})();

/**
 * The css class name for the atlanticpagebreak element.
 *
 * @since 4.1
 * @cfg {String} [atlanticpagebreak_className='pagebreak']
 * @member CKEDITOR.config
 * @type String
 * @default 'pagebreak'
 * @example
 * CKEDITOR.config.atlanticpagebreak_className = 'pagebreak';
 */
CKEDITOR.config.atlanticpagebreak_className = 'pagebreak';
