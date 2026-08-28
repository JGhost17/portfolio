# Vendored third-party code

These files are copied verbatim from **three.js r169** (MIT licence, see the
header in `three.module.min.js`). They are committed rather than installed
because the site has no build step and no package manager: it is plain static
files served straight from the repo.

| File | Upstream path in the `three` package |
|---|---|
| `three.module.min.js` | `build/three.module.min.js` |
| `GLTFLoader.js` | `examples/jsm/loaders/GLTFLoader.js` |
| `OrbitControls.js` | `examples/jsm/controls/OrbitControls.js` |
| `BufferGeometryUtils.js` | `examples/jsm/utils/BufferGeometryUtils.js` |
| `meshopt_decoder.module.js` | `examples/jsm/libs/meshopt_decoder.module.js` |

## Local edits

Each addon normally imports three.js by the bare specifier `from 'three'`,
which only resolves if the page declares an import map. To avoid adding one to
all six HTML files, those specifiers were repointed to the relative vendored
build. `GLTFLoader.js` additionally had `../utils/BufferGeometryUtils.js`
flattened to `./BufferGeometryUtils.js`.

Every edited file carries a `LOCAL EDIT` comment at the top. **Re-apply these
after any upgrade** — otherwise the loader silently 404s at runtime, since the
import only fires when a visitor presses Load.

To upgrade:

```bash
npm install three@<version>
# copy the five files above, then redo the specifier edits
```

## Regenerating the CAD model

`assets/model/IMechE-Design-Challenge-Full-Assembly.glb` is tessellated from
`assets/docs/IMechE-Design-Challenge-Full-Assembly.step`. The STEP file stays
the authoritative download; the GLB exists only so the page can draw it.

```bash
pip install cascadio trimesh
python -c "import cascadio; cascadio.step_to_glb('in.step','raw.glb',tol_linear=0.5,tol_angular=0.5)"

npx @gltf-transform/cli dedup raw.glb a.glb
npx @gltf-transform/cli weld  a.glb  b.glb
npx @gltf-transform/cli meshopt b.glb out.glb --level high
```

That path takes 26 MB of STEP to roughly 1.7 MB of GLB while keeping all
371k triangles. Avoid `gltf-transform optimize`: it runs a lossy `simplify`
pass that saves only another ~0.4 MB and visibly rounds off CAD edges.

Meshopt compression is deliberate rather than Draco: its decoder is ~24 KB of
plain JS against Draco's ~250 KB of WebAssembly, which matters more here than
the slightly better compression ratio, given the whole point is that nothing
downloads until someone asks for it.
