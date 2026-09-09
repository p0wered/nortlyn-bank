import * as THREE from '/node_modules/three/build/three.module.js';
import { clothVertex, clothFragment, particleVertex, particleFragment, postVertex, postFragment } from './wave-shaders.js';

export function createBackground(canvas,onStatus=()=>{},onTime=()=>{}) {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=reduced.matches, disposed=false, failed=false, lost=false, time=0, speed=1, raf=0, previous=0;
  let renderer, target, clothGeometry, clothMaterial, particleGeometry, particleMaterial, postGeometry, postMaterial;
  let scene, camera, particles, postScene, postCamera;
  const uniforms={uTime:{value:reduced.matches?2.0:0},uIntensity:{value:1},uFocus:{value:.53},uAperture:{value:1},uResolution:{value:new THREE.Vector2(1,1)}};
  if(reduced.matches) time=2.0;
  function status() { onStatus(failed?'fallback':lost?'lost':time>=7.6?'settled':paused?(reduced.matches?'reduced':'paused'):'running'); }
  function render() {
    if(!renderer||disposed||lost||failed) return;
    uniforms.uTime.value=time; onTime(time);
    renderer.setRenderTarget(target); renderer.clear(); renderer.render(scene,camera);
    renderer.setRenderTarget(null); renderer.clear(); renderer.render(postScene,postCamera);
    // Particle CoC is computed individually; surface depth still occludes them.
    renderer.clearDepth(); renderer.render(particles,camera);
  }
  function resize() {
    if(!renderer||disposed||failed||lost) return;
    const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);
    const ratio=Math.min(devicePixelRatio||1,1.5,Math.sqrt(1800000/(w*h)));
    renderer.setPixelRatio(ratio); renderer.setSize(w,h,false);
    renderer.getDrawingBufferSize(uniforms.uResolution.value);
    target.setSize(uniforms.uResolution.value.x,uniforms.uResolution.value.y);
    camera.aspect=w/h;
    // Keep the far edge/horizon outside the crop even in wide windows with roll.
    const maxHalfAngle=THREE.MathUtils.degToRad(12.5);
    camera.fov=Math.min(24,THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(maxHalfAngle)/(Math.cos(.28)+camera.aspect*Math.sin(.28)))));
    camera.updateProjectionMatrix(); camera.updateMatrixWorld(); render();
  }
  function frame(now) {
    raf=0;
    if(paused||document.hidden||disposed||failed||lost||time>=7.6) return;
    if(previous) time=Math.min(7.6,time+Math.min((now-previous)/1000,.05)*speed);
    previous=now; render();
    if(time>=7.6) status(); else raf=requestAnimationFrame(frame);
  }
  function sync() {
    cancelAnimationFrame(raf); raf=0; previous=0;
    render();
    if(!paused&&!document.hidden&&!disposed&&!failed&&!lost&&time<7.6) raf=requestAnimationFrame(frame);
  }
  function motionChange() { paused=reduced.matches; status(); sync(); }
  function contextLost(event) { event.preventDefault(); lost=true; cancelAnimationFrame(raf); canvas.style.visibility='hidden'; status(); }
  function contextRestored() { lost=false; canvas.style.visibility='visible'; resize(); status(); sync(); }
  try {
    renderer=new THREE.WebGLRenderer({canvas,antialias:false,alpha:false,powerPreference:'low-power'});
    renderer.autoClear=false;
    renderer.setClearColor(0x082d32,1);
    renderer.debug.onShaderError=()=>{ failed=true; canvas.style.visibility='hidden'; status(); };
    camera=new THREE.PerspectiveCamera(24,1,.1,40);
    // Low macro viewpoint, ~18 degrees above the fabric, with a slight diagonal
    // framing. The wave remains circular in world space.
    camera.position.set(.35,.9,2.65); camera.lookAt(0,0,-.05);
    camera.rotateZ(.28);
    scene=new THREE.Scene(); particles=new THREE.Scene();
    clothGeometry=new THREE.PlaneGeometry(22,22,300,300);
    clothGeometry.rotateX(-Math.PI/2);
    clothMaterial=new THREE.ShaderMaterial({uniforms,vertexShader:clothVertex,fragmentShader:clothFragment,side:THREE.DoubleSide});
    const cloth=new THREE.Mesh(clothGeometry,clothMaterial);
    cloth.frustumCulled=false; scene.add(cloth);
    target=new THREE.WebGLRenderTarget(1,1,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,depthBuffer:true});
    target.depthTexture=new THREE.DepthTexture(1,1,THREE.UnsignedIntType);
    // Stable seeded anchors in world space, with different heights above cloth.
    let seed=92741;
    const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
    const count=1800, positions=new Float32Array(count*3), seeds=new Float32Array(count), lifts=new Float32Array(count);
    for(let i=0;i<count;i++) {
      positions[i*3]=(random()-.5)*16;
      positions[i*3+2]=(random()-.5)*16;
      seeds[i]=random(); lifts[i]=.035+Math.pow(random(),2)*.35;
    }
    particleGeometry=new THREE.BufferGeometry();
    particleGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    particleGeometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));
    particleGeometry.setAttribute('aLift',new THREE.BufferAttribute(lifts,1));
    particleMaterial=new THREE.ShaderMaterial({uniforms:{...uniforms,uDepthTexture:{value:target.depthTexture}},vertexShader:particleVertex,fragmentShader:particleFragment,transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending});
    const dust=new THREE.Points(particleGeometry,particleMaterial); dust.frustumCulled=false; particles.add(dust);
    postScene=new THREE.Scene(); postCamera=new THREE.Camera();
    postGeometry=new THREE.PlaneGeometry(2,2);
    postMaterial=new THREE.ShaderMaterial({uniforms:{...uniforms,uColorTexture:{value:target.texture},uDepthTexture:{value:target.depthTexture},uInverseProjection:{value:camera.projectionMatrixInverse},uCameraWorld:{value:camera.matrixWorld}},vertexShader:postVertex,fragmentShader:postFragment,depthTest:false,depthWrite:false});
    const quad=new THREE.Mesh(postGeometry,postMaterial); quad.frustumCulled=false; postScene.add(quad);
    resize(); status(); sync();
  } catch(error) { failed=true; console.error(error); canvas.style.visibility='hidden'; status(); }
  const observer=new ResizeObserver(resize); observer.observe(canvas);
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',motionChange);
  canvas.addEventListener('webglcontextlost',contextLost);
  canvas.addEventListener('webglcontextrestored',contextRestored);
  return {
    get paused(){return paused;},
    setSpeed(value){speed=value;},
    setIntensity(value){uniforms.uIntensity.value=value; render();},
    setFocus(value){uniforms.uFocus.value=value; render();},
    setAperture(value){uniforms.uAperture.value=value; render();},
    toggle(){paused=!paused; status(); sync();},
    seek(value){time=Math.max(0,Math.min(7.6,value)); paused=true; status(); sync();},
    replay(){time=0; paused=false; status(); sync();},
    dispose(){
      disposed=true; cancelAnimationFrame(raf); observer.disconnect();
      document.removeEventListener('visibilitychange',sync); reduced.removeEventListener('change',motionChange);
      canvas.removeEventListener('webglcontextlost',contextLost); canvas.removeEventListener('webglcontextrestored',contextRestored);
      for(const resource of [clothGeometry,clothMaterial,particleGeometry,particleMaterial,postGeometry,postMaterial,target,renderer]) resource?.dispose();
    }
  };
}
