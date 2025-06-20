
import React, { useEffect, useRef } from 'react';
// @ts-ignore
import { gsap } from 'gsap'; // Assuming GSAP is globally available via CDN
import { useLanguage } from '../../hooks/useLanguage';

interface SplashScreenAnimatedProps {
  onAnimationComplete: () => void;
  loginContainerSelector: string;
}

const SplashScreenAnimated: React.FC<SplashScreenAnimatedProps> = ({ onAnimationComplete, loginContainerSelector }) => {
  const { t } = useLanguage();
  const componentRootRef = useRef<HTMLDivElement>(null);

  const appNameForSVG = t('appName');
  const taglineForSVG = t('splashTaglineDigitalRain'); // Using new tagline key

  // SVG structure for "Digital Rain"
  const svgContent = `
    <svg id="splashAnimationSVG_DigitalRain" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="sky_grad_dr" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#ADD8E6; stop-opacity:1" id="sky_stop1_dr" /> <!-- Light Sky Blue for clouds -->
          <stop offset="100%" style="stop-color:#87CEEB; stop-opacity:1" id="sky_stop2_dr" />
        </linearGradient>
        <filter id="heatHaze_dr" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="3" result="turbulence"/>
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="3" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <filter id="glow_dr" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
      </defs>

      <rect id="sky_rect_dr" x="0" y="0" width="800" height="600" fill="url(#sky_grad_dr)" />
      
      <g id="clouds_dr">
        <ellipse id="cloud1_dr" cx="150" cy="100" rx="80" ry="40" fill="#ADD8E6" opacity="0.7"/> <!-- Sky blue clouds -->
        <ellipse id="cloud2_dr" cx="400" cy="130" rx="100" ry="50" fill="#ADD8E6" opacity="0.6"/> <!-- Sky blue clouds -->
        <ellipse id="cloud3_dr" cx="650" cy="110" rx="90" ry="45" fill="#ADD8E6" opacity="0.65"/> <!-- Sky blue clouds -->
      </g>
      
      <path id="dry_land_dr" d="M0 450 Q200 480 400 450 T800 480 L800 600 L0 600Z" fill="#D2B48C" /> <!-- Tan / Dry Earth -->
      <path id="cracks_dr" d="M100 470 Q150 460 200 475 M300 460 Q350 480 400 455 M500 470 Q550 450 600 475 M250 500 Q300 520 350 490 M450 510 Q500 490 550 515" 
            stroke="#8B4513" stroke-width="2" fill="none" opacity="0.6"/>
      
      <!-- Additional smaller plants -->
      <g id="extra_plant_1_dr" transform="translate(150 440) scale(0.4)" opacity="0">
        <path d="M0,0 C-10,-15 -5,-30 0,-30 C5,-30 10,-15 0,0 Z" fill="#A0522D"/>
        <path d="M-10,-5 C-20,-20 -15,-35 -10,-35 C-5,-35 0,-20 -10,-5 Z" fill="#A0522D" transform="rotate(-20)"/>
        <path d="M10,-5 C20,-20 15,-35 10,-35 C5,-35 0,-20 10,-5 Z" fill="#A0522D" transform="rotate(20)"/>
      </g>
      <g id="extra_plant_2_dr" transform="translate(600 435) scale(0.5)" opacity="0">
        <ellipse cx="0" cy="-10" rx="15" ry="10" fill="#A0522D"/>
        <ellipse cx="-10" cy="-15" rx="12" ry="8" fill="#A0522D"/>
        <ellipse cx="10" cy="-15" rx="12" ry="8" fill="#A0522D"/>
      </g>
       <g id="extra_plant_3_dr" transform="translate(300 450) scale(0.35)" opacity="0">
        <rect x="-10" y="-20" width="20" height="20" rx="5" fill="#A0522D"/>
        <circle cx="0" cy="-25" r="8" fill="#A0522D" />
      </g>
      <g id="extra_plant_4_dr" transform="translate(500 455) scale(0.45)" opacity="0"> <!-- New Plant 4: Taller, spikier -->
        <path d="M0 0 L-5 -30 L0 -25 L5 -30 Z" fill="#A0522D" />
        <path d="M0 -10 L-8 -40 L0 -35 L8 -40 Z" fill="#A0522D" transform="rotate(15)" />
        <path d="M0 -10 L-8 -40 L0 -35 L8 -40 Z" fill="#A0522D" transform="rotate(-15)" />
      </g>
      <g id="extra_plant_5_dr" transform="translate(220 460) scale(0.4)" opacity="0"> <!-- New Plant 5: Low, circular bush -->
        <circle cx="0" cy="-10" r="15" fill="#A0522D" />
        <circle cx="-10" cy="-5" r="10" fill="#A0522D" />
        <circle cx="10" cy="-5" r="10" fill="#A0522D" />
      </g>

      <rect id="heat_haze_rect_dr" x="0" y="450" width="800" height="150" opacity="0.08" filter="url(#heatHaze_dr)" fill="#D2B48C"/>

      <g id="digital_rain_group_dr"></g> <!-- Raindrops will be appended here -->

      <g id="crop_growth_dr" transform="translate(400 500) scale(0.8)"> <!-- Centered crop -->
        <!-- Stages of crop growth (Paddy example) -->
        <path id="sprout_dr" d="M0 0 Q-2 -10 0 -20 Q2 -10 0 0" fill="#38761D" opacity="0" transform="scale(0.5)"/>
        <g id="paddy_leaves_dr" opacity="0">
            <path d="M0 -20 Q-15 -35 -10 -55 T0 -70" stroke="#55A630" stroke-width="3" fill="none" transform="rotate(-15)"/>
            <path d="M0 -20 Q15 -35 10 -55 T0 -70" stroke="#55A630" stroke-width="3" fill="none" transform="rotate(15)"/>
        </g>
        <rect id="paddy_stem_dr" x="-2" y="-60" width="4" height="0" fill="#55A630" opacity="0"/>
        <g id="paddy_head_dr" opacity="0" transform="translate(0 -60)">
            <circle cx="0" cy="-10" r="3" fill="#FBBE24"/> <circle cx="-5" cy="-15" r="3" fill="#FBBE24"/> <circle cx="5" cy="-15" r="3" fill="#FBBE24"/>
            <circle cx="0" cy="-20" r="3" fill="#FBBE24"/> <circle cx="-5" cy="-25" r="3" fill="#FBBE24"/> <circle cx="5" cy="-25" r="3" fill="#FBBE24"/>
        </g>
      </g>
      
      <g id="app_logo_dr" opacity="0" transform="translate(400 150)">
        <path d="M0 -30 Q20 -40 30 -20 Q40 0 20 20 Q0 40 -20 20 Q-40 0 -30 -20 Q-20 -40 0 -30 Z" fill="#4CAF50"/>
        <circle cx="0" cy="0" r="5" fill="white"/>
        <circle id="logo_pulse_dr" cx="0" cy="0" r="10" fill="rgba(255,255,255,0.5)" opacity="0"/>
      </g>

      <text id="appNameText_dr" x="400" y="280" font-family="Roboto, Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="white" opacity="0" style="filter: drop-shadow(2px 2px 3px rgba(0,0,0,0.5));">${appNameForSVG}</text>
      <text id="taglineText_dr" x="400" y="325" font-family="Gautami, Hind, Arial, sans-serif" font-size="24" text-anchor="middle" fill="white" opacity="0" style="filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.5));">${taglineForSVG}</text>
    </svg>
  `;

  useEffect(() => {
    const appNameEl = componentRootRef.current?.querySelector("#appNameText_dr");
    const taglineEl = componentRootRef.current?.querySelector("#taglineText_dr");
    if (appNameEl) appNameEl.textContent = appNameForSVG;
    if (taglineEl) taglineEl.textContent = taglineForSVG;

    const tl = gsap.timeline();

    // Scene 1: The Land Awaits (0 - 2.5s)
    tl.from("#clouds_dr ellipse", { x: "+=100", opacity: 0, duration: 2, stagger: 0.2, ease: "power1.out" }, "scene1_start")
      .to("#heat_haze_rect_dr", { opacity: 0.12, duration: 1, yoyo:true, repeat:2, ease: "sine.inOut" }, "scene1_start");

    // Scene 2: The Gathering Clouds & Digital Rain (2.5 - 5s)
    tl.to("#clouds_dr #cloud1_dr", { cx: 300, rx:100, ry:60, fill:"#D3D3D3", duration: 1.5, ease: "power1.inOut" }, "scene2_start")
      .to("#clouds_dr #cloud2_dr", { cx: 400, rx:120, ry:70, fill:"#C0C0C0", duration: 1.5, ease: "power1.inOut" }, "scene2_start")
      .to("#clouds_dr #cloud3_dr", { cx: 500, rx:100, ry:60, fill:"#D3D3D3", duration: 1.5, ease: "power1.inOut" }, "scene2_start")
      .to("#sky_stop1_dr", { attr:{style:"stop-color:#A0C8D8"}}, "scene2_start") // Sky darkens slightly
      .to("#sky_stop2_dr", { attr:{style:"stop-color:#78A8BB"}}, "scene2_start");

    const rainGroup = componentRootRef.current?.querySelector("#digital_rain_group_dr");
    if (rainGroup) {
      for (let i = 0; i < 30; i++) { // Create 30 raindrops
        const drop = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const mainDrop = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        gsap.set(mainDrop, { attr: { cx:0, cy:0, rx:2, ry:5, fill:"#87CEFA", opacity:0.8 }}); // Simple blue drops
        
        drop.appendChild(mainDrop);
        rainGroup.appendChild(drop);

        tl.fromTo(drop, 
          { x: gsap.utils.random(50, 750), y: gsap.utils.random(150, 250), opacity: 0 },
          { 
            y: gsap.utils.random(460, 520), 
            opacity: 1, 
            duration: gsap.utils.random(0.8, 1.5), 
            ease: "power1.in",
            onComplete: () => gsap.to(drop, {opacity:0, duration:0.3}) // Raindrop fades on hit
          }, 
          `scene2_start+=${1 + Math.random() * 0.5}` // Staggered start of rain
        );
      }
    }
    tl.to("#heat_haze_rect_dr", { opacity: 0, duration: 0.5 }, ">-1"); // Heat haze disappears with rain

    // Scene 3: The Growth of the Crop (5 - 8s)
    tl.add("scene3_start", ">-0.5") // Start slightly before all rain finishes for overlap
      .to("#cracks_dr", { opacity: 0, duration: 1, ease: "power1.out" }, "scene3_start")
      .to("#dry_land_dr", { fill: "#5C4033", duration: 1, ease: "power1.inOut" }, "scene3_start") // Rich, fertile brown
      
      // Crop Growth Animation
      .to("#sprout_dr", { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, "scene3_start+=0.5")
      .to("#paddy_leaves_dr", { opacity: 1, duration: 0.5, ease: "power1.out" }, ">+=0.2")
      .to("#paddy_stem_dr", { opacity: 1, attr:{height: 60}, duration: 0.7, ease: "elastic.out(1,0.5)" }, ">+=0.1")
      .to("#paddy_head_dr", { opacity: 1, duration: 0.5, stagger:0.1, ease: "back.out" }, ">+=0.3")

      // Additional smaller plants animation
      .to(["#extra_plant_1_dr", "#extra_plant_2_dr", "#extra_plant_3_dr", "#extra_plant_4_dr", "#extra_plant_5_dr"], { opacity: 1, scale: 1, duration: 0.6, stagger:0.15, ease: "back.out(1.5)" }, "scene3_start+=0.7")
      .to(["#extra_plant_1_dr path", "#extra_plant_2_dr ellipse", "#extra_plant_3_dr rect", "#extra_plant_3_dr circle", "#extra_plant_4_dr path", "#extra_plant_5_dr circle"], { fill: "#6B8E23", duration: 1, ease: "power1.inOut" }, "scene3_start+=0.8");


    // Scene 4: The Brand (8 - 12s) - Farmer removed
    tl.add("scene4_start", ">+=0.5")
      .to("#sky_stop1_dr", { attr:{style:"stop-color:#87CEEB;"}}, "scene4_start") // Bright Blue Sky
      .to("#sky_stop2_dr", { attr:{style:"stop-color:#B2FFFF;"}}, "scene4_start")
      .to("#clouds_dr ellipse", { fill:"white", opacity:gsap.utils.wrap([0.8,0.7,0.75]), duration:1}, "scene4_start") // Clouds become white and slightly more opaque
      .to("#dry_land_dr", { fill: "#90EE90", duration: 1.5, ease: "power1.inOut" }, "scene4_start") // Lush green field
      .to("#app_logo_dr", { opacity: 1, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" }, "scene4_start+=0.5")
      .to("#logo_pulse_dr", { scale: 2.5, opacity: 0, duration: 0.7, ease: "power1.out"}, ">-=0.3")
      .to(["#appNameText_dr", "#taglineText_dr"], { opacity: 1, duration: 1.0, stagger: 0.2, ease: "power2.out" }, "scene4_start+=1.0");

    // Transition to Login
    tl.add("scene_end_transition", ">+=1.5") // Hold final scene for 1.5s
      .to(componentRootRef.current, { opacity: 0, duration: 1, ease: "power1.in" }, "scene_end_transition")
      .set(loginContainerSelector, { display: 'block', opacity: 0 }, ">-=0.5")
      .to(loginContainerSelector, { 
          opacity: 1, 
          duration: 1, 
          ease: "power1.out",
          onComplete: () => {
            if (componentRootRef.current) {
                 componentRootRef.current.style.display = 'none';
            }
            onAnimationComplete(); 
          }
      }, ">-=0.2");

    return () => {
      tl.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appNameForSVG, taglineForSVG, onAnimationComplete, loginContainerSelector]);

  return (
    <div 
      ref={componentRootRef} 
      className="fixed top-0 left-0 w-full h-full z-[1000] bg-gray-100"
      dangerouslySetInnerHTML={{ __html: svgContent }} 
    />
  );
};

export default SplashScreenAnimated;
