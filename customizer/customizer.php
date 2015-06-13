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
			'title'      => __( 'Components Test', 'ginger' ),
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
			'capability'  => 'edit_theme_options',
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
				'palette'	=> array(
					'#3FADD7',
					'rgba(0,0,0,0.5)',
					'#666666',
					'#F5f5f5',
					'#333333',
					'#404040',
					'#2B4267'
				)
			)
		)
	);

	// Alpha Color Picker Test Setting
	$wp_customize->add_setting(
		'components_alpha_color_test_setting_two',
		array(
			'default'     => 'rgba( 120, 50, 70, 0.6 )',
			'type'        => 'theme_mod',
			'capability'  => 'edit_theme_options',
			'transport'   => 'postMessage'
		)
	);

	// Alpha Color Picker Test Control
	$wp_customize->add_control(
		new Customize_Alpha_Color_Control(
			$wp_customize,
			'components_alpha_color_test_control_two',
			array(
				'label'     => __( 'Alpha Color Picker Test', 'components' ),
				'section'   => 'components_test_section',
				'settings'  => 'components_alpha_color_test_setting_two',
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

	// Alpha Color Picker Test Setting
	$wp_customize->add_setting(
		'components_alpha_color_test_setting_three',
		array(
			'default'     => 'rgba(0,0,0,0)',
			'type'        => 'theme_mod',
			'capability'  => 'edit_theme_options',
			'transport'   => 'postMessage'
		)
	);

	// Alpha Color Picker Test Control
	$wp_customize->add_control(
		new Customize_Alpha_Color_Control(
			$wp_customize,
			'components_alpha_color_test_control_three',
			array(
				'label'     => __( 'Alpha Color Picker Test', 'components' ),
				'section'   => 'components_test_section',
				'settings'  => 'components_alpha_color_test_setting_three',
				'show_opacity'	=> 'true',
				'palette'	=> true
			)
		)
	);

}
