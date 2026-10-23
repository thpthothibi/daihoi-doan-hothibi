/**
 * Minified by jsDelivr using Terser v5.37.0.
 * Original file: /npm/qrcode-generator@1.4.4/qrcode.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var qrcode=function(){var t=function(t,r){var e=t,n=g[r],o=null,i=0,a=null,u=[],f={},c=function(t,r){o=function(t){for(var r=new Array(t),e=0;e<t;e+=1){r[e]=new Array(t);for(var n=0;n<t;n+=1)r[e][n]=null}return r}(i=4*e+17),l(0,0),l(i-7,0),l(0,i-7),s(),h(),d(t,r),e>=7&&v(t),null==a&&(a=p(e,n,u)),w(a,r)},l=function(t,r){for(var e=-1;e<=7;e+=1)if(!(t+e<=-1||i<=t+e))for(var n=-1;n<=7;n+=1)r+n<=-1||i<=r+n||(o[t+e][r+n]=0<=e&&e<=6&&(0==n||6==n)||0<=n&&n<=6&&(0==e||6==e)||2<=e&&e<=4&&2<=n&&n<=4)},h=function(){for(var t=8;t<i-8;t+=1)null==o[t][6]&&(o[t][6]=t%2==0);for(var r=8;r<i-8;r+=1)null==o[6][r]&&(o[6][r]=r%2==0)},s=function(){for(var t=B.getPatternPosition(e),r=0;r<t.length;r+=1)for(var n=0;n<t.length;n+=1){var i=t[r],a=t[n];if(null==o[i][a])for(var u=-2;u<=2;u+=1)for(var f=-2;f<=2;f+=1)o[i+u][a+f]=-2==u||2==u||-2==f||2==f||0==u&&0==f}},v=function(t){for(var r=B.getBCHTypeNumber(e),n=0;n<18;n+=1){var a=!t&&1==(r>>n&1);o[Math.floor(n/3)][n%3+i-8-3]=a}for(n=0;n<18;n+=1){a=!t&&1==(r>>n&1);o[n%3+i-8-3][Math.floor(n/3)]=a}},d=function(t,r){for(var e=n<<3|r,a=B.getBCHTypeInfo(e),u=0;u<15;u+=1){var f=!t&&1==(a>>u&1);u<6?o[u][8]=f:u<8?o[u+1][8]=f:o[i-15+u][8]=f}for(u=0;u<15;u+=1){f=!t&&1==(a>>u&1);u<8?o[8][i-u-1]=f:u<9?o[8][15-u-1+1]=f:o[8][15-u-1]=f}o[i-8][8]=!t},w=function(t,r){for(var e=-1,n=i-1,a=7,u=0,f=B.getMaskFunction(r),c=i-1;c>0;c-=2)for(6==c&&(c-=1);;){for(var g=0;g<2;g+=1)if(null==o[n][c-g]){var l=!1;u<t.length&&(l=1==(t[u]>>>a&1)),f(n,c-g)&&(l=!l),o[n][c-g]=l,-1==(a-=1)&&(u+=1,a=7)}if((n+=e)<0||i<=n){n-=e,e=-e;break}}},p=function(t,r,e){for(var n=A.getRSBlocks(t,r),o=b(),i=0;i<e.length;i+=1){var a=e[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var u=0;for(i=0;i<n.length;i+=1)u+=n[i].dataCount;if(o.getLengthInBits()>8*u)throw"code length overflow. ("+o.getLengthInBits()+">"+8*u+")";for(o.getLengthInBits()+4<=8*u&&o.put(0,4);o.getLengthInBits()%8!=0;)o.putBit(!1);for(;!(o.getLengthInBits()>=8*u||(o.put(236,8),o.getLengthInBits()>=8*u));)o.put(17,8);return function(t,r){for(var e=0,n=0,o=0,i=new Array(r.length),a=new Array(r.length),u=0;u<r.length;u+=1){var f=r[u].dataCount,c=r[u].totalCount-f;n=Math.max(n,f),o=Math.max(o,c),i[u]=new Array(f);for(var g=0;g<i[u].length;g+=1)i[u][g]=255&t.getBuffer()[g+e];e+=f;var l=B.getErrorCorrectPolynomial(c),h=k(i[u],l.getLength()-1).mod(l);for(a[u]=new Array(l.getLength()-1),g=0;g<a[u].length;g+=1){var s=g+h.getLength()-a[u].length;a[u][g]=s>=0?h.getAt(s):0}}var v=0;for(g=0;g<r.length;g+=1)v+=r[g].totalCount;var d=new Array(v),w=0;for(g=0;g<n;g+=1)for(u=0;u<r.length;u+=1)g<i[u].length&&(d[w]=i[u][g],w+=1);for(g=0;g<o;g+=1)for(u=0;u<r.length;u+=1)g<a[u].length&&(d[w]=a[u][g],w+=1);return d}(o,n)};f.addData=function(t,r){var e=null;switch(r=r||"Byte"){case"Numeric":e=M(t);break;case"Alphanumeric":e=x(t);break;case"Byte":e=m(t);break;case"Kanji":e=L(t);break;default:throw"mode:"+r}u.push(e),a=null},f.isDark=function(t,r){if(t<0||i<=t||r<0||i<=r)throw t+","+r;return o[t][r]},f.getModuleCount=function(){return i},f.make=function(){if(e<1){for(var t=1;t<40;t++){for(var r=A.getRSBlocks(t,n),o=b(),i=0;i<u.length;i++){var a=u[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var g=0;for(i=0;i<r.length;i++)g+=r[i].dataCount;if(o.getLengthInBits()<=8*g)break}e=t}c(!1,function(){for(var t=0,r=0,e=0;e<8;e+=1){c(!0,e);var n=B.getLostPoint(f);(0==e||t>n)&&(t=n,r=e)}return r}())},f.createTableTag=function(t,r){t=t||2;var e="";e+='<table style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: "+(r=void 0===r?4*t:r)+"px;",e+='">',e+="<tbody>";for(var n=0;n<f.getModuleCount();n+=1){e+="<tr>";for(var o=0;o<f.getModuleCount();o+=1)e+='<td style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: 0px;",e+=" width: "+t+"px;",e+=" height: "+t+"px;",e+=" background-color: ",e+=f.isDark(n,o)?"#000000":"#ffffff",e+=";",e+='"/>';e+="</tr>"}return e+="</tbody>",e+="</table>"},f.createSvgTag=function(t,r,e,n){var o={};"object"==typeof arguments[0]&&(t=(o=arguments[0]).cellSize,r=o.margin,e=o.alt,n=o.title),t=t||2,r=void 0===r?4*t:r,(e="string"==typeof e?{text:e}:e||{}).text=e.text||null,e.id=e.text?e.id||"qrcode-description":null,(n="string"==typeof n?{text:n}:n||{}).text=n.text||null,n.id=n.text?n.id||"qrcode-title":null;var i,a,u,c,g=f.getModuleCount()*t+2*r,l="";for(c="l"+t+",0 0,"+t+" -"+t+",0 0,-"+t+"z ",l+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',l+=o.scalable?"":' width="'+g+'px" height="'+g+'px"',l+=' viewBox="0 0 '+g+" "+g+'" ',l+=' preserveAspectRatio="xMinYMin meet"',l+=n.text||e.text?' role="img" aria-labelledby="'+y([n.id,e.id].join(" ").trim())+'"':"",l+=">",l+=n.text?'<title id="'+y(n.id)+'">'+y(n.text)+"</title>":"",l+=e.text?'<description id="'+y(e.id)+'">'+y(e.text)+"</description>":"",l+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',l+='<path d="',a=0;a<f.getModuleCount();a+=1)for(u=a*t+r,i=0;i<f.getModuleCount();i+=1)f.isDark(a,i)&&(l+="M"+(i*t+r)+","+u+c);return l+='" stroke="transparent" fill="black"/>',l+="</svg>"},f.createDataURL=function(t,r){t=t||2,r=void 0===r?4*t:r;var e=f.getModuleCount()*t+2*r,n=r,o=e-r;return I(e,e,(function(r,e){if(n<=r&&r<o&&n<=e&&e<o){var i=Math.floor((r-n)/t),a=Math.floor((e-n)/t);return f.isDark(a,i)?0:1}return 1}))},f.createImgTag=function(t,r,e){t=t||2,r=void 0===r?4*t:r;var n=f.getModuleCount()*t+2*r,o="";return o+="<img",o+=' src="',o+=f.createDataURL(t,r),o+='"',o+=' width="',o+=n,o+='"',o+=' height="',o+=n,o+='"',e&&(o+=' alt="',o+=y(e),o+='"'),o+="/>"};var y=function(t){for(var r="",e=0;e<t.length;e+=1){var n=t.charAt(e);switch(n){case"<":r+="&lt;";break;case">":r+="&gt;";break;case"&":r+="&amp;";break;case'"':r+="&quot;";break;default:r+=n}}return r};return f.createASCII=function(t,r){if((t=t||1)<2)return function(t){t=void 0===t?2:t;var r,e,n,o,i,a=1*f.getModuleCount()+2*t,u=t,c=a-t,g={"██":"█","█ ":"▀"," █":"▄","  ":" "},l={"██":"▀","█ ":"▀"," █":" ","  ":" "},h="";for(r=0;r<a;r+=2){for(n=Math.floor((r-u)/1),o=Math.floor((r+1-u)/1),e=0;e<a;e+=1)i="█",u<=e&&e<c&&u<=r&&r<c&&f.isDark(n,Math.floor((e-u)/1))&&(i=" "),u<=e&&e<c&&u<=r+1&&r+1<c&&f.isDark(o,Math.floor((e-u)/1))?i+=" ":i+="█",h+=t<1&&r+1>=c?l[i]:g[i];h+="\n"}return a%2&&t>0?h.substring(0,h.length-a-1)+Array(a+1).join("▀"):h.substring(0,h.length-1)}(r);t-=1,r=void 0===r?2*t:r;var e,n,o,i,a=f.getModuleCount()*t+2*r,u=r,c=a-r,g=Array(t+1).join("██"),l=Array(t+1).join("  "),h="",s="";for(e=0;e<a;e+=1){for(o=Math.floor((e-u)/t),s="",n=0;n<a;n+=1)i=1,u<=n&&n<c&&u<=e&&e<c&&f.isDark(o,Math.floor((n-u)/t))&&(i=0),s+=i?g:l;for(o=0;o<t;o+=1)h+=s+"\n"}return h.substring(0,h.length-1)},f.renderTo2dContext=function(t,r){r=r||2;for(var e=f.getModuleCount(),n=0;n<e;n++)for(var o=0;o<e;o++)t.fillStyle=f.isDark(n,o)?"black":"white",t.fillRect(n*r,o*r,r,r)},f};t.stringToBytes=(t.stringToBytesFuncs={default:function(t){for(var r=[],e=0;e<t.length;e+=1){var n=t.charCodeAt(e);r.push(255&n)}return r}}).default,t.createStringToBytes=function(t,r){var e=function(){for(var e=S(t),n=function(){var t=e.read();if(-1==t)throw"eof";return t},o=0,i={};;){var a=e.read();if(-1==a)break;var u=n(),f=n()<<8|n();i[String.fromCharCode(a<<8|u)]=f,o+=1}if(o!=r)throw o+" != "+r;return i}(),n="?".charCodeAt(0);return function(t){for(var r=[],o=0;o<t.length;o+=1){var i=t.charCodeAt(o);if(i<128)r.push(i);else{var a=e[t.charAt(o)];"number"==typeof a?(255&a)==a?r.push(a):(r.push(a>>>8),r.push(255&a)):r.push(n)}}return r}};var r,e,n,o,i,a=1,u=2,f=4,c=8,g={L:1,M:0,Q:3,H:2},l=0,h=1,s=2,v=3,d=4,w=5,p=6,y=7,B=(r=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],e=1335,n=7973,i=function(t){for(var r=0;0!=t;)r+=1,t>>>=1;return r},(o={}).getBCHTypeInfo=function(t){for(var r=t<<10;i(r)-i(e)>=0;)r^=e<<i(r)-i(e);return 21522^(t<<10|r)},o.getBCHTypeNumber=function(t){for(var r=t<<12;i(r)-i(n)>=0;)r^=n<<i(r)-i(n);return t<<12|r},o.getPatternPosition=function(t){return r[t-1]},o.getMaskFunction=function(t){switch(t){case l:return function(t,r){return(t+r)%2==0};case h:return function(t,r){return t%2==0};case s:return function(t,r){return r%3==0};case v:return function(t,r){return(t+r)%3==0};case d:return function(t,r){return(Math.floor(t/2)+Math.floor(r/3))%2==0};case w:return function(t,r){return t*r%2+t*r%3==0};case p:return function(t,r){return(t*r%2+t*r%3)%2==0};case y:return function(t,r){return(t*r%3+(t+r)%2)%2==0};default:throw"bad maskPattern:"+t}},o.getErrorCorrectPolynomial=function(t){for(var r=k([1],0),e=0;e<t;e+=1)r=r.multiply(k([1,C.gexp(e)],0));return r},o.getLengthInBits=function(t,r){if(1<=r&&r<10)switch(t){case a:return 10;case u:return 9;case f:case c:return 8;default:throw"mode:"+t}else if(r<27)switch(t){case a:return 12;case u:return 11;case f:return 16;case c:return 10;default:throw"mode:"+t}else{if(!(r<41))throw"type:"+r;switch(t){case a:return 14;case u:return 13;case f:return 16;case c:return 12;default:throw"mode:"+t}}},o.getLostPoint=function(t){for(var r=t.getModuleCount(),e=0,n=0;n<r;n+=1)for(var o=0;o<r;o+=1){for(var i=0,a=t.isDark(n,o),u=-1;u<=1;u+=1)if(!(n+u<0||r<=n+u))for(var f=-1;f<=1;f+=1)o+f<0||r<=o+f||0==u&&0==f||a==t.isDark(n+u,o+f)&&(i+=1);i>5&&(e+=3+i-5)}for(n=0;n<r-1;n+=1)for(o=0;o<r-1;o+=1){var c=0;t.isDark(n,o)&&(c+=1),t.isDark(n+1,o)&&(c+=1),t.isDark(n,o+1)&&(c+=1),t.isDark(n+1,o+1)&&(c+=1),0!=c&&4!=c||(e+=3)}for(n=0;n<r;n+=1)for(o=0;o<r-6;o+=1)t.isDark(n,o)&&!t.isDark(n,o+1)&&t.isDark(n,o+2)&&t.isDark(n,o+3)&&t.isDark(n,o+4)&&!t.isDark(n,o+5)&&t.isDark(n,o+6)&&(e+=40);for(o=0;o<r;o+=1)for(n=0;n<r-6;n+=1)t.isDark(n,o)&&!t.isDark(n+1,o)&&t.isDark(n+2,o)&&t.isDark(n+3,o)&&t.isDark(n+4,o)&&!t.isDark(n+5,o)&&t.isDark(n+6,o)&&(e+=40);var g=0;for(o=0;o<r;o+=1)for(n=0;n<r;n+=1)t.isDark(n,o)&&(g+=1);return e+=Math.abs(100*g/r/r-50)/5*10},o),C=function(){for(var t=new Array(256),r=new Array(256),e=0;e<8;e+=1)t[e]=1<<e;for(e=8;e<256;e+=1)t[e]=t[e-4]^t[e-5]^t[e-6]^t[e-8];for(e=0;e<255;e+=1)r[t[e]]=e;var n={glog:function(t){if(t<1)throw"glog("+t+")";return r[t]},gexp:function(r){for(;r<0;)r+=255;for(;r>=256;)r-=255;return t[r]}};return n}();function k(t,r){if(void 0===t.length)throw t.length+"/"+r;var e=function(){for(var e=0;e<t.length&&0==t[e];)e+=1;for(var n=new Array(t.length-e+r),o=0;o<t.length-e;o+=1)n[o]=t[o+e];return n}(),n={getAt:function(t){return e[t]},getLength:function(){return e.length},multiply:function(t){for(var r=new Array(n.getLength()+t.getLength()-1),e=0;e<n.getLength();e+=1)for(var o=0;o<t.getLength();o+=1)r[e+o]^=C.gexp(C.glog(n.getAt(e))+C.glog(t.getAt(o)));return k(r,0)},mod:function(t){if(n.getLength()-t.getLength()<0)return n;for(var r=C.glog(n.getAt(0))-C.glog(t.getAt(0)),e=new Array(n.getLength()),o=0;o<n.getLength();o+=1)e[o]=n.getAt(o);for(o=0;o<t.getLength();o+=1)e[o]^=C.gexp(C.glog(t.getAt(o))+r);return k(e,0).mod(t)}};return n}var A=function(){var t=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],r=function(t,r){var e={};return e.totalCount=t,e.dataCount=r,e},e={};return e.getRSBlocks=function(e,n){var o=function(r,e){switch(e){case g.L:return t[4*(r-1)+0];case g.M:return t[4*(r-1)+1];case g.Q:return t[4*(r-1)+2];case g.H:return t[4*(r-1)+3];default:return}}(e,n);if(void 0===o)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+n;for(var i=o.length/3,a=[],u=0;u<i;u+=1)for(var f=o[3*u+0],c=o[3*u+1],l=o[3*u+2],h=0;h<f;h+=1)a.push(r(c,l));return a},e}(),b=function(){var t=[],r=0,e={getBuffer:function(){return t},getAt:function(r){var e=Math.floor(r/8);return 1==(t[e]>>>7-r%8&1)},put:function(t,r){for(var n=0;n<r;n+=1)e.putBit(1==(t>>>r-n-1&1))},getLengthInBits:function(){return r},putBit:function(e){var n=Math.floor(r/8);t.length<=n&&t.push(0),e&&(t[n]|=128>>>r%8),r+=1}};return e},M=function(t){var r=a,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+2<r.length;)t.put(o(r.substring(n,n+3)),10),n+=3;n<r.length&&(r.length-n==1?t.put(o(r.substring(n,n+1)),4):r.length-n==2&&t.put(o(r.substring(n,n+2)),7))}},o=function(t){for(var r=0,e=0;e<t.length;e+=1)r=10*r+i(t.charAt(e));return r},i=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);throw"illegal char :"+t};return n},x=function(t){var r=u,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+1<r.length;)t.put(45*o(r.charAt(n))+o(r.charAt(n+1)),11),n+=2;n<r.length&&t.put(o(r.charAt(n)),6)}},o=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);if("A"<=t&&t<="Z")return t.charCodeAt(0)-"A".charCodeAt(0)+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return n},m=function(r){var e=f,n=t.stringToBytes(r),o={getMode:function(){return e},getLength:function(t){return n.length},write:function(t){for(var r=0;r<n.length;r+=1)t.put(n[r],8)}};return o},L=function(r){var e=c,n=t.stringToBytesFuncs.SJIS;if(!n)throw"sjis not supported.";!function(){var t=n("友");if(2!=t.length||38726!=(t[0]<<8|t[1]))throw"sjis not supported."}();var o=n(r),i={getMode:function(){return e},getLength:function(t){return~~(o.length/2)},write:function(t){for(var r=o,e=0;e+1<r.length;){var n=(255&r[e])<<8|255&r[e+1];if(33088<=n&&n<=40956)n-=33088;else{if(!(57408<=n&&n<=60351))throw"illegal char at "+(e+1)+"/"+n;n-=49472}n=192*(n>>>8&255)+(255&n),t.put(n,13),e+=2}if(e<r.length)throw"illegal char at "+(e+1)}};return i},D=function(){var t=[],r={writeByte:function(r){t.push(255&r)},writeShort:function(t){r.writeByte(t),r.writeByte(t>>>8)},writeBytes:function(t,e,n){e=e||0,n=n||t.length;for(var o=0;o<n;o+=1)r.writeByte(t[o+e])},writeString:function(t){for(var e=0;e<t.length;e+=1)r.writeByte(t.charCodeAt(e))},toByteArray:function(){return t},toString:function(){var r="";r+="[";for(var e=0;e<t.length;e+=1)e>0&&(r+=","),r+=t[e];return r+="]"}};return r},S=function(t){var r=t,e=0,n=0,o=0,i={read:function(){for(;o<8;){if(e>=r.length){if(0==o)return-1;throw"unexpected end of file./"+o}var t=r.charAt(e);if(e+=1,"="==t)return o=0,-1;t.match(/^\s$/)||(n=n<<6|a(t.charCodeAt(0)),o+=6)}var i=n>>>o-8&255;return o-=8,i}},a=function(t){if(65<=t&&t<=90)return t-65;if(97<=t&&t<=122)return t-97+26;if(48<=t&&t<=57)return t-48+52;if(43==t)return 62;if(47==t)return 63;throw"c:"+t};return i},I=function(t,r,e){for(var n=function(t,r){var e=t,n=r,o=new Array(t*r),i={setPixel:function(t,r,n){o[r*e+t]=n},write:function(t){t.writeString("GIF87a"),t.writeShort(e),t.writeShort(n),t.writeByte(128),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(255),t.writeByte(255),t.writeByte(255),t.writeString(","),t.writeShort(0),t.writeShort(0),t.writeShort(e),t.writeShort(n),t.writeByte(0);var r=a(2);t.writeByte(2);for(var o=0;r.length-o>255;)t.writeByte(255),t.writeBytes(r,o,255),o+=255;t.writeByte(r.length-o),t.writeBytes(r,o,r.length-o),t.writeByte(0),t.writeString(";")}},a=function(t){for(var r=1<<t,e=1+(1<<t),n=t+1,i=u(),a=0;a<r;a+=1)i.add(String.fromCharCode(a));i.add(String.fromCharCode(r)),i.add(String.fromCharCode(e));var f,c,g,l=D(),h=(f=l,c=0,g=0,{write:function(t,r){if(t>>>r!=0)throw"length over";for(;c+r>=8;)f.writeByte(255&(t<<c|g)),r-=8-c,t>>>=8-c,g=0,c=0;g|=t<<c,c+=r},flush:function(){c>0&&f.writeByte(g)}});h.write(r,n);var s=0,v=String.fromCharCode(o[s]);for(s+=1;s<o.length;){var d=String.fromCharCode(o[s]);s+=1,i.contains(v+d)?v+=d:(h.write(i.indexOf(v),n),i.size()<4095&&(i.size()==1<<n&&(n+=1),i.add(v+d)),v=d)}return h.write(i.indexOf(v),n),h.write(e,n),h.flush(),l.toByteArray()},u=function(){var t={},r=0,e={add:function(n){if(e.contains(n))throw"dup key:"+n;t[n]=r,r+=1},size:function(){return r},indexOf:function(r){return t[r]},contains:function(r){return void 0!==t[r]}};return e};return i}(t,r),o=0;o<r;o+=1)for(var i=0;i<t;i+=1)n.setPixel(i,o,e(i,o));var a=D();n.write(a);for(var u=function(){var t=0,r=0,e=0,n="",o={},i=function(t){n+=String.fromCharCode(a(63&t))},a=function(t){if(t<0);else{if(t<26)return 65+t;if(t<52)return t-26+97;if(t<62)return t-52+48;if(62==t)return 43;if(63==t)return 47}throw"n:"+t};return o.writeByte=function(n){for(t=t<<8|255&n,r+=8,e+=1;r>=6;)i(t>>>r-6),r-=6},o.flush=function(){if(r>0&&(i(t<<6-r),t=0,r=0),e%3!=0)for(var o=3-e%3,a=0;a<o;a+=1)n+="="},o.toString=function(){return n},o}(),f=a.toByteArray(),c=0;c<f.length;c+=1)u.writeByte(f[c]);return u.flush(),"data:image/gif;base64,"+u};return t}();qrcode.stringToBytesFuncs["UTF-8"]=function(t){return function(t){for(var r=[],e=0;e<t.length;e++){var n=t.charCodeAt(e);n<128?r.push(n):n<2048?r.push(192|n>>6,128|63&n):n<55296||n>=57344?r.push(224|n>>12,128|n>>6&63,128|63&n):(e++,n=65536+((1023&n)<<10|1023&t.charCodeAt(e)),r.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n))}return r}(t)},function(t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports&&(module.exports=t())}((function(){return qrcode}));


    function normalizeGateQrUrl(value) {
      try {
        const fallback = /^https?:$/.test(location.protocol) ? location.href : "https://thpthothibi.github.io/daihoi-doan-hothibi/";
        const url = new URL((value || fallback).trim(), fallback);
        if (!/^https?:$/.test(url.protocol)) throw new Error("Invalid protocol");
        url.searchParams.set("gate", "checkin"); url.searchParams.delete("db"); url.hash = "";
        return url.href;
      } catch (_) { return "https://thpthothibi.github.io/daihoi-doan-hothibi/?gate=checkin"; }
    }
    function makeGateQr(url) {
      const qr = qrcode(0, "M"); qr.addData(url); qr.make(); return qr;
    }
    function renderGateQrImages(url) {
      const qr = makeGateQr(url);
      const data = qr.createDataURL(6, 24);
      ["gate-real-qr", "admin-real-qr"].forEach(id => {
        const img = document.getElementById(id); if (img) { img.src = data; img.dataset.url = url; }
      });
    }
    // =========================================================================
    // 1. INITIAL DATA
    // =========================================================================
    const INITIAL_BCH_CANDIDATES = [
      { id: 1, name: "Trần Ngọc Bảo Trân", unit: "Chi đoàn Giáo viên", role: "UV BCH nhiệm kỳ cũ" },
      { id: 2, name: "Nguyễn Minh Khôi", unit: "Chi đoàn 12A1", role: "Phó Bí thư nhiệm kỳ cũ" },
      { id: 3, name: "Lê Hoàng Gia Hân", unit: "Chi đoàn 12A2", role: "Ủy viên BTV" },
      { id: 4, name: "Phạm Quốc Anh", unit: "Chi đoàn 12A5", role: "Chủ nhiệm CLB Truyền thông" },
      { id: 5, name: "Võ Thị Thanh Thảo", unit: "Chi đoàn 11A1", role: "Bí thư Chi đoàn 11A1" },
      { id: 6, name: "Đặng Tuấn Kiệt", unit: "Chi đoàn 11A3", role: "Đội trưởng Đội Cờ Đỏ" },
      { id: 7, name: "Huỳnh Ngọc Phương Nghi", unit: "Chi đoàn 11A6", role: "CLB Văn nghệ Xung kích" },
      { id: 8, name: "Bùi Đức Duy", unit: "Chi đoàn 12A8", role: "Bí thư Chi đoàn 12A8" },
      { id: 9, name: "Ngô Bảo Ngọc", unit: "Chi đoàn 10A1", role: "Bí thư Chi đoàn 10A1" },
      { id: 10, name: "Trịnh Gia Bảo", unit: "Chi đoàn 10A4", role: "Đội trưởng Hoa Phượng Đỏ" },
      { id: 11, name: "Lý Mỹ Tâm", unit: "Chi đoàn 11A9", role: "Ủy viên BCH nhiệm kỳ cũ" },
      { id: 12, name: "Đỗ Hoàng Phúc", unit: "Chi đoàn Giáo viên", role: "Trợ lý Thanh niên" },
      { id: 13, name: "Phan Thanh Ngân", unit: "Chi đoàn 10A2", role: "Bí thư Chi đoàn 10A2" }
    ];

    const INITIAL_SECRETARY_CANDIDATES = [
      {
        id: 101,
        name: "Trần Ngọc Bảo Trân",
        unit: "Chi đoàn Giáo viên",
        bio: "Giáo viên trẻ tiêu biểu, UV BCH nhiệm kỳ cũ, dẫn dắt công tác Đoàn đạt cờ thi đua xuất sắc."
      },
      {
        id: 102,
        name: "Nguyễn Minh Khôi",
        unit: "Chi đoàn 12A1",
        bio: "Học sinh 3 Tốt cấp Thành phố, Phó Bí thư Đoàn trường phụ trách chuyển đổi số."
      }
    ];

    const INITIAL_DRIVE_DOCUMENTS = [
      {
        id: "doc-1",
        title: "1. Báo cáo tổng kết công tác Đoàn nhiệm kỳ 2025 - 2026",
        category: "BAO_CAO",
        driveFileId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
        driveUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
        updatedAt: "20/10/2026 09:15",
        size: "2.4 MB",
        summaryHtml: `<div class="space-y-2"><p class="font-bold text-slate-900">Kết quả công tác Đoàn nhiệm kỳ 2025 - 2026:</p><ul class="list-disc pl-5 space-y-1"><li>100% Chi đoàn (45/45 lớp) triển khai sinh hoạt chủ điểm chuyển đổi số.</li><li>Chiến dịch Hoa Phượng Đỏ, Chủ Nhật Xanh thu hút 1.450 lượt đoàn viên.</li><li>Kết nạp mới 320 đoàn viên ưu tú khối 10, 11, 12.</li></ul></div>`
      },
      {
        id: "doc-2",
        title: "2. Phương hướng, nhiệm vụ nhiệm kỳ 2026 - 2027",
        category: "BAO_CAO",
        driveFileId: "1htbPhuongHuong20262027DriveIdDemo",
        driveUrl: "https://drive.google.com/file/d/1htbPhuongHuong20262027DriveIdDemo/preview",
        updatedAt: "20/10/2026 09:16",
        size: "1.8 MB",
        summaryHtml: `<div class="space-y-2"><p class="font-bold text-slate-900">Chỉ tiêu trọng tâm nhiệm kỳ 2026 - 2027:</p><ul class="list-disc pl-5 space-y-1"><li>100% đoàn viên đăng ký chương trình Rèn luyện đoàn viên trực tuyến.</li><li>Phát triển ít nhất 400 đoàn viên mới; giới thiệu 15 đoàn viên ưu tú cho Đảng.</li><li>Trao tặng 30 suất học bổng "Thắp sáng ước mơ".</li></ul></div>`
      },
      {
        id: "doc-3",
        title: "3. Đề án nhân sự Ban Chấp hành (13 UV)",
        category: "NHAN_SU",
        driveFileId: "1htbDeAnNhanSu13ThanhVienDriveId",
        driveUrl: "https://drive.google.com/file/d/1htbDeAnNhanSu13ThanhVienDriveId/preview",
        updatedAt: "20/10/2026 09:17",
        size: "1.5 MB",
        summaryHtml: `<div class="space-y-2"><p class="font-bold text-slate-900">Đề án nhân sự Ban Chấp hành nhiệm kỳ 2026 - 2027:</p><p>Danh sách ứng cử gồm 13 đồng chí tiêu biểu đại diện Chi đoàn Giáo viên và các khối 10, 11, 12.</p></div>`
      },
      {
        id: "doc-4",
        title: "4. Đề án bầu trực tiếp chức danh Bí thư & Nội quy bầu cử",
        category: "QUY_CHE",
        driveFileId: "1htbDeAnBauBiThuTrucTiepDriveId",
        driveUrl: "https://drive.google.com/file/d/1htbDeAnBauBiThuTrucTiepDriveId/preview",
        updatedAt: "20/10/2026 09:18",
        size: "920 KB",
        summaryHtml: `<div class="space-y-2"><p class="font-bold text-slate-900">Nội quy & Quy chế bầu cử điện tử:</p><p>Mỗi đại biểu đăng nhập bằng mã QR định danh duy nhất (ĐB-001 đến ĐB-100) để bỏ phiếu bầu Ban Chấp hành và bầu trực tiếp Bí thư Đoàn trường.</p></div>`
      }
    ];

    // =========================================================================
    // 2. STATE MANAGEMENT (PERSISTENT SESSION FOR NETWORK DROP / RE-ENTRY)
    // =========================================================================
    const ADMIN_PASSWORD_DEFAULT = "";
    const BCH_ACCOUNT_PASSWORD_DEFAULT = "";

    const state = {
      userRole: "delegate", // "delegate" (3 tabs), "bch" (4 tabs incl. Kết quả & Xuất Excel), or "admin" (all 6 tabs)
      selectedLoginRole: "bch",
      sessionConfirmed: false, // false shows Check-in Gate first; true restores session immediately
      mainSection: "overview",
      votingTab: "bch",
      currentVoterIndex: 0,
      bchDraftSelectedIds: new Set(),
      biThuDraftSelectedIds: new Set(),
      biThuUnlockedSession: false,
      biThuSelectedCandidateId: 101,
      config: {
        adminPassword: ADMIN_PASSWORD_DEFAULT,
        bchAccountPassword: BCH_ACCOUNT_PASSWORD_DEFAULT,
        gateQrUrl: "https://thpthothibi.github.io/daihoi-doan-hothibi/?gate=checkin",
        gateQrLabel: "CỔNG ĐIỂM DANH",
        biThuPassword: "",
        biThuUnlockTime: "09:30",
        biThuGateMode: "OPEN",
        bchElectedQuota: 11,
        bchMaxSelectAllowed: 13,
        driveLoadMode: "CACHE",
        driveFolderId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
      },
      candidatesBch: [],
      candidatesBiThu: [],
      delegates: [],
      documents: JSON.parse(JSON.stringify(INITIAL_DRIVE_DOCUMENTS)),
      activeDocCategory: "ALL",
      activeDocumentId: "doc-1",
      docViewerMode: "fast",
      adminTableFilter: "ALL"
    };

    let bchChartInstance = null;





    function showToast(message, type = "info") {
      const container = document.getElementById("toast-container");
      if (!container) return;
      const colors = {
        success: "bg-emerald-600 text-white border-emerald-500",
        warning: "bg-amber-500 text-slate-950 border-amber-400",
        error: "bg-rose-600 text-white border-rose-500",
        info: "bg-slate-900 text-white border-slate-700"
      };
      const el = document.createElement("div");
      el.className = `pointer-events-auto px-4 py-2.5 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2 transition-all duration-300 ${colors[type] || colors.info}`;
      el.textContent = message;
      container.appendChild(el);
      setTimeout(() => {
        el.style.opacity = "0";
        setTimeout(() => el.remove(), 250);
      }, 2800);
    }

    // =========================================================================
    // 3. ROLE PERMISSIONS, BCH & ADMIN LOGIN (đã được thiết lập trên máy chủ), CHANGE PASS & NAV
    // =========================================================================
    function renderRolePermissions() {
      document.body.dataset.userRole = state.userRole;
      const isAdmin = state.userRole === "admin";
      const isBch = state.userRole === "bch";
      const isStaff = isAdmin || isBch;

      const drawerBchGroup = document.getElementById("drawer-bch-group");
      const drawerAdminGroup = document.getElementById("drawer-admin-group");
      const drawerDelegateCard = document.getElementById("drawer-delegate-card");
      const drawerAdminCard = document.getElementById("drawer-admin-card");
      const drawerAccountBadge = document.getElementById("drawer-account-badge");
      const drawerAccountTitle = document.getElementById("drawer-account-title");
      const drawerAccountDesc = document.getElementById("drawer-account-desc");

      const btnOpenQrLogin = document.getElementById("btn-open-qr-login");
      const btnHeaderChangePass = document.getElementById("btn-header-change-pass");
      const overviewDelegateCard = document.getElementById("overview-delegate-card");
      const overviewAdminBanner = document.getElementById("overview-admin-banner");
      const overviewRolePill = document.getElementById("overview-role-pill");
      const overviewBtnAdmin = document.getElementById("overview-btn-admin");
      const overviewBtnCloud = document.getElementById("overview-btn-cloud");

      const votingDelegateBar = document.getElementById("voting-delegate-bar");
      const votingAdminNotice = document.getElementById("voting-admin-notice");

      const headerRoleBadge = document.getElementById("header-role-badge");
      const headerRoleText = document.getElementById("header-role-text");
      const btnHeaderAdmin = document.getElementById("btn-header-admin");
      const btnDrawerAdmin = document.getElementById("drawer-btn-admin-login");

      if (isStaff) {
        // Hide individual delegate names for both BCH and Admin
        if (drawerBchGroup) drawerBchGroup.classList.remove("hidden");
        if (drawerAdminGroup) {
          if (isAdmin) drawerAdminGroup.classList.remove("hidden");
          else drawerAdminGroup.classList.add("hidden");
        }
        if (drawerDelegateCard) drawerDelegateCard.classList.add("hidden");
        if (drawerAdminCard) drawerAdminCard.classList.remove("hidden");
        if (btnOpenQrLogin) btnOpenQrLogin.classList.add("hidden");
        if (btnHeaderChangePass) {
          btnHeaderChangePass.classList.remove("hidden");
          btnHeaderChangePass.classList.add("flex");
        }
        if (overviewDelegateCard) overviewDelegateCard.classList.add("hidden");
        if (overviewAdminBanner) overviewAdminBanner.classList.remove("hidden");
        if (votingDelegateBar) votingDelegateBar.classList.add("hidden");
        if (votingAdminNotice) {
          if (isAdmin) votingAdminNotice.classList.remove("hidden");
          else votingAdminNotice.classList.add("hidden");
        }

        if (isAdmin) {
          if (headerRoleBadge) {
            headerRoleBadge.className = "text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-400 text-slate-950 inline-flex items-center gap-1";
          }
          if (headerRoleText) headerRoleText.textContent = "👑 Quản trị viên (Admin)";
          if (drawerAccountBadge) drawerAccountBadge.textContent = "👑 Tài khoản Quản trị (Admin)";
          if (drawerAccountTitle) drawerAccountTitle.textContent = "Ban Tổ Chức Đại Hội";
          if (drawerAccountDesc) drawerAccountDesc.textContent = "Toàn quyền điều hành & Điều hành máy chủ";
          if (overviewRolePill) overviewRolePill.textContent = "👑 Chế độ Quản trị viên (Admin)";
          if (overviewBtnAdmin) overviewBtnAdmin.classList.remove("hidden");
          if (overviewBtnCloud) overviewBtnCloud.classList.remove("hidden");
          if (btnHeaderAdmin) btnHeaderAdmin.classList.add("hidden");
          if (btnDrawerAdmin) btnDrawerAdmin.textContent = "⚙️ Trang Quản trị";
        } else {
          // Ban Chấp Hành (bch) role
          if (headerRoleBadge) {
            headerRoleBadge.className = "text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-400 text-slate-950 inline-flex items-center gap-1";
          }
          if (headerRoleText) headerRoleText.textContent = "🌟 Ban Chấp Hành";
          if (drawerAccountBadge) drawerAccountBadge.textContent = "🌟 Tài khoản Ban Chấp Hành";
          if (drawerAccountTitle) drawerAccountTitle.textContent = "BCH Đoàn Trường THPT Hồ Thị Bi";
          if (drawerAccountDesc) drawerAccountDesc.textContent = "Xem Kết quả & Xuất báo cáo Excel";
          if (overviewRolePill) overviewRolePill.textContent = "🌟 Tài khoản Ban Chấp Hành Đoàn Trường";
          if (overviewBtnAdmin) overviewBtnAdmin.classList.add("hidden");
          if (overviewBtnCloud) overviewBtnCloud.classList.add("hidden");
          if (btnHeaderAdmin) btnHeaderAdmin.classList.remove("hidden");
          if (btnDrawerAdmin) btnDrawerAdmin.textContent = "🔐 Đổi TK / Admin";
          if (["admin", "cloud"].includes(state.mainSection)) {
            state.mainSection = "excel";
          }
        }
      } else {
        // Delegate mode: strictly hide BCH & Admin tabs and show the current Delegate's personal identity
        if (drawerBchGroup) drawerBchGroup.classList.add("hidden");
        if (drawerAdminGroup) drawerAdminGroup.classList.add("hidden");
        if (drawerDelegateCard) drawerDelegateCard.classList.remove("hidden");
        if (drawerAdminCard) drawerAdminCard.classList.add("hidden");
        if (btnOpenQrLogin) btnOpenQrLogin.classList.remove("hidden");
        if (btnHeaderChangePass) {
          btnHeaderChangePass.classList.add("hidden");
          btnHeaderChangePass.classList.remove("flex");
        }
        if (overviewDelegateCard) overviewDelegateCard.classList.remove("hidden");
        if (overviewAdminBanner) overviewAdminBanner.classList.add("hidden");
        if (votingDelegateBar) votingDelegateBar.classList.remove("hidden");
        if (votingAdminNotice) votingAdminNotice.classList.add("hidden");

        if (headerRoleBadge) {
          headerRoleBadge.className = "text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/25 text-sky-100 border border-sky-300/30 inline-flex items-center gap-1";
        }
        if (headerRoleText) headerRoleText.textContent = "Đại biểu";
        if (btnHeaderAdmin) btnHeaderAdmin.classList.remove("hidden");
        if (btnDrawerAdmin) btnDrawerAdmin.textContent = "🔐 BCH / Quản trị";

        if (["admin", "excel", "cloud"].includes(state.mainSection)) {
          state.mainSection = "overview";
        }
      }
    }

    function selectLoginAccountType(roleType) {
      state.selectedLoginRole = roleType;
      const userEl = document.getElementById("admin-login-username");
      const btnBch = document.getElementById("btn-role-select-bch");
      const btnAdmin = document.getElementById("btn-role-select-admin");
      const hintBox = document.getElementById("login-role-hint-box");

      if (roleType === "bch") {
        if (userEl) userEl.value = "bch";
        if (btnBch) btnBch.className = "py-2 px-3 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold text-xs text-center transition";
        if (btnAdmin) btnAdmin.className = "py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold text-xs text-center transition";
        if (hintBox) {
          hintBox.className = "p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 leading-relaxed";
          hintBox.innerHTML = "<strong>Tài khoản Ban Chấp Hành (bch):</strong> Mở thêm tab <strong>Kết quả &amp; Xuất Excel — Đại hội BCH Đoàn trường THPT Hồ Thị Bi</strong> và có chức năng <strong>Đổi mật khẩu</strong>.";
        }
      } else {
        if (userEl) userEl.value = "admin";
        if (btnAdmin) btnAdmin.className = "py-2 px-3 rounded-xl border-2 border-amber-500 bg-amber-50 text-amber-950 font-extrabold text-xs text-center transition";
        if (btnBch) btnBch.className = "py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold text-xs text-center transition";
        if (hintBox) {
          hintBox.className = "p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950 leading-relaxed";
          hintBox.innerHTML = "<strong>Tài khoản Quản trị viên (admin):</strong> Mở toàn bộ 6 tab (Quản trị Drive, Import Excel đại biểu, Cài Mã QR Cổng Điểm Danh, Điều hành máy chủ, Kết quả &amp; Xuất Excel, Lưu trữ Cloud) và có chức năng <strong>Đổi mật khẩu</strong>.";
        }
      }
    }

    function openAdminLoginModal() {
      const passInput = document.getElementById("admin-login-password");
      if (passInput) passInput.value = "";
      selectLoginAccountType(state.selectedLoginRole || "bch");
      const modal = document.getElementById("modal-admin-login");
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      setTimeout(() => { if (passInput) passInput.focus(); }, 80);
    }

    function closeAdminLoginModal() {
      const modal = document.getElementById("modal-admin-login");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }



    function openChangePasswordModal() {
      if (state.userRole !== "admin" && state.userRole !== "bch") {
        openAdminLoginModal();
        return;
      }
      const roleSelect = document.getElementById("change-pass-target-role");
      if (roleSelect) {
        roleSelect.value = state.userRole === "bch" ? "bch" : "admin";
        // If logged in as BCH, only allow changing BCH password; Admin can change either
        roleSelect.disabled = (state.userRole === "bch");
      }
      document.getElementById("change-pass-old").value = "";
      document.getElementById("change-pass-new").value = "";
      document.getElementById("change-pass-confirm").value = "";
      const modal = document.getElementById("modal-change-password");
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      setTimeout(() => document.getElementById("change-pass-old")?.focus(), 80);
    }

    function closeChangePasswordModal() {
      const modal = document.getElementById("modal-change-password");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }





    function toggleMobileDrawer() {
      const drawer = document.getElementById("mobile-drawer");
      const overlay = document.getElementById("mobile-drawer-overlay");
      const isClosed = drawer.classList.contains("-translate-x-full");
      if (isClosed) {
        drawer.classList.remove("-translate-x-full");
        overlay.classList.remove("hidden");
      } else {
        closeMobileDrawer();
      }
    }

    function closeMobileDrawer() {
      const drawer = document.getElementById("mobile-drawer");
      const overlay = document.getElementById("mobile-drawer-overlay");
      if (drawer) drawer.classList.add("-translate-x-full");
      if (overlay) overlay.classList.add("hidden");
    }

    function switchMainSection(sectionName) {
      if (!state.sessionConfirmed) { openQrLoginModal(); return; }
      if (sectionName === "excel" && state.userRole !== "admin" && state.userRole !== "bch") {
        openAdminLoginModal();
        return;
      }
      if (["admin", "cloud"].includes(sectionName) && state.userRole !== "admin") {
        selectLoginAccountType("admin");
        openAdminLoginModal();
        return;
      }
      state.mainSection = sectionName;
      saveState();
      closeMobileDrawer();

      const allSections = ["overview", "documents", "voting", "admin", "excel", "cloud"];
      allSections.forEach(s => {
        const secEl = document.getElementById("section-" + s);
        if (secEl) {
          if (s === sectionName) secEl.classList.remove("hidden");
          else secEl.classList.add("hidden");
        }
        const drawerBtn = document.getElementById("drawer-btn-" + s);
        if (drawerBtn) {
          if (s === sectionName) {
            drawerBtn.className = "w-full px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition bg-sky-600 text-white shadow";
          } else {
            drawerBtn.className = "w-full px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-semibold flex items-center justify-between transition text-slate-200 hover:bg-slate-800";
          }
        }
      });



      if (sectionName === "overview") {
        renderVoterBar();
      } else if (sectionName === "documents") {
        if (docsCloud.apiBase && Date.now() - docsCloud.lastSync > 15000) refreshCloudDocuments(false).catch(() => {});
        renderDocumentsList();
        renderActiveDocumentViewer();
      } else if (sectionName === "voting") {
        renderVoterBar();
        renderBchVotingGrid();
        renderBiThuVotingSection();
      } else if (sectionName === "admin") {
        renderAdminDriveAndQrSection();
      } else if (sectionName === "excel") {
        renderExcelSection();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function scrollToAdminCard(cardId) {
      const el = document.getElementById(cardId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // =========================================================================
    // 4. CHECK-IN GATE (CỔNG ĐIỂM DANH NHƯ HÌNH) & HEADER BAR
    // =========================================================================




    function formatVietnamCheckinTime(value) {
      if (!value) return "Chưa có thời gian";
      const date = new Date(value);
      if (!Number.isFinite(date.getTime())) return "Chưa có thời gian";
      const parts = new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
      }).formatToParts(date);
      const part = type => parts.find(p => p.type === type).value;
      return `${part("hour")}:${part("minute")}:${part("second")} · ${part("day")}/${part("month")}/${part("year")}`;
    }

    function renderVoterBar() {
      const voter = getCurrentVoter();
      const checkedCount = state.delegates.filter(d => d.checkedIn).length;

      const topLabel = document.getElementById("current-voter-label");
      if (topLabel) topLabel.textContent = `${voter.code} • ${voter.name}`;

      const drawerName = document.getElementById("drawer-voter-name");
      if (drawerName) drawerName.textContent = `${voter.code} • ${voter.name}`;
      const drawerClass = document.getElementById("drawer-voter-class");
      if (drawerClass) drawerClass.textContent = `Chi đoàn ${voter.className}`;
      const drawerStat = document.getElementById("drawer-checkin-stat");
      if (drawerStat) drawerStat.textContent = `${checkedCount} / ${state.delegates.length} ĐB`;

      // Home overview card (distinct per delegate)
      const homeBadge = document.getElementById("home-voter-badge");
      if (homeBadge) homeBadge.textContent = voter.code;
      const homeName = document.getElementById("home-voter-name");
      if (homeName) homeName.textContent = `Đại biểu: ${voter.name}`;
      const homeClass = document.getElementById("home-voter-class");
      if (homeClass) homeClass.textContent = `Chi đoàn ${voter.className}`;
      const homeCheckinPill = document.getElementById("home-voter-checkin-pill");
      if (homeCheckinPill) {
        homeCheckinPill.textContent = voter.checkedIn
          ? `● Đã điểm danh · ${formatVietnamCheckinTime(voter.checkedInAt)}`
          : `○ Chưa điểm danh`;
      }
      const homeBchStatus = document.getElementById("home-voter-bch-status");
      if (homeBchStatus) {
        homeBchStatus.textContent = voter.votedBch
          ? `✓ Phiếu BCH: Máy chủ đã nhận`
          : "● Phiếu BCH: Chưa bầu";
        homeBchStatus.className = voter.votedBch ? "font-bold text-emerald-600" : "font-semibold text-amber-600";
      }
      const homeBiThuStatus = document.getElementById("home-voter-bithu-status");
      if (homeBiThuStatus) {
        homeBiThuStatus.textContent = voter.votedBiThu
          ? "✓ Phiếu Bí thư: Đã bầu"
          : "● Phiếu Bí thư: Chưa bầu";
        homeBiThuStatus.className = voter.votedBiThu ? "font-bold text-emerald-600" : "font-semibold text-amber-600";
      }
      const docCountEl = document.getElementById("stat-docs-count");
      if (docCountEl) docCountEl.textContent = String(state.documents.length);

      // Voting section bar
      const vCode = document.getElementById("voter-card-code");
      if (vCode) vCode.textContent = voter.code;
      const vName = document.getElementById("voter-card-name");
      if (vName) vName.textContent = voter.name;
      const vClass = document.getElementById("voter-card-class");
      if (vClass) vClass.textContent = voter.className;

      const bchStat = document.getElementById("voter-status-bch");
      if (bchStat) {
        bchStat.textContent = voter.votedBch ? `✓ BCH: Máy chủ đã nhận` : "● BCH: Chưa bầu";
        bchStat.className = voter.votedBch ? "font-bold text-emerald-600" : "font-semibold text-amber-600";
      }
      const biThuStat = document.getElementById("voter-status-bithu");
      if (biThuStat) {
        biThuStat.textContent = voter.votedBiThu ? "✓ Bí thư: Đã bầu" : "● Bí thư: Chưa bầu";
        biThuStat.className = voter.votedBiThu ? "font-bold text-emerald-600" : "font-semibold text-amber-600";
      }
    }



    function closeQrLoginModal() {
      if (!state.sessionConfirmed || (state.userRole === "delegate" && !state.delegates[state.currentVoterIndex]?.checkedIn)) {
        showToast("Vui lòng chọn lớp, họ tên và xác nhận điểm danh.", "warning");
        return;
      }
      const modal = document.getElementById("modal-qr-login");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }



    let gateQrZoomTrigger = null;
    function openGateQrZoom(trigger) {
      gateQrZoomTrigger = trigger || document.activeElement;
      const preview = document.getElementById("gate-real-qr");
      const url = preview?.dataset.url || normalizeGateQrUrl(state.config.gateQrUrl);
      document.getElementById("gate-qr-zoom-image").src = makeGateQr(url).createDataURL(12, 48);
      document.getElementById("gate-qr-zoom-url").textContent = url;
      const modal = document.getElementById("gate-qr-zoom");
      if (!modal.open) modal.showModal();
    }
    function closeGateQrZoom() {
      document.getElementById("gate-qr-zoom").close();
    }
    document.getElementById("gate-qr-zoom").addEventListener("close", () => {
      if (gateQrZoomTrigger?.isConnected) gateQrZoomTrigger.focus();
      gateQrZoomTrigger = null;
    });

    function syncGateQrUrlInput(newUrl) {
      const val = normalizeGateQrUrl(newUrl);
      renderGateQrImages(val);
      const gateBox = document.getElementById("gate-qr-url-box");
      if (gateBox) gateBox.textContent = val;
      const adminInput = document.getElementById("admin-qr-link-input");
      if (adminInput && adminInput.value !== val) adminInput.value = val;
    }

    function copyGitCommandsGuide() {
      const el = document.getElementById("git-commands-snippet");
      if (el) {
        copyTextFallback(el.textContent);
        showToast("Đã sao chép bộ lệnh Git để đẩy web lên GitHub!", "success");
      }
    }









    // =========================================================================
    // 5. DOCUMENTS SECTION
    // =========================================================================
    function filterDocuments(category) {
      state.activeDocCategory = category;
      document.querySelectorAll(".doc-cat-btn").forEach(btn => {
        if (btn.getAttribute("data-doc-cat") === category) {
          btn.className = "doc-cat-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white";
        } else {
          btn.className = "doc-cat-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200";
        }
      });
      renderDocumentsList();
    }

    function renderDocumentsList() {
      const container = document.getElementById("documents-list-container");
      if (!container) return;
      const filtered = state.documents.filter(doc =>
        state.activeDocCategory === "ALL" || doc.category === state.activeDocCategory
      );

      container.innerHTML = filtered.map(doc => {
        const isActive = doc.id === state.activeDocumentId;
        const catLabel = doc.category === "BAO_CAO" ? "Báo cáo" : (doc.category === "NHAN_SU" ? "Nhân sự" : "Nội quy");
        return `
          <div onclick="selectDocument('${doc.id}')" class="cursor-pointer p-3.5 rounded-xl border transition ${isActive ? 'border-blue-600 bg-blue-50/70 shadow-xs' : 'border-slate-200 bg-white hover:border-blue-300'}">
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}">${catLabel}</span>
              <span class="text-[11px] text-slate-400">${escapeDocText(doc.size) || '1.5 MB'}</span>
            </div>
            <h4 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug">${escapeDocText(doc.title)}</h4>
          </div>
        `;
      }).join("");
    }

    function selectDocument(docId) {
      state.activeDocumentId = docId;
      renderDocumentsList();
      renderActiveDocumentViewer();
    }

    function setDocViewerMode(mode) {
      state.docViewerMode = mode;
      const btnFast = document.getElementById("btn-viewer-mode-fast");
      const btnIframe = document.getElementById("btn-viewer-mode-iframe");
      if (mode === "fast") {
        btnFast.className = "px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white";
        btnIframe.className = "px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700";
      } else {
        btnIframe.className = "px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white";
        btnFast.className = "px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700";
      }
      renderActiveDocumentViewer();
    }

    function renderActiveDocumentViewer() {
      const doc = state.documents.find(d => d.id === state.activeDocumentId) || state.documents[0];
      if (!doc) {
        document.getElementById("viewer-doc-title").textContent = "Chưa có văn kiện";
        document.getElementById("viewer-fast-content").textContent = "Quản trị chưa công bố văn kiện trên máy chủ.";
        document.getElementById("drive-preview-iframe").src = "about:blank";
        document.getElementById("viewer-drive-external").href = "https://drive.google.com";
        return;
      }
      document.getElementById("viewer-doc-title").textContent = doc.title;
      document.getElementById("viewer-drive-external").href = `https://drive.google.com/file/d/${doc.driveFileId}/view`;

      const fastEl = document.getElementById("viewer-fast-content");
      const iframeBox = document.getElementById("viewer-iframe-container");
      const iframeEl = document.getElementById("drive-preview-iframe");

      if (state.docViewerMode === "fast") {
        fastEl.classList.remove("hidden");
        iframeBox.classList.add("hidden");
        fastEl.innerHTML = doc.summaryHtml;
      } else {
        fastEl.classList.add("hidden");
        iframeBox.classList.remove("hidden");
        if (state.mainSection === "documents" && iframeEl.src !== doc.driveUrl) iframeEl.src = doc.driveUrl;
      }
    }

    function openDriveConfigModal() {
      const modal = document.getElementById("modal-drive-config");
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }

    function closeDriveConfigModal() {
      const modal = document.getElementById("modal-drive-config");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }

    function extractGoogleDriveFileId(input) {
      const trimmed = (input || "").trim();
      const match = trimmed.match(/[-\w]{25,}/);
      return match ? match[0] : (trimmed || "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms");
    }


    // =========================================================================
    // 6. VOTING SECTION (TAB 1 BCH & TAB 2 BÍ THƯ)
    // =========================================================================
    function switchVotingTab(tabName) {
      state.votingTab = tabName;
      const btnBch = document.getElementById("subtab-btn-bch");
      const btnBiThu = document.getElementById("subtab-btn-bithu");
      const panelBch = document.getElementById("voting-panel-bch");
      const panelBiThu = document.getElementById("voting-panel-bithu");

      if (tabName === "bch") {
        panelBch.classList.remove("hidden");
        panelBiThu.classList.add("hidden");
        btnBch.className = "py-3.5 px-3 sm:px-5 text-center sm:text-left font-extrabold text-xs sm:text-sm flex items-center justify-center sm:justify-between border-b-3 border-sky-600 bg-white text-sky-900 transition";
        btnBiThu.className = "py-3.5 px-3 sm:px-5 text-center sm:text-left font-extrabold text-xs sm:text-sm flex items-center justify-center sm:justify-between border-b-3 border-transparent text-slate-600 hover:bg-slate-100 transition";
        renderBchVotingGrid();
      } else {
        panelBch.classList.add("hidden");
        panelBiThu.classList.remove("hidden");
        btnBiThu.className = "py-3.5 px-3 sm:px-5 text-center sm:text-left font-extrabold text-xs sm:text-sm flex items-center justify-center sm:justify-between border-b-3 border-amber-500 bg-white text-amber-950 transition";
        btnBch.className = "py-3.5 px-3 sm:px-5 text-center sm:text-left font-extrabold text-xs sm:text-sm flex items-center justify-center sm:justify-between border-b-3 border-transparent text-slate-600 hover:bg-slate-100 transition";
        renderBiThuVotingSection();
      }
    }





    function renderBchVotingGrid() {
      const grid = document.getElementById("bch-candidates-grid");
      if (!grid) return;
      const voter = getCurrentVoter();
      const selectedCount = state.bchDraftSelectedIds.size;
      const unselectedCount = state.candidatesBch.length - selectedCount;

      document.getElementById("count-bch-selected").textContent = String(selectedCount);
      document.getElementById("count-bch-unselected").textContent = String(unselectedCount);
      const badgeBch = document.getElementById("badge-subtab-bch");
      if (badgeBch) badgeBch.textContent = `Đang chọn: ${selectedCount}/${state.candidatesBch.length}`;

      document.getElementById("bch-footer-summary").textContent =
        `Tín nhiệm: ${selectedCount}/${state.candidatesBch.length} • Gạch tên: ${unselectedCount}`;

      const votedBanner = document.getElementById("bch-already-voted-banner");
      const submitBtn = document.getElementById("btn-submit-bch-ballot");
      if (voter.votedBch) {
        votedBanner.classList.remove("hidden");
        submitBtn.textContent = "✓ Đã Nộp Phiếu BCH";
      } else {
        votedBanner.classList.add("hidden");
        submitBtn.textContent = "✓ Nộp Phiếu Bầu BCH";
      }

      grid.innerHTML = state.candidatesBch.map((cand, idx) => {
        const isSelected = state.bchDraftSelectedIds.has(cand.id);
        return `
          <div onclick="toggleBchCandidate(${cand.id})" class="candidate-card cursor-pointer rounded-xl border-2 p-3 flex items-center justify-between gap-2.5 ${isSelected ? 'candidate-selected' : 'candidate-unselected'}">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-8 h-8 rounded-lg font-extrabold text-xs flex items-center justify-center shrink-0 ${isSelected ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-500'}">
                ${String(idx + 1).padStart(2, '0')}
              </div>
              <div class="min-w-0">
                <h4 class="text-xs sm:text-sm font-extrabold truncate ${isSelected ? 'text-slate-900' : 'strikethrough-name'}">
                  ${escapeDocText(cand.name)}
                </h4>
                <div class="text-[11px] text-slate-500 truncate">${escapeDocText(cand.unit)} • ${escapeDocText(cand.role)}</div>
              </div>
            </div>

            <div class="w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 ${isSelected ? 'bg-sky-600 border-sky-600 text-white' : 'bg-white border-slate-300 text-transparent'}">
              ✓
            </div>
          </div>
        `;
      }).join("");
    }



    function closeConfirmBchModal() {
      const modal = document.getElementById("modal-confirm-bch");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }



    // TAB 2: SECRETARY VOTING (DEFAULT SELECTED, CLICK TO UNSELECT / STRIKETHROUGH)
    function renderBiThuVotingSection() {
      const lockScreen = document.getElementById("bithu-lock-screen");
      const unlockedContent = document.getElementById("bithu-unlocked-content");
      const timeDisplay = document.getElementById("bithu-scheduled-time-display");
      const passHint = document.getElementById("bithu-demo-pass-hint");
      const badgeSubtab = document.getElementById("badge-subtab-bithu");

      if (passHint) passHint.textContent = state.config.biThuPassword;
      if (timeDisplay) {
        timeDisplay.textContent = state.config.biThuGateMode === "WAIT_TIME"
          ? `Chờ Ban tổ chức mở vòng trên máy chủ`
          : `Ban tổ chức đã mở vòng bầu cử`;
      }

      if (!state.biThuUnlockedSession) {
        lockScreen.classList.remove("hidden");
        unlockedContent.classList.add("hidden");
        if (badgeSubtab) badgeSubtab.textContent = "🔒 Khóa Pass";
        return;
      }

      lockScreen.classList.add("hidden");
      unlockedContent.classList.remove("hidden");

      const voter = getCurrentVoter();
      const totalCount = state.candidatesBiThu.length;
      // Keep only valid IDs in draft set
      const validIds = new Set(state.candidatesBiThu.map(c => c.id));
      state.biThuDraftSelectedIds.forEach(id => {
        if (!validIds.has(id)) state.biThuDraftSelectedIds.delete(id);
      });

      const selectedCount = state.biThuDraftSelectedIds.size;
      const unselectedCount = Math.max(0, totalCount - selectedCount);

      if (badgeSubtab) badgeSubtab.textContent = `Đang chọn: ${selectedCount}/${totalCount}`;
      const elSel = document.getElementById("count-bithu-selected");
      if (elSel) elSel.textContent = String(selectedCount);
      const elTot = document.getElementById("count-bithu-total");
      if (elTot) elTot.textContent = String(totalCount);
      const elUnsel = document.getElementById("count-bithu-unselected");
      if (elUnsel) elUnsel.textContent = String(unselectedCount);

      const votedBanner = document.getElementById("bithu-already-voted-banner");
      const submitBtn = document.getElementById("btn-submit-bithu-ballot");
      if (voter.votedBiThu) {
        if (votedBanner) votedBanner.classList.remove("hidden");
        if (submitBtn) submitBtn.textContent = "✓ Đã Nộp Phiếu Bí Thư";
      } else {
        if (votedBanner) votedBanner.classList.add("hidden");
        if (submitBtn) submitBtn.textContent = "✓ Gửi Phiếu Bầu Bí Thư";
      }

      const grid = document.getElementById("bithu-candidates-grid");
      grid.innerHTML = state.candidatesBiThu.map((cand, idx) => {
        const isSelected = state.biThuDraftSelectedIds.has(cand.id);
        return `
          <div onclick="selectBiThuCandidate(${cand.id})" class="candidate-card cursor-pointer rounded-xl border-2 p-4 transition flex items-start justify-between gap-3 ${isSelected ? 'candidate-selected' : 'candidate-unselected'}">
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isSelected ? 'bg-sky-600 text-white' : 'bg-rose-100 text-rose-700'}">
                  ${isSelected ? '✓ Đang chọn (Tín nhiệm)' : '✕ Đã bỏ chọn (Gạch tên)'}
                </span>
                <span class="text-[11px] font-bold text-slate-400">#0${idx + 1}</span>
              </div>
              <h4 class="text-sm sm:text-base font-extrabold mt-1.5 ${isSelected ? 'text-slate-900' : 'strikethrough-name'}">${escapeDocText(cand.name)}</h4>
              <div class="text-xs font-semibold text-sky-700 mt-0.5">${escapeDocText(cand.unit)}</div>
              <p class="text-xs text-slate-600 mt-1">${escapeDocText(cand.bio)}</p>
            </div>
            <div class="w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 mt-1 font-extrabold ${isSelected ? 'bg-sky-600 border-sky-600 text-white' : 'bg-white border-slate-300 text-transparent'}">
              ✓
            </div>
          </div>
        `;
      }).join("");

      const selectedNames = state.candidatesBiThu
        .filter(c => state.biThuDraftSelectedIds.has(c.id))
        .map(c => c.name);

      document.getElementById("bithu-footer-summary").textContent =
        voter.votedBiThu
          ? `✓ Đại biểu ${voter.code} đã nộp phiếu bầu Bí thư (${selectedCount}/${totalCount})`
          : (selectedNames.length > 0
              ? `Đang chọn (${selectedCount}/${totalCount}): ${selectedNames.join(", ")}`
              : `Đã gạch tên tất cả (${unselectedCount}/${totalCount}) — Bấm vào thẻ để chọn lại`);
    }





    function lockBiThuTabSession() {
      state.biThuUnlockedSession = false;
      saveState();
      renderBiThuVotingSection();
    }







    // =========================================================================
    // 7. SECTION 4: QUẢN TRỊ GOOGLE DRIVE, QR & CHỈNH DANH SÁCH BÍ THƯ
    // =========================================================================
    function renderAdminDriveAndQrSection() {
      // Update counts
      const pillBiThu = document.getElementById("admin-pill-bithu-count");
      if (pillBiThu) pillBiThu.textContent = String(state.candidatesBiThu.length);
      const cardBiThu = document.getElementById("admin-card-bithu-count");
      if (cardBiThu) cardBiThu.textContent = String(state.candidatesBiThu.length);

      const totalDocBadge = document.getElementById("admin-doc-total-badge");
      if (totalDocBadge) totalDocBadge.textContent = `Tổng: ${state.documents.length} văn kiện`;
      const sysDocCount = document.getElementById("sys-doc-count");
      if (sysDocCount) sysDocCount.textContent = `${state.documents.length} tài liệu`;

      // Render Received Documents Table matching screenshot
      const tbody = document.getElementById("admin-drive-docs-tbody");
      if (tbody) {
        tbody.innerHTML = state.documents.map((doc, idx) => {
          const catBadge = doc.category === "BAO_CAO"
            ? `<span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">Báo cáo</span>`
            : (doc.category === "NHAN_SU"
              ? `<span class="px-2 py-0.5 rounded bg-orange-50 text-orange-700 font-semibold">Nhân sự</span>`
              : `<span class="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold">Nội quy</span>`);
          return `
            <tr class="hover:bg-slate-50">
              <td class="py-2.5 px-2 font-semibold text-slate-500">${idx + 1}</td>
              <td class="py-2.5 px-2 font-bold text-slate-900">
                <div class="flex items-center gap-2">
                  <span class="px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-extrabold">PDF</span>
                  <span class="truncate max-w-[210px] sm:max-w-xs">${escapeDocText(doc.title)}</span>
                </div>
              </td>
              <td class="py-2.5 px-2">${catBadge}</td>
              <td class="py-2.5 px-2 text-slate-500">${escapeDocText(doc.updatedAt) || '20/10/2026 09:15'}</td>
              <td class="py-2.5 px-2 text-slate-500">${escapeDocText(doc.size) || '1.5 MB'}</td>
              <td class="py-2.5 px-2">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">${doc.cloudSynced ? "● Đã lưu máy chủ" : "○ Chỉ trên thiết bị"}</span>
              </td>
              <td class="py-2.5 px-2 text-right">
                <div class="inline-flex items-center gap-1">
                  <button onclick="selectDocument('${doc.id}'); switchMainSection('documents');" class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold">
                    👁 Xem
                  </button>
                  <button onclick="deleteDriveDocument('${doc.id}')" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 font-bold" title="Xóa">
                    🗑
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join("");
      }

      updateAdminQrCardPreview();

      const importCountBadge = document.getElementById("admin-import-delegate-count");
      if (importCountBadge) importCountBadge.textContent = `Hiện có: ${state.delegates.length} đại biểu`;

      const sysDelCount = document.getElementById("sys-delegate-count");
      if (sysDelCount) sysDelCount.textContent = `${state.delegates.filter(d => d.checkedIn).length}/${state.delegates.length} đại biểu`;

      // Sync BiThu pass inputs
      document.getElementById("admin-bithu-pass").value = state.config.biThuPassword;
      document.getElementById("admin-bithu-time").value = state.config.biThuUnlockTime;
      document.getElementById("admin-bithu-gate-mode").value = state.config.biThuGateMode;
    }

    function updateAdminQrCardPreview() {
      const totalDel = state.delegates.length;
      const checkedTotal = state.delegates.filter(x => x.checkedIn).length;
      const bchVoted = state.delegates.filter(x => x.votedBch).length;
      const biThuVoted = state.delegates.filter(x => x.votedBiThu).length;

      const boxCode = document.getElementById("admin-qr-box-code");
      if (boxCode) boxCode.textContent = `${checkedTotal}/${totalDel} ĐB`;

      const insideLabel = document.getElementById("admin-qr-inside-label");
      if (insideLabel) insideLabel.textContent = state.config.gateQrLabel || "CỔNG ĐIỂM DANH";

      const labelInput = document.getElementById("admin-qr-label-input");
      if (labelInput && labelInput.value !== (state.config.gateQrLabel || "CỔNG ĐIỂM DANH")) {
        labelInput.value = state.config.gateQrLabel || "CỔNG ĐIỂM DANH";
      }

      const linkInput = document.getElementById("admin-qr-link-input");
      if (linkInput && state.config.gateQrUrl) {
        linkInput.value = state.config.gateQrUrl;
      }

      renderGateQrImages(normalizeGateQrUrl(state.config.gateQrUrl));
      const gateUrlBox = document.getElementById("gate-qr-url-box");
      if (gateUrlBox && state.config.gateQrUrl) {
        gateUrlBox.textContent = state.config.gateQrUrl;
      }

      const checkinSum = document.getElementById("admin-qr-checkin-summary");
      if (checkinSum) checkinSum.textContent = `${checkedTotal} / ${totalDel} đại biểu`;

      const simStatus = document.getElementById("admin-sim-status-text");
      if (simStatus) {
        simStatus.textContent = `ĐD: ${checkedTotal}/${totalDel} • BCH: ${bchVoted}/${totalDel} • Bí thư: ${biThuVoted}/${totalDel}`;
      }
    }

    function updateGateQrLabel(val) {
      const clean = (val || "CỔNG ĐIỂM DANH").trim().toUpperCase();
      state.config.gateQrLabel = clean;
      const insideLabel = document.getElementById("admin-qr-inside-label");
      if (insideLabel) insideLabel.textContent = clean;
      const gateParam = document.getElementById("gate-qr-inside-param");
      if (gateParam) gateParam.textContent = clean;
    }







    function syncDriveFolderLinkFromId() {
      const idVal = document.getElementById("admin-drive-folder-id").value.trim();
      document.getElementById("admin-drive-folder-link").value = `https://drive.google.com/drive/folders/${idVal}`;
    }


    function copyDriveFolderLink() {
      const val = document.getElementById("admin-drive-folder-link").value;
      copyTextFallback(val);
      showToast("Đã sao chép link thư mục Google Drive!", "success");
    }

    function setAdminDriveLoadMode(mode) {
      state.config.driveLoadMode = mode;
      const btnCache = document.getElementById("drive-mode-cache");
      const btnPrev = document.getElementById("drive-mode-preview");
      const btnDir = document.getElementById("drive-mode-direct");
      [btnCache, btnPrev, btnDir].forEach(b => {
        if (b) b.className = "px-3 py-1.5 rounded-lg font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200";
      });
      if (mode === "CACHE" && btnCache) btnCache.className = "px-3 py-1.5 rounded-lg font-bold bg-blue-600 text-white";
      if (mode === "PREVIEW" && btnPrev) btnPrev.className = "px-3 py-1.5 rounded-lg font-bold bg-blue-600 text-white";
      if (mode === "DIRECT" && btnDir) btnDir.className = "px-3 py-1.5 rounded-lg font-bold bg-blue-600 text-white";
    }



    function copyAdminQrLink() {
      const val = document.getElementById("admin-qr-link-input").value;
      copyTextFallback(val);
      showToast("Đã sao chép liên kết định danh QR!", "success");
    }

    function downloadQrBadgePng() {
      const qr = makeGateQr(normalizeGateQrUrl(state.config.gateQrUrl));
      const size = qr.getModuleCount(), scale = 10, margin = 4;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = (size + margin * 2) * scale;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f172a";
      for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
        if (qr.isDark(y, x)) ctx.fillRect((x + margin) * scale, (y + margin) * scale, scale, scale);
      }
      const a = document.createElement("a");
      a.download = "QR_CONG_DIEM_DANH.png"; a.href = canvas.toDataURL("image/png"); a.click();
      showToast("Đã tải mã QR cổng điểm danh!", "success");
    }

    // =========================================================================
    // 8. CHỈNH SỬA DANH SÁCH BÍ THƯ MODAL (NEW FEATURE REQUESTED)
    // =========================================================================
    function openEditBiThuModal() {
      renderEditBiThuModalList();
      const modal = document.getElementById("modal-edit-bithu");
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }

    function closeEditBiThuModal() {
      const modal = document.getElementById("modal-edit-bithu");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }

    function renderEditBiThuModalList() {
      const container = document.getElementById("edit-bithu-list");
      if (!container) return;
      container.innerHTML = state.candidatesBiThu.map((c, idx) => `
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-slate-700">Ứng viên Bí thư #${idx + 1}</span>
            <button onclick="removeBiThuCandidate(${c.id})" class="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold">
              ✕ Xóa
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-0.5">Họ và tên:</label>
              <input id="edit-bithu-name-${c.id}" type="text" value="${escapeDocText(c.name)}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold bg-white" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-0.5">Chi đoàn / Đơn vị:</label>
              <input id="edit-bithu-unit-${c.id}" type="text" value="${escapeDocText(c.unit)}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white" />
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-500 mb-0.5">Chức vụ / Tóm tắt thành tích:</label>
            <input id="edit-bithu-bio-${c.id}" type="text" value="${escapeDocText(c.bio)}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white" />
          </div>
        </div>
      `).join("");
    }







    // =========================================================================
    // 9. SECTION 5: KẾT QUẢ & XUẤT EXCEL RIÊNG
    // =========================================================================


    function setAdminTableFilter(filterMode) {
      state.adminTableFilter = filterMode;
      document.getElementById("btn-filter-all-cand").className = filterMode === "ALL"
        ? "px-3 py-1 rounded-lg text-xs font-bold bg-slate-900 text-white"
        : "px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700";
      document.getElementById("btn-filter-elected-cand").className = filterMode === "ELECTED"
        ? "px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white"
        : "px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700";
      renderExcelSection();
    }

    function renderExcelSection() {
      const tally = computeElectionTally();
      const checkedCount = state.delegates.filter(d => d.checkedIn).length;

      const totalDel = state.delegates.length;
      document.getElementById("excel-kpi-bch").textContent = `${tally.bchTurnout} / ${totalDel}`;
      document.getElementById("excel-kpi-bithu").textContent = `${tally.biThuTurnout} / ${totalDel}`;
      document.getElementById("excel-kpi-checkin").textContent = `${checkedCount} / ${totalDel}`;
      document.getElementById("admin-bch-quota").value = String(state.config.bchElectedQuota);

      document.getElementById("admin-bithu-turnout").textContent = `${tally.biThuTurnout} / ${totalDel} phiếu`;
      const biThuBox = document.getElementById("admin-bithu-results-box");
      biThuBox.innerHTML = tally.biThuResults.map((item, idx) => {
        const isWinner = tally.biThuTurnout > 0 && idx === 0 && item.votes > tally.biThuTurnout / 2 && item.votes > (tally.biThuResults[1]?.votes || 0);
        return `
          <div class="p-3 rounded-xl border ${isWinner ? 'border-emerald-300 bg-emerald-50/60' : 'border-slate-200 bg-slate-50'}">
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="text-slate-900">${escapeDocText(item.name)} (${escapeDocText(item.unit)})</span>
              <span class="text-indigo-700">${item.votes} phiếu (${item.pct}%)</span>
            </div>
            <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-1.5">
              <div class="h-full ${isWinner ? 'bg-emerald-500' : 'bg-indigo-500'}" style="width: ${Math.min(100, item.pct)}%"></div>
            </div>
          </div>
        `;
      }).join("");

      const tbody = document.getElementById("admin-bch-table-body");
      const rows = state.adminTableFilter === "ELECTED"
        ? tally.rankedBch.filter(r => r.isElected)
        : tally.rankedBch;

      document.getElementById("admin-table-subtitle").textContent =
        `Thu về ${tally.bchTurnout}/${state.delegates.length} phiếu • Chỉ tiêu trúng cử: ${state.config.bchElectedQuota}/${state.candidatesBch.length} đồng chí`;

      if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-xs text-slate-500">Chưa có kết quả. Kết quả tổng hợp sẽ cập nhật từ máy chủ.</td></tr>`;
      } else {
        tbody.innerHTML = rows.map(item => `
          <tr class="hover:bg-slate-50">
            <td class="py-2 px-2.5 font-bold text-slate-600">#${item.rank}</td>
            <td class="py-2 px-2.5 font-bold text-slate-900">${escapeDocText(item.name)}</td>
            <td class="py-2 px-2.5 text-slate-500">${escapeDocText(item.unit)}</td>
            <td class="py-2 px-2.5 text-right font-extrabold text-sky-700">${item.agree}</td>
            <td class="py-2 px-2.5 text-right font-semibold text-rose-600">${item.reject}</td>
            <td class="py-2 px-2.5 text-right font-bold">${item.pct}%</td>
            <td class="py-2 px-2.5 text-center">
              ${item.isElected
                ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Dự kiến đạt</span>'
                : '<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">Chưa xác định</span>'}
            </td>
          </tr>
        `).join("");
      }

      renderAdminChart(tally.rankedBch);
    }

    function renderAdminChart(rankedBch) {
      const canvas = document.getElementById("bchVotesChart");
      if (!canvas || typeof Chart === "undefined") return;
      const labels = rankedBch.map(c => c.name.split(" ").slice(-2).join(" "));
      const agreeData = rankedBch.map(c => c.agree);
      const colors = rankedBch.map(c => c.isElected ? "rgba(14, 165, 233, 0.85)" : "rgba(148, 163, 184, 0.65)");

      if (bchChartInstance) bchChartInstance.destroy();
      bchChartInstance = new Chart(canvas, {
        type: "bar",
        data: {
          labels,
          datasets: [{ label: "Số phiếu đồng ý", data: agreeData, backgroundColor: colors, borderRadius: 5 }]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { beginAtZero: true, suggestedMax: state.delegates.length || 1 } }
        }
      });
    }







    function openEditCandidatesModal() {
      const listEl = document.getElementById("edit-candidates-list");
      listEl.innerHTML = state.candidatesBch.map((c, idx) => `
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div class="sm:col-span-1 font-bold text-slate-500">#${idx + 1}</div>
          <div class="sm:col-span-5">
            <input id="edit-cand-name-${c.id}" type="text" value="${escapeDocText(c.name)}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold bg-white" />
          </div>
          <div class="sm:col-span-3">
            <input id="edit-cand-unit-${c.id}" type="text" value="${escapeDocText(c.unit)}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white" />
          </div>
          <div class="sm:col-span-3">
            <input id="edit-cand-role-${c.id}" type="text" value="${escapeDocText(c.role)}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white" />
          </div>
        </div>
      `).join("");
      const modal = document.getElementById("modal-edit-candidates");
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }

    function closeEditCandidatesModal() {
      const modal = document.getElementById("modal-edit-candidates");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }



    function exportElectionToExcel() {
      const tally = computeElectionTally();
      if (typeof XLSX !== "undefined") {
        const wb = XLSX.utils.book_new();
        const bchRows = tally.rankedBch.map(item => ({
          "Hạng": item.rank,
          "Họ và tên": item.name,
          "Chi đoàn": item.unit,
          "Chức vụ": item.role,
          "Phiếu đồng ý": item.agree,
          "Phiếu gạch": item.reject,
          "Tỷ lệ (%)": item.pct,
          "Kết quả": item.isElected ? "DỰ KIẾN ĐẠT QUÁ BÁN" : "Chưa xác định"
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(bchRows), "Ket_Qua_BCH");

        const biThuRows = tally.biThuResults.map((item, idx) => ({
          "Hạng": idx + 1,
          "Ứng cử viên Bí thư": item.name,
          "Đơn vị": item.unit,
          "Số phiếu": item.votes,
          "Tỷ lệ (%)": item.pct,
          "Kết quả": (tally.biThuTurnout > 0 && idx === 0 && item.votes > tally.biThuTurnout / 2 && item.votes > (tally.biThuResults[1]?.votes || 0)) ? "DỰ KIẾN ĐẠT QUÁ BÁN BÍ THƯ" : "Chưa xác định"
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(biThuRows), "Ket_Qua_Bi_Thu");

        const delRows = state.delegates.map(d => ({
          "Mã ĐB": d.code,
          "Họ và tên": d.name,
          "Chi đoàn": d.className,
          "Điểm danh QR": d.checkedIn ? "Đã điểm danh" : "Chưa",
          "Bầu BCH": d.votedBch ? "Đã bầu" : "Chưa",
          "Bầu Bí thư": d.votedBiThu ? "Đã bầu" : "Chưa"
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(delRows), "Danh_Sach_Dai_Bieu");

        XLSX.writeFile(wb, "Ket_Qua_Bau_Cu_THPT_Ho_Thi_Bi_2026.xlsx");
        showToast("Đã xuất file Excel (.xlsx) thành công!", "success");
      } else {
        exportElectionToCSV();
      }
    }

    function exportElectionToCSV() {
      const tally = computeElectionTally();
      const lines = ["Hang,Ho va ten,Chi doan,Dong y,Gach,Ty le (%),Ket qua"];
      tally.rankedBch.forEach(item => {
        lines.push(`${item.rank},"${csvCell(item.name)}","${csvCell(item.unit)}",${item.agree},${item.reject},${item.pct},"${item.isElected ? 'Trung cu' : 'Khong'}"`);
      });
      const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Ket_Qua_Bau_Cu_THPT_Ho_Thi_Bi.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("Đã tải xuống file CSV!", "success");
    }

    function openMinutesModal() {
      const tally = computeElectionTally();
      const electedList = tally.rankedBch.filter(r => r.isElected);
      const firstBiThu=tally.biThuResults[0]; const winnerBiThu=firstBiThu && firstBiThu.votes>tally.biThuTurnout/2 && firstBiThu.votes>(tally.biThuResults[1]?.votes||0) ? firstBiThu : null;
      const text = [
        "ĐOÀN TNCS HỒ CHÍ MINH TRƯỜNG THPT HỒ THỊ BI",
        "BIÊN BẢN KIỂM PHIẾU ĐẠI HỘI BCH ĐOÀN TRƯỜNG THPT HỒ THỊ BI (2026 - 2027)",
        "==================================================",
        `1. Phiếu bầu BCH thu về: ${tally.bchTurnout}/${state.delegates.length} phiếu`,
        `2. Phiếu bầu Bí thư thu về: ${tally.biThuTurnout}/${state.delegates.length} phiếu`,
        "",
        "I. KẾT QUẢ BẦU BAN CHẤP HÀNH:",
        ...tally.rankedBch.map(r => `  #${r.rank}. ${escapeDocText(r.name)} (${escapeDocText(r.unit)}): ${r.agree} phiếu (${r.pct}%) - ${r.isElected ? 'TRÚNG CỬ' : 'Chưa xác định'}`),
        "",
        "II. KẾT QUẢ BẦU BÍ THƯ ĐOÀN TRƯỜNG:",
        ...tally.biThuResults.map((b, i) => `  #${i + 1}. ${escapeDocText(b.name)} (${escapeDocText(b.unit)}): ${b.votes} phiếu (${b.pct}%)`),
        winnerBiThu && tally.biThuTurnout > 0 ? `\n=> DỰ KIẾN ĐẠT QUÁ BÁN BÍ THƯ: Đồng chí ${winnerBiThu.name}` : ""
      ].join("\n");
      document.getElementById("minutes-text-content").textContent = text;
      const modal = document.getElementById("modal-minutes");
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }

    function closeMinutesModal() {
      const modal = document.getElementById("modal-minutes");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }

    function copyTextFallback(text) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      ta.remove();
    }

    function copyMinutesText() {
      copyTextFallback(document.getElementById("minutes-text-content").textContent);
      showToast("Đã sao chép Biên bản kiểm phiếu!", "success");
    }



    function closeResetConfirmModal() {
      const modal = document.getElementById("modal-reset-confirm");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }



    // Cloud storage ping & export

    function exportCloudConfigJson() {
      const payload = {
        storageStack: ["Appwrite", "Cloudflare", "Google Drive"],
        appwriteEndpoint: document.getElementById("cfg-appwrite-url")?.value || "",
        appwriteProjectId: document.getElementById("cfg-appwrite-project-id")?.value || "",
        cloudflareWorker: document.getElementById("cfg-cf-worker-url")?.value || "",
        googleDriveFolderId: document.getElementById("cfg-gdrive-folder-id")?.value || ""
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cau-hinh-appwrite-cloudflare-drive.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("Đã tải file cấu hình lưu trữ!", "success");
    }

    function startClock() {
      const clockEl = document.getElementById("live-clock");
      const updateClock = () => {
        if (clockEl) clockEl.textContent = new Date().toLocaleTimeString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hourCycle: "h23" });
      };
      updateClock();
      setInterval(updateClock, 1000);
    }

    window.addEventListener("online", () => {
      saveState();
      showToast("Đã kết nối lại mạng — Đang kiểm tra lại trạng thái từ máy chủ.", "success");
    });

    window.addEventListener("offline", () => {
      saveState();
      showToast("Mất kết nối mạng tạm thời — Chưa thể gửi hoặc xác nhận phiếu. Kết nối lại mạng để kiểm tra trạng thái trên máy chủ.", "warning");
    });

    window.addEventListener("DOMContentLoaded", () => {
      capturePreviousDocuments();
      loadSavedState();
      if (!state.sessionConfirmed) {
        syncDraftWithCurrentVoter();
      }
      renderRolePermissions();
      renderVoterBar();
      renderDocumentsList();
      renderActiveDocumentViewer();
      renderBchVotingGrid();
      renderBiThuVotingSection();
      renderAdminDriveAndQrSection();
      startClock();

      // Scanning the general QR always opens the selection screen, including a returning session.
      if (!state.sessionConfirmed || new URLSearchParams(location.search).get("gate") === "checkin") {
        openQrLoginModal();
      } else {
        switchMainSection(state.mainSection || "overview");
      }
    });