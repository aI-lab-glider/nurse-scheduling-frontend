/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as React from "react";

function BabyIcon(props: React.SVGProps<SVGSVGElement>) {
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
        d="M8.701 3.722c.284.05.506.192.667.426.16.234.215.493.166.777a.978.978 0 01-.425.666l-.685.463c-.21.148-.426.271-.648.37v.425l1 1.037c.184.16.29.363.314.61a.977.977 0 01-.13.666l-.703 1.036a.996.996 0 01-.87.463.97.97 0 01-.517-.148.92.92 0 01-.24-.204 1.738 1.738 0 01-.223-.351c-.062-.136-.062-.315 0-.537.062-.222.204-.45.426-.684l-.352-.222c-.32.11-.648.11-.98 0l-.334.222c.222.234.364.462.426.684.062.222.055.401-.019.537a1.32 1.32 0 01-.203.351.92.92 0 01-.24.204.97.97 0 01-.519.148.996.996 0 01-.87-.463L3.04 9.162a1.064 1.064 0 01-.148-.666.973.973 0 01.333-.61l1-1.037v-.425a4.668 4.668 0 01-.648-.37l-.685-.463a.978.978 0 01-.425-.666c-.05-.284.006-.543.166-.777a.969.969 0 01.648-.426c.284-.049.549.006.796.167l.666.462c.283.198.592.321.925.37.345.038.648.019.907-.055s.487-.179.684-.315l.666-.462a1.04 1.04 0 01.777-.167zm-3.719 5.68l-.48-.665.536-.5-.648-.666-.018-.018v-.019l-.722.759c-.197.16-.234.351-.111.573l.685.98c.086.149.21.223.37.223a.53.53 0 00.24-.056.405.405 0 00.185-.277.39.39 0 00-.037-.333zM6.518 7.83l.666-.666V6.96H4.816v.204l.666.666c.11.111.277.167.5.167.234 0 .413-.056.536-.167zm1.832.463l-.722-.759v.019l-.018.018-.666.648.555.518-.481.666a.442.442 0 00-.056.333.474.474 0 00.204.277.492.492 0 00.222.056.422.422 0 00.388-.222l.685-.98c.123-.223.086-.414-.111-.574zm.425-3.183c.148-.11.21-.247.185-.407-.024-.173-.104-.29-.24-.352-.136-.074-.29-.067-.463.019l-.666.463c-.53.333-1.08.493-1.647.48a2.794 2.794 0 01-1.535-.48l-.666-.463c-.16-.099-.315-.105-.463-.019a.406.406 0 00-.24.352c-.013.148.049.284.184.407l.685.463c.271.185.574.333.907.444v.351h2.368v-.351c.333-.111.635-.26.907-.444l.684-.463zM7.036 3.722A1.41 1.41 0 016 4.148c-.407 0-.759-.142-1.055-.426a1.472 1.472 0 01-.425-1.054c0-.407.142-.753.425-1.037A1.44 1.44 0 016 1.187c.407 0 .752.148 1.036.444.296.284.444.63.444 1.037 0 .407-.148.758-.444 1.054zM6.63 2.04A.857.857 0 006 1.779a.856.856 0 00-.63.26.857.857 0 00-.258.629c0 .246.086.456.259.629.173.172.382.259.629.259a.857.857 0 00.63-.26.856.856 0 00.258-.628.857.857 0 00-.259-.63z"
        fill="#333"
      />
    </svg>
  );
}

export default BabyIcon;