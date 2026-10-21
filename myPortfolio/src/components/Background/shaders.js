// Ashima 3D simplex noise (MIT), shared by the blob and the particle field.
const NOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`

const ROTATE = /* glsl */ `
vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }
vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
vec3 rotZ(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z); }
`

export const blobVertex = /* glsl */ `
uniform float uTime;
uniform float uDistort;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
${NOISE}

float field(vec3 p) {
  float n = snoise(p * 0.9 + uTime * 0.18);
  n += 0.35 * snoise(p * 1.7 - uTime * 0.12);
  return n;
}

vec3 displace(vec3 p) {
  return p + normalize(p) * field(p) * uDistort;
}

void main() {
  vec3 p = displace(position);
  // Rebuild the normal from two displaced neighbours along the surface tangent plane.
  vec3 t = normalize(cross(normal, abs(normal.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  vec3 b = cross(normal, t);
  float e = 0.01;
  vec3 pt = displace(normalize(position + t * e) * length(position));
  vec3 pb = displace(normalize(position + b * e) * length(position));
  vec3 n = normalize(cross(pt - p, pb - p));

  vNoise = field(position);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vNormal = normalize(normalMatrix * n);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`

export const blobFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uBase;
uniform float uDark;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;

// Thin-film style iridescence cycling through the site's three accent colours.
vec3 palette(float t) {
  t = fract(t) * 3.0;
  if (t < 1.0) return mix(uC1, uC2, smoothstep(0.0, 1.0, t));
  if (t < 2.0) return mix(uC2, uC3, smoothstep(1.0, 2.0, t));
  return mix(uC3, uC1, smoothstep(2.0, 3.0, t));
}

void main() {
  vec3 n = normalize(vNormal);
  float facing = clamp(dot(n, vView), 0.0, 1.0);
  float fres = pow(1.0 - facing, 2.2);

  vec3 irid = palette(fres * 0.8 + vNoise * 0.25 + uTime * 0.04);
  vec3 col = mix(uBase, irid, 0.25 + fres * 0.75);

  vec3 l = normalize(vec3(-0.4, 0.8, 0.6));
  float spec = pow(max(dot(reflect(-l, n), vView), 0.0), 48.0);
  col += spec * mix(0.35, 0.8, uDark);
  col += irid * pow(fres, 3.0) * mix(0.25, 0.9, uDark);

  gl_FragColor = vec4(col, 1.0);
}
`

export const particleVertex = /* glsl */ `
attribute vec3 aP0;
attribute vec3 aP1;
attribute vec3 aP2;
attribute vec3 aP3;
attribute vec3 aP4;
attribute vec3 aDir;
attribute float aRand;
attribute float aScale;

uniform float uTime;
uniform float uProgress;
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uMouse;
uniform float uMouseForce;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;

varying vec3 vColor;
varying float vAlpha;
${NOISE}
${ROTATE}

// 0: ringed disk around the hero core
vec3 shape0() {
  vec3 p = rotY(aP0, uTime * 0.07 + aRand * 0.02);
  return rotZ(rotX(p, 0.42), 0.32);
}
// 1: double helix (stored as axis x, angle, signed radius)
vec3 shape1() {
  float a = aP1.y + uTime * 0.35;
  vec3 p = vec3(aP1.x, cos(a) * aP1.z, sin(a) * aP1.z);
  return rotZ(p, -0.28);
}
// 2: flowing data terrain
vec3 shape2() {
  vec3 p = aP2;
  p.y += sin(p.x * 0.55 + uTime * 0.7) * 0.35 + cos(p.z * 0.7 + uTime * 0.5) * 0.3;
  p.y += snoise(vec3(p.xz * 0.25, uTime * 0.08)) * 0.45;
  return p;
}
// 3: torus knot
vec3 shape3() {
  return rotX(rotY(aP3, uTime * 0.16), 0.5 + sin(uTime * 0.1) * 0.2);
}
// 4: breathing sphere
vec3 shape4() {
  return rotY(aP4, uTime * 0.1) * (1.0 + sin(uTime * 0.8 + aRand * 6.28) * 0.025);
}

vec3 shapeAt(float i) {
  if (i < 0.5) return shape0();
  if (i < 1.5) return shape1();
  if (i < 2.5) return shape2();
  if (i < 3.5) return shape3();
  return shape4();
}

void main() {
  float seg = clamp(floor(uProgress), 0.0, 3.0);
  float f = clamp(uProgress - seg, 0.0, 1.0);
  // Staggered per-particle timing turns a uniform morph into a wave of dispersal.
  float k = smoothstep(aRand * 0.45, aRand * 0.45 + 0.55, f);

  vec3 a = shapeAt(seg);
  vec3 b = shapeAt(seg + 1.0);
  vec3 p = mix(a, b, k);
  float burst = sin(k * 3.14159);
  p += aDir * burst * (1.1 + aRand * 1.6);

  // Idle drift
  p += 0.06 * vec3(
    sin(uTime * 0.6 + aRand * 31.0),
    cos(uTime * 0.5 + aRand * 17.0),
    sin(uTime * 0.4 + aRand * 11.0)
  );

  // Pointer repulsion in the group's local plane
  vec2 d = p.xy - uMouse.xy;
  float dist = length(d);
  float push = smoothstep(1.8, 0.0, dist) * uMouseForce;
  p.xy += normalize(d + 0.0001) * push * 0.75;
  p.z += push * 0.6;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aScale * uPixelRatio * (1.0 + burst * 0.6 + push * 0.8) / -mv.z;

  float t = fract(aRand * 3.7 + p.y * 0.06 + uTime * 0.015);
  vec3 c = mix(uC1, uC2, smoothstep(0.0, 0.6, t));
  c = mix(c, uC3, smoothstep(0.55, 1.0, t));
  vColor = mix(c, vec3(1.0), push * 0.4);
  vAlpha = smoothstep(22.0, 5.0, -mv.z) * (0.55 + aScale * 0.35);
}
`

export const particleFragment = /* glsl */ `
uniform float uOpacity;
varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = pow(smoothstep(0.5, 0.0, d), 1.6) * vAlpha * uOpacity;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
}
`
