import{r as s,H as ae,_ as tt,I as ot,o as lt,J as Q,K as at,t as d,x as l,L as A,z as _,A as X,T as ee,M as Ie,N as Ne,O as Pe,P as te,Q as oe,R as le,S as nt,y as $,v,U as st}from"./DdQN4F8u.js";import{M as rt,u as it,A as fe,H as ut,a as ct}from"./DSEoa7WU.js";import"./Dv6OuOwg.js";const _e=(E,g)=>{window.dispatchEvent(new CustomEvent(E,{detail:g}))};function dt(){const E=s([]),g=s(!1),I=()=>{try{const i=localStorage.getItem("m5live_codes");i?E.value=JSON.parse(i):J(),g.value=!0}catch(i){console.error("Error loading codes from localStorage:",i),E.value=[],g.value=!0}},J=async()=>{try{const i=await fetch("/data/codes.json");if(i.ok){const h=await i.json();E.value=h,T();return}const C=await fetch("/data/code.json");if(C.ok){const h=await C.json();E.value=h,T();return}E.value=[{title:"Simple Example",code:`INS 0 1;
OSC P5 P6 B2 F2 P30;
OUT B2 B1;
END;
GEN 0 1 2 0 0 .999 50 .999 205 -.999 306 -.999 461 0 511;
NOT 0 1 .50 125 8.45;
NOT .75 1 .17 250 8.45;
NOT 4.00 2 .50 500 8.46;
TER 8.00 ;`,year:2025,composer:"M5LIVE",comments:"A basic example to get started"}],T()}catch(i){console.error("Error loading default codes:",i)}},T=()=>{try{localStorage.setItem("m5live_codes",JSON.stringify(E.value))}catch(i){console.error("Error saving codes to localStorage:",i)}};ae(E,()=>{g.value&&T()},{deep:!0});const y=()=>{const i=JSON.stringify(E.value,null,2),C="data:application/json;charset=utf-8,"+encodeURIComponent(i),h=`m5live_codes_${new Date().toISOString().slice(0,10)}.json`,V=document.createElement("a");V.setAttribute("href",C),V.setAttribute("download",h),V.click()},m=i=>{const C=i.target;if(!C.files||C.files.length===0)return;const h=C.files[0],V=new FileReader;V.onload=F=>{var B;try{const P=(B=F.target)==null?void 0:B.result,D=JSON.parse(P);if(Array.isArray(D))E.value=D,T(),_e("m5live:import-success",{count:D.length});else throw new Error("Imported data is not an array")}catch(P){console.error("Error importing codes:",P),alert("Invalid JSON file. Please select a valid M5LIVE codes file."),_e("m5live:import-error",{error:"Invalid JSON file"})}},V.readAsText(h)};return{codes:E,loadCodes:I,saveCodes:T,exportCodes:y,importCodes:()=>{const i=document.createElement("input");i.type="file",i.accept="application/json",i.style.display="none",i.addEventListener("change",m),document.body.appendChild(i),i.click(),i.addEventListener("change",()=>{document.body.removeChild(i)})},isLoaded:g}}const vt={class:"app-container"},ft={class:"settings"},mt=["title"],pt={key:0,class:"icon",viewBox:"0 0 24 24"},gt={key:1,class:"icon",viewBox:"0 0 24 24"},yt={key:0,class:"current-title"},Ct=["title"],ht={class:"icon",viewBox:"0 0 24 24"},wt={key:0,fill:"currentColor",d:"M8,5.14V19.14L19,12.14L8,5.14Z"},Et={key:1,fill:"currentColor",d:"M18,18H6V6H18V18Z"},kt={key:0,class:"content-wrapper"},bt={class:"editor-container"},Lt={key:0,class:"mini-oscilloscopes"},St={class:"mini-oscilloscope-label"},Tt=["src"],xt=["src"],Vt={class:"storage-menu-content"},Ot={class:"left-panel"},Mt={class:"entry-fields"},At={class:"code-list"},It=["onClick"],Nt={class:"right-panel"},Pt={class:"code-actions"},_t={class:"footer"},Ft={key:0,class:"loading"},Ht={key:2,class:"error"},Ut={key:0,class:"notification"},me=`
INS 0 1 ;
OSC P5 P6 B2 F2 P30;
OUT B2 B1;
END;
GEN 0 1 2 0 0 .999 50 .999 205 -.999 306 -.999 461 0 511;
NOT 0 1 .50 125 8.45;
NOT .75 1 .17 250 8.45;
NOT 4.00 2 .50 500 8.46;
TER 8.00 ;
`,$t={__name:"index",setup(E){const g={debug:(e,t,...o)=>{M&&M.value&&console.debug(`[${e}]`,t,...o)},info:(e,t,...o)=>{console.info(`[${e}]`,t,...o)},warn:(e,t,...o)=>{console.warn(`[${e}]`,t,...o)},error:(e,t,...o)=>{console.error(`[${e}]`,t,...o)}},I=new rt,{startProcessing:J,completeProcessing:T}=it(),y=s(null),m=s(null),x=s(null),i=s(!1),C=s(0),h=s(null),V=s(null),F=s(!0),B=s(!1),P=s(!1),D=s(0),pe=s(!1),q=s(!1),R=s(null),K=s([]),O=ot({}),G=s(""),M=s(!1),b=s(!1),H=s(!0),{codes:k,loadCodes:Fe,saveCodes:ge,exportCodes:He,importCodes:Ue}=dt(),ye=s({title:"",year:new Date().getFullYear(),composer:"",comments:"",code:""}),N=s(-1),u=s(null),w=s({...ye.value}),ne=s(!1),se=s(.7),re=s(.3),Ce=s(0),he=s(0),we=s(0),W=s(""),U=s(!1),ie=()=>{pe.value=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)};lt(async()=>{ie(),window.addEventListener("resize",ie),window.addEventListener("keydown",Ee);const e=o=>{const a=o.detail||{count:0};W.value=`Imported ${a.count} codes successfully!`,U.value=!0,setTimeout(()=>{U.value=!1},3e3)},t=o=>{const a=o.detail||{error:"Unknown error"};W.value=`Import failed: ${a.error}`,U.value=!0,setTimeout(()=>{U.value=!1},3e3)};window.addEventListener("m5live:import-success",e),window.addEventListener("m5live:import-error",t),await Q(),de(),await Fe(),console.log("Setting default score in editor"),y.value?(y.value.addToEditor(me),console.log("Default score set in editor")):console.error("Score editor reference not available")}),at(()=>{window.removeEventListener("resize",ie),window.removeEventListener("keydown",Ee),window.removeEventListener("m5live:import-success",handleImportSuccess),window.removeEventListener("m5live:import-error",handleImportError),R.value&&URL.revokeObjectURL(R.value)});const Ee=e=>{e.altKey&&e.shiftKey&&(e.key==="ArrowLeft"&&k.value.length>0?(e.preventDefault(),ke(-1)):e.key==="ArrowRight"&&k.value.length>0&&(e.preventDefault(),ke(1))),e.ctrlKey&&e.key==="p"&&(e.preventDefault(),de()),(/Mac|iPod|iPhone|iPad/.test(navigator.platform)?e.metaKey&&e.key===".":e.ctrlKey&&e.key===".")&&b.value&&(e.preventDefault(),Le()),Se(e)},ke=e=>{var o;if(k.value.length===0)return;let t=N.value+e;t<0&&(t=k.value.length-1),t>=k.value.length&&(t=0),N.value=t,u.value=k.value[t],H.value=!1,z(),P.value&&x.value?x.value.addToEditor(u.value.code||""):(o=y.value)==null||o.addToEditor(u.value.code||""),G.value=u.value.title||"Untitled",setTimeout(()=>{G.value=""},4e3)},be=()=>{var e;return(e=y.value)==null?void 0:e.clearEditor()},$e=()=>F.value=!F.value,ue=()=>P.value=!P.value,Be=async()=>{var a,n,c;const{randomizeScore:e}=ct(),t=((n=(a=y.value)==null?void 0:a.aceEditor())==null?void 0:n.getValue())||me,o=e(t);H.value=!1,z(),(c=y.value)==null||c.addToEditor(o)},De=()=>{C.value=0;const e=setInterval(()=>{C.value<90&&(C.value+=Math.random()*15),C.value>90&&(C.value=90)},1200);return()=>clearInterval(e)},ce=()=>{var o,a;const e=(o=y.value)==null?void 0:o.aceEditor(),t=e?e.getValue():"";if(console.log("Binary editor instance:",e),console.log("Binary editor text:",t),!t||!t.trim()){h.value="Please enter some text to evaluate.";return}i.value=!0,J(),(a=m.value)==null||a.addTerminalOutput("musicV fortran binaries original render next"),i.value=!1,T()},Le=()=>{var e;if(b.value){console.log("Stopping playback...");try{I.stop(),b.value=!1,console.log("Playback stopped, isPlaying set to:",b.value),i.value=!1,T()}catch(t){console.error("Error stopping playback:",t),(e=m.value)==null||e.addTerminalOutput(`Error stopping playback: ${t.message}`)}}},j=async(e=null)=>{var c,p,f,L,r,S,ve,Z,Ve,Oe,Me;if(console.log("handleEvaluateTS called, current isPlaying state:",b.value),b.value){console.log("Audio is playing, stopping..."),Le();return}const t=(c=y.value)==null?void 0:c.aceEditor(),o=t?t.getValue():"",a=e??o;if(console.log("Editor instance:",t),console.log("Editor text:",a),!a||typeof a!="string"||!a.trim()){console.error("No text to evaluate found in editor"),h.value="Please enter some text to evaluate.";return}console.log("Starting audio evaluation..."),i.value=!0,J();const n=De();try{(p=m.value)==null||p.addTerminalOutput("Starting TS evaluation..."),H.value=!1,K.value=[],z(),await Q(),(f=m.value)==null||f.addTerminalOutput("Parsing score..."),I.parseScore(a),(L=m.value)==null||L.addTerminalOutput(I.getConsoleOutput()),(r=m.value)==null||r.addTerminalOutput("Initializing audio..."),await I.initAudio(),(S=m.value)==null||S.addTerminalOutput("Audio initialized successfully"),(ve=m.value)==null||ve.addTerminalOutput("Starting playback..."),await I.play(),(Z=m.value)==null||Z.addTerminalOutput("Playback started"),b.value=!0,console.log("Playback started, isPlaying set to:",b.value),(Ve=m.value)==null||Ve.addTerminalOutput("Generating sound...");const Y=await I.generateSound(10),et=Ke(Y,44100);R.value&&URL.revokeObjectURL(R.value),R.value=URL.createObjectURL(et),(Oe=m.value)==null||Oe.addTerminalOutput("Sound generation complete");const Ae=I.getFunctionTables();M.value&&g.debug("App",`Found ${Ae.length} function tables`),K.value=[...Ae],await Q(),H.value=!0}catch(Y){console.error("Error during evaluation:",Y),(Me=m.value)==null||Me.addTerminalOutput(`Error: ${Y.message}`),b.value=!1,h.value=`Evaluation failed: ${Y.message}`}finally{n(),i.value=!1,T()}};ae(K,e=>{Object.keys(O).forEach(o=>{const a=O[o];if(a){const n=a.getContext("2d");n&&n.clearRect(0,0,a.width,a.height)}});const t=e.map(o=>o.functionNum);Object.keys(O).forEach(o=>{t.includes(parseInt(o))||delete O[o]}),M.value&&g.debug("App",`Drawing ${e.length} oscilloscopes`),setTimeout(()=>e.forEach(We),0)},{deep:!0});const Re=()=>{console.log("handleEvaluateTSFromMenu called, selectedCode:",u.value),u.value&&u.value.code?(console.log("Evaluating code from menu:",u.value.code),j(u.value.code)):(console.error("No code selected in menu"),h.value="No code selected to evaluate.")},Se=e=>{e.altKey&&e.key==="Enter"?(e.preventDefault(),j()):e.ctrlKey&&e.key==="Enter"?(e.preventDefault(),ce()):e.ctrlKey&&e.key==="h"&&(e.preventDefault(),be())},Ke=(e,t)=>{const o=e.length*2,a=new ArrayBuffer(44+o),n=new DataView(a),c=(L,r)=>{for(let S=0;S<r.length;S++)n.setUint8(L+S,r.charCodeAt(S))};c(0,"RIFF"),n.setUint32(4,36+o,!0),c(8,"WAVE"),c(12,"fmt "),n.setUint32(16,16,!0),n.setUint16(20,1,!0),n.setUint16(22,1,!0),n.setUint32(24,t,!0),n.setUint32(28,t*2,!0),n.setUint16(32,2,!0),n.setUint16(34,16,!0),c(36,"data"),n.setUint32(40,o,!0);const p=.1;let f=44;for(let L=0;L<e.length;L++){const r=Math.max(-1,Math.min(1,e[L]*p)),S=r<0?r*32768:r*32767;n.setInt16(f,S,!0),f+=2}return new Blob([a],{type:"audio/wav"})},je=e=>{ne.value=!0,Ce.value=e.clientY,he.value=se.value,we.value=re.value,document.addEventListener("mousemove",Te),document.addEventListener("mouseup",xe),document.body.style.userSelect="none"},Te=e=>{if(!ne.value)return;const t=document.querySelector(".editor-container");if(!t)return;const o=t.clientHeight,n=(e.clientY-Ce.value)/o;let c=he.value+n,p=we.value-n;const f=.2;c<f?(c=f,p=1-f):p<f&&(p=f,c=1-f),se.value=c,re.value=p},xe=()=>{ne.value=!1,document.removeEventListener("mousemove",Te),document.removeEventListener("mouseup",xe),document.body.style.userSelect="",Q(()=>{var e,t;(e=y.value)==null||e.resize(),(t=m.value)==null||t.resize()})},de=()=>{var e;(e=m.value)==null||e.clearTerminal()},ze=()=>{k.value.push({...w.value}),w.value={title:"",year:new Date().getFullYear(),composer:"",comments:"",code:""},N.value=k.value.length-1,u.value=k.value[N.value],x.value&&x.value.addToEditor("")},Ze=async e=>{var t,o;if(e>=0&&u.value){const a=((o=(t=x.value)==null?void 0:t.aceEditor())==null?void 0:o.getValue())||"";k.value[e]={...w.value,code:a},await ge()}},Ye=async e=>{e>=0&&confirm("Delete this code?")&&(k.value.splice(e,1),N.value=-1,u.value=null,w.value={...ye.value},x.value&&x.value.addToEditor(""),await ge())},Je=e=>{var o;N.value=e,u.value=k.value[e],w.value={...u.value};const t=(o=x.value)==null?void 0:o.aceEditor();t&&t.setValue(u.value.code||"",-1)},qe=e=>{u.value&&(u.value.code=e,w.value.code=e)},Ge=()=>{var e;u.value&&((e=y.value)==null||e.addToEditor(u.value.code||""),ue(),z())},We=e=>{if(!e||!e.functionNum||!e.data||e.data.length===0){M.value&&g.warn("Oscilloscope",`Invalid function table data for F${(e==null?void 0:e.functionNum)||"unknown"}`);return}const t=O[e.functionNum];if(!t){M.value&&g.warn("Oscilloscope",`Canvas not found for function table F${e.functionNum}`);return}const o=t.getContext("2d");if(!o){M.value&&g.warn("Oscilloscope",`Could not get 2D context for canvas F${e.functionNum}`);return}M.value&&g.debug("Oscilloscope",`Drawing function table F${e.functionNum} with ${e.data.length} points`);const a=t.width,n=t.height,c=e.data;o.clearRect(0,0,a,n),o.fillStyle="#1a1a1a",o.fillRect(0,0,a,n),o.strokeStyle="#333333",o.lineWidth=.5;for(let r=0;r<=a;r+=a/4)o.beginPath(),o.moveTo(r,0),o.lineTo(r,n),o.stroke();for(let r=0;r<=n;r+=n/2)o.beginPath(),o.moveTo(0,r),o.lineTo(a,r),o.stroke();o.strokeStyle="#555555",o.beginPath(),o.moveTo(0,n/2),o.lineTo(a,n/2),o.stroke();let p=1/0,f=-1/0;for(let r=0;r<c.length;r++)p=Math.min(p,c[r]),f=Math.max(f,c[r]);p===f&&(p-=.5,f+=.5),o.strokeStyle="#00ff00",o.lineWidth=1.5,o.beginPath();const L=c.length;try{for(let r=0;r<L;r++){const S=r/(L-1)*a,Z=(1-(c[r]-p)/(f-p))*n;r===0?o.moveTo(S,Z):o.lineTo(S,Z)}o.stroke(),o.fillStyle="#00ff00",o.font="9px monospace",o.fillText(`${f.toFixed(2)}`,2,8),o.fillText(`${p.toFixed(2)}`,2,n-2),o.fillText(`${L}p`,a-25,8)}catch(r){M.value&&g.error("Oscilloscope",`Error drawing oscilloscope for F${e.functionNum}:`,r)}},z=()=>{H.value=!1,Object.keys(O).forEach(e=>{const t=O[e];if(t){const o=t.getContext("2d");o&&(o.clearRect(0,0,t.width,t.height),o.fillStyle="#1a1a1a",o.fillRect(0,0,t.width,t.height))}}),Object.keys(O).forEach(e=>{delete O[e]}),K.value=[],M.value&&g.debug("App","Cleared all oscilloscopes")};ae(()=>{var e,t;return(t=(e=y.value)==null?void 0:e.aceEditor())==null?void 0:t.getValue()},()=>{H.value=!1,z()},{deep:!0}),ae(b,e=>{console.log("isPlaying changed to:",e)},{immediate:!0});const Qe=()=>{He(),W.value="Codes exported successfully!",U.value=!0,setTimeout(()=>{U.value=!1},3e3)},Xe=()=>{Ue()};return(e,t)=>(v(),d("div",vt,[l("div",ft,[l("button",{onClick:$e,class:"icon-button",title:F.value?"Hide Code":"Show Code"},[F.value?(v(),d("svg",pt,t[12]||(t[12]=[l("path",{fill:"currentColor",d:"M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"},null,-1)]))):(v(),d("svg",gt,t[13]||(t[13]=[l("path",{fill:"currentColor",d:"M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z"},null,-1)]))),_(ee,{name:"title-fade"},{default:X(()=>[G.value?(v(),d("span",yt,$(G.value),1)):A("",!0)]),_:1})],8,mt),l("button",{onClick:ce,class:"icon-button",title:"Evaluate Binary (Ctrl+Enter)"},t[14]||(t[14]=[l("svg",{class:"icon",viewBox:"0 0 24 24"},[l("path",{fill:"currentColor",d:"M8,5.14V19.14L19,12.14L8,5.14Z"})],-1),l("span",{class:"f-subscript"},"F",-1)])),l("button",{onClick:j,class:"icon-button",title:b.value?"Stop Audio (Cmd+. or Ctrl+.)":"Evaluate TS (Alt+Enter)"},[(v(),d("svg",ht,[b.value?(v(),d("path",Et)):(v(),d("path",wt))])),t[15]||(t[15]=l("span",{class:"ts-subscript"},"TS",-1))],8,Ct),l("button",{onClick:be,class:"icon-button",title:"Clear Editor (Ctrl+H)"},t[16]||(t[16]=[l("svg",{class:"icon",viewBox:"0 0 24 24"},[l("path",{fill:"currentColor",d:"M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,21V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"})],-1)])),l("button",{onClick:Be,class:"icon-button",title:"Randomize Score"},t[17]||(t[17]=[l("svg",{class:"icon",viewBox:"0 0 24 24"},[l("path",{fill:"currentColor",d:"M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z"})],-1)])),l("button",{onClick:t[0]||(t[0]=o=>B.value=!0),class:"icon-button",title:"Help"},t[18]||(t[18]=[l("svg",{class:"icon",viewBox:"0 0 24 24"},[l("path",{fill:"currentColor",d:"M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z"})],-1)])),l("button",{onClick:ue,class:"icon-button",title:"Storage Menu (Ctrl+M)"},t[19]||(t[19]=[l("svg",{class:"icon",viewBox:"0 0 24 24"},[l("path",{fill:"currentColor",d:"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"})],-1)]))]),F.value?(v(),d("div",kt,[l("div",bt,[l("div",{class:"score-editor",style:Ie({flex:se.value})},[_(fe,{ref_key:"scoreEditorRef",ref:y,mode:"editor",value:me,onEvaluate:ce,onEvaluateTS:j,onKeydown:Se},null,512),H.value?(v(),d("div",Lt,[(v(!0),d(Ne,null,Pe(K.value,(o,a)=>(v(),d("div",{key:`table-${o.functionNum}-${a}`,class:"mini-oscilloscope"},[l("div",St,"F"+$(o.functionNum),1),l("canvas",{ref_for:!0,ref:n=>{n&&(O[o.functionNum]=n)},width:"80",height:"50",class:"mini-oscilloscope-canvas"},null,512)]))),128))])):A("",!0)],4),l("div",{class:"divider",onMousedown:je},null,32),l("div",{class:"console-editor",style:Ie({flex:re.value})},[l("div",{class:"console-header"},[l("button",{class:"clear-btn",onClick:de,title:"Clear console (Ctrl+P)"},"🗑️")]),_(fe,{ref_key:"consoleEditorRef",ref:m,mode:"terminal"},null,512)],4)])])):A("",!0),_(ee,{"enter-active-class":"fadeIn","leave-active-class":"fadeOut",duration:3e3,mode:"out-in"},{default:X(()=>[V.value?(v(),d("div",{class:"plot-display",key:D.value},[l("img",{src:`data:image/png;base64,${V.value}`,alt:"Plot",onClick:t[1]||(t[1]=o=>q.value=!0),class:"plot-image"},null,8,Tt)])):A("",!0)]),_:1}),_(ee,{"enter-active-class":"fadeIn","leave-active-class":"fadeOut",duration:300},{default:X(()=>[q.value?(v(),d("div",{key:0,class:"lightbox",onClick:t[4]||(t[4]=o=>q.value=!1)},[l("button",{class:"close-button",onClick:t[2]||(t[2]=te(o=>q.value=!1,["stop"]))},t[20]||(t[20]=[l("svg",{class:"icon",viewBox:"0 0 24 24"},[l("path",{fill:"currentColor",d:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"})],-1)])),l("img",{src:`data:image/png;base64,${V.value}`,alt:"Plot",class:"lightbox-image",onClick:t[3]||(t[3]=te(()=>{},["stop"]))},null,8,xt)])):A("",!0)]),_:1}),P.value?(v(),d("div",{key:1,class:"storage-menu",onClick:te(ue,["self"])},[l("div",Vt,[l("div",Ot,[l("div",Mt,[l("form",{onSubmit:te(ze,["prevent"])},[oe(l("input",{"onUpdate:modelValue":t[5]||(t[5]=o=>w.value.title=o),placeholder:"Title",required:""},null,512),[[le,w.value.title]]),oe(l("input",{type:"number","onUpdate:modelValue":t[6]||(t[6]=o=>w.value.year=o),placeholder:"Year",required:""},null,512),[[le,w.value.year,void 0,{number:!0}]]),oe(l("input",{"onUpdate:modelValue":t[7]||(t[7]=o=>w.value.composer=o),placeholder:"Composer",required:""},null,512),[[le,w.value.composer]]),oe(l("textarea",{"onUpdate:modelValue":t[8]||(t[8]=o=>w.value.comments=o),placeholder:"Comments",rows:"3",required:""},null,512),[[le,w.value.comments]]),t[21]||(t[21]=l("button",{type:"submit"},"[ Add ]",-1))],32)]),l("div",At,[(v(!0),d(Ne,null,Pe(nt(k),(o,a)=>(v(),d("div",{key:a,class:st({selected:N.value===a}),onClick:n=>Je(a)},$(o.composer)+" - "+$(o.year)+" - "+$(o.title||"Untitled"),11,It))),128))])]),l("div",Nt,[_(fe,{ref_key:"codeEditorRef",ref:x,mode:"editor",value:u.value?u.value.code:"",onInput:qe},null,8,["value"]),l("div",Pt,[l("button",{onClick:Re},"[ Play TS ]"),l("button",{onClick:Ge},"[ To Editor ]"),l("button",{onClick:t[9]||(t[9]=o=>Ze(N.value))},"[ Update ]"),l("button",{onClick:t[10]||(t[10]=o=>Ye(N.value))},"[ Delete ]"),l("button",{onClick:Qe},"[ Export ]"),l("button",{onClick:Xe},"[ Import ]")])])])])):A("",!0),l("div",_t,[i.value?(v(),d("div",Ft)):A("",!0),pe.value?(v(),d("button",{key:1,onClick:j,class:"mobile-evaluate-btn",title:"Alt+Enter"},"Evaluate TS")):A("",!0)]),h.value?(v(),d("div",Ht,$(h.value),1)):A("",!0),_(ut,{modelValue:B.value,"onUpdate:modelValue":t[11]||(t[11]=o=>B.value=o)},null,8,["modelValue"]),_(ee,{name:"fade"},{default:X(()=>[U.value?(v(),d("div",Ut,$(W.value),1)):A("",!0)]),_:1})]))}},Kt=tt($t,[["__scopeId","data-v-f841f43a"]]);export{Kt as default};
