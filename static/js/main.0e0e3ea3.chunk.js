(this.webpackJsonpscheduling_visual_app=this.webpackJsonpscheduling_visual_app||[]).push([[0],{34:function(e,r,t){e.exports=t(53)},39:function(e,r,t){},40:function(e,r,t){},41:function(e,r,t){},51:function(e,r,t){},52:function(e,r,t){},53:function(e,r,t){"use strict";t.r(r);var a=t(0),i=t.n(a),n=t(20),l=t.n(n),o=(t(39),t(32)),s=t(2);t(40);var c=function(e){var r=e.processes,t=e.onClick;return i.a.createElement("div",{className:"ProcessTable"},r.map((function(e){return i.a.createElement("div",{onClick:function(){return t(e)},key:e.id,className:"ProcessTable-Item box"},i.a.createElement("div",{className:"color",style:{backgroundColor:e.color}}),i.a.createElement("div",null,i.a.createElement("i",null,"Process:"),e.id),i.a.createElement("div",null,i.a.createElement("i",null,"ArrivalTime:"),e.arrivalTime),i.a.createElement("div",null,i.a.createElement("i",null,"ServiceTime:"),e.serviceTime),i.a.createElement("div",null,i.a.createElement("i",null,"Priority:"),e.priority))})))},u=t(31);t(41);var m=function(e){var r=e.process,t=e.onSave,n=e.onCancel,l=Object(a.useState)({}),o=Object(s.a)(l,2),c=o[0],m=o[1],v=Object(a.useState)(r.id),d=Object(s.a)(v,2),T=d[0],p=d[1],f=Object(a.useState)(r.id),h=Object(s.a)(f,2),g=h[0],E=(h[1],Object(a.useState)(r.arrivalTime)),b=Object(s.a)(E,2),_=b[0],O=b[1],S=Object(a.useState)(r.serviceTime),j=Object(s.a)(S,2),y=j[0],P=j[1],C=Object(a.useState)(r.priority),N=Object(s.a)(C,2),R=N[0],D=N[1];return i.a.createElement("div",{className:"ProcessDialog",onClick:n},i.a.createElement("div",{className:"ProcessDialog-dialog",onClick:function(e){return e.stopPropagation()}},i.a.createElement("div",{className:"ProcessDialog-input"},i.a.createElement("label",null,"Color"),i.a.createElement("span",null,i.a.createElement(u.a,{initialHexColor:r.color,onChange:m,placement:"right"}))),i.a.createElement("div",{className:"ProcessDialog-input"},i.a.createElement("label",null,"Process"),i.a.createElement("input",{value:T,onChange:function(e){return p(e.target.value)}})),i.a.createElement("div",{className:"ProcessDialog-input"},i.a.createElement("label",null,"ArrivalTime"),i.a.createElement("input",{value:_,onChange:function(e){return O(e.target.value)}})),i.a.createElement("div",{className:"ProcessDialog-input"},i.a.createElement("label",null,"ServiceTime"),i.a.createElement("input",{value:y,onChange:function(e){return P(e.target.value)}})),i.a.createElement("div",{className:"ProcessDialog-input"},i.a.createElement("label",null,"Priority"),i.a.createElement("input",{value:R,onChange:function(e){return D(e.target.value)}})),i.a.createElement("button",{className:"ProcessDialog-saveBtn",onClick:function(){t({oid:g,id:T,color:c.hex,arrivalTime:parseInt(_),serviceTime:parseInt(y),priority:parseInt(R)})}},"Save")))},v=t(4),d=t(28),T=t(33),p=t(30),f=(t(50),new Date(0).getTime());function h(e,r,t){return t.indexOf(e)===r}var g=function(e){return e.map((function(e){var r=Object(p.a)(e),t=r[0],a=r[1],i=r[2],n=r.slice(3);return[t,new Date(f+1e3*a),new Date(f+1e3*i)].concat(Object(v.a)(n))}))},E=function(e){return function(r,t){return e.filter((function(e){return e.arrivalTime>r&&e.arrivalTime<=t||r===t&&e.arrivalTime===r}))}},b=function(e){return Object(v.a)(e).sort((function(e,r){return e.serviceTime-r.serviceTime}))[0]},_={fcfs:function(e){var r={totalTurnaroundTime:0,totalResponseTime:0,averageTurnaroundTime:0,averageResponseTime:0},t=[],a=[];return(e=e.sort((function(e,r){return e.arrivalTime-r.arrivalTime}))).forEach((function(e){var i=t.length?t[t.length-1]:null,n=i?i[2]:-1,l=e.arrivalTime>n?e.arrivalTime:n,o=l+e.serviceTime,s=o-e.arrivalTime;r.totalTurnaroundTime+=o-l,r.totalResponseTime+=s,a.push(e.color),t.push([e.id,e.arrivalTime,e.arrivalTime]),t.push([e.id,l,o])})),r.averageTurnaroundTime=r.totalTurnaroundTime/e.length,r.averageResponseTime=r.totalResponseTime/e.length,{scheduledProcesses:g(t),colors:a,stats:r}},spn:function(e){var r={totalTurnaroundTime:0,totalResponseTime:0,averageTurnaroundTime:0,averageResponseTime:0},t=[],a=[];e=e.sort((function(e,r){return e.arrivalTime-r.arrivalTime}));var i=E(e),n=e[0].arrivalTime,l=i(n,n);e.forEach((function(e){a.push(e.color),t.push([e.id,e.arrivalTime,e.arrivalTime])}));for(var o=function(){var e,a=void 0;1===l.length?a=l.pop():(a=b(l),l=l.filter((function(e){return e.id!==a.id})));var o=n,s=o+a.serviceTime,c=s-a.arrivalTime;r.totalTurnaroundTime+=s-o,r.totalResponseTime+=c,t.push([a.id,o,s]),n=s,(e=l).push.apply(e,Object(v.a)(i(o,s)))};l.length;)o();return r.averageTurnaroundTime=r.totalTurnaroundTime/e.length,r.averageResponseTime=r.totalResponseTime/e.length,{scheduledProcesses:g(t),colors:a,stats:r}},srt:function(e){var r=[],t=[];(e=e.sort((function(e,r){return e.arrivalTime-r.arrivalTime}))).forEach((function(e){r.push(e.color),t.push([e.id,e.arrivalTime,e.arrivalTime])}));for(var a={},i={},n=E(e),l=e.map((function(e){return e.arrivalTime})).filter(h).reverse(),o=l.pop(),s=[],c=null,u=function(){var e;0==l.length&&l.push(o+1),(e=s).push.apply(e,Object(v.a)(n(o,o)));var r=c?c.serviceTime-(o-c._startTime):null,u=b(s),m=c&&u&&u.serviceTime<r;if(!c&&u)return s=s.filter((function(e){return e.id!==u.id})),(c=u)._startTime=o,c._endTime=o+c.serviceTime,l.push(c._endTime),void 0===a[c.id]&&(a[c.id]=c._startTime),l=l.filter(h).sort().reverse(),o=l.pop(),"continue";if(c&&c._endTime<=o&&!u)return t.push([c.id,c._startTime,c._endTime]),i[c.id]=c._endTime,c=null,o=l.pop(),"continue";if(c&&c._endTime<=o&&u)return t.push([c.id,c._startTime,c._endTime]),i[c.id]=c._endTime,s=s.filter((function(e){return e.id!==u.id})),(c=u)._startTime=o,c._endTime=o+c.serviceTime,void 0===a[c.id]&&(a[c.id]=c._startTime),l.push(c._endTime),l=l.filter(h).sort().reverse(),o=l.pop(),"continue";if(m){s=s.filter((function(e){return e.id!==u.id})),t.push([c.id,c._startTime,o]);var d=c.serviceTime-(o-c._startTime);return s.push(Object(T.a)({},c,{_startTime:null,_endTime:null,serviceTime:d})),(c=u)._startTime=o,c._endTime=o+c.serviceTime,void 0===a[c.id]&&(a[c.id]=c._startTime),l.push(c._endTime),l=l.filter(h).sort().reverse(),o=l.pop(),"continue"}o=l.pop()};l.length||s.length||c;)u();var m={totalTurnaroundTime:0,totalResponseTime:0,averageTurnaroundTime:0,averageResponseTime:0};return e.forEach((function(e){m.totalTurnaroundTime+=i[e.id]-a[e.id],m.totalResponseTime+=i[e.id]-e.arrivalTime})),m.averageTurnaroundTime=m.totalTurnaroundTime/e.length,m.averageResponseTime=m.totalResponseTime/e.length,{scheduledProcesses:g(t),colors:r,stats:m}}};t(51);var O=function(e){var r=e.processes,t=e.type,a=e.headline,n=(0,_[t])(r),l=n.scheduledProcesses,o=n.colors,s=n.stats;return i.a.createElement("div",{className:"SchedulingSection box"},i.a.createElement(d.a,{width:"100%",height:"400px",chartType:"Timeline",loader:i.a.createElement("div",null,"Loading Chart ..."),data:[[{type:"string",id:"ProcessId"},{type:"date",id:"Start"},{type:"date",id:"End"}]].concat(Object(v.a)(l||[])),options:{colors:o,avoidOverlappingGridLines:!0}}),i.a.createElement("div",{className:"SchedulingSection-stats"},i.a.createElement("h2",null,a),i.a.createElement("div",null,"Average Turnaround-Time: ",i.a.createElement("b",null,s.averageTurnaroundTime)),i.a.createElement("div",null,"Average Response-Time: ",i.a.createElement("b",null,s.averageResponseTime))))},S=(t(52),[{id:"A",arrivalTime:0,serviceTime:7,priority:2,color:"#4285f4"},{id:"B",arrivalTime:3,serviceTime:3,priority:1,color:"#db4437"},{id:"C",arrivalTime:4,serviceTime:2,priority:3,color:"#f4b400"},{id:"D",arrivalTime:6,serviceTime:5,priority:2,color:"#0f9d58"},{id:"E",arrivalTime:8,serviceTime:2,priority:3,color:"#ab47bc"}]);var j=function(){var e=Object(a.useState)(S),r=Object(s.a)(e,2),t=r[0],n=r[1],l=Object(a.useState)(null),u=Object(s.a)(l,2),v=u[0],d=u[1];return i.a.createElement("div",{className:"App"},i.a.createElement("div",{className:"App-section"},i.a.createElement("h2",null,"Processes:"),i.a.createElement(c,{processes:t,onClick:d})),i.a.createElement("div",{className:"App-section"},i.a.createElement("h2",null,"Simulations"),i.a.createElement(O,{headline:"First Come First Served (FCFS)",processes:t,type:"fcfs"}),i.a.createElement(O,{headline:"Shortest Process Next (SPN)",processes:t,type:"spn"}),i.a.createElement(O,{headline:"Shortest Remaining Time Next (SRT)",processes:t,type:"srt"})),v&&i.a.createElement(m,{process:v,onSave:function(e){var r=e.oid,t=Object(o.a)(e,["oid"]);n((function(e){return e.map((function(e){return e.id===r?t:e}))})),d(null)},onCancel:function(){return d(null)}}))};l.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(j,null)),document.getElementById("root"))}},[[34,1,2]]]);
//# sourceMappingURL=main.0e0e3ea3.chunk.js.map