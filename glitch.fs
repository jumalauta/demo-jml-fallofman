#define float2 vec2
#define float3 vec3
#define float4 vec4
in vec2 texCoord;
out vec4 fragColor;

uniform sampler2D texture0;
uniform float time;
uniform float amt; //0 - 1 glitch amount
uniform float scrollspeed;

#define speed 0.35
//2D (returns 0 - 1)
float random2d(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, floor(time * speed * 15.0+sin(time))*4.1414))) * (43758.5453));
}

float randomRange (in vec2 seed, in float min, in float max) {
return min + random2d(seed) * (max - min);
}

// return 1 if v inside 1d range
float insideRange(float v, float bottom, float top) {
   return step(bottom, v) - step(top, v);
}

void main()
{
    float offset = 2.05;
    float redness = 0.0;

   	vec2 uv = texCoord;
	uv.y-=time*scrollspeed;
	uv.y=mod(uv.y,1.0);

    float timeStep = floor(time * speed * 45.0);    
	float offsetStep = floor(speed*time)*.001;

    vec4 outCol = texture(texture0, uv);

    float maxoffset = offset*.25;

    for (float i = 0.0; i < 34.0 * amt; i += 1.0) {
        float sliceY = random2d(vec2(amt , 15.0*step(sin(time),0.5)+445.0 + float(i)));
        float sliceH = random2d(vec2(amt , 15.0*step(sin(time),0.25)+5035.0 + float(i))) * 0.15;
        float hoffset = 522.0*randomRange(vec2(amt , 9625.0 + float(i)), -maxoffset, maxoffset);
        vec2 uvOff = uv;
        uvOff.x += hoffset*offsetStep;
        if (insideRange(uv.y, sliceY, fract(sliceY+sliceH)) == 1.0 ){
        outCol = texture(texture0, uv+uvOff);
        }
    }
	outCol.r=outCol.r+redness;
	fragColor = outCol;
}

