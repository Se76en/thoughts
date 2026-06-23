export class ShaderCanvas {
  constructor(container) {
    if (!container) return;

    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'block';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.container.appendChild(this.canvas);
    this.gl = this.canvas.getContext('webgl');

    if (!this.gl) {
      console.error("WebGL not supported");
      return;
    }

    this.vsSource = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
    this.fsSource = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / max(resolution.x, resolution.y);
        float t = time * 1.0;
        float lineWidth = 0.002;
        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t * 0.5 - 0.01*float(j)+float(i)*0.01) - length(uv) + mod(uv.x+uv.y, 0.2));
          }
        }
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    this.init();
  }

  init() {
    const gl = this.gl;
    if (!gl) return;

    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, this.vsSource);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, this.fsSource);
    gl.compileShader(fs);

    this.program = gl.createProgram();
    gl.attachShader(this.program, vs);
    gl.attachShader(this.program, fs);
    gl.linkProgram(this.program);
    gl.useProgram(this.program);

    const vertices = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(this.program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    this.uResolution = gl.getUniformLocation(this.program, "resolution");
    this.uTime = gl.getUniformLocation(this.program, "time");

    window.addEventListener('resize', this.resize);
    this.resize();

    this.startTime = Date.now();
    this.running = true;
    this.render();
  }

  resize = () => {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    if (this.gl) this.gl.viewport(0, 0, this.width, this.height);
  };

  render = () => {
    if (!this.running) return;
    const elapsed = (Date.now() - this.startTime) * 0.0005;
    this.gl.uniform2f(this.uResolution, this.width, this.height);
    this.gl.uniform1f(this.uTime, elapsed);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    this.raf = requestAnimationFrame(this.render);
  };

  destroy() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.resize);
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
