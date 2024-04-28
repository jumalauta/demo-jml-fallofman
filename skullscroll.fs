
#version 330 core
in vec2 texCoord;
in vec4 vertexFragColor;
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
uniform vec4 color = vec4(1);
void main()
{
vec4 colors;
 
    vec2 xy = texCoord.xy;
	xy*=2.0;

	xy.y-=.4*time;
     vec4 color2=texture(texture0,xy);

	
	color2*=.9;
	color2.a=1.0;
	fragColor=color2;
	  
 
}