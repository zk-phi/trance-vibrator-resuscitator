precision highp float;
uniform sampler2D texture;
uniform float value;
uniform vec2 resolution;

void main (void) {
    vec2 pos = gl_FragCoord.xy / resolution;
    float v = 1. - smoothstep(value - .1, value, abs(.5 - pos.y) * 2.);
    vec4 bg = vec4(mix(vec3(0.), vec3(.4, .2, .1), v), 1.);
    vec4 fg = vec4(texture2D(texture, gl_FragCoord.xy / resolution));
    gl_FragColor = clamp(bg + fg, 0., 1.);
}
