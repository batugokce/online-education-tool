import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import sanitizeHtml from 'sanitize-html';
import React from 'react';
import './Comment.css'
import { ScrollPanel } from 'primereact/scrollpanel';
import '../../../ScrollPanel.css';
export default class Article extends React.Component {
    constructor() {
        super();
    }

    convertParagraph(paragraph, index){

        return(
            <div key={index} style={{margin: 12}}>
                <p> <b>{index}</b> &nbsp; {paragraph} </p>
            </div>);
    }

    bubbleUpSelectedRegion =  (e) => {
        const { setBtnsGroupPosition, showButtonsGroup, closeButtonsGroup } = this.props;

        const selection = window.getSelection();

        if (selection.toString()) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          setBtnsGroupPosition(rect);
          showButtonsGroup();
          document.addEventListener("click", (evt) => {
            var flyoutElement = document.getElementById('button'),
                flyoutElement2 = document.getElementById('comment'),
                targetElement = evt.target;  // clicked element

            do{
              if (targetElement == flyoutElement || targetElement == flyoutElement2 ) {
                       return;
              }
        
              targetElement = targetElement.parentNode;
              } while (targetElement);
              closeButtonsGroup();
          });
      
    }
  }
 

  


  render() {
      let index=1;
      let paragraphs = this.props.article.split("$$$");

    const contentSectionStyles = {
      textAlign: 'justify',
      background: '#fff',
      padding: '20px'
    }

    const sanitizationOptions = {
        allowedTags: [ 'p','br','h2','h1','strong','span','em','u','ol','ul','li','img', 'iframe'],
        allowedAttributes: {
            'span': [ 'class','style' ],
            'img': ['src', 'width'],
            'iframe': ['src', 'allowfullscreen', 'width', 'height']
        },
        allowedSchemes: [
            'data', 'http', 'https',
        ],
        
        allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
        allowIframeRelativeUrls: true
    }

    const cleanHtml = sanitizeHtml(this.props.article, sanitizationOptions);

    /*
    html render etmek icin ama güvenilir degilmis,
    <div
    dangerouslySetInnerHTML={{
        __html: this.props.article
    }}/>

    eski hali
    {paragraphs.map((paragraph)=>{
                        return(this.convertParagraph(paragraph,index++))
                    })}
     */

    return (
       <div className="scrollpanel">
           <div className="card"  >
               <ScrollPanel style={{height: "100vh"}} className="custombar1">
                    <section
                      id="text"
                      ref={(elm) => { this.contentContainer = elm; }}
                      style={contentSectionStyles}
                      onMouseUp = {this.bubbleUpSelectedRegion}
                      onMouseMove={this.bubbleUpSelectedRegion}

                    >
                    <div style={{margin: 24}} className="p-text-center">
                        <p style={{fontWeight: "bold", fontSize:"large"}}> {this.props.title}</p>
                    </div>
                        <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />


                 </section>
               </ScrollPanel>
           </div>
      </div>
    );
  }
}
