import * as React from "react";

export default function WorkspaceMascot() {
  return (
    <div className="playground-mascot" aria-hidden="true">
      <span className="mascot-speech">Oi! Bora inventar?</span>
      <svg viewBox="0 0 220 164" fill="none">
        <ellipse cx="115" cy="151" rx="57" ry="7" fill="#e8defa" />
        <path d="m25 42 4 10 11 2-9 7 1 11-9-6-10 4 4-11-7-8 11-1Z" fill="#ffc75d" />
        <path d="m193 89 3 8 8 2-7 5v8l-7-5-7 2 3-7-4-7 8 1Z" fill="#88d5bc" />
        <circle cx="179" cy="35" r="5" fill="#ffac93" />
        <path
          d="m54 101-15 6-10-17M166 101l16-9 7-16"
          stroke="#7760be"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path d="m95 132-3 13m47-13 3 13" stroke="#7760be" strokeWidth="12" strokeLinecap="round" />
        <rect
          x="80"
          y="102"
          width="72"
          height="35"
          rx="14"
          fill="#aa8be8"
          stroke="#6951a7"
          strokeWidth="3"
        />
        <rect x="106" y="111" width="20" height="14" rx="5" fill="#ffe298" />
        <path d="M115 46V28" stroke="#7760be" strokeWidth="5" strokeLinecap="round" />
        <circle cx="115" cy="22" r="8" fill="#ffb56b" stroke="#dd8445" strokeWidth="3" />
        <rect
          x="59"
          y="45"
          width="114"
          height="73"
          rx="26"
          fill="#bea2f2"
          stroke="#6951a7"
          strokeWidth="3"
        />
        <rect x="71" y="57" width="90" height="49" rx="18" fill="#4c3b78" />
        <path d="M93 75v7m45-7v7" stroke="#fffdf5" strokeWidth="8" strokeLinecap="round" />
        <path d="M107 88q9 10 18 0" stroke="#fffdf5" strokeWidth="4" strokeLinecap="round" />
        <circle cx="83" cy="88" r="5" fill="#ffb4b2" opacity=".8" />
        <circle cx="149" cy="88" r="5" fill="#ffb4b2" opacity=".8" />
      </svg>
    </div>
  );
}
