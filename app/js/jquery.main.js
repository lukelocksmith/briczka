$(document).ready(function(){
	// validation
	(function validation(){
		var form=$('.subscribe-form');
		form.each(function(){
			var _this = $(this),
			_inputHolder = _this.find('.input-holder');
			_inputHolder.find('input[type="text"]').blur(function(){
				var val=$(this).val();
				if((/^[^]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$/ig).test(val) && val!=this.defaultValue){
					$(this).closest('.input-holder').removeClass('error');
				}else{
					$(this).closest('.input-holder').addClass('error');
				}
			});
			_this.submit(function(e){
				_this.find('input').trigger('blur');
				if(!form.find('.error').size()){
					var containerHolder = $('.container-holder'),
						body = $('body'),
						lightboxContact = $('#lightbox-contact'),
						lightboxPressKit = $('#lightbox-press-kit'),
						lightboxEmailSend = $('#lightbox-email-send');

                    $.post(_this.attr('action'), _this.serialize())
                        .done(function (data) {
                            lightboxEmailSend.find('.email-send-box span').text(data);
                        })
                        .always(function () {
                            setTimeout(function(){
                                if (body.is('.has-contact')) {
                                    body.removeClass('has-contact');
                                    lightboxContact.hide();
                                } else if (body.is('.has-press-kit')) {
                                    body.removeClass('has-press-kit');
                                    lightboxPressKit.hide();
                                }

                                containerHolder.hide();
                                body.addClass('has-email-send');
                                lightboxEmailSend.slideDown();

                                $('.subscribe-form .input-holder input').val('e-mail');
                            }, 0);
                        });
				}
				e.preventDefault();
			});
		});
	})();
	/* sly */
	$frame=null,
	wst=0;
	initSly();
	$(window).load(function(){
		initSly();
	});

	$(window).resize(function(){
		initSly();
		posterBox();
	});

	function initSly(){
		if ('sly' in $.fn) {
			$frame = $('.music-list-slyder .music-sly');
			var $frameHolder = $frame.closest('.music-list-slyder'),
				windowHMusic = $(window).height() - 140,
				$frameSlyH = $frameHolder.find('.list-music').height();
			if (windowHMusic < $frameSlyH) {
				$frameHolder.addClass('has-sly');

			} else {
				$frameHolder.removeClass('has-sly');
			}
			$frameHolder.find('.music-sly').css({
				'max-height': windowHMusic
			});
			$frame.each(function(){
				var _this = $(this);
				var $wrap = $(this).parent();
				$(this).sly({
						 horizontal: 0,
						 smart: 1,
						 activateOn: 'click',
						 mouseDragging: 1,
						 touchDragging: 1,
						 releaseSwing: 1,
						 startAt: 0,
						 cycleBy: 'pages',
						 cycleInterval: 0,
						 scrollBar: $wrap.find('.scrollbar'),
						 scrollBy: 100,
						 speed: 450,
						 elasticBounds: 1,
						 easing: 'swing',
						 dragHandle: 1,
						 dynamicHandle: 1,
						 clickBar: 1,
						prevPage: $wrap.parent().find('.prev'),
						nextPage: $wrap.parent().find('.next'),
						 draggedClass:  'dragged',  // Class for dragged elements (like SLIDEE or scrollbar handle).
						 activeClass:   'active',   // Class for active items and pages.
						 disabledClass: 'disabled'
				}, {
					move: function(a){
						wst = this.pos.cur;
						$(window).trigger('scroll');
					}
				});
				$frame.sly('reload');
				$frame.on('touchmove', function(e){
					e.preventDefault();
				});

			});
		}
	}
	// next music
	$(function() {
		// Setup the player to autoplay the next track
		var a = audiojs.createAll({
		  trackEnded: function() {
			console.log(1);
			var next = $('.list-music li.playing').next();
			if (!next.length) next = $('.list-music li').first();
			next.addClass('playing').siblings().removeClass('playing');
			audio.load($('a', next).attr('data-src'));
			audio.play();
		  }
		});

		// Load in the first track
		var audio = a[0];
			first = $('.list-music a').attr('data-src');
		$('.list-music li').first().addClass('playing');
		audio.load(first);

		// Load in a track on click
		$('.list-music li').click(function(e) {
		  e.preventDefault();
		  $(this).addClass('playing').siblings().removeClass('playing');
		  audio.load($('a', this).attr('data-src'));
		  audio.play();
		});
		// Keyboard shortcuts
		$(document).keydown(function(e) {
		  var unicode = e.charCode ? e.charCode : e.keyCode;
			 // right arrow
		  if (unicode == 39) {
			var next = $('li.playing').next();
			if (!next.length) next = $('.list-music li').first();
			next.click();
			// back arrow
		  } else if (unicode == 37) {
			var prev = $('li.playing').prev();
			if (!prev.length) prev = $('.list-music li').last();
			prev.click();
			// spacebar
		  } else if (unicode == 32) {
			audio.playPause();
		  }
		});
		$(document).ready(function(){
			$('.audiojs .play').click();
		});
	});
	$(window).load(function(){
		var dropMusicList = $('.drop-music-list');
		dropMusicList.hide();
		dropMusicList.css({
			'right': 0,
			'left': '-40px',
			'right': '-40px'
		});
	});
	// lightbox contact
	openContact();
	openPressKit();
	closeContact();
	openMusicPlaylist();
	posterBox();
});
// poster box
function posterBox() {
	if ($("*").is('.poster-box')) {
		var poster_drop = $('.poster-drop .poster-drop-list'),
			poster_h = poster_drop.height(),
			poster_add_h = $(window).outerHeight() - 200,
			poster_drop_frame = $('.poster-drop');
		if (poster_add_h > poster_h) {
			poster_drop_frame.height('auto');
		} else {
			poster_drop_frame.height(poster_add_h);
		}
	}
}
// open music playlist
function openMusicPlaylist() {
	$('.btn-music-list').click(function(e){
		e.preventDefault();
		var dropMusicList = $('.drop-music-list');
		var self = $(this);
		if (self.is('.select')) {
			self.removeClass('select');
			$('body').removeClass('has-music-list');
			dropMusicList.fadeOut();
		} else {
			self.addClass('select');
			$('body').addClass('has-music-list');
			dropMusicList.fadeIn();
			$(window).resize();
		}
	});
	$('.close-drop-music').click(function(){
		var dropMusicList = $('.drop-music-list'),
			self = $('.btn-music-list');
		self.removeClass('select');
		$('body').removeClass('has-music-list');
		dropMusicList.fadeOut();
	});
};
// open contact
function openContact() {
	$('.btn-has-contact').click(function(e){
		e.preventDefault();
		var containerHolder = $('.container-holder'),
			body = $('body'),
			lightboxContact = $('#lightbox-contact'),
			lightboxPressKit = $('#lightbox-press-kit'),
			lightboxEmailSend = $('#lightbox-email-send');
		if (!body.is('.has-contact') && !body.is('.has-press-kit') && !body.is('.has-email-send')) {
			body.addClass('has-contact');
			containerHolder.hide();
			lightboxContact.slideDown();
		} else if (body.is('.has-press-kit')) {
			body.removeClass('has-press-kit');
			body.addClass('has-contact');
			lightboxPressKit.hide();
			lightboxContact.slideDown();
		} else if (body.is('.has-email-send')) {
			lightboxEmailSend.hide();
			body.addClass('has-contact');
			containerHolder.hide();
			lightboxContact.slideDown();
		}
	});
};
// open contact
function openPressKit() {
	$('.btn-has-press-kit').click(function(e){
		e.preventDefault();
		var containerHolder = $('.container-holder'),
			body = $('body'),
			lightboxContact = $('#lightbox-contact'),
			lightboxPressKit = $('#lightbox-press-kit'),
			lightboxEmailSend = $('#lightbox-email-send');
		if (!body.is('.has-contact') && !body.is('.has-press-kit') && !body.is('.has-email-send')) {
			body.addClass('has-press-kit');
			containerHolder.hide();
			lightboxPressKit.slideDown();
		} else if (body.is('.has-contact')) {
			body.removeClass('has-contact');
			body.addClass('has-press-kit');
			lightboxPressKit.slideDown();
			lightboxContact.hide();
		} else if (body.is('.has-email-send')) {
			lightboxEmailSend.hide();
			body.addClass('has-press-kit');
			containerHolder.hide();
			lightboxPressKit.slideDown();
		}
	});
};
// close contact
function closeContact() {
	$('.btn-l-close').click(function(e){
		e.preventDefault();
		var containerHolder = $('.container-holder'),
			body = $('body'),
			lightboxContact = $('#lightbox-contact'),
			lightboxPressKit = $('#lightbox-press-kit'),
			lightboxEmailSend = $('#lightbox-email-send');
		if (body.is('.has-contact')) {
			body.removeClass('has-contact');
			containerHolder.slideDown();
			lightboxContact.hide();
		} else if (body.is('.has-press-kit')) {
			body.removeClass('has-press-kit');
			lightboxPressKit.hide();
			containerHolder.slideDown();
		} else if (body.is('.has-email-send')) {
			body.removeClass('has-email-send');
			lightboxEmailSend.hide();
			containerHolder.slideDown();
		}
	});
}

// clear inputs on focus
function initInputs() {
	PlaceholderInput.replaceByOptions({
		// filter options
		clearInputs: true,
		clearTextareas: true,
		clearPasswords: true,
		skipClass:'default',

		// input options
		showPasswordBullets: false,
		wrapWithElement: false,
		showUntilTyping: false,
		getParentByClass: false,
		placeholderAttr: 'value'
	});
}

// placeholder class
;(function(){
	var placeholderCollection = [];
	PlaceholderInput = function() {
		this.options = {
			element:null,
			showUntilTyping:false,
			wrapWithElement:false,
			getParentByClass:false,
			showPasswordBullets:false,
			placeholderAttr:'value',
			inputFocusClass:'focus',
			inputActiveClass:'text-active',
			parentFocusClass:'parent-focus',
			parentActiveClass:'parent-active',
			labelFocusClass:'label-focus',
			labelActiveClass:'label-active',
			fakeElementClass:'input-placeholder-text'
		}
		placeholderCollection.push(this);
		this.init.apply(this,arguments);
	}
	PlaceholderInput.refreshAllInputs = function(except) {
		for(var i = 0; i < placeholderCollection.length; i++) {
			if(except !== placeholderCollection[i]) {
				placeholderCollection[i].refreshState();
			}
		}
	}
	PlaceholderInput.replaceByOptions = function(opt) {
		var inputs = [].concat(
			convertToArray(document.getElementsByTagName('input')),
			convertToArray(document.getElementsByTagName('textarea'))
		);
		for(var i = 0; i < inputs.length; i++) {
			if(inputs[i].className.indexOf(opt.skipClass) < 0) {
				var inputType = getInputType(inputs[i]);
				if((opt.clearInputs && (inputType === 'text' || inputType === 'email')) ||
					(opt.clearTextareas && inputType === 'textarea') ||
					(opt.clearPasswords && inputType === 'password')
				) {
					new PlaceholderInput({
						element:inputs[i],
						wrapWithElement:opt.wrapWithElement,
						showUntilTyping:opt.showUntilTyping,
						getParentByClass:opt.getParentByClass,
						showPasswordBullets:opt.showPasswordBullets,
						placeholderAttr: inputs[i].getAttribute('placeholder') ? 'placeholder' : opt.placeholderAttr
					});
				}
			}
		}
	}
	PlaceholderInput.prototype = {
		init: function(opt) {
			this.setOptions(opt);
			if(this.element && this.element.PlaceholderInst) {
				this.element.PlaceholderInst.refreshClasses();
			} else {
				this.element.PlaceholderInst = this;
				if(this.elementType !== 'radio' || this.elementType !== 'checkbox' || this.elementType !== 'file') {
					this.initElements();
					this.attachEvents();
					this.refreshClasses();
				}
			}
		},
		setOptions: function(opt) {
			for(var p in opt) {
				if(opt.hasOwnProperty(p)) {
					this.options[p] = opt[p];
				}
			}
			if(this.options.element) {
				this.element = this.options.element;
				this.elementType = getInputType(this.element);
				this.wrapWithElement = (this.elementType === 'password' || this.options.showUntilTyping ? true : this.options.wrapWithElement);
				if(this.options.showPasswordBullets && this.elementType === 'password') {
					this.wrapWithElement = false;
				}
				this.setPlaceholderValue(this.options.placeholderAttr);
			}
		},
		setPlaceholderValue: function(attr) {
			this.origValue = (attr === 'value' ? this.element.defaultValue : (this.element.getAttribute(attr) || ''));
			if(this.options.placeholderAttr !== 'value') {
				this.element.removeAttribute(this.options.placeholderAttr);
			}
		},
		initElements: function() {
			// create fake element if needed
			if(this.wrapWithElement) {
				this.fakeElement = document.createElement('span');
				this.fakeElement.className = this.options.fakeElementClass;
				this.fakeElement.innerHTML += this.origValue;
				this.fakeElement.style.color = getStyle(this.element, 'color');
				this.fakeElement.style.position = 'absolute';
				this.element.parentNode.insertBefore(this.fakeElement, this.element);

				if(this.element.value === this.origValue || !this.element.value) {
					this.element.value = '';
					this.togglePlaceholderText(true);
				} else {
					this.togglePlaceholderText(false);
				}
			} else if(!this.element.value && this.origValue.length) {
				this.element.value = this.origValue;
			}
			// get input label
			if(this.element.id) {
				this.labels = document.getElementsByTagName('label');
				for(var i = 0; i < this.labels.length; i++) {
					if(this.labels[i].htmlFor === this.element.id) {
						this.labelFor = this.labels[i];
						break;
					}
				}
			}
			// get parent node (or parentNode by className)
			this.elementParent = this.element.parentNode;
			if(typeof this.options.getParentByClass === 'string') {
				var el = this.element;
				while(el.parentNode) {
					if(hasClass(el.parentNode, this.options.getParentByClass)) {
						this.elementParent = el.parentNode;
						break;
					} else {
						el = el.parentNode;
					}
				}
			}
		},
		attachEvents: function() {
			this.element.onfocus = bindScope(this.focusHandler, this);
			this.element.onblur = bindScope(this.blurHandler, this);
			if(this.options.showUntilTyping) {
				this.element.onkeydown = bindScope(this.typingHandler, this);
				this.element.onpaste = bindScope(this.typingHandler, this);
			}
			if(this.wrapWithElement) this.fakeElement.onclick = bindScope(this.focusSetter, this);
		},
		togglePlaceholderText: function(state) {
			if(this.wrapWithElement) {
				this.fakeElement.style.display = state ? '' : 'none';
			} else {
				this.element.value = state ? this.origValue : '';
			}
		},
		focusSetter: function() {
			this.element.focus();
		},
		focusHandler: function() {
			clearInterval(this.checkerInterval);
			this.checkerInterval = setInterval(bindScope(this.intervalHandler,this), 1);
			this.focused = true;
			if(!this.element.value.length || this.element.value === this.origValue) {
				if(!this.options.showUntilTyping) {
					this.togglePlaceholderText(false);
				}
			}
			this.refreshClasses();
		},
		blurHandler: function() {
			clearInterval(this.checkerInterval);
			this.focused = false;
			if(!this.element.value.length || this.element.value === this.origValue) {
				this.togglePlaceholderText(true);
			}
			this.refreshClasses();
			PlaceholderInput.refreshAllInputs(this);
		},
		typingHandler: function() {
			setTimeout(bindScope(function(){
				if(this.element.value.length) {
					this.togglePlaceholderText(false);
					this.refreshClasses();
				}
			},this), 10);
		},
		intervalHandler: function() {
			if(typeof this.tmpValue === 'undefined') {
				this.tmpValue = this.element.value;
			}
			if(this.tmpValue != this.element.value) {
				PlaceholderInput.refreshAllInputs(this);
			}
		},
		refreshState: function() {
			if(this.wrapWithElement) {
				if(this.element.value.length && this.element.value !== this.origValue) {
					this.togglePlaceholderText(false);
				} else if(!this.element.value.length) {
					this.togglePlaceholderText(true);
				}
			}
			this.refreshClasses();
		},
		refreshClasses: function() {
			this.textActive = this.focused || (this.element.value.length && this.element.value !== this.origValue);
			this.setStateClass(this.element, this.options.inputFocusClass,this.focused);
			this.setStateClass(this.elementParent, this.options.parentFocusClass,this.focused);
			this.setStateClass(this.labelFor, this.options.labelFocusClass,this.focused);
			this.setStateClass(this.element, this.options.inputActiveClass, this.textActive);
			this.setStateClass(this.elementParent, this.options.parentActiveClass, this.textActive);
			this.setStateClass(this.labelFor, this.options.labelActiveClass, this.textActive);
		},
		setStateClass: function(el,cls,state) {
			if(!el) return; else if(state) addClass(el,cls); else removeClass(el,cls);
		}
	}

	// utility functions
	function convertToArray(collection) {
		var arr = [];
		for (var i = 0, ref = arr.length = collection.length; i < ref; i++) {
			arr[i] = collection[i];
		}
		return arr;
	}
	function getInputType(input) {
		return (input.type ? input.type : input.tagName).toLowerCase();
	}
	function hasClass(el,cls) {
		return el.className ? el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')) : false;
	}
	function addClass(el,cls) {
		if (!hasClass(el,cls)) el.className += " "+cls;
	}
	function removeClass(el,cls) {
		if (hasClass(el,cls)) {el.className=el.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)'),' ');}
	}
	function bindScope(f, scope) {
		return function() {return f.apply(scope, arguments)}
	}
	function getStyle(el, prop) {
		if (document.defaultView && document.defaultView.getComputedStyle) {
			return document.defaultView.getComputedStyle(el, null)[prop];
		} else if (el.currentStyle) {
			return el.currentStyle[prop];
		} else {
			return el.style[prop];
		}
	}
}());

if (window.addEventListener) window.addEventListener("load", initInputs, false);
else if (window.attachEvent) window.attachEvent("onload", initInputs);