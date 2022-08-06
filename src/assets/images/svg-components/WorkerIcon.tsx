/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as React from "react";

function WorkerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.665 6.516c.679 0 1.259.247 1.74.74.493.482.74 1.061.74 1.74v.777a.857.857 0 01-.26.629.857.857 0 01-.628.26H2.743a.857.857 0 01-.629-.26.856.856 0 01-.259-.63v-.776c0-.679.24-1.258.722-1.74.493-.493 1.08-.74 1.758-.74.16 0 .394.05.703.148.32.099.641.148.962.148.32 0 .641-.049.962-.148.32-.098.555-.148.703-.148zm1.888 3.257v-.777c0-.518-.185-.962-.555-1.332a1.817 1.817 0 00-1.333-.556c-.074 0-.283.05-.629.148A3.628 3.628 0 016 7.404c-.358 0-.71-.049-1.055-.148-.333-.098-.536-.148-.61-.148-.518 0-.962.185-1.333.556-.37.37-.555.814-.555 1.332v.777c0 .086.025.154.074.203a.303.303 0 00.222.093h6.514c.086 0 .154-.03.203-.093a.246.246 0 00.093-.203zM7.665 5.24A2.267 2.267 0 016 5.924a2.329 2.329 0 01-1.684-.684 2.329 2.329 0 01-.684-1.684c0-.654.228-1.21.684-1.665A2.297 2.297 0 016 1.187c.654 0 1.209.235 1.665.704.47.456.703 1.011.703 1.665 0 .654-.234 1.215-.703 1.684zm-.407-2.942A1.713 1.713 0 006 1.779c-.493 0-.913.173-1.258.519a1.713 1.713 0 00-.518 1.258c0 .493.172.913.518 1.258.345.345.765.518 1.258.518s.913-.173 1.258-.518c.346-.345.518-.765.518-1.258 0-.494-.172-.913-.518-1.258z"
        fill="#333"
      />
    </svg>
  );
}

export default WorkerIcon;
