/* =========================================================================
   Portfolio — CAD model viewer
   Loaded on demand (dynamic import from site.js) the first time a visitor
   asks to see a model, so the ~800 KB of three.js and the model itself
   never touch the initial page load.

   The model is a meshopt-compressed GLB tessellated from the original STEP
   assembly; the STEP remains the download for anyone who wants real CAD.

   Presentation follows the Drawing Sheet system rather than a game engine's
   defaults: paper ground, graphite surfaces, a soft key/fill pair, and a
   ground grid on the sheet's own hairline colour. No environment map, no
   tone-mapped glare — this is meant to read as a drawing, not a render.
   ========================================================================= */
import * as THREE from "./vendor/three.module.min.js";
import { GLTFLoader } from "./vendor/GLTFLoader.js";
import { OrbitControls } from "./vendor/OrbitControls.js";
import { MeshoptDecoder } from "./vendor/meshopt_decoder.module.js";

const PAPER = 0xfafaf8, LINE = 0xd9d9d4, INK = 0x9a9c9e;

export function mountModel(host, src) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PAPER);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 200);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);

  // Key/fill/rim on a hemisphere base: enough modelling to read curvature and
  // chamfers without the hard specular hotspots a studio HDRI would introduce.
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb8b9b4, 2.1));
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(1.6, 2.4, 1.9);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.7);
  fill.position.set(-2.1, 0.7, -1.4);
  scene.add(fill);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.rotateSpeed = 0.85;
  controls.zoomSpeed = 0.8;
  // Let the page keep scrolling: the deck is the primary interaction, so the
  // viewer only takes the wheel once the visitor has deliberately grabbed it.
  controls.enableZoom = false;

  const root = new THREE.Group();
  scene.add(root);

  let frame = 0, disposed = false;
  const tick = () => {
    if (disposed) return;
    frame = requestAnimationFrame(tick);
    controls.update();
    renderer.render(scene, camera);
  };

  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);

  return new Promise((resolve, reject) => {
    loader.load(
      src,
      (gltf) => {
        const model = gltf.scene;

        // One consistent graphite material across every part. The source
        // assembly carries no meaningful colour, and 178 arbitrary CAD tints
        // would fight the sheet; a single surface lets form do the talking.
        model.traverse((o) => {
          if (!o.isMesh) return;
          o.material = new THREE.MeshStandardMaterial({
            color: INK, metalness: 0.15, roughness: 0.62, flatShading: false,
          });
        });

        // Fusion 360 writes Z-up; glTF is Y-up, and cascadio passes the CAD
        // axes through untouched. Without this the machine stands on its tail.
        model.rotation.x = -Math.PI / 2;
        model.updateMatrixWorld(true);

        // Normalise: centre on the origin and scale to a unit-ish box so the
        // camera framing below is independent of the model's real dimensions.
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const centre = box.getCenter(new THREE.Vector3());
        const span = Math.max(size.x, size.y, size.z) || 1;
        model.position.sub(centre);
        root.scale.setScalar(1 / span);
        root.add(model);

        // Ground grid on the sheet's hairline colour, sat just under the model.
        const grid = new THREE.GridHelper(2.6, 26, LINE, LINE);
        grid.position.y = -(size.y / span) / 2 - 0.02;
        grid.material.transparent = true;
        grid.material.opacity = 0.75;
        scene.add(grid);

        camera.position.set(1.15, 0.82, 1.35);
        controls.target.set(0, 0, 0);
        controls.minDistance = 0.8;
        controls.maxDistance = 4.5;
        controls.update();

        if (!reduce) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.9;
          // Any deliberate interaction ends the idle spin for good.
          const stop = () => { controls.autoRotate = false; };
          renderer.domElement.addEventListener("pointerdown", stop, { once: true });
          renderer.domElement.addEventListener("wheel", stop, { once: true });
        }

        resize();
        tick();
        resolve({
          dispose() {
            disposed = true;
            cancelAnimationFrame(frame);
            ro.disconnect();
            controls.dispose();
            scene.traverse((o) => {
              if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); }
            });
            renderer.dispose();
            renderer.domElement.remove();
          },
          enableZoom() { controls.enableZoom = true; },
        });
      },
      null,
      (err) => { ro.disconnect(); reject(err); }
    );
  });
}
