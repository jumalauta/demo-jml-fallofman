
in vec2 texCoord;
out vec4 fragColor;

uniform sampler2D texture0;
uniform float time;
uniform vec4 color;

void main()
{
vec4 colors;
 
    vec2 uv = texCoord.xy;
	uv.x*=3.0;
	uv.y*=2.0;

    uv.x += .25*time;


    vec4 color2=texture(texture0,uv);
	color2.rgb=vec3(0.0);
	

	fragColor=color2;
	  
 
}