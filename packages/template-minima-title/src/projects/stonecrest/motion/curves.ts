/**
 * Curve Library - v0.26
 *
 * Comprehensive collection of easing curves for fluid motion.
 * All curves are functions: (t: number) => number where t is 0-1 progress.
 *
 * Philosophy: Named curves > magic numbers
 *
 * Categories:
 * 1. Standard (CSS/Web spec)
 * 2. Apple Ecosystem (measured from iOS/macOS)
 * 3. Material Design (Google spec)
 * 4. Emphasis (overshoot/anticipation)
 * 5. Project-specific (Stonecrest/Minima)
 */

export type CurveFunction = (t: number) => number;

/**
 * Create a cubic bezier curve function
 * Standard implementation matching CSS cubic-bezier()
 */
export function bezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): CurveFunction {
  // Newton-Raphson iteration for finding t given x
  const NEWTON_ITERATIONS = 4;
  const NEWTON_MIN_SLOPE = 0.001;
  const SUBDIVISION_PRECISION = 0.0000001;
  const SUBDIVISION_MAX_ITERATIONS = 10;

  const kSplineTableSize = 11;
  const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  function A(a1: number, a2: number): number {
    return 1.0 - 3.0 * a2 + 3.0 * a1;
  }
  function B(a1: number, a2: number): number {
    return 3.0 * a2 - 6.0 * a1;
  }
  function C(a1: number): number {
    return 3.0 * a1;
  }

  function calcBezier(t: number, a1: number, a2: number): number {
    return ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t;
  }

  function getSlope(t: number, a1: number, a2: number): number {
    return 3.0 * A(a1, a2) * t * t + 2.0 * B(a1, a2) * t + C(a1);
  }

  function binarySubdivide(
    x: number,
    intervalStart: number,
    intervalEnd: number,
    mX1: number,
    mX2: number
  ): number {
    let currentX;
    let currentT;
    let i = 0;
    do {
      currentT = intervalStart + (intervalEnd - intervalStart) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - x;
      if (currentX > 0.0) {
        intervalEnd = currentT;
      } else {
        intervalStart = currentT;
      }
    } while (
      Math.abs(currentX) > SUBDIVISION_PRECISION &&
      ++i < SUBDIVISION_MAX_ITERATIONS
    );
    return currentT;
  }

  function newtonRaphsonIterate(
    x: number,
    guessT: number,
    mX1: number,
    mX2: number
  ): number {
    for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
      const currentSlope = getSlope(guessT, mX1, mX2);
      if (currentSlope === 0.0) {
        return guessT;
      }
      const currentX = calcBezier(guessT, mX1, mX2) - x;
      guessT -= currentX / currentSlope;
    }
    return guessT;
  }

  // Pre-compute samples for faster lookup
  const sampleValues: number[] = [];
  for (let i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, x1, x2);
  }

  function getTForX(x: number): number {
    let intervalStart = 0.0;
    let currentSample = 1;
    const lastSample = kSplineTableSize - 1;

    for (
      ;
      currentSample !== lastSample && sampleValues[currentSample] <= x;
      ++currentSample
    ) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    const dist =
      (x - sampleValues[currentSample]) /
      (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    const guessForT = intervalStart + dist * kSampleStepSize;

    const initialSlope = getSlope(guessForT, x1, x2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(x, guessForT, x1, x2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(
        x,
        intervalStart,
        intervalStart + kSampleStepSize,
        x1,
        x2
      );
    }
  }

  // Linear case optimization
  if (x1 === y1 && x2 === y2) {
    return (t: number) => t;
  }

  return function (t: number): number {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return calcBezier(getTForX(t), y1, y2);
  };
}

// ============================================
// STANDARD CURVES (CSS/Web Spec)
// ============================================

export const CURVES = {
  /** Linear - constant rate of change */
  linear: ((t: number) => t) as CurveFunction,

  /** CSS ease - subtle acceleration and deceleration */
  ease: bezier(0.25, 0.1, 0.25, 1),

  /** CSS ease-in - starts slow, accelerates */
  easeIn: bezier(0.42, 0, 1, 1),

  /** CSS ease-out - starts fast, decelerates */
  easeOut: bezier(0, 0, 0.58, 1),

  /** CSS ease-in-out - slow start and end */
  easeInOut: bezier(0.42, 0, 0.58, 1),

  // ============================================
  // POWER CURVES (Polynomial)
  // ============================================

  /** Quadratic ease-in (power of 2) */
  easeInQuad: ((t: number) => t * t) as CurveFunction,

  /** Quadratic ease-out */
  easeOutQuad: ((t: number) => t * (2 - t)) as CurveFunction,

  /** Quadratic ease-in-out */
  easeInOutQuad: ((t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t) as CurveFunction,

  /** Cubic ease-in (power of 3) */
  easeInCubic: ((t: number) => t * t * t) as CurveFunction,

  /** Cubic ease-out */
  easeOutCubic: ((t: number) => {
    const t1 = t - 1;
    return t1 * t1 * t1 + 1;
  }) as CurveFunction,

  /** Cubic ease-in-out */
  easeInOutCubic: ((t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1) as CurveFunction,

  /** Quartic ease-out (power of 4) - very smooth deceleration */
  easeOutQuart: ((t: number) => {
    const t1 = t - 1;
    return 1 - t1 * t1 * t1 * t1;
  }) as CurveFunction,

  /** Quintic ease-out (power of 5) - extremely smooth deceleration */
  easeOutQuint: ((t: number) => {
    const t1 = t - 1;
    return 1 + t1 * t1 * t1 * t1 * t1;
  }) as CurveFunction,

  // ============================================
  // APPLE ECOSYSTEM CURVES
  // Measured from actual iOS/macOS animations
  // ============================================

  /** Apple default - used for most system animations */
  appleDefault: bezier(0.25, 0.1, 0.25, 1),

  /** Apple keyboard appearance */
  appleKeyboard: bezier(0.1, 0.9, 0.2, 1),

  /** Apple sheet/modal presentation */
  appleSheet: bezier(0.33, 1, 0.68, 1),

  /** Apple modal dismissal */
  appleModal: bezier(0.32, 0.72, 0, 1),

  /** Apple app launch/zoom */
  appleLaunch: bezier(0.16, 1, 0.3, 1),

  /** Apple navigation push */
  appleNavPush: bezier(0.35, 0.91, 0.33, 0.97),

  /** Apple spring feel (bezier approximation) */
  appleSpringBezier: bezier(0.5, 1.8, 0.5, 0.8),

  // ============================================
  // MATERIAL DESIGN CURVES (Google Spec)
  // ============================================

  /** Material standard - elements moving together */
  materialStandard: bezier(0.4, 0, 0.2, 1),

  /** Material decelerate - elements entering screen */
  materialDecelerate: bezier(0, 0, 0.2, 1),

  /** Material accelerate - elements leaving screen */
  materialAccelerate: bezier(0.4, 0, 1, 1),

  /** Material sharp - elements that may return */
  materialSharp: bezier(0.4, 0, 0.6, 1),

  // ============================================
  // EMPHASIS CURVES (Overshoot/Anticipation)
  // ============================================

  /** Small overshoot - subtle bounce past target */
  overshootSmall: bezier(0.34, 1.2, 0.64, 1),

  /** Medium overshoot - noticeable spring */
  overshootMedium: bezier(0.34, 1.4, 0.64, 1),

  /** Large overshoot - playful bounce */
  overshootLarge: bezier(0.34, 1.56, 0.64, 1),

  /** Small anticipation - slight pullback before action */
  anticipateSmall: bezier(0.38, -0.1, 0.69, 0.88),

  /** Medium anticipation - noticeable windup */
  anticipateMedium: bezier(0.38, -0.2, 0.69, 0.88),

  /** Anticipate and overshoot combined */
  anticipateOvershoot: bezier(0.68, -0.55, 0.27, 1.55),

  // ============================================
  // ELASTIC/BOUNCE CURVES
  // ============================================

  /** Elastic out - rubber band snap */
  elasticOut: ((t: number) => {
    if (t === 0 || t === 1) return t;
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
  }) as CurveFunction,

  /** Bounce out - ball dropping */
  bounceOut: ((t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }) as CurveFunction,

  // ============================================
  // PROJECT-SPECIFIC CURVES (Stonecrest/Minima)
  // ============================================

  /** Folder opening - mechanical hinge feel */
  folderOpen: bezier(0.2, 0.9, 0.3, 1),

  /** Photo burst - energetic expansion */
  photoBurst: bezier(0.18, 0.89, 0.32, 1.15),

  /** Search bar growth - responsive UI */
  searchGrow: bezier(0.22, 0.61, 0.36, 1),

  /** Website reveal - dramatic entrance */
  websiteReveal: bezier(0.16, 1, 0.3, 1),

  /** Metamorphosis - smooth transformation */
  metamorphosis: bezier(0.33, 1, 0.68, 1),

  /** Settle - natural landing with micro-bounce */
  settle: bezier(0.34, 1.1, 0.64, 1),

  /** Float - dreamy, suspended motion */
  float: bezier(0.45, 0.05, 0.55, 0.95),

  /** Exit subtle - graceful departure */
  exitSubtle: bezier(0.4, 0, 0.75, 0.9),
} as const;

// Type for curve names
export type CurveName = keyof typeof CURVES;

/**
 * Get a curve function by name or return the function if already a function
 */
export function getCurve(curveOrName: CurveName | CurveFunction): CurveFunction {
  if (typeof curveOrName === 'function') {
    return curveOrName;
  }
  const curve = CURVES[curveOrName];
  if (!curve) {
    console.warn(`Unknown curve: ${curveOrName}, falling back to ease`);
    return CURVES.ease;
  }
  return curve;
}

/**
 * Reverse a curve (play backwards)
 */
export function reverseCurve(curve: CurveFunction): CurveFunction {
  return (t: number) => 1 - curve(1 - t);
}

/**
 * Mirror a curve (ease-in becomes ease-in-out)
 */
export function mirrorCurve(curve: CurveFunction): CurveFunction {
  return (t: number) => (t < 0.5 ? curve(t * 2) / 2 : 1 - curve((1 - t) * 2) / 2);
}

/**
 * Chain two curves together
 */
export function chainCurves(
  first: CurveFunction,
  second: CurveFunction,
  midpoint: number = 0.5
): CurveFunction {
  return (t: number) => {
    if (t < midpoint) {
      return first(t / midpoint) * midpoint;
    } else {
      return midpoint + second((t - midpoint) / (1 - midpoint)) * (1 - midpoint);
    }
  };
}
