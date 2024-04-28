
in vec2 texCoord;
out vec4 fragColor;

uniform sampler2D texture0;
uniform float time;
uniform float speed;
uniform float speedY;
uniform float video;
uniform float value1;
uniform float value2;
uniform float value3;
uniform float value4;
uniform float contrast;
uniform float alpha;
uniform vec4 color;


float random(in vec2 p) {
    return fract(cos(dot(p,
        vec2(16.12327, 27.4725))) *
        29322.1543424);
}

float noise(in vec2 p) {

    vec2 i = floor(p);
    vec2 f = fract(p);
   
    float a = random(i);
    float b = random(i + vec2(1., 0.));
    float c = random(i + vec2(0., 1.));
    float d = random(i + vec2(1., 1.));
   
    vec2 u = smoothstep(0., 1., f);
   
    return mix(a, b, u.x) +
        (c - a) * u.y * (1.0-u.x) +
        (d - b) * u.x * u.y;

}

#define OCTAVES 12

float fbm(vec2 p) {



	float t2= time*1.1;
    float t = t2 / 8.;

   
    float shift = -t2/1.;

    float value = 0.;
    float amp = .5;
    float freq = 10.;
   
    for (int i = 0; i < OCTAVES; i++) {
   
        value += amp * noise(p  + shift);
        p *= 2.;
        amp *= .5;
   
    }
   
    return value;
}

float repFbm(vec2 p, float l) {
   
    float o = 0.;
     o = fbm(vec2(p+o));

    return o;
   
}

float Scanlines(float x, float repeat, float modValue)
{
    x = floor(x * repeat);
    return mod(x, modValue);
}

const vec3 col3 = vec3(1.0),
           col2 = vec3(1.0),
           col1 = vec3(0.0, 0.0,0.0);

void main()
{

    vec2 uv = texCoord.xy*2.0;
	
    float v = repFbm(uv, 3.);

    vec3 col = mix(col1,col2,clamp(v/3.,0.,.5));
       
    col = 2.0*(1.0-mix(col,col3,mix(v*3.,.2,.66)));

    float repeat = 155.0;
    float modValue = 2.0;
    float scanlines = abs(Scanlines(uv.y + 0.1, repeat, modValue));
    
	
    // Output to screen
    fragColor = vec4(col-vec3(scanlines*.15),1.0);
}