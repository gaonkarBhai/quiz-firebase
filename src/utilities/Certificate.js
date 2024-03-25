import { PDFDocument, rgb, cmyk } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit'
import { saveAs } from 'file-saver';
import { toast } from "react-hot-toast";

import { eventUrls } from './EventsDetails';


const generateCerti = async (name, certificateImg, certificateFont) => {

    const formattedCertificateImg = certificateImg.toLowerCase().replace(/\s/g, '');
    const formattedCertificateFont = certificateFont.toLowerCase().replace(/\s/g, '');

    console.log(formattedCertificateFont);
    var uri = "";

    // Get the URLs based on the event name
    const eventUrlsForEvent = eventUrls[formattedCertificateImg];

    if (!eventUrlsForEvent) {
        // Display a toast error message
        toast.error("Certificate for this event is not available");
        return;
    }
    let { 
        img: PDFURL,
        font: FONTURL,
        textSize:textsize,
        yOffset:yoffset,
        cmky:cmky
     } = eventUrlsForEvent;


    const toastId = toast.loading("Downloading certificate. Please wait...");

    //fetch PDF
    const exBytes = await fetch(PDFURL)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Failed to fetch PDF: ${res.statusText}`);
            }
            return res.arrayBuffer();
        })
        .catch((error) => {
            console.error(error);
            throw error;
        });


    //fetch font
    const exFont = await fetch(FONTURL)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Failed to fetch font: ${res.statusText}`);
            }
            return res.arrayBuffer();
        })
        .catch((error) => {
            console.error(error);
            throw error;
        });


    const pdfDoc = await PDFDocument.load(exBytes);
    //console.log("Loaded PDF Document:", pdfDoc);

    pdfDoc.registerFontkit(fontkit);
    const myFont = await pdfDoc.embedFont(exFont);


    const textSize = textsize;
    const yOffset = yoffset;
    const textWidth = myFont.widthOfTextAtSize(name, textSize);

    const pages = pdfDoc.getPages();
    const FirstPage = pages[0];

    FirstPage.drawText(name, {
        x: (FirstPage.getWidth()) / 2 - textWidth / 2 + (FirstPage.getWidth() * 0),
        y: yOffset,
        size: textSize,
        font: myFont,
        color: cmyk(cmky.cyan, cmky.magenta, cmky.yellow, cmky.key),
    });

    toast.dismiss(toastId);

    uri = await pdfDoc.saveAsBase64({ dataUri: true });

    // Open the generated PDF in a new window
    //window.open(uri);

    // Download certificate
    saveAs(uri, "Certificate", { autoBom: true });
}

export default generateCerti;
