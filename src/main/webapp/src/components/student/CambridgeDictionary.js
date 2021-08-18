import React from 'react'
import sanitizeHtml from "sanitize-html";

const rawHTML = `
    <form
    action='https://dictionary.cambridge.org/search/english/direct/?utm_source=widget_searchbox_source&utm_medium=widget_searchbox&utm_campaign=widget_tracking'
    method='get'
    target='_blank'>
    <table style='font-size:200px;background:#292929;border-collapse:collapse;border-spacing:0;width:350px;'>
        <tbody>
        <tr>
            <td colSpan='2' style='padding:0;background:none;border:none;'>
            <a href='https://dictionary.cambridge.org/'
              style='display:block; background: transparent url(https://dictionary.cambridge.org/external/images/freesearch/sbl.png?version=5.0.158) no-repeat 5px 6px;height:42px;'>
              
            </a>
            </td>
        </tr>
        <tr>
            <td stsyle='width:230px;background:none;border:none;padding:4px;'>
                <input
                style='width:100%;display:block;font-size:10px;padding:2px;border:none;' name='q'/>
            </td>
            <td style='width:110px;background:none;border:none;padding:0 4px 0 0;'>
                <input
                    style='width:100%;display:block;font-size:10px;padding:2px;border:none;float:right;background:#d0a44c;'
                    type='submit' value='Look it up' formtarget='_blank'/>
            </td>
        </tr>
        </tbody>
    </table>
</form>`

const sanitizationOptions = {
    allowedTags: [ 'p','h2','h1','strong','span','em','u','ol','ul','li','img'],
    allowedAttributes: {
        'span': [ 'class','style' ],
        'img': ['src', 'width']
    },
    allowedSchemes: [
        'data'
    ]
}

const cleanHtml = sanitizeHtml(rawHTML, sanitizationOptions);

const CambridgeDictionary = () => (
    <div>
        { <div dangerouslySetInnerHTML={{ __html: cleanHtml }}/> }
    </div>
)

export default CambridgeDictionary

