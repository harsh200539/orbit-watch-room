# Orbit watch room

A Vercel-ready static web app with Supabase Realtime signaling and WebRTC media for up to eight people. It has a Three.js entrance, invite codes, voice chat, screen sharing, and opt-in approximate location markers.

## Architecture

Vercel serves static files in `public/`. Supabase Realtime Presence lists active friends and Broadcast relays WebRTC offers, answers, and ICE candidates. Each room exists only while at least one participant remains connected. Media is peer to peer and is never recorded by this app. The six-character code is the room secret; only share it with people you want to join. Public Realtime channels do not provide access control beyond that code.

The browser imports Supabase JS and Three.js from esm.sh. The Three.js scene animates with scroll, adds a pointer-reactive portal field, moves into the room, renders the live video as a VideoTexture, then zooms into full playback. Browsers with WebGL disabled show a CSS portrait and live preview. The visual direction takes inspiration from ThreeUI's Portal Field, but the shader, character, and page are original to Orbit. `public/config.js` contains only the public project URL and publishable key; never put a service role or secret key in frontend code.

## Local run

Node.js 20 or later, no package install required. Run `npm start` then open `http://localhost:3000`. Configure `public/config.js` for your own Supabase project if using a copy.

## Vercel

Deploy the `watchverse` directory as a new Vercel project. The included `vercel.json` serves `public/` at the root. HTTPS enables browser capture, microphone, and location. The project requires public Realtime channels in its Supabase settings.

Desktop screen sharing requires `getDisplayMedia`. iPhone and iPad browsers cannot capture their screen from a web page; they can join, watch, talk, share a camera, and opt in to location. Orbit shows this limitation in the room.

WebRTC waits for ICE gathering before signaling the offer to avoid candidates arriving before the peer description. It uses public STUN servers. Some networks block peer-to-peer media; add a TURN relay for reliable cross-network calls, which can have bandwidth cost. For eight people the mesh sends a separate stream to each friend, so a host's upload capacity matters. This is a watch room, not a mass audience streaming service. Location is rounded to 0.1° before appearing on the schematic map. Share only content you are allowed to show.
