'use strict';
import { Component }                        from 'angular2/core';
import { DateFormatPipe } from 'angular2-moment/index';

/* jshint ignore:start */
@Component({
    selector: 'no-signal-svg',
    pipes: [DateFormatPipe],
    template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">

 <path d="m2,7.5,0-3-2,0,0,3z" style="fill:#ffff00;"/>

 <path d="m1.9983,7.5,2,0,0-3-2,0z" style="fill:#f44336;"/>

 <path d="m3.9966,7.5,2,0,0-3-2,0,0,3" style="fill:#9c27b0;"/>

 <path d="m5.9948,7.5,2,0,0-3-2,0,0,3" style="fill:#009688;"/>

 <path d="m7.9931,7.5,2,0,0-3-2,0,0,3" style="fill:#03a9f4;"/>

 <path d="m9.9914,7.5,2,0,0-3-2,0,0,3" style="fill:#ff5722;"/>

 <path d="m11.99,7.5,2,0,0-3-2,0,0,3" style="fill:#795548;"/>

 <path d="m13.988,7.5,2,0,0-3-2,0,0,3" style="fill:#ff9800;"/>

 <path style="stroke-linejoin:miter;stroke:#000000;stroke-linecap:butt;stroke-width:1px;fill:none;" d="m6,4.5,0-1"/>

 <path style="stroke-linejoin:miter;stroke:#000000;stroke-linecap:butt;stroke-width:1px;fill:none;" d="m10,4.5,0-1"/>

 <path style="stroke-linejoin:miter;stroke:#000000;stroke-linecap:butt;stroke-width:1px;fill:none;" d="m8,4.5,0-1"/>

 <path style="stroke-linejoin:miter;stroke:#e6e6e6;stroke-linecap:butt;stroke-width:1px;fill:none;" d="m5,4.5,0-1"/>

 <path style="stroke-linejoin:miter;stroke:#e6e6e6;stroke-linecap:butt;stroke-width:1px;fill:none;" d="m7,4.5,0-1"/>

 <path style="stroke-linejoin:miter;stroke:#e6e6e6;stroke-linecap:butt;stroke-width:1px;fill:none;" d="m9,4.5,0-1"/>

 <path style="stroke-linejoin:miter;stroke:#e6e6e6;stroke-linecap:butt;stroke-width:1px;fill:none;" d="m11,4.5,0-1"/>

 <path style="fill:#e6e6e6;" d="m1,4.5,0-2,3,0,0,2-3,0"/>

 <path style="fill:#e6e6e6;" d="m12,4.5,0-2,3,0,0,2z"/>

 <path style="stroke-linejoin:miter;stroke:#000000;stroke-linecap:butt;stroke-width:1px;fill:none;" d="m15,4.5,0-2-3,0,0,2"/>

 <path style="stroke-linejoin:miter;stroke:#000000;stroke-linecap:butt;stroke-width:1px;fill:none;" d="m1,4.5,0-2,3,0,0,2"/>

 <path style="stroke-linejoin:miter;stroke:#000000;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:0.5;fill:none;" d="m6.9831,3.5193,0-2"/>

 <path style="stroke-linejoin:miter;stroke:#000000;stroke-linecap:butt;stroke-width:1px;fill:none;" d="m5,1.5,6,0"/>

 <text style="font-size:0.99177438px;letter-spacing:0px;font-style:normal;word-spacing:0px;font-stretch:normal;font-variant:normal;font-weight:normal;line-height:125%;fill:#000000;" xml:space="preserve" y="3.1530125" x="4.8981295"><tspan x="4.8981295" y="3.1530125">NO</tspan></text>

 <text style="font-size:0.99177438px;letter-spacing:0px;font-style:normal;word-spacing:0px;font-stretch:normal;font-variant:normal;font-weight:normal;line-height:125%;fill:#000000;" xml:space="preserve" y="3.154372" x="7.5180721"><tspan x="7.5180721" y="3.154372">SIGNAL</tspan></text>

 <path style="stroke-linejoin:miter;stroke:#000000;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:2;fill:none;" d="M0,8,16,8"/>

 <path style="stroke-linejoin:miter;stroke:#ffffff;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:0.25;fill:none;" d="M0,8,3,8"/>

 <path style="stroke-linejoin:miter;stroke:#ffffff;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:0.25000000000000000;fill:none;" d="M3,9,3,7"/>

 <path style="stroke-linejoin:miter;stroke:#ffffff;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:0.25;fill:none;" d="M16,8,13,8"/>

 <path style="stroke-linejoin:miter;stroke:#ffffff;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:0.25000000000000000;fill:none;" d="M13,9,13,7"/>

 <text style="font-size:0.99177438px;font-family:monospace;letter-spacing:0.09px;font-style:normal;word-spacing:0px;font-stretch:normal;font-variant:normal;font-weight:normal;line-height:125%;fill:#ffffff;" xml:space="preserve" y="8.3561764" x="5.0254035"><tspan x="5.5" y="8.3561764">{{ time | amDateFormat:'HH:mm:ss' }}</tspan></text>

 <path style="fill:#000000;" d="m0,9,0,3.5,16,0,0-3.5z"/>

 <path style="stroke-linejoin:miter;stroke:#ffffff;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:0.25;fill:none;" d="m3,9,0,3"/>

 <path style="stroke-linejoin:miter;stroke:#ffffff;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:0.25000000000000000;fill:none;" d="m4,9,0,3"/>

 <path style="stroke-linejoin:miter;stroke:#ffffff;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:0.25;fill:none;" d="m5,9,0,3"/>

 <path style="stroke-linejoin:miter;stroke:#ffffff;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:0.25;fill:none;" d="m7,9,0,3"/>

 <path style="stroke-linejoin:miter;stroke:#ffffff;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:0.25;fill:none;" d="m8,9,0,3"/>

 <path style="stroke-linejoin:miter;stroke:#ffffff;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:0.25;fill:none;" d="m9,9,0,3"/>

 <path style="stroke-linejoin:miter;stroke:#ffffff;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:0.25;fill:none;" d="m11,9,0,3"/>

 <path style="stroke-linejoin:miter;stroke:#ffffff;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:0.25;fill:none;" d="m10,9,0,3"/>

 <path style="stroke-linejoin:miter;stroke:#ffffff;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:0.25;fill:none;" d="m12,9,0,3"/>

 <path style="stroke-linejoin:miter;stroke:#ffffff;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:0.25;fill:none;" d="m6,9,0,3"/>

 <path style="stroke-linejoin:miter;stroke:#ffffff;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-width:0.25;fill:none;" d="m13,9,0,3"/>

 <path style="fill:#000000;" d="M0,12.5,0,14,3,14,3,12.5z"/>

 <path style="fill:#5a5a5a;" d="m2.7557,12.5,0,1.5,3,0,0-1.5z"/>

 <path style="fill:#ffffff;" d="m13.023,12.5,0,1.5,3,0,0-1.5z"/>

 <path style="fill:#afafaf;" d="m10.267,12.5,0,1.5,3,0,0-1.5z"/>

 <path style="fill:#7d7d7d;" d="m5.5114,12.5,0,1.5,5,0,0-1.5z"/>

 <path style="fill:#000000;" d="m4,14,0,0.5,8.5,0,0-0.5z"/>

 <path style="fill:#ff9800;" d="m0,14.5,7,0,0,1.5-7,0z"/>

 <path style="fill:#ff9800;" d="M9,14.5,16,14.5,16,16,9,16z"/>

 <path style="fill:#f44336;" d="m7,14.5,2,0,0,1.5-2,0z"/>

</svg>`,
    styles: [`
        :host {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
        }
    `]
})
/* jshint ignore:end */
export class NoSignalSVG {
    constructor() {
        this.time = new Date();

        setInterval( () => {
            this.time = new Date();
        },1000);
    }

    static get parameters() {
        // return [[]];
    }
}