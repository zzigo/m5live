import{_ as i,r as n,o as _,v as o,O as e,y as d,q as g,t}from"./CLPStcoR.js";const u={class:"logs-container"},p={key:0,class:"loading"},f={key:1,class:"error"},v=["innerHTML"],h={__name:"logs",setup(y){const r=n(!0),a=n(null),l=n(""),c=g();return _(async()=>{try{const s=await fetch(`${c.public.apiBase.replace("/api","")}/log`);if(!s.ok)throw new Error(`HTTP error! status: ${s.status}`);l.value=await s.text()}catch(s){a.value=`Failed to load logs: ${s.message}`,console.error("Error loading logs:",s)}finally{r.value=!1}}),(s,m)=>(t(),o("div",u,[e(r)?(t(),o("div",p,"Loading logs...")):e(a)?(t(),o("div",f,d(e(a)),1)):(t(),o("div",{key:2,innerHTML:e(l),class:"logs-content"},null,8,v))]))}},w=i(h,[["__scopeId","data-v-12810711"]]);export{w as default};
