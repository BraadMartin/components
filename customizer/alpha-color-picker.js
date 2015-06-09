/**
 * Alpha Color Picker JS
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
 * Given a hex, rgb, or rgba color value, return the alpha channel value.
 */
function get_alpha_value_from_color( value ) {

	var alphaVal;

	// Remove all spaces from the passed in value to help our RGBa regex.
	value = value.replace( / /g, '' );

	if ( value.match( /rgba\(\d+\,\d+\,\d+\,([^\)]+)\)/ ) ) {
		alphaVal = parseFloat( value.match( /rgba\(\d+\,\d+\,\d+\,([^\)]+)\)/ )[1] ) * 100;
		alphaVal = parseInt( alphaVal );
	} else {
		alphaVal = 100;
	}

	return alphaVal;	
}

jQuery( document ).ready( function( $ ) {

	// Loop over each control and transform it into our color picker.
	$( '.alpha-color-control' ).each( function() {

		// Store the control instance.
		var $control = $( this );
		
		// Get a clean starting value for the option.
		var value = $control.val().replace( /\s+/g, '' );

		// Get some data off our control.
		var paletteInput = $control.attr( 'data-palette' );
		var showOpacity = $control.attr( 'data-show-opacity' );

		// Process the palette.
		if ( paletteInput === 'false' || paletteInput === false ) {
			var palette = false;
		} else if ( paletteInput === 'true' || paletteInput === true ) {
			var palette = true;
		} else {
			var palette = $control.attr( 'data-palette' ).split( "|" );
		}

		// Set up the options that we'll pass to wpColorPicker().
		var colorPickerOptions = {
			change: function( event, ui ) {
				
				var newValue = $control.val();
				var defaultValue = $control.data( 'default-color' );
				var key = $control.attr( 'data-customize-setting-link' );

				// If the new value equals the default value then reset the opacity slider.
				if ( defaultValue == newValue ) {
					var alpha_val = get_alpha_value_from_color( newValue );
					$alphaSlider.find( '.ui-slider-handle' ).text( alphaVal ).css( 'left', '100%' );
				}
				
				// Send ajax request to wp.customize to trigger the Save action.
				wp.customize( key, function( obj ) {
					obj.set( newValue );
				});
				
				var $transparency = $container.find( '.transparency' );
				
				// Always show the background color of the opacity slider at 100% opacity.
				$transparency.css( 'backgroundColor', ui.color.toString( 'no-alpha' ) );
			},
			palettes: palette // Use the passed in palette.
		};

		// Create the colorpicker.
		$control.wpColorPicker( colorPickerOptions );

		var $container = $control.parents( '.wp-picker-container:first' );

		// Insert our opacity slider.
		$( '<div class="alpha-color-picker-container"><div class="min-click-zone click-zone"></div><div class="max-click-zone click-zone"></div><div class="alpha-slider"></div><div class="transparency"></div></div>' ).appendTo( $container.find( '.wp-picker-holder' ) );

		var $alphaSlider = $container.find( '.alpha-slider' );
		
		// If starting value is in format RGBa, grab alpha channel.
		var alphaVal = get_alpha_value_from_color( value );

		// Set up jQuery UI slider() options.
		var sliderOptions = {
			slide: function( event, ui ) {

				var newValue = $control.val();
				var key = $control.attr( 'data-customize-setting-link' );
				
				// Change value shown on slider handle.
				$( this ).find( '.ui-slider-handle' ).text( ui.value );

				// Send ajax request to wp.customizer to enable Save & Publish button.
				wp.customize( key, function( obj ) {
					obj.set( newValue );
				});
			},
			create: function( event, ui ) {

				var v = $( this ).slider( 'value' );
				
				// Set up initial values.
				$( this ).find( '.ui-slider-handle' ).text( v );
				$( this ).siblings( '.transparency ').css( 'background-color', value );
			},
			value: alphaVal,
			range: "max",
			step: 1,
			min: 0,
			max: 100,
			animate: 'slow'
		};

		// Initialize jQuery UI slider with our options.
		$alphaSlider.slider( sliderOptions );

		// Maybe show the opacity on the handle.
		if ( 'true' === showOpacity || true === showOpacity ) {
			$alphaSlider.find( '.ui-slider-handle' ).addClass( 'show-opacity' );
		}

		// Bind event handlers for the click zones.
		$container.find( '.min-click-zone' ).on( 'click', function() {
			$alphaSlider.slider( 'value', 0 ); // Set value
			$alphaSlider.find( '.ui-slider-handle' ).text( '0' ); // Update handle text
		});
		$container.find( '.max-click-zone' ).on( 'click', function() {
			$alphaSlider.slider( 'value', 100 );
			$alphaSlider.find( '.ui-slider-handle' ).text( '100' );
		});

		// Bind event handler for clicking on a palette color.
		$container.find( '.iris-palette' ).on( 'click', function() {
			var color = $( this ).css( 'background-color' );
			var alpha = get_alpha_value_from_color( color );
			$alphaSlider.slider( 'value', alpha );
			$alphaSlider.find( '.ui-slider-handle' ).text( alpha );
		});

		// Update all the things when the slider is interacted with.
		$alphaSlider.slider().on( 'slidechange', function( event, ui ) {
			
			var newAlphaVal = parseFloat( ui.value );
			var iris = $control.data( 'a8cIris' );
			var	colorPicker = $control.data( 'wpWpColorPicker' );
			
			// Set the alpha value on our Iris object.
			iris._color._alpha = newAlphaVal / 100.0;
			
			// Set the value of our input.
			$control.val( iris._color.toString() );
			
			// Update the background color of the color picker.
			colorPicker.toggler.css({
				backgroundColor: $control.val()
			});
			
			// Update the color value of the color picker object.
			var newVal = $control.val();
			$control.wpColorPicker( 'color', newVal );
		});
	});
});
