// Shared by mesh and particles: one event, no periodic time wrapping.
export const waveField = `
uniform float uTime;
uniform float uIntensity;
uniform float uFocus;
uniform float uAperture;
uniform vec2 uResolution;
const vec2 pulseOrigin=vec2(0.0,-.45);
float pulseRadius(float age) { return age*1.05; }
float gaussian(float x,float width) { return exp(-x*x/(width*width)); }
vec3 wave(vec2 p,float age) {
  vec2 delta=p-pulseOrigin;
  float radius=length(delta);
  float front=radius-pulseRadius(age);
  float envelope=smoothstep(0.0,.35,age)*(1.0-smoothstep(5.0,7.6,age));
  // A broad viscous crest, a trough, then one smaller trailing rebound.
  float head=gaussian(front,.48);
  float trough=gaussian(front+.64,.50);
  float tail=gaussian(front+1.34,.64);
  float height=(.29*head-.17*trough+.070*tail)*envelope;
  float light=(head+.30*tail)*envelope;
  float slope=(-2.0*front/.2304*.29*head
    +2.0*(front+.64)/.25*.17*trough
    -2.0*(front+1.34)/.4096*.070*tail)*envelope;
  return vec3(height,light,slope);
}
float restHeight(vec2 p) { return .035*sin(p.x*.65+p.y*.35)+.022*cos(p.y*.8); }
float clothHeight(vec2 p) { return restHeight(p)+wave(p,uTime).x; }
// Art-directed curved focus surface follows the annular crest. A conventional
// planar focal plane cannot keep this whole tilted ring sharp simultaneously.
float blurRadius(vec3 world,float depth) {
  float radialOffset=abs(length(world.xz-pulseOrigin)-pulseRadius(uTime));
  float halfWidth=mix(.18,.95,uFocus);
  float outside=max(0.0,radialOffset-halfWidth);
  float radialBlur=smoothstep(0.0,1.35,outside)*.023;
  // Dust above the cloth retains near/far bokeh even over the focused crest.
  float elevation=abs(world.y-clothHeight(world.xz));
  float verticalBlur=smoothstep(.05,.38,elevation)*.013;
  return min(length(vec2(radialBlur,verticalBlur))*uAperture*clamp(3.0/max(depth,.1),.45,1.5),.032);
}
`;

export const clothVertex = waveField + `
varying vec3 vWorld;
varying vec3 vNormal;
varying vec2 vMaterial;
varying float vDepth;
void main() {
  vec2 p=position.xz;
  float height=clothHeight(p);
  float dx=(clothHeight(p+vec2(.012,0.0))-clothHeight(p-vec2(.012,0.0)))/.024;
  float dz=(clothHeight(p+vec2(0.0,.012))-clothHeight(p-vec2(0.0,.012)))/.024;
  vNormal=normalize(vec3(-dx,1.0,-dz));
  vec3 displaced=vec3(p.x,height,p.y);
  vWorld=displaced;
  // Yarn stays attached to vertices as the crest stretches the surface.
  vMaterial=vec2(p.x*.83+p.y*.55,p.x*.55-p.y*.83);
  vec4 view=modelViewMatrix*vec4(displaced,1.0);
  vDepth=-view.z;
  gl_Position=projectionMatrix*view;
}
`;
export const clothFragment = waveField + `
varying vec3 vWorld;
varying vec3 vNormal;
varying vec2 vMaterial;
varying float vDepth;
void main() {
  vec3 event=wave(vWorld.xz,uTime);
  vec3 normal=normalize(vNormal);
  vec3 view=normalize(cameraPosition-vWorld);
  vec3 light=normalize(vec3(-.5,1.0,-.4));
  float diffuse=max(dot(normal,light),0.0);
  vec3 halfway=normalize(light+view);
  float spec=pow(max(dot(normal,halfway),0.0),28.0);
  float fresnel=pow(1.0-max(dot(normal,view),0.0),3.0);
  float cool=smoothstep(-2.8,3.2,vWorld.x);
  vec3 base=mix(vec3(.008,.115,.083),vec3(.025,.17,.22),cool);
  vec3 glow=mix(vec3(.36,.88,.12),vec3(.30,.83,.62),cool);
  vec3 color=base*(.65+diffuse*.55);
  color+=glow*event.y*(.46+diffuse*.29)*uIntensity;
  color+=vec3(.46,.74,.50)*spec*(.06+event.y*.48)*uIntensity;
  color+=vec3(.025,.085,.075)*fresnel;
  // Woven nylon; texture footprint follows perspective and real displacement.
  vec2 c=vMaterial*380.0;
  float blur=blurRadius(vWorld,vDepth);
  vec2 dx=dFdx(c),dy=dFdy(c);
  float variance=blur*blur*uResolution.y*uResolution.y+1.0/12.0;
  vec2 attenuation=exp(-.5*(dx*dx+dy*dy)*variance);
  float warp=sin(c.x),weft=sin(c.y*.88);
  float weave=warp*.40*attenuation.x+weft*.26*attenuation.y;
  weave+=warp*weft*.22*attenuation.x*attenuation.y;
  color*=1.0+weave*.55;
  color+=glow*max(0.0,warp*weft)*attenuation.x*attenuation.y*event.y*.05;
  gl_FragColor=vec4(color,1.0);
}
`;

export const particleVertex = waveField + `
attribute float aSeed;
attribute float aLift;
varying float vBrightness;
varying float vCore;
void main() {
  vec2 anchor=position.xz;
  vec3 event=wave(anchor,uTime);
  vec3 delayed=wave(anchor,max(0.0,uTime-.10));
  vec2 delta=anchor-pulseOrigin;
  vec2 radial=delta/max(length(delta),.0001);
  vec2 drift=radial*delayed.z*.035;
  vec2 p=anchor+drift;
  float y=clothHeight(p)+aLift+max(0.0,delayed.x)*.24;
  vec4 view=modelViewMatrix*vec4(p.x,y,p.y,1.0);
  float depth=-view.z;
  float sharp=(1.0+aSeed*1.0)*uResolution.y/850.0*3.0/max(depth,.1);
  float b=blurRadius(vec3(p.x,y,p.y),depth)*uResolution.y;
  float size=clamp(sqrt(sharp*sharp+b*b*2.0),1.0,64.0);
  gl_PointSize=size;
  gl_Position=projectionMatrix*view;
  vCore=sharp/size;
  // Pulse lights the suspended dust; no unrelated drift or twinkling clock.
  vBrightness=(.025+event.y*1.05+delayed.y*.30)*uIntensity;
}
`;
export const particleFragment = `
uniform sampler2D uDepthTexture;
uniform vec2 uResolution;
varying float vBrightness;
varying float vCore;
void main() {
  vec2 q=gl_PointCoord-.5;
  float disc=exp(-dot(q,q)*16.0);
  if(dot(q,q)>.25) discard;
  float surfaceDepth=texture2D(uDepthTexture,gl_FragCoord.xy/uResolution).r;
  if(gl_FragCoord.z>surfaceDepth+.00001) discard;
  float alpha=disc*vBrightness*vCore;
  gl_FragColor=vec4(vec3(.68,.94,.79),alpha);
}
`;

export const postVertex = `
varying vec2 vUv;
void main() { vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }
`;
export const postFragment = waveField + `
uniform sampler2D uColorTexture;
uniform mat4 uInverseProjection;
uniform mat4 uCameraWorld;
uniform sampler2D uDepthTexture;
varying vec2 vUv;
float linearDepth(float depth) {
  float near=.1,far=40.0;
  return near*far/(far-depth*(far-near));
}
void main() {
  float rawDepth=texture2D(uDepthTexture,vUv).r;
  float depth=linearDepth(rawDepth);
  vec4 view=uInverseProjection*vec4(vUv*2.0-1.0,rawDepth*2.0-1.0,1.0);
  vec3 world=(uCameraWorld*vec4(view.xyz/view.w,1.0)).xyz;
  float radius=blurRadius(world,depth);
  vec2 aspect=vec2(uResolution.y/uResolution.x,1.0);
  vec3 color=texture2D(uColorTexture,vUv).rgb;
  float total=1.0;
  for(int i=0;i<32;i++) {
    float f=float(i)+.5;
    float angle=f*2.39996323;
    vec2 offset=vec2(cos(angle),sin(angle))*sqrt(f/32.0)*radius*aspect*1.5;
    vec2 sampleUV=clamp(vUv+offset,vec2(.001),vec2(.999));
    float sampleDepth=linearDepth(texture2D(uDepthTexture,sampleUV).r);
    // Suppress background leaking over a closer, focused crest.
    float weight=1.0-smoothstep(.06,.6,sampleDepth-depth)*(1.0-smoothstep(.001,.008,radius));
    color+=texture2D(uColorTexture,sampleUV).rgb*weight;
    total+=weight;
  }
  color/=total;
  color*=1.0-.13*length((vUv-.5)*vec2(.8,1.0));
  float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);
  gl_FragColor=vec4(color+(grain-.5)/255.0,1.0);
}
`;
