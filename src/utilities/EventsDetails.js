import capturetheflagImg from '../assets/capturetheflag.pdf'
import capturetheflagfont from '../assets/capturetheflag.ttf'

import programmerzImg from '../assets/programmerz.pdf'
import programmerzfont from '../assets/programmerz.ttf'


// Event Urls for different Certificates 
// Note certificateImg and event must be in LowerCase and equal
export const eventUrls = {
    capturetheflag: {
        img: capturetheflagImg,
        font: capturetheflagfont,
        textSize:35,
        yOffset:305,
        cmky:{
            cyan:0,
            magenta:0.4,
            yellow:0.11,
            key:0.8
        }
    },
    programmerz:{
        img:programmerzImg,
        font:programmerzfont,
        textSize:40,
        yOffset:305,
        cmky:{
            cyan:0,
            magenta:1,
            yellow:0.11,
            key:0.8
        }
    },
    // Add other events when the certificate is available
};