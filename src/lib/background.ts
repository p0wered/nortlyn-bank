import * as THREE from 'three';
import {
  clothFragment,
  clothVertex,
  particleFragment,
  particleVertex,
  postFragment,
  postVertex,
} from './wave-shaders';
import {
  IMPULSE_DURATION,
  REFERENCE_TIME,
  type BackgroundController,
  type BackgroundStatus,
} from './types';

type Disposable = { dispose: () => void };

export function createBackground(
  canvas: HTMLCanvasElement,
  onStatus: (status: BackgroundStatus) => void = () => {},
  onTime: (time: number) => void = () => {},
): BackgroundController {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const study = new URLSearchParams(location.search).has('study');
  let paused = study || reduced.matches;
  let disposed = false;
  let failed = false;
  let lost = false;
  let time = study ? REFERENCE_TIME : 0;
  let speed = 1;
  let raf = 0;
  let previous = 0;
  let renderer: THREE.WebGLRenderer | undefined;
  let target: THREE.WebGLRenderTarget | undefined;
  let clothGeometry: THREE.PlaneGeometry | undefined;
  let clothMaterial: THREE.ShaderMaterial | undefined;
  let particleGeometry: THREE.BufferGeometry | undefined;
  let particleMaterial: THREE.ShaderMaterial | undefined;
  let postGeometry: THREE.PlaneGeometry | undefined;
  let postMaterial: THREE.ShaderMaterial | undefined;
  let scene: THREE.Scene | undefined;
  let camera: THREE.PerspectiveCamera | undefined;
  let particles: THREE.Scene | undefined;
  let postScene: THREE.Scene | undefined;
  let postCamera: THREE.Camera | undefined;

  const uniforms = {
    uTime: { value: time },
    uIntensity: { value: 1 },
    uFocus: { value: 0.32 },
    uAperture: { value: 1 },
    uResolution: { value: new THREE.Vector2(1, 1) },
  };

  if (reduced.matches) time = REFERENCE_TIME;

  function status(): void {
    const next: BackgroundStatus = failed
      ? 'fallback'
      : lost
        ? 'lost'
        : time >= IMPULSE_DURATION
          ? 'settled'
          : paused
            ? reduced.matches
              ? 'reduced'
              : 'paused'
            : 'running';
    onStatus(next);
  }

  function render(): void {
    if (!renderer || !target || !scene || !camera || !postScene || !postCamera || !particles) return;
    if (disposed || lost || failed) return;
    uniforms.uTime.value = time;
    onTime(time);
    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(postScene, postCamera);
    // Particle CoC is computed individually; surface depth still occludes them.
    renderer.clearDepth();
    renderer.render(particles, camera);
  }

  function resize(): void {
    if (!renderer || !target || !camera || disposed || failed || lost) return;
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    const ratio = Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(1_800_000 / (w * h)));
    renderer.setPixelRatio(ratio);
    renderer.setSize(w, h, false);
    renderer.getDrawingBufferSize(uniforms.uResolution.value);
    target.setSize(uniforms.uResolution.value.x, uniforms.uResolution.value.y);
    camera.aspect = w / h;
    // Keep the far edge/horizon outside the crop, including wide windows.
    const maxHalfAngle = THREE.MathUtils.degToRad(12.5);
    camera.fov = Math.min(
      24,
      THREE.MathUtils.radToDeg(
        2 * Math.atan(Math.tan(maxHalfAngle) / (Math.cos(0.65) + camera.aspect * Math.sin(0.65))),
      ),
    );
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    render();
  }

  function frame(now: number): void {
    raf = 0;
    if (paused || document.hidden || disposed || failed || lost || time >= IMPULSE_DURATION) return;
    if (previous) time = Math.min(IMPULSE_DURATION, time + Math.min((now - previous) / 1000, 0.05) * speed);
    previous = now;
    render();
    if (time >= IMPULSE_DURATION) status();
    else raf = requestAnimationFrame(frame);
  }

  function sync(): void {
    cancelAnimationFrame(raf);
    raf = 0;
    previous = 0;
    render();
    if (!paused && !document.hidden && !disposed && !failed && !lost && time < IMPULSE_DURATION) {
      raf = requestAnimationFrame(frame);
    }
  }

  function motionChange(): void {
    paused = reduced.matches;
    status();
    sync();
  }

  function contextLost(event: Event): void {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(raf);
    canvas.style.visibility = 'hidden';
    status();
  }

  function contextRestored(): void {
    lost = false;
    canvas.style.visibility = 'visible';
    resize();
    status();
    sync();
  }

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
    });
    renderer.autoClear = false;
    renderer.setClearColor(0x082d32, 1);
    renderer.debug.onShaderError = () => {
      failed = true;
      canvas.style.visibility = 'hidden';
      status();
    };

    camera = new THREE.PerspectiveCamera(24, 1, 0.1, 40);
    // Crop one distant arc rather than exposing the impulse center.
    // A 37-degree roll matches the reference diagonal in portrait.
    camera.position.set(0, 1.45, 3.6);
    camera.lookAt(0, 0, 0);
    camera.rotateZ(0.65);

    scene = new THREE.Scene();
    particles = new THREE.Scene();
    clothGeometry = new THREE.PlaneGeometry(22, 22, 300, 300);
    clothGeometry.rotateX(-Math.PI / 2);
    clothMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: clothVertex,
      fragmentShader: clothFragment,
      side: THREE.DoubleSide,
    });
    const cloth = new THREE.Mesh(clothGeometry, clothMaterial);
    cloth.frustumCulled = false;
    scene.add(cloth);

    target = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      generateMipmaps: true,
      depthBuffer: true,
    });
    target.depthTexture = new THREE.DepthTexture(1, 1, THREE.UnsignedIntType);

    // Stable seeded anchors in world space, with different heights above cloth.
    let seed = 92741;
    const random = () => {
      seed = (1664525 * seed + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const lifts = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (random() - 0.5) * 10;
      positions[i * 3 + 2] = (random() - 0.5) * 10;
      seeds[i] = random();
      // Mostly fine dust close to the yarn, fewer suspended bokeh highlights.
      const layer = random();
      lifts[i] = layer < 0.68 ? 0.008 + random() * 0.055 : 0.1 + Math.pow(random(), 1.5) * 0.48;
    }

    particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    particleGeometry.setAttribute('aLift', new THREE.BufferAttribute(lifts, 1));
    particleMaterial = new THREE.ShaderMaterial({
      uniforms: { ...uniforms, uDepthTexture: { value: target.depthTexture } },
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(particleGeometry, particleMaterial);
    dust.frustumCulled = false;
    particles.add(dust);

    postScene = new THREE.Scene();
    postCamera = new THREE.Camera();
    postGeometry = new THREE.PlaneGeometry(2, 2);
    postMaterial = new THREE.ShaderMaterial({
      uniforms: {
        ...uniforms,
        uColorTexture: { value: target.texture },
        uDepthTexture: { value: target.depthTexture },
        uInverseProjection: { value: camera.projectionMatrixInverse },
        uCameraWorld: { value: camera.matrixWorld },
      },
      vertexShader: postVertex,
      fragmentShader: postFragment,
      depthTest: false,
      depthWrite: false,
    });
    const quad = new THREE.Mesh(postGeometry, postMaterial);
    quad.frustumCulled = false;
    postScene.add(quad);

    resize();
    status();
    sync();
  } catch (error) {
    failed = true;
    console.error(error);
    canvas.style.visibility = 'hidden';
    status();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', motionChange);
  canvas.addEventListener('webglcontextlost', contextLost);
  canvas.addEventListener('webglcontextrestored', contextRestored);

  return {
    get paused() {
      return paused;
    },
    setSpeed(value) {
      speed = value;
    },
    setIntensity(value) {
      uniforms.uIntensity.value = value;
      render();
    },
    setFocus(value) {
      uniforms.uFocus.value = value;
      render();
    },
    setAperture(value) {
      uniforms.uAperture.value = value;
      render();
    },
    toggle() {
      paused = !paused;
      status();
      sync();
    },
    seek(value) {
      time = Math.max(0, Math.min(IMPULSE_DURATION, value));
      paused = true;
      status();
      sync();
    },
    replay() {
      time = 0;
      paused = false;
      status();
      sync();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reduced.removeEventListener('change', motionChange);
      canvas.removeEventListener('webglcontextlost', contextLost);
      canvas.removeEventListener('webglcontextrestored', contextRestored);
      const resources: Array<Disposable | undefined> = [
        clothGeometry,
        clothMaterial,
        particleGeometry,
        particleMaterial,
        postGeometry,
        postMaterial,
        target,
        renderer,
      ];
      for (const resource of resources) resource?.dispose();
    },
  };
}
