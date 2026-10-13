import { useEffect, useRef } from "react";

type Props = { mobileSpeed?: number };

export default function AuroraHero({ mobileSpeed = 0.35 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, powerPreference: "low-power" });
    if (!gl) return;
    const vertex = `attribute vec2 position; varying vec2 vUv; void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
    const fragment = `precision mediump float;
    varying vec2 vUv;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uMouseEnabled;
    float wave(float x,float t,float phase){return sin(x*5.2+t+phase)*.11+sin(x*10.7-t*.68+phase)*.045;}
    void main(){
      vec2 uv=vUv;
      float x=uv.x*2.-1.;
      float t=uTime*.45;
      float bend=uMouseEnabled*(uMouse.x-.5)*.22;
      float y=.51+wave(x,t,0.)+bend+uMouseEnabled*(uMouse.y-.5)*.11;
      float y2=.45+wave(x,t,1.8)*1.2-bend*.6;
      float y3=.57+wave(x,t,3.4)*.9;
      float ribbon=exp(-pow((uv.y-y)/.19,2.))*0.37;
      float ribbon2=exp(-pow((uv.y-y2)/.23,2.))*0.31;
      float ribbon3=exp(-pow((uv.y-y3)/.20,2.))*0.22;
      float envelope=smoothstep(0.,.22,uv.x)*(1.-smoothstep(.78,1.,uv.x));
      vec3 mint=vec3(.39,.94,.74);
      vec3 blue=vec3(.30,.65,1.);
      vec3 violet=vec3(.65,.51,1.);
      vec3 rgb=(mint*ribbon+blue*ribbon2+violet*ribbon3)*envelope;
      float alpha=clamp((ribbon+ribbon2+ribbon3)*envelope,0.,.52);
      gl_FragColor=vec4(rgb/max(alpha,.001),alpha);
    }`;
    function shader(type: number, source: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, source); gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) { gl!.deleteShader(s); return null; }
      return s;
    }
    const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);
    if(!vs||!fs)return;
    const program=gl.createProgram()!;
    gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    gl.useProgram(program);
    const pos=gl.getAttribLocation(program,"position");
    gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
    const timeLoc=gl.getUniformLocation(program,"uTime"),resLoc=gl.getUniformLocation(program,"uResolution");
    const mouseLoc=gl.getUniformLocation(program,"uMouse"),enabledLoc=gl.getUniformLocation(program,"uMouseEnabled");
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile=window.matchMedia("(pointer: coarse)");
    let frame=0,last=0,elapsed=0,active=true;
    let mx=.5,my=.5,tx=.5,ty=.5;
    const move=(e:PointerEvent)=>{if(e.pointerType!=="mouse")return;const r=canvas.getBoundingClientRect();tx=(e.clientX-r.left)/r.width;ty=1-(e.clientY-r.top)/r.height;};
    const leave=()=>{tx=.5;ty=.5;};
    const parent=canvas.parentElement;
    parent?.addEventListener("pointermove",move);
    parent?.addEventListener("pointerleave",leave);
    function render(now:number){
      if(!active)return;
      const delta=Math.min((now-last)/1000,.05);last=now;
      if(!reduced.matches)elapsed+=delta*(mobile.matches?mobileSpeed:1);
      const dpr=Math.min(window.devicePixelRatio||1,1.5);
      const width=Math.max(1,Math.round(canvas!.clientWidth*dpr)),height=Math.max(1,Math.round(canvas!.clientHeight*dpr));
      if(canvas!.width!==width||canvas!.height!==height){canvas!.width=width;canvas!.height=height;gl!.viewport(0,0,width,height);}
      mx+=(tx-mx)*.035;my+=(ty-my)*.035;
      gl!.uniform1f(timeLoc,elapsed);gl!.uniform2f(resLoc,width,height);
      gl!.uniform2f(mouseLoc,mx,my);gl!.uniform1f(enabledLoc,mobile.matches||reduced.matches?0:1);
      gl!.clearColor(0,0,0,0);gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES,0,6);
      if(!reduced.matches)frame=requestAnimationFrame(render);
    }
    frame=requestAnimationFrame(render);
    return()=>{active=false;cancelAnimationFrame(frame);parent?.removeEventListener("pointermove",move);parent?.removeEventListener("pointerleave",leave);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);};
  },[mobileSpeed]);
  return <canvas ref={canvasRef} className="portfolio-aurora-canvas" aria-hidden="true" />;
}
