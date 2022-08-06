/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as React from "react";

function GliderLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={36}
      height={36}
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 748 748"
      {...props}
    >
      <defs>
        <style>
          {
            ".cls-2,.cls-3{fill:none;stroke-miterlimit:10;stroke-width:11px}.cls-2{stroke:#fff}.cls-3{stroke:#ffc300}"
          }
        </style>
      </defs>
      <circle
        cx={374}
        cy={374}
        r={374}
        style={{
          fill: "#242423",
        }}
      />
      <g id="logo">
        <g id="circle">
          <ellipse className="cls-2" cx={498.16} cy={381.04} rx={43.79} ry={43.63} />
          <ellipse className="cls-2" cx={580.21} cy={511.36} rx={43.79} ry={43.63} />
          <ellipse className="cls-2" cx={438.29} cy={638.37} rx={43.79} ry={43.63} />
          <ellipse className="cls-2" cx={252.03} cy={555.54} rx={43.79} ry={43.63} />
          <ellipse className="cls-2" cx={132.29} cy={357.85} rx={43.79} ry={43.63} />
          <ellipse className="cls-2" cx={428.32} cy={128.13} rx={43.79} ry={43.63} />
          <g id="graf">
            <path
              className="cls-2"
              d="m257.02 456.7-2.52 53.8M286.96 581.5l107.54 44.17M482.09 625.67l70.95-79.52M560.8 472.16l-37.69-55.22M517.57 341.83l24.39-35.34M465.46 151.87l70.95 82.83M384.52 145.24l-98.67 89.46M222.65 292.13 170.5 336.5M148.37 398.16l74.28 124.8"
            />
          </g>
        </g>
        <g id="logo-2" data-name="logo">
          <path
            className="cls-3"
            d="M523.11 271.15h-68.74M366.78 271.15l-62.08-1.1M261.46 314.22v55.22M295.83 439.02l73.67 58.48"
          />
          <ellipse className="cls-3" cx={260.9} cy={270.6} rx={43.79} ry={43.63} />
          <ellipse className="cls-3" cx={410.58} cy={270.6} rx={43.79} ry={43.63} />
          <ellipse className="cls-3" cx={566.9} cy={270.6} rx={43.79} ry={43.63} />
          <ellipse className="cls-3" cx={260.9} cy={413.07} rx={43.79} ry={43.63} />
          <ellipse className="cls-3" cx={410.58} cy={515.78} rx={43.79} ry={43.63} />
        </g>
      </g>
    </svg>
  );
}

export default GliderLogo;
