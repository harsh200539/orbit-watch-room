// Orbit's cinematic scene. The same renderer follows the visitor from the
// scrolling introduction into the room, where the shared video becomes its screen.
const holder=document.querySelector('#stage3d');
try {
 const T=await import('https://esm.sh/three@0.180.0');
 const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 holder.append(renderer.domElement);
 const scene=new T.Scene();scene.fog=new T.FogExp2(0x0b101a,.022);
 const camera=new T.PerspectiveCamera(37,1,.1,100);camera.position.set(0,1.1,9.7);
 scene.add(new T.AmbientLight(0xa7b8c8,1.3));
 const light=(color,power,x,y,z)=>{const l=new T.PointLight(color,power,20);l.position.set(x,y,z);scene.add(l)};
 light(0xb6f264,95,2.5,3.2,4);light(0x8562ff,85,-3,2,-2);light(0x57c8d7,25,-1,-2,3);
 const suit=new T.MeshStandardMaterial({color:0x303847,metalness:.7,roughness:.27});
 const trim=new T.MeshStandardMaterial({color:0x121922,metalness:.86,roughness:.22});
 const lime=new T.MeshStandardMaterial({color:0xb6f264,emissive:0x8ee541,emissiveIntensity:2.5,metalness:.25,roughness:.3});
 const silver=new T.MeshStandardMaterial({color:0xa9bac2,metalness:.8,roughness:.2});
 const face=new T.MeshStandardMaterial({color:0x9b877b,roughness:.7});
 const visor=new T.MeshPhysicalMaterial({color:0x304554,metalness:.65,roughness:.1,transparent:true,opacity:.67,side:T.DoubleSide});
 const soft=new T.MeshBasicMaterial({color:0x14251e});
 const rig=new T.Group();scene.add(rig);
 const add=(geo,mat,parent=rig,x=0,y=0,z=0)=>{const obj=new T.Mesh(geo,mat);obj.position.set(x,y,z);parent.add(obj);return obj};
 const sphere=(r,mat,x,y,z,parent=rig)=>add(new T.SphereGeometry(r,28,20),mat,parent,x,y,z);
 const box=(w,h,d,mat,x,y,z,parent=rig)=>add(new T.BoxGeometry(w,h,d),mat,parent,x,y,z);
 const link=(a,b,r,mat)=>{const start=new T.Vector3(...a),end=new T.Vector3(...b),delta=end.clone().sub(start);const item=add(new T.CylinderGeometry(r,r*.88,delta.length(),16),mat,rig,...start.clone().add(end).multiplyScalar(.5).toArray());item.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return item};
 // An astronaut as the host: suit, visible face, helmet, joints and hands.
 const torso=add(new T.CapsuleGeometry(.73,.85,8,20),suit,rig,0,.13,0);torso.scale.z=.66;
 box(1.24,.16,.46,trim,0,.74,.08);box(.72,.5,.12,trim,0,.14,.59);box(.55,.34,.04,lime,0,.14,.68);
 box(.85,.25,.53,trim,0,-.68,.05);sphere(.17,silver,0,.99,0);
 sphere(.73,trim,0,1.72,0);sphere(.55,face,0,1.69,.42);sphere(.60,visor,0,1.73,.4);
 const visorRim=add(new T.TorusGeometry(.6,.055,12,52),silver,rig,0,1.72,.5);visorRim.scale.y=.93;
 box(.43,.035,.025,trim,0,1.59,.96);sphere(.035,lime,-.16,1.72,.95);sphere(.035,lime,.16,1.72,.95);
 for(const side of [-1,1]){sphere(.29,trim,side*.83,.55,0);link([side*.84,.50,0],[side*1.1,-.12,.35],.23,suit);sphere(.23,silver,side*1.1,-.13,.35);link([side*1.1,-.13,.35],[side*1.3,-.25,1.4],.17,suit);sphere(.21,face,side*1.3,-.25,1.4);
  link([side*.38,-.78,0],[side*.46,-1.7,.04],.31,suit);box(.55,.24,.73,trim,side*.49,-1.92,.25);box(.47,.045,.67,lime,side*.49,-2.06,.27)}
 // The floating screen is held at its side grips; it becomes a VideoTexture.
 const screen=new T.Group();screen.position.set(0,-.19,1.57);screen.rotation.x=-.06;rig.add(screen);
 box(3.42,2.03,.16,trim,0,0,0,screen);box(3.23,1.84,.025,silver,0,0,.095,screen);
 const panel=add(new T.PlaneGeometry(3.14,1.76),soft,screen,0,0,.114);
 // Two weighted doors make the display feel like an object being unveiled.
 // They separate in depth as well as sideways, so the reveal reads from an angle.
 const doorMaterial=new T.MeshStandardMaterial({color:0x263239,metalness:.88,roughness:.24,side:T.DoubleSide});
 const doorLeft=box(1.59,1.77,.045,doorMaterial,-.79,0,.15,screen);
 const doorRight=box(1.59,1.77,.045,doorMaterial,.79,0,.15,screen);
 const doorSeams=[];
 for(const [door,side] of [[doorLeft,-1],[doorRight,1]]){
  for(let i=0;i<5;i++){const seam=box(.028,1.48,.008,i===2?lime:silver,side*(.2+i*.27),0,.183,screen);seam.material=seam.material.clone();seam.material.transparent=true;seam.material.opacity=i===2?.7:.22;doorSeams.push(seam)}
 }
 const core=add(new T.RingGeometry(.18,.27,48),lime,screen,0,0,.21);
 const coreInner=sphere(.07,silver,0,0,.23,screen);
 const edgeLight=new T.PointLight(0xb6f264,8,5);edgeLight.position.set(0,0,.7);screen.add(edgeLight);
 const inner=new T.Group();inner.position.z=.124;screen.add(inner);
 const planet=sphere(.4,lime,.44,.11,0,inner);planet.scale.z=.25;
 const rings=[.58,.8,1.06].map((radius,i)=>{const tor=add(new T.TorusGeometry(radius,.012,7,90),i===1?silver:lime,inner,.44,.11,-.03);tor.rotation.y=.65;return tor});
 for(let i=0;i<4;i++)box(.55+i*.08,.04,.01,i===0?lime:silver,-.9,-.57+i*.22,.02,inner);
 box(.46,.04,.03,lime,0,-1.035,.13,screen);sphere(.047,lime,-1.58,-.88,.14,screen);sphere(.047,lime,1.58,-.88,.14,screen);
 // Spatial anchors, orbital rings and a field of particles.
 const orbit=new T.Group();scene.add(orbit);
 for(let i=0;i<3;i++){const ring=new T.Mesh(new T.TorusGeometry(2.65+i*.42,.009,5,130),i===1?silver:lime);ring.rotation.set(.45+i*.26,.3+i*.4,i*.17);ring.material=ring.material.clone();ring.material.transparent=true;ring.material.opacity=i===1?.25:.42;orbit.add(ring)}
 const positions=new Float32Array(240*3);for(let i=0;i<240;i++){const a=Math.random()*Math.PI*2,r=2.9+Math.random()*4.2;positions[i*3]=Math.cos(a)*r;positions[i*3+1]=(Math.random()-.5)*7;positions[i*3+2]=Math.sin(a)*r-1}
 const stars=new T.BufferGeometry();stars.setAttribute('position',new T.BufferAttribute(positions,3));scene.add(new T.Points(stars,new T.PointsMaterial({color:0xb6f264,size:.018,transparent:true,opacity:.67})));
 const blast=new T.Group();scene.add(blast);
 for(let i=0;i<30;i++){const a=i*Math.PI*2/30;const ray=add(new T.BoxGeometry(.012,.012,.8+Math.random()*1.6),i%3?lime:silver,blast,Math.cos(a)*2.3,Math.sin(a)*2.3,1.2);ray.rotation.z=a-Math.PI/2;ray.rotation.x=.36;ray.material=ray.material.clone();ray.material.transparent=true;ray.material.opacity=.25}
 let currentHolder=holder,room=false,play=false,videoTexture=null,scrollTarget=0,camZ=9.7,camY=1.1,camX=0,activeVideo=null;
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function scroll(){if(room)return;scrollTarget=clamp(scrollY/Math.max(innerHeight,1),0,1);document.documentElement.style.setProperty('--journey',`${scrollTarget*100}%`);document.querySelector('.stage-wrap').style.opacity=scrollY>document.querySelector('#landing-shell').offsetHeight-innerHeight*.16?'0':'1'}
 addEventListener('scroll',scroll,{passive:true});scroll();
 function resize(){const w=currentHolder.clientWidth,h=currentHolder.clientHeight;if(w&&h){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}}addEventListener('resize',resize);resize();
 window.orbitEnterRoom=()=>{room=true;document.body.classList.add('room-open');currentHolder=document.querySelector('#room-stage');currentHolder.append(renderer.domElement);resize()};
 window.orbitSetVideo=video=>{if(activeVideo===video)return;activeVideo=video;if(videoTexture){videoTexture.dispose();videoTexture=null}if(video){videoTexture=new T.VideoTexture(video);videoTexture.colorSpace=T.SRGBColorSpace;panel.material=new T.MeshBasicMaterial({map:videoTexture,toneMapped:false});inner.visible=false;window.orbitZoom()}else{panel.material=soft;inner.visible=true;window.orbitStop()}};
 window.orbitZoom=()=>{if(!room)return;play=true;document.querySelector('#theater').classList.add('is-portal');setTimeout(()=>{if(play)document.querySelector('#theater').classList.add('playing')},1550)};
 window.orbitStop=()=>{play=false;document.querySelector('#theater').classList.remove('is-portal','playing')};
 if(!document.querySelector('#room').classList.contains('hidden')){window.orbitEnterRoom();const live=document.querySelector('#remote-video:not(.hidden), #local-video:not(.hidden)');if(live)window.orbitSetVideo(live)}
 const clock=new T.Clock();function frame(){requestAnimationFrame(frame);const t=clock.getElapsedTime();const reveal=room?1:clamp((scrollTarget-.18)/.62,0,1);const targetZ=room?(play?2.9:8.6):9.7-scrollTarget*4.7;const targetY=room?(play?-.13:.6):1.1-scrollTarget*.72;const targetX=room?0:Math.sin(scrollTarget*Math.PI)*.55;camZ+=(targetZ-camZ)*.045;camY+=(targetY-camY)*.045;camX+=(targetX-camX)*.045;camera.position.set(camX,camY,camZ);camera.lookAt(0,room&&play?-.15:.15,0);
 rig.position.y=Math.sin(t*.85)*.1;const targetRotation=room?(play?0:-.08):-.32+scrollTarget*.42+Math.sin(t*.32)*.05;rig.rotation.y+=(targetRotation-rig.rotation.y)*.02;
 doorLeft.position.x=-.79-reveal*1.9;doorRight.position.x=.79+reveal*1.9;doorLeft.position.z=.15+reveal*.6;doorRight.position.z=.15+reveal*.6;doorLeft.rotation.y=-reveal*.4;doorRight.rotation.y=reveal*.4;doorLeft.visible=doorRight.visible=reveal<.98&&!play;doorSeams.forEach((seam,i)=>{seam.visible=reveal<.98&&!play;seam.position.x=(i<5?-1:1)*(.2+(i%5)*.27)+(i<5?-1:1)*reveal*1.9;seam.position.z=.183+reveal*.6});core.visible=coreInner.visible=reveal<.95&&!play;
 blast.scale.setScalar(.8+reveal*.45+(play?.35:0));blast.rotation.z=t*.035;blast.children.forEach(ray=>ray.material.opacity=(.08+reveal*.2)*(play?1.5:1));orbit.rotation.z=t*.05;orbit.rotation.y=t*.025;planet.rotation.y=t*.45;rings.forEach((r,i)=>r.rotation.z=t*(i%2?-.13:.09));renderer.render(scene,camera)}frame();
} catch(error){console.warn('3D scene unavailable',error);const fallback=`<div class="fallback-scene"><div class="fallback-halo"></div><div class="fallback-person"><div class="fallback-head"><i></i></div><div class="fallback-body"></div><div class="fallback-arm left"></div><div class="fallback-arm right"></div></div><div class="fallback-display"><div class="fallback-content"><span>THE SIGNAL IS YOURS</span><strong>✦</strong><small>ORBIT / LIVE SPACE</small></div><div class="fallback-door left"></div><div class="fallback-door right"></div></div><div class="fallback-floor"></div></div>`;holder.innerHTML=fallback;document.querySelector('#room-stage').innerHTML=fallback;const scrollFallback=()=>document.documentElement.style.setProperty('--journey',`${Math.min(100,Math.max(0,scrollY/innerHeight*100))}%`);addEventListener('scroll',scrollFallback,{passive:true});scrollFallback();let playing=false;window.orbitEnterRoom=()=>{document.body.classList.add('room-open')};window.orbitSetVideo=video=>{const display=document.querySelector('#room-stage .fallback-display');display.querySelector('video')?.remove();if(video){const preview=document.createElement('video');preview.autoplay=true;preview.muted=true;preview.playsInline=true;preview.srcObject=video.srcObject;display.append(preview);preview.play().catch(()=>{});window.orbitZoom()}else window.orbitStop()};window.orbitZoom=()=>{playing=true;document.querySelector('#theater').classList.add('is-portal');setTimeout(()=>{if(playing)document.querySelector('#theater')?.classList.add('playing')},1000)};window.orbitStop=()=>{playing=false;document.querySelector('#theater')?.classList.remove('is-portal','playing')};if(!document.querySelector('#room').classList.contains('hidden'))window.orbitEnterRoom()}
