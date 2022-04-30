import {
	Vector2
} from 'three';

/**
 * Convert Structure Tensor to Tangent vector
 */

const hkTangentShader = {

	uniforms: {

		'u_image': { value: null },

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D u_image;
		
		varying vec2 vUv;
		
		vec2 st2tangent(vec4 g) {			
			g.rgb = (g.rgb * 2.0) - 1.0; // unnormalize to [-1, 1]
			float angle = 0.5 * atan((2.0 * g.z), (g.x - g.y)); // works!
			return vec2(-sin(angle), cos(angle)); // 90 degree rotation			
		}

		void main () {

			vec4 st = texture2D(u_image, vUv);

			float mag = st.a;
			vec2 tangent;
			
			if (mag < 0.000001) tangent = normalize(vec2(1, 1)); // [-1, 1]
			else tangent = st2tangent(st); // [-1, 1]
			
			tangent = (tangent + 1.0) / 2.0; // [0, 1]

			// alpha = 1.0 to convert to visible png file
			gl_FragColor = vec4(tangent, 0.0, 1.0);

		}`

};

export { hkTangentShader }; // named export
