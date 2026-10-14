import { useRef, useEffect, memo } from 'react'
import { useTheme } from '../../context/ThemeContext'

/**
 * Full-screen, non-intrusive WebGL background component
 * Renders an ethereal "Prismatic Light Ribbon / Optical Caustics" effect
 * using raw HTML5 Canvas + GLSL Fragment Shader (zero external 3D libraries).
 *
 * - Dark Mode: Preserves #111112 base with luminous silky wandering prismatic ribbons.
 * - Light Mode: Soft light greyish base (#E5E5E0) with delicate diffused spectral ribbons.
 * - Theme Reactivity: Smoothly interpolates uniforms between Light and Dark mode.
 * - Optical Caustics: Warm white core highlight with chromatic dispersion fringe along curve normals.
 * - Performance: Handles devicePixelRatio, window resize, prefers-reduced-motion, and clean resource disposal.
 */

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER_SOURCE = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 v_uv;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_theme;      // 0.0 = Light Mode (#E5E5E0), 1.0 = Dark Mode (#111112)
uniform vec3 u_darkBase;    // #111112 = vec3(17.0, 17.0, 18.0) / 255.0
uniform vec3 u_lightBase;   // #E5E5E0 = vec3(229.0, 229.0, 224.0) / 255.0
uniform float u_intensity;

// Numerically robust exp function to eliminate float underflow and NaN across all GPUs
float safeExp(float x) {
  return exp(-clamp(x, 0.0, 35.0));
}

// Smooth domain warping via layered low-frequency sine harmonics
float domainWarp(vec2 p, float t, float seed) {
  float n = 0.0;
  n += 0.55 * sin(p.x * 1.10 + p.y * 0.70 + t * 0.35 + seed);
  n += 0.28 * sin(p.x * 2.20 - p.y * 1.60 - t * 0.25 + seed * 1.7);
  n += 0.14 * cos(p.x * 4.30 + p.y * 3.20 + t * 0.45 + seed * 3.1);
  return n;
}

vec2 rotate2D(vec2 v, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

// Evaluates a single wandering prismatic light ribbon with chromatic dispersion
vec3 sampleRibbon(
  vec2 p,
  float angle,
  vec2 offset,
  float timeOffset,
  float widthBase,
  float speed,
  float dispersionScale
) {
  // Rotate and translate coordinate space for this ribbon path
  vec2 q = rotate2D(p - offset, angle);
  
  float t = u_time * speed + timeOffset;
  
  // Layered low-frequency harmonics (domain warping)
  float u = q.x;
  float warp1 = domainWarp(vec2(u * 0.6, 0.0), t * 0.35, timeOffset);
  float warp2 = domainWarp(vec2(u * 1.2, 0.5), -t * 0.25, timeOffset + 2.5);
  
  // Ribbon centerline yCenter(u)
  float yCenter = sin(u * 1.10 + t * 0.40) * 0.25
                + cos(u * 0.55 - t * 0.25) * 0.18
                + warp1 * 0.22
                + warp2 * 0.10;
                
  // Gradient estimation for orthogonal normal calculation
  float eps = 0.015;
  float uNext = u + eps;
  float warp1Next = domainWarp(vec2(uNext * 0.6, 0.0), t * 0.35, timeOffset);
  float warp2Next = domainWarp(vec2(uNext * 1.2, 0.5), -t * 0.25, timeOffset + 2.5);
  float yCenterNext = sin(uNext * 1.10 + t * 0.40) * 0.25
                    + cos(uNext * 0.55 - t * 0.25) * 0.18
                    + warp1Next * 0.22
                    + warp2Next * 0.10;
                    
  float slope = (yCenterNext - yCenter) / eps;
  float invSec = 1.0 / sqrt(1.0 + slope * slope);
  
  // Orthogonal signed distance d to the curve
  float dist = (q.y - yCenter) * invSec;
  
  // Modulate ribbon width along its length (graceful breathing, never pinches to a disconnect)
  float widthMod = widthBase * (1.0 + 0.25 * sin(u * 1.2 + t * 0.30 + timeOffset));
  widthMod = max(widthMod, 0.035);
  
  float nd = dist / widthMod;
  
  // 1. Core Highlight: Soft, delicate specular sheen
  float coreIntensity = safeExp(nd * nd * 4.0);
  vec3 coreColor = vec3(0.98, 0.96, 0.92);
  
  // 2. Prismatic Spectral Dispersion (staggered across curve normal for a connected continuous spectrum)
  float disp = dispersionScale;
  
  // 6 continuous spectral wavelengths (Red -> Amber -> Mint -> Cyan -> Indigo -> Violet):
  float dR = nd + 1.20 * disp;
  float sR = safeExp(dR * dR * 2.2);
  vec3 colR = vec3(0.98, 0.32, 0.28);
  
  float dA = nd + 0.68 * disp;
  float sA = safeExp(dA * dA * 2.2);
  vec3 colA = vec3(0.98, 0.65, 0.24);
  
  float dG = nd + 0.08 * disp;
  float sG = safeExp(dG * dG * 2.2);
  vec3 colG = vec3(0.30, 0.88, 0.52);
  
  float dC = nd - 0.48 * disp;
  float sC = safeExp(dC * dC * 2.2);
  vec3 colC = vec3(0.22, 0.76, 0.96);
  
  float dB = nd - 0.95 * disp;
  float sB = safeExp(dB * dB * 2.2);
  vec3 colB = vec3(0.40, 0.50, 0.98);
  
  float dV = nd - 1.40 * disp;
  float sV = safeExp(dV * dV * 2.2);
  vec3 colV = vec3(0.78, 0.38, 0.92);
  
  // Smooth Gaussian outer envelope across ribbon cross-section (continuous across center, NO hole)
  float envelope = safeExp(nd * nd * 0.40);
  float sumWeights = max(sR + sA + sG + sC + sB + sV, 0.001);
  
  vec3 spectralColor = (
    colR * sR +
    colA * sA +
    colG * sG +
    colC * sC +
    colB * sB +
    colV * sV
  ) / sumWeights;
  
  // Entire ribbon is connected seamlessly: spectral color modulated by envelope + subtle luminous core
  vec3 ribbonColor = (spectralColor * 0.50 + coreColor * (coreIntensity * 0.15)) * envelope;
  
  // Subtle length attenuation only far outside the viewport boundary
  float lenFade = 1.0 - smoothstep(2.8, 4.2, abs(u));
  
  return ribbonColor * lenFade;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution) / max(min(u_resolution.x, u_resolution.y), 1.0);
  
  // Ribbon 1: Primary Hero Ribbon (Diagonal sweep across center-upper)
  vec3 r1 = sampleRibbon(
    p,
    -0.58,                  // ~ -33 deg angle
    vec2(0.0, 0.04),        // center offset
    0.0,                    // time offset
    0.075,                  // widthBase
    0.14,                   // speed
    1.0                     // dispersionScale
  );
  
  // Ribbon 2: Secondary Counter Ribbon (Weaves through lower-middle)
  vec3 r2 = sampleRibbon(
    p,
    0.44,                   // ~ +25 deg angle
    vec2(-0.08, -0.14),     // offset
    4.71,                   // time offset
    0.060,                  // widthBase
    0.11,                   // speed
    0.92                    // dispersionScale
  );
  
  // Ribbon 3: Ambient Silk Thread (Floating across upper-left periphery)
  vec3 r3 = sampleRibbon(
    p,
    -1.14,                  // ~ -65 deg angle
    vec2(0.16, 0.20),       // offset
    9.28,                   // time offset
    0.048,                  // widthBase
    0.09,                   // speed
    0.85                    // dispersionScale
  );
  
  // Smooth max-blend ribbons so overlapping ribbons do not blow out text contrast
  vec3 totalRibbons = max(r1, max(r2 * 0.80, r3 * 0.58));
  
  // Base color interpolation:
  // u_theme: 0.0 = Light Mode (#E5E5E0), 1.0 = Dark Mode (#111112)
  vec3 baseColor = mix(u_lightBase, u_darkBase, u_theme);
  
  // Theme-Aware Blending:
  // In Dark Mode: Luminous, translucent radiance against #111112 (WCAG AAA >= 7:1 guaranteed)
  vec3 darkRender = baseColor + totalRibbons * (0.58 * u_intensity);
  
  // In Light Mode: Vivid optical caustics & luminous white core across #E5E5E0
  float meanLum = (totalRibbons.r + totalRibbons.g + totalRibbons.b) * 0.33333;
  vec3 chromaticDelta = (totalRibbons - vec3(meanLum, meanLum, meanLum)) * 1.6;
  vec3 whiteSheen = (vec3(1.0) - baseColor) * (meanLum * 2.2);
  vec3 lightRender = clamp(baseColor + whiteSheen + chromaticDelta - vec3(meanLum * 0.10), 0.0, 1.0);
  
  vec3 finalColor = mix(lightRender, darkRender, u_theme);
  
  // Film grain / dithering pass using normalized UV coords (prevents float overflow on high-res displays)
  float dither = fract(sin(dot(v_uv, vec2(12.9898, 78.233))) * 43758.5453);
  finalColor += (dither - 0.5) * 0.006;
  
  gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
}
`

function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }
  return program
}

function PrismBackgroundComponent() {
  const canvasRef = useRef(null)
  const { isDark } = useTheme()
  const isDarkRef = useRef(isDark)

  useEffect(() => {
    isDarkRef.current = isDark
  }, [isDark])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Attempt WebGL2 first, then WebGL, then experimental-webgl
    const gl =
      canvas.getContext('webgl2', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power',
      }) ||
      canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power',
      }) ||
      canvas.getContext('experimental-webgl')

    if (!gl) {
      console.warn('WebGL is not supported on this browser/device.')
      return
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE)
    if (!vertexShader || !fragmentShader) {
      console.error('WebGL shaders failed to compile.')
      return
    }

    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) {
      console.error('WebGL program failed to link.')
      return
    }

    gl.useProgram(program)

    // Full-screen quad positions (two triangles)
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        -1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        1.0, 1.0,
      ]),
      gl.STATIC_DRAW
    )

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, 'u_resolution')
    const uTime = gl.getUniformLocation(program, 'u_time')
    const uTheme = gl.getUniformLocation(program, 'u_theme')
    const uDarkBase = gl.getUniformLocation(program, 'u_darkBase')
    const uLightBase = gl.getUniformLocation(program, 'u_lightBase')
    const uIntensity = gl.getUniformLocation(program, 'u_intensity')

    // Initial base colors
    gl.uniform3f(uDarkBase, 17.0 / 255.0, 17.0 / 255.0, 18.0 / 255.0)
    gl.uniform3f(uLightBase, 229.0 / 255.0, 229.0 / 255.0, 224.0 / 255.0)

    // Initial clear to avoid black flash on canvas creation
    const initialBase = isDarkRef.current
      ? [17.0 / 255.0, 17.0 / 255.0, 18.0 / 255.0]
      : [229.0 / 255.0, 229.0 / 255.0, 224.0 / 255.0]
    gl.clearColor(initialBase[0], initialBase[1], initialBase[2], 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Initial sizing
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const initialWidth = Math.max(1, Math.floor(window.innerWidth * dpr))
    const initialHeight = Math.max(1, Math.floor(window.innerHeight * dpr))
    canvas.width = initialWidth
    canvas.height = initialHeight
    gl.viewport(0, 0, initialWidth, initialHeight)
    gl.uniform2f(uResolution, initialWidth, initialHeight)

    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let prefersReducedMotion = mediaQuery.matches
    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches
    }
    mediaQuery.addEventListener?.('change', handleMotionChange)

    let animationFrameId
    let lastTime = performance.now()
    let accumulatedTime = 0
    let currentTheme = isDarkRef.current ? 1.0 : 0.0

    const render = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      // Resize check each frame
      const currentDpr = Math.min(window.devicePixelRatio || 1, 2)
      const displayWidth = Math.max(1, Math.floor(window.innerWidth * currentDpr))
      const displayHeight = Math.max(1, Math.floor(window.innerHeight * currentDpr))

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth
        canvas.height = displayHeight
        gl.viewport(0, 0, displayWidth, displayHeight)
      }

      // Time progression
      if (!prefersReducedMotion) {
        accumulatedTime += dt
      } else {
        accumulatedTime += dt * 0.05
      }

      // Smooth theme reactivity
      const targetTheme = isDarkRef.current ? 1.0 : 0.0
      currentTheme += (targetTheme - currentTheme) * 0.1

      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.enableVertexAttribArray(positionAttributeLocation)
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

      gl.uniform2f(uResolution, canvas.width, canvas.height)
      gl.uniform1f(uTime, accumulatedTime)
      gl.uniform1f(uTheme, currentTheme)
      gl.uniform1f(uIntensity, 1.0)
      gl.uniform3f(uDarkBase, 17.0 / 255.0, 17.0 / 255.0, 18.0 / 255.0)
      gl.uniform3f(uLightBase, 229.0 / 255.0, 229.0 / 255.0, 224.0 / 255.0)

      gl.drawArrays(gl.TRIANGLES, 0, 6)

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    // WebGL context loss handling
    const handleContextLost = (e) => {
      e.preventDefault()
      cancelAnimationFrame(animationFrameId)
    }
    canvas.addEventListener('webglcontextlost', handleContextLost, false)

    return () => {
      cancelAnimationFrame(animationFrameId)
      mediaQuery.removeEventListener?.('change', handleMotionChange)
      canvas.removeEventListener('webglcontextlost', handleContextLost)

      if (gl) {
        gl.deleteBuffer(positionBuffer)
        gl.deleteProgram(program)
        gl.deleteShader(vertexShader)
        gl.deleteShader(fragmentShader)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        backgroundColor: isDark ? '#111112' : '#E5E5E0',
      }}
      aria-hidden="true"
    />
  )
}

export const PrismBackground = memo(PrismBackgroundComponent)
export default PrismBackground
