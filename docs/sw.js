if(!self.define){let s,e={};const i=(i,n)=>(i=new URL(i+".js",n).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(n,l)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let u={};const o=s=>i(s,r),d={module:{uri:r},exports:u,require:o};e[r]=Promise.all(n.map((s=>d[s]||o(s)))).then((s=>(l(...s),u)))}}define(["./workbox-5ffe50d4"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/copytoclipboard-BUPoDJxG.png",revision:null},{url:"assets/index--5j8P1xj.js",revision:null},{url:"assets/index-2FfE64vQ.js",revision:null},{url:"assets/index-6986NTB_.js",revision:null},{url:"assets/index-8FRTRmBF.js",revision:null},{url:"assets/index-a3Xxa1Rg.js",revision:null},{url:"assets/index-B1-IgnJh.css",revision:null},{url:"assets/index-BABlCeMG.js",revision:null},{url:"assets/index-BD6COGOl.js",revision:null},{url:"assets/index-BJ5KA7lB.js",revision:null},{url:"assets/index-BwYxo5Ki.css",revision:null},{url:"assets/index-BXEKywEU.js",revision:null},{url:"assets/index-Cb93FWLK.js",revision:null},{url:"assets/index-CBOJPVkM.js",revision:null},{url:"assets/index-Cj4eyWFc.js",revision:null},{url:"assets/index-CM4g1epP.js",revision:null},{url:"assets/index-CPTCUQpx.css",revision:null},{url:"assets/index-D2s3k_n2.js",revision:null},{url:"assets/index-DBQq7ewy.js",revision:null},{url:"assets/index-DBvCIqSF.js",revision:null},{url:"assets/index-DduJOEj4.css",revision:null},{url:"assets/index-DHqpyXOf.js",revision:null},{url:"assets/index-DiGZ3ZJs.js",revision:null},{url:"assets/index-DMyxIJKa.js",revision:null},{url:"assets/index-DpcH8iPs.css",revision:null},{url:"assets/index-DyqzChe-.js",revision:null},{url:"assets/index-fkXxyJXw.css",revision:null},{url:"assets/index-GMi6nqvW.js",revision:null},{url:"assets/index-UfCUwpoR.js",revision:null},{url:"assets/index-xF0_becH.css",revision:null},{url:"assets/index-yrzG481Z.js",revision:null},{url:"assets/install_iphone-Ca3z6fdW.png",revision:null},{url:"favicon.ico",revision:"b26e17110468490c0c7f39c49443631a"},{url:"icons/icon-192x192.png",revision:"2f8ef5dd3a3bb6a0f2e7901d212dddf7"},{url:"icons/icon-512x512.png",revision:"379e8d9ad64de5a77b22027995d05658"},{url:"index.html",revision:"b4af11f47db81f0afca41bba11e467ed"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"icons/icon-192x192.png",revision:"2f8ef5dd3a3bb6a0f2e7901d212dddf7"},{url:"icons/icon-512x512.png",revision:"379e8d9ad64de5a77b22027995d05658"},{url:"manifest.webmanifest",revision:"beb9cb48e1ee69474eb10fe2e5f8469a"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
