
import { SVGProps } from "react";

interface PingoLogoProps extends SVGProps<SVGSVGElement> {
  animated?: boolean;
}

const PingoLogo = ({ animated = false, ...props }: PingoLogoProps) => {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Background Circle */}
      <circle cx="60" cy="60" r="60" className="fill-pingo-500/20" />
      
      {/* Penguin Body */}
      <ellipse 
        cx="60" 
        cy="65" 
        rx="30" 
        ry="35" 
        className="fill-slate-800 dark:fill-slate-900" 
        className={animated ? "animate-bounce-soft" : ""}
      />
      
      {/* White Belly */}
      <ellipse 
        cx="60" 
        cy="72" 
        rx="18" 
        ry="24" 
        fill="white"
      />
      
      {/* Eyes */}
      <circle cx="50" cy="50" r="4" fill="white" />
      <circle cx="70" cy="50" r="4" fill="white" />
      <circle cx="51" cy="51" r="2" className="fill-slate-900" />
      <circle cx="69" cy="51" r="2" className="fill-slate-900" />
      
      {/* Beak */}
      <path
        d="M60 58 L52 65 L68 65 L60 58"
        className="fill-orange-400"
      />
      
      {/* Wings */}
      <path
        d="M30 65 Q40 85 45 70"
        className="stroke-slate-800 dark:stroke-slate-900 fill-none stroke-[12]"
        strokeLinecap="round"
      />
      <path
        d="M90 65 Q80 85 75 70"
        className="stroke-slate-800 dark:stroke-slate-900 fill-none stroke-[12]"
        strokeLinecap="round"
      />
      
      {/* Speed indicator */}
      <path
        d="M60 90 L60 105"
        className="stroke-pingo-500 stroke-[4]"
        strokeLinecap="round"
      />
      
      {/* Speed lines */}
      <path
        d="M40 95 L45 100"
        className="stroke-pingo-400 stroke-[2] opacity-80"
        strokeLinecap="round"
      />
      <path
        d="M80 95 L75 100"
        className="stroke-pingo-400 stroke-[2] opacity-80"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default PingoLogo;
