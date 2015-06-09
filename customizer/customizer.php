<?php
/**
 * Main Customizer File
 */

add_action( 'customize_register', 'components_customize_register' );
function components_customize_register( $wp_customize ) {

	// Inlcude Alpha Color Picker
	require_once( dirname( __FILE__ ) . '/alpha-color-picker.php' );

	// Add our test section.
	$wp_customize->add_section(
		'components_test_section',
		array(
			'title'      => __( 'Components Test', 'components' ),
			'priority'   => 999,
			'capability' => 'edit_theme_options',
		)
	);

	// Alpha Color Picker Test Setting
	$wp_customize->add_setting(
		'components_alpha_color_test_setting',
		array(
			'default'     => '#0099CC',
			'type'        => 'theme_mod',
			'transport'   => 'postMessage'
		)
	);

	// Alpha Color Picker Test Control
	$wp_customize->add_control(
		new Customize_Alpha_Color_Control(
			$wp_customize,
			'components_alpha_color_test_control',
			array(
				'label'     => __( 'Alpha Color Picker Test', 'components' ),
				'section'   => 'components_test_section',
				'settings'  => 'components_alpha_color_test_setting',
				'show_opacity'	=> true,
				'palette'	=> array(
					'rgb(150,50,220)',
					'rgba(50,50,50,0.8)',
					'rgba( 255, 255, 255, 0.2 )',
					'rgba(20, 80, 100, 0.3)',
					'#00CC99'
				)
			)
		)
	);

}

