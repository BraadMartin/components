<?php
/**
 * Multi Color Picker Customizer Control
 *
 * This control allows registering a group of color settings to a single control,
 * and it uses a custom version of the stock WP color picker that supports RGBa
 * color values and includes an opacity slider.
 *
 * This Multi Color Picker is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this Multi Color Picker. If not, see <http://www.gnu.org/licenses/>.
 */
class Customize_Multi_Color_Control extends WP_Customize_Control {

	/**
	 * Official control name.
	 */
	public $type = 'multi-color';

	/**
	 * The array of color data.
	 */
	public $color_data;

	/**
	 * The label for this control group.
	 */
	public $label;

	/**
	 * Enqueue scripts and styles.
	 *
	 * Ideally these would get registered and given proper paths before this control object
	 * gets initialized, then we could simply enqueue them here, but for completeness as a
	 * stand alone class we'll register and enqueue them here.
	 */
	public function enqueue() {
		wp_enqueue_script( 'multi-color-picker', get_stylesheet_directory_uri() . '/admin/customizer/multi-color-picker/multi-color-picker.js', array( 'jquery', 'wp-color-picker' ), '1.0.0', true );
		wp_enqueue_style( 'multi-color-picker', get_stylesheet_directory_uri() . '/admin/customizer/multi-color-picker/multi-color-picker.css', array( 'wp-color-picker' ), '1.0.0' );
	}

	/**
	 * Render the control.
	 */
	public function render_content() {

		if ( isset( $this->label ) && '' !== $this->label ) {
			echo '<span class="customize-control-title">' . sanitize_text_field( $this->label ) . '</span>';
		}

		if ( isset( $this->description ) && '' !== $this->description ) {
			echo '<span class="description customize-control-description">' . sanitize_text_field( $this->description ) . '</span>';
		}

		// Output the div that will wrap our picker triggers.
		echo '<div class="multi-color-picker-triggers"></div>';

		// Loop over the color settings to output the actual inputs.
		foreach ( $this->settings as $key => $setting ) {

			// Store color data associated with the current setting.
			$color_data = $this->color_data[$setting->id];

			// Process the palette. Default to 'true' if no palette was passed in.
			$palette = ( isset( $color_data['palette'] ) ) ? $color_data['palette'] : true;
			if ( is_array( $palette ) ) {
				$palette = implode( '|', $palette );
			} elseif ( true === $palette || 'true' === $palette ) {
				$palette = 'true';
			} else {
				$palette = 'false';
			}

			// Grab the rest of the setting data. Define defaults to make everything except 'label' optional.
			$label = $color_data['label'];
			$default = ( isset( $color_data['default'] ) ) ? $color_data['default'] : '#000000';
			$show_opacity = ( isset( $color_data['show_opacity'] ) ) ? $color_data['show_opacity'] : 'true';

			?>
			<input type="text" class="multi-color-control" data-show-opacity="<?php echo esc_attr( $show_opacity ); ?>" data-palette="<?php echo $palette ?>" data-title="<?php echo esc_attr( $label ); ?>" data-default-color="<?php echo esc_attr( $default ); ?>" value="<?php echo $this->settings[$key]->value(); ?>" <?php echo $this->get_link( $key ); ?> />
			<?php
		}
	}
}