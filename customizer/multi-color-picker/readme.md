# Multi Color Picker Customizer Control #

Ever wanted to pick multiple colors from a single color control in the Customizer? Now you can with this multi color picker control. It uses a custom version of the stock WP color picker that supports RGBa color values and includes an opacity slider.

Here's what it looks like:

![WordPress Multi Color Picker](https://github.com/BraadMartin/components/blob/master/demos/multi-color-picker.gif)

![Wordpress Multi Color Picker Color Grid](https://github.com/BraadMartin/components/blob/master/demos/multi-color-picker-grid.png)

## How It Works ##

Each color is registered to its own setting and can be used exactly as if the color was picked with the standard Customize_Color_Control. Live-previewing in JS using transport: postMessage works great, as does transport: refresh. This control takes advantage of the support in the Customizer API for hooking a single control up to multiple settings. Multiple "groups" of colors (multiple instances of the Customize_Multi_Color_Control class) can be used together without limitations.

One key difference between this control and my [Alpha Color Picker Control](https://github.com/BraadMartin/components/tree/master/customizer/alpha-color-picker) is that the palette, default color, and show_opacity options are no longer explicity tied to the control. I wanted to allow these to be set individually for each color, so the control requires a single additional color_data array with all the extra data about each color setting.

You could write out the color_data array and register the settings and control yourself, but I've also included a helper function that I recommend using that takes care of everything. Since the helper function is not part of the control itself it lives in the customizer.php file in the customizer folder of this repo. The helper function is components_register_color_group, but "components" is just my prefix for this repo and should be changed to the prefix for your project.

Feedback and pull requests are encouraged!

## Usage ##

```php
add_action( 'customize_register', 'yourprefix_customize_register' );
function yourprefix_customize_register( $wp_customize ) {

	/**
	 * Inlcude the Multi Color Picker control file.
	 */
	require_once( dirname( __FILE__ ) . '/multi-color-picker/multi-color-picker.php' );

	/**
	 * Define a default palette that we'll use for some of the colors.
	 *
	 * We could certainly define a separate palette for each color also.
	 */
	$palette = array(
		'rgba(255, 0, 0, 0.7)',
		'rgba(54, 0, 170, 0.8)',
		'#FFCC00',
		'rgba( 20, 20, 20, 0.8 )',
		'#00CC77',
	);

	/**
	 * Define the color settings array that we'll pass to our helper function to
	 * register each setting and group them under a single control.
	 *
	 * For this example we'll register a group of background colors.
	 */
	$bg_colors = array(
		'body_bg' => array(
			'label'   => __( 'Body Background', 'yourprefix' ),
			'default' => 'rgba(255, 0, 0, 0.7)', // Hex, RGB, or RGBa works here
			'palette' => $palette, // This could also be true or false
		),
		'header_bg' => array(
			'label'   => __( 'Header Background', 'yourprefix' ),
			'default' => 'rgba(54, 0, 170, 0.8)',
			'palette' => $palette,
		),
		'sidebar_bg' => array(
			'label'   => __( 'Sidebar Background', 'yourprefix' ),
			'default' => '#FFCC00',
			'palette' => $palette,
		),
		'article_bg' => array(
			'label'   => __( 'Article Background', 'yourprefix' ),
			'default' => 'rgba( 20, 20, 20, 0.8 )',
			'palette' => $palette,
		),
		'footer_bg' => array(
			'label'   => __( 'Footer Background', 'yourprefix' ),
			'default' => '#00CC77',
			'palette' => $palette,
		),
	);

	/**
	 * Set up the array of standard control data.
	 *
	 * This could also have an active_callback, a sanitize_callback, etc.
	 */
	$bg_colors_control_data = array(
		'label'       => __( 'Background Colors', 'yourprefix' ),
		'description' => __( 'This is the optional control description.', 'yourprefix' ),
		'section'     => 'colors'
	);

	/**
	 * Use the helper function to register the group of settings and associate them with
	 * a single Multi Color Picker control.
	 */
	components_register_color_group(
		$wp_customize,                  // The main customizer object.
		$bg_colors,                     // The array of color setting data for this group.
		'yourprefix_background_colors', // The string name for the option to use.
		$bg_colors_control_data,        // The array of standard control data.
		$palette,                       // A fallback palette to use if none is specified in the color setting data.
		$transport                      // The transport method to use for the setting group.
	);

}
```

A big thanks to David Gwyer for providing the original inspiration for this control.

## License ##

This control is licensed under the GPL. Please do anything you want with it. :)
