"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);

// Mobile address bar show/hide shouldn't recalculate every trigger mid-scroll
ScrollTrigger.config({ ignoreMobileResize: true });

// House easings: a long, decisive deceleration used everywhere
CustomEase.create("house", "0.16, 1, 0.3, 1");
CustomEase.create("curtain", "0.76, 0, 0.24, 1");
// Bottom-sheet curve (the one iOS sheets use): eases in gently, no snap
CustomEase.create("sheet", "0.32, 0.72, 0, 1");

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
