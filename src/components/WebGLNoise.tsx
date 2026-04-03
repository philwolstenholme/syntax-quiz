import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import type { GlowData } from './GlowEffect';

interface WebGLNoiseProps extends GlowData {
  isDark: boolean;
  isHovered: boolean;
}

const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Bayer ordered dithering — structured pixel grid, CRT / retro aesthetic.
// u_areaScale expands the glow ellipse on hover, showing more dots at the edges.
const FRAG = `
  precision mediump float;

  uniform vec2      u_res;
  uniform vec2      u_hlCenter;
  uniform float     u_hlW;
  uniform float     u_hlH;
  uniform float     u_time;
  uniform float     u_dark;
  uniform float     u_areaScale; // lerped 1.0→1.2 on hover, expands coverage area
  uniform sampler2D u_bayer;    // 8×8 Bayer matrix, REPEAT, NEAREST

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
    vec2 d  = uv - u_hlCenter;

    float rx = max(u_hlW * 0.7, 120.0) * u_areaScale;
    float ry = (55.0 + u_hlH * 0.4) * u_areaScale;
    float t      = sqrt((d.x * d.x) / (rx * rx) + (d.y * d.y) / (ry * ry));
    float weight = 1.0 - smoothstep(0.50, 0.95, t);

    vec2  cell  = floor(uv / 2.0);

    float seed    = hash(cell);
    float shimmer = sin(u_time * (0.8 + seed * 1.8) + seed * 6.2832) * 0.07
                    * step(0.001, weight);

    float threshold = texture2D(u_bayer, fract(cell / 8.0)).r;
    float dithered  = step(threshold, weight + shimmer) * step(0.015, weight);

    vec3  col       = mix(vec3(0.133, 0.706, 0.333), vec3(0.0, 1.0, 0.533), u_dark);
    float intensity = mix(0.07, 0.10, u_dark);

    gl_FragColor = vec4(col, dithered * intensity);
  }
`;

// 8×8 Bayer matrix, values 0–63 mapped to 0–255
const BAYER_8 = new Uint8Array([
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
].map(v => Math.round(v * 255 / 63)));

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export const WebGLNoise = ({ hlX, hlY, hlW, hlH, canvasW, canvasH, isDark, isHovered }: WebGLNoiseProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isHoveredRef = useRef(isHovered);
  const areaScaleRef = useRef(1.0);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const bayerTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, bayerTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 8, 8, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, BAYER_8);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    const uRes       = gl.getUniformLocation(prog, 'u_res');
    const uHlCenter  = gl.getUniformLocation(prog, 'u_hlCenter');
    const uHlW       = gl.getUniformLocation(prog, 'u_hlW');
    const uHlH       = gl.getUniformLocation(prog, 'u_hlH');
    const uTime      = gl.getUniformLocation(prog, 'u_time');
    const uDark      = gl.getUniformLocation(prog, 'u_dark');
    const uAreaScale = gl.getUniformLocation(prog, 'u_areaScale');
    const uBayer     = gl.getUniformLocation(prog, 'u_bayer');

    gl.uniform1i(uBayer, 0);

    canvas.width  = canvasW;
    canvas.height = canvasH;
    gl.viewport(0, 0, canvasW, canvasH);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const start = performance.now();
    let rafId: number;
    let lastTime = performance.now();

    const render = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Lerp area scale toward target — framerate-independent exponential ease
      const target = isHoveredRef.current ? 1.2 : 1.0;
      areaScaleRef.current += (target - areaScaleRef.current) * (1 - Math.pow(0.02, dt));

      const t = (now - start) / 1000;
      gl.uniform2f(uRes,      canvasW, canvasH);
      gl.uniform2f(uHlCenter, hlX + hlW / 2, hlY + hlH / 2);
      gl.uniform1f(uHlW,      hlW);
      gl.uniform1f(uHlH,      hlH);
      gl.uniform1f(uTime,     t);
      gl.uniform1f(uDark,     isDark ? 1.0 : 0.0);
      gl.uniform1f(uAreaScale, areaScaleRef.current);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
      gl.deleteTexture(bayerTex);
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
