# Alpha Color Picker Customizer Control #

Ever wanted to pick an RGBa color using the WordPress color picker in the Customizer? Now you can with this drop-in replacement for the stock WP color picker control.

Here's what it looks like:

![WordPress Alpha Color Picker](https://github.com/BraadMartin/components/blob/master/demos/alpha-color-picker.gif)

A jQuery plugin version of this alpha color picker that can be used in the admin outside of the Customizer can be found [here](https://github.com/BraadMartin/components/tree/master/alpha-color-picker).

## Usage ##

The control includes a CSS file and a JS file that have urls defined in a `wp_enqueue_scripts` call in `alpha-color-picker.php` that you'll probably want to update based on where you put the alpha-color-picker folder. The default urls are:

```php
get_stylesheet_directory_uri() . '/admin/customizer/alpha-color-picker/alpha-color-picker.js'
get_stylesheet_directory_uri() . '/admin/customizer/alpha-color-picker/alpha-color-picker.css'
```

If you use this in a plugin, you'd use something like `plugin_dir_url()`, and update the path to the files.

With the right urls for the CSS and JS in place, drop this in your theme or plugin's functions.php file:

```php
add_action( 'customize_register', 'xxx_customize_register' );
function xxx_customize_register( $wp_customize ) {

	// Inlcude the Alpha Color Picker control file.
	require_once( dirname( __FILE__ ) . '/alpha-color-picker/alpha-color-picker.php' );

	// Alpha Color Picker setting.
	$wp_customize->add_setting(
		'alpha_color_setting',
		array(
			'default'     => 'rgba(209,0,55,0.7)',
			'type'        => 'theme_mod',
			'capability'  => 'edit_theme_options',
			'transport'   => 'postMessage'
		)
	);

	// Alpha Color Picker control.
	$wp_customize->add_control(
		new Customize_Alpha_Color_Control(
			$wp_customize,
			'alpha_color_control',
			array(
				'label'         => __( 'Alpha Color Picker', 'yourtextdomain' ),
				'section'       => 'colors',
				'settings'      => 'alpha_color_setting',
				'show_opacity'  => true, // Optional.
				'palette'	=> array(
					'rgb(150, 50, 220)', // RGB, RGBa, and hex values supported
					'rgba(50,50,50,0.8)',
					'rgba( 255, 255, 255, 0.2 )', // Different spacing = no problem
					'#00CC99' // Mix of color types = no problem
				)
			)
		)
	);
}
```

## More Information ##

I wrote a post with more detailed usage information [on my blog](http://braadmartin.com/alpha-color-picker-control-for-the-wordpress-customizer/).

Feedback and pull requests are encouraged!

## License ##

This control is licensed under the GPL. Please do anything you want with it. :)
