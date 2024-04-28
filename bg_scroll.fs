
in vec2 texCoord;
out vec4 fragColor;

uniform sampler2D texture0;
uniform float time = 21.0;
uniform float speedX = -0.1;
uniform float speedY = 0.3;
uniform float video = 0.0;
uniform float value1 = 1.0;
uniform float value2 = 0.5;
uniform float value3 = 2.0;
uniform float value4 = 2.0;
uniform float contrast = 0.025;
uniform float alpha = 1.0;
uniform vec4 color = vec4(1.0);
void main()
{
vec4 colors;
 
    vec2 uv = texCoord.xy;
	

	
	uv.x += step(uv.x, 0.5) * (0.5-uv.x) * 2.0;

    
    uv.x -= 0.5*time;
    uv.y -= time;
	
    vec4 color2=texture(texture0,uv);

	

	fragColor=color2;
	  
 
}