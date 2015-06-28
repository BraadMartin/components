/**
 * Multi Color Picker JS
 *
 * This file includes several helper functions and the core control JS.
 */

/**
 * Override the stock color.js toString() method to add support for
 * outputting RGBa or Hex.
 */
Color.prototype.toString = function( flag ) {

	// If our no-alpha flag has been passed in, output RGBa value with 100% opacity (used to set the background color on the opacity slider)
	if ( 'no-alpha' == flag ) {
		return this.toCSS( 'rgba', '1' ).replace( /\s+/g, '' );
	}

	// If we have a proper opacity value, output RGBa
	if ( 1 > this._alpha ) {
		return this.toCSS( 'rgba', this._alpha ).replace( /\s+/g, '' );
	}

	// Proceed with stock color.js Hex output
	var hex = parseInt( this._color, 10 ).toString( 16 );
	if ( this.error ) { return ''; }
	if ( hex.length < 6 ) {
		for ( var i = 6 - hex.length - 1; i >= 0; i-- ) {
			hex = '0' + hex;
		}
	}

	return '#' + hex;
};

/**
 * Given an RGBa, RGB, or hex color value, return the alpha channel value.
 */
function mcp_get_alpha_value_from_color( value ) {
	var alphaVal;

	// Remove all spaces from the passed in value to help our RGBa regex.
	value = value.replace( / /g, '' );

	if ( value.match( /rgba\(\d+\,\d+\,\d+\,([^\)]+)\)/ ) ) {
		alphaVal = parseFloat( value.match( /rgba\(\d+\,\d+\,\d+\,([^\)]+)\)/ )[1] ).toFixed(2) * 100;
		alphaVal = parseInt( alphaVal );
	} else {
		alphaVal = 100;
	}

	return alphaVal;
}

/**
 * Force update the alpha value of the color picker object and maybe the alpha slider. 
 */
function mcp_update_alpha_value_on_color_control( alpha, $control, $alphaSlider, update_slider ) {
	var iris, color;

	iris = $control.data( 'a8cIris' );
	colorPicker = $control.data( 'wpWpColorPicker' );

	// Set the alpha value on the Iris object.
	iris._color._alpha = alpha;

	// Store the new color value.
	color = iris._color.toString();

	// Set the value of the input.
	$control.val( color );

	// Update the background color of the color picker.
	colorPicker.toggler.css({
		'background-color': color
	});

	// Maybe update the alpha slider itself.
	if ( update_slider ) {
		mcp_update_alpha_value_on_alpha_slider( alpha, $alphaSlider );
	}

	// Update the color value of the color picker object.
	$control.wpColorPicker( 'color', color );
}

/**
 * Update the slider handle position and label.
 */
function mcp_update_alpha_value_on_alpha_slider( alpha, $alphaSlider ) {
	$alphaSlider.slider( 'value', alpha );
	$alphaSlider.find( '.ui-slider-handle' ).text( alpha.toString() );
}

/**
 * Initialization trigger.
 */
jQuery( document ).ready( function( $ ) {

	// Loop over each control and transform it into our color picker.
	$( '.multi-color-control' ).each( function() {

		// Scope the vars.
		var $control, $controlWrap, $controlTriggerWrap, startingColor, paletteInput, showOpacity, defaultColor, colorTitle, palette, colorPickerOptions, $container, $trigger, defaultButton, $_trigger, $pickerTriggers, $alphaSlider, alphaVal, sliderOptions;

		// Store the control instance, the control group wrapper, and the trigger wrapper.
		$control = $( this );
		$controlWrap = $control.parent( '.customize-control-multi-color' );
		$controlTriggerWrap = $controlWrap.find( '.multi-color-picker-triggers' );
		
		// Get a clean starting value for the option.
		startingColor = $control.val().replace( /\s+/g, '' );

		// Get some data off our control.
		paletteInput = $control.attr( 'data-palette' );
		showOpacity = $control.attr( 'data-show-opacity' );
		defaultColor = $control.attr( 'data-default-color' );
		colorTitle = $control.attr( 'data-title' );

		// Process the palette.
		if ( paletteInput == 'false' ) {
			palette = false;
		} else if ( paletteInput == 'true' ) {
			palette = true;
		} else {
			palette = $control.attr( 'data-palette' ).split( "|" );
		}

		// Set up the options that we'll pass to wpColorPicker().
		colorPickerOptions = {
			change: function( event, ui ) {
				var key, value, alpha;

				key = $control.attr( 'data-customize-setting-link' );
				value = $control.wpColorPicker( 'color' );

				// Set the opacity value on the slider handle when the default color button is clicked.
				if ( defaultColor == value ) {
					alpha = mcp_get_alpha_value_from_color( value );
					$alphaSlider.find( '.ui-slider-handle' ).text( alpha );
				}

				// Send ajax request to wp.customize to trigger the Save action.
				wp.customize( key, function( obj ) {
					obj.set( value );
				});

				// Update the background color on the trigger.
				$_trigger.css( 'background-color', value ); 

				// Update the background color on the transparency slider and always show
				// the background color of the opacity slider at 100% opacity.
				$container.find( '.transparency' ).css( 'background-color', ui.color.toString( 'no-alpha' ) );
			},
			palettes: palette // Use the passed in palette.
		};

		// Create the colorpicker.
		$control.wpColorPicker( colorPickerOptions );

		// Store the container.
		$container = $control.parents( '.wp-picker-container:first' );

		// Store the color picker trigger anchor.
		$trigger = $container.find( '.wp-color-result' );

		// Store the default button.
		$defaultButton = $container.find( '.wp-picker-default' );

		// Inject a div where we'll show the color title.
		$container.prepend( '<div class="multi-color-control-color-title"></div>' );

		// Add some extra data to the color result anchor.
		$trigger.attr( 'title', colorTitle );

		// Clone the trigger.
		$_trigger = $trigger.clone(); 

		// Add the clone to the trigger container and wrap it in a span for styling purposes.
		$_trigger.appendTo( $controlTriggerWrap ).wrap( '<span class="multi-color-picker-trigger"></span>' );

		// Bind a special click handler on the clone that opens and closes the appropriate color picker.
		// This could use a clean up, but it is working.
		$_trigger.on( 'click', function() {

			if ( $trigger.hasClass( 'wp-picker-open' ) ) {

				// Close the picker.
				$trigger.click().removeClass( 'wp-picker-open' );
				$container.removeClass( 'open' );
				$container.find( '.multi-color-control-color-title' ).text( '' );

			} else {

				// Close any open pickers, then open the triggered picker.
				$controlWrap.find( '.wp-color-result.wp-picker-open' ).click().removeClass( 'wp-picker-open' );
				$controlWrap.find( '.wp-picker-container' ).removeClass( 'open' );
				$controlWrap.find( '.wp-picker-default' ).hide();
				$controlWrap.find( '.multi-color-control-color-title' ).text( '' );

				// Open the picker.
				$trigger.addClass( 'wp-picker-open' ).click().addClass( 'wp-picker-open' ); // There must be a better way to do this.
				$container.find( '.multi-color-control-color-title' ).text( colorTitle );
				$container.addClass( 'open' );
				$control.show();
			}
		});

		// Insert our opacity slider.
		$( '<div class="alpha-slider-container">' +
				'<div class="min-click-zone click-zone"></div>' +
				'<div class="max-click-zone click-zone"></div>' +
				'<div class="alpha-slider"></div>' +
				'<div class="transparency"></div>' +
			'</div>' ).appendTo( $container.find( '.wp-picker-holder' ) );

		// Store the alpha slider wrapper.
		$alphaSlider = $container.find( '.alpha-slider' );
		
		// If starting value is in format RGBa, grab alpha channel.
		alphaVal = mcp_get_alpha_value_from_color( startingColor );

		// Set up jQuery UI slider() options.
		var sliderOptions = {
			create: function( event, ui ) {
				var value = $( this ).slider( 'value' );

				// Set up initial values.
				$( this ).find( '.ui-slider-handle' ).text( value );
				$( this ).siblings( '.transparency ').css( 'background-color', startingColor );
			},
			value: alphaVal,
			range: 'max',
			step: 1,
			min: 0,
			max: 100,
			animate: 300
		};

		// Initialize jQuery UI slider with our options.
		$alphaSlider.slider( sliderOptions );

		// Maybe show the opacity on the handle.
		if ( 'true' == showOpacity ) {
			$alphaSlider.find( '.ui-slider-handle' ).addClass( 'show-opacity' );
		}

		// Bind event handlers for the click zones.
		$container.find( '.min-click-zone' ).on( 'click', function() {
			mcp_update_alpha_value_on_color_control( 0, $control, $alphaSlider, true );
		});
		$container.find( '.max-click-zone' ).on( 'click', function() {
			mcp_update_alpha_value_on_color_control( 100, $control, $alphaSlider, true );
		});

		// Bind event handler for clicking on a palette color.
		$container.find( '.iris-palette' ).on( 'click', function() {
			var color, alpha;

			color = $( this ).css( 'background-color' );
			alpha = mcp_get_alpha_value_from_color( color );

			mcp_update_alpha_value_on_alpha_slider( alpha, $alphaSlider );

			// Sometimes Iris doesn't set a perfect background-color on the palette,
			// for example rgba(20, 80, 100, 0.3) becomes rgba(20, 80, 100, 0.298039).
			// To compensante for this we round the opacity value on RGBa colors here
			// and save it a second time to the color picker object.
			if ( alpha != 100 ) {
				color = color.replace( /[^,]+(?=\))/, ( alpha / 100 ).toFixed( 2 ) );
			}

			$control.wpColorPicker( 'color', color );
		});

		// Bind event handler for clicking on the 'Default' button.
		$container.find( '.button.wp-picker-default' ).on( 'click', function() {
			var alpha = mcp_get_alpha_value_from_color( defaultColor );

			mcp_update_alpha_value_on_alpha_slider( alpha, $alphaSlider );
		});

		// Update all the things when the slider is interacted with.
		$alphaSlider.slider().on( 'slide', function( event, ui ) {
			var alpha = parseFloat( ui.value ) / 100.0;

			mcp_update_alpha_value_on_color_control( alpha, $control, $alphaSlider, false );

			// Change value shown on slider handle.
			$( this ).find( '.ui-slider-handle' ).text( ui.value );
		});

	});

});
