import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

export interface GlowData {
  hlX: number;
  hlY: number;
  hlW: number;
  hlH: number;
  canvasW: number;
  canvasH: number;
}

interface WebGLGlowProps extends GlowData {
  isDark: boolean;
}

// Full-screen quad vertex shader
const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Fragment shader — volumetric glow rays emanating from the highlighted syntax
const FRAG = `
  precision mediump float;

  uniform vec2  u_res;
  uniform vec2  u_hlCenter; // highlight center in CSS pixels (Y from top)
  uniform vec2  u_hlHalf;   // highlight half-extents
  uniform float u_time;
  uniform float u_dark;     // 0 = light theme, 1 = dark theme

  // Signed distance to a rounded box
  float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }

  void main() {
    // Flip Y: WebGL origin is bottom-left, CSS is top-left
    vec2 uv = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);

    // Distance from the highlight box
    float distBox = sdBox(uv - u_hlCenter, u_hlHalf + 4.0);
    float dist    = max(0.0, distBox);

    // Angle from highlight center — drives animated ray pattern
    vec2  toPixel = uv - u_hlCenter;
    float angle   = atan(toPixel.y, toPixel.x);

    float rays =
      pow(max(0.0, sin(angle * 5.0 + u_time * 0.40) * 0.5 + 0.5), 3.0) * 0.70 +
      pow(max(0.0, sin(angle * 3.0 - u_time * 0.28) * 0.5 + 0.5), 5.0) * 0.45;

    // Gaussian falloffs — no perceptible circular edge, smooth fade to nothing
    float sigma1 = 90.0;  // broad atmospheric glow
    float sigma2 = 50.0;  // ray envelope
    float sigma3 = 22.0;  // tight bloom right at highlight
    float d2     = dist * dist;
    float glow    = exp(-d2 / (2.0 * sigma1 * sigma1));
    float rayMask = exp(-d2 / (2.0 * sigma2 * sigma2));
    float bloom   = exp(-d2 / (2.0 * sigma3 * sigma3));

    // Breathing shimmer
    float shimmer = sin(u_time * 2.6) * 0.04 + 0.96;

    float intensity = (glow * 0.32 + rays * rayMask * 0.40 + bloom * 0.24) * shimmer;

    // Smooth fade-out 60px from all canvas edges — no hard clip
    float fadeX = smoothstep(0.0, 60.0, min(uv.x, u_res.x - uv.x));
    float fadeY = smoothstep(0.0, 60.0, min(uv.y, u_res.y - uv.y));
    float edgeFade = fadeX * fadeY;

    // Warm amber in dark mode, rich gold in light mode
    vec3 col = mix(
      vec3(0.95, 0.72, 0.08),
      vec3(1.00, 0.78, 0.22),
      u_dark
    );

    float alphaScale = mix(0.48, 0.62, u_dark);

    gl_FragColor = vec4(col, clamp(intensity * alphaScale * edgeFade, 0.0, 1.0));
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

export const WebGLGlow = ({ hlX, hlY, hlW, hlH, canvasW, canvasH, isDark }: WebGLGlowProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
    if (!gl) return;

    // Build program
    const program = gl.createProgram()!;
    gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uRes      = gl.getUniformLocation(program, 'u_res');
    const uHlCenter = gl.getUniformLocation(program, 'u_hlCenter');
    const uHlHalf   = gl.getUniformLocation(program, 'u_hlHalf');
    const uTime     = gl.getUniformLocation(program, 'u_time');
    const uDark     = gl.getUniformLocation(program, 'u_dark');

    // Size canvas
    canvas.width  = canvasW;
    canvas.height = canvasH;
    gl.viewport(0, 0, canvasW, canvasH);

    // Alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const startTime = performance.now();
    let rafId: number;

    const render = () => {
      const t = (performance.now() - startTime) / 1000;

      gl.uniform2f(uRes,      canvasW, canvasH);
      gl.uniform2f(uHlCenter, hlX + hlW / 2, hlY + hlH / 2);
      gl.uniform2f(uHlHalf,   hlW / 2, hlH / 2);
      gl.uniform1f(uTime,     t);
      gl.uniform1f(uDark,     isDark ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      gl.deleteProgram(program);
      gl.deleteBuffer(buf);
    };
  }, [canvasW, canvasH, hlX, hlY, hlW, hlH, isDark, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};
