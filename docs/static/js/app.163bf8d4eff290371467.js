webpackJsonp([1],{"0+Fr":function(e,t){},NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=n("7+uW"),o={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},staticRenderFns:[]};var r=n("VU/8")({name:"App"},o,!1,function(e){n("qz3L")},null,null).exports,a=n("/ocq"),i=n("mtWM"),c=n.n(i),u=(n("MU8w"),{apiHost:"https://ejcifra-api.herokuapp.com/api",get:function(e,t,n,s){c.a.get(u.apiHost+"/songs",{params:{search:n,page:s}}).then(function(t){e(t)}).catch(function(e){t(e)})},getSingle:function(e,t,n){c.a.get(u.apiHost+"/songs/"+n).then(function(t){e(t)}).catch(function(e){t(e)})}}),l=u,d={name:"Index",data:function(){return{msg:"Songs",songs:[],searchKeyword:"",pages:[],currentPage:1}},created:function(){var e=this;this.handlers={success:function(t){if(t.data.data.length){e.songs=t.data.data,e.pages=[];for(var n=0;n<t.data.last_page;n++)e.pages.push(n+1)}},error:function(e){console.debug(e)}}},mounted:function(){l.get(this.handlers.success,this.handlers.error)},methods:{search:function(){if(this.searchKeyword){this.currentPage=1,l.get(this.handlers.success,this.handlers.error,this.searchKeyword)}},goToPage:function(e){this.currentPage=e,l.get(this.handlers.success,this.handlers.error,this.searchKeyword,e)}}},h={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"index"},[n("h1",[e._v(e._s(e.msg))]),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.searchKeyword,expression:"searchKeyword"}],attrs:{type:"text",placeholder:"Title or artist name"},domProps:{value:e.searchKeyword},on:{input:function(t){t.target.composing||(e.searchKeyword=t.target.value)}}}),e._v(" "),n("button",{attrs:{type:"button"},on:{click:function(t){e.search()}}},[e._v("Search")]),e._v(" "),n("ul",e._l(e.songs,function(t){return n("li",[n("router-link",{attrs:{to:{name:"View",params:{id:t.id,slug:t.slug}}}},[e._v(e._s(t.title)+" - "+e._s(t.artists)+" "+e._s(t.comment?"("+t.comment+")":""))])],1)})),e._v(" "),n("ul",e._l(e.pages,function(t){return n("li",[n("button",{attrs:{disabled:e.currentPage===t,type:"button"},on:{click:function(n){e.goToPage(t)}}},[e._v(e._s(t))])])}))])},staticRenderFns:[]};var p=n("VU/8")(d,h,!1,function(e){n("ryUD")},"data-v-4944e2f0",null).exports,g={name:"View",props:["id","slug"],data:function(){return{song:{title:"",artists:"",key:"",bpm:"",meter:"",comment:!1},content:"",keys:["C","C#","Db","D","D#","Eb","E","F","F#","Gb","G","G#","Ab","A","A#","Bb","B"],neyKey:null}},created:function(){var e=this;this.handlers={success:function(t){t.data&&(e.song=t.data,e.content=ChordPlus.getHTML(e.song.body))},error:function(e){console.debug(e)}};var t=document.createElement("script");t.setAttribute("src","static/vendor/chord-plus/chord-plus.min.js"),document.head.appendChild(t)},mounted:function(){l.getSingle(this.handlers.success,this.handlers.error,this.id)},methods:{transpose:function(){this.song&&(this.content=ChordPlus.getHTML(this.song.body,this.song.key,this.newKey))},reset:function(){this.song&&(this.newKey=null,this.content=ChordPlus.getHTML(this.song.body,this.song.key))}}},v={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"index"},[n("ul",[n("li",[n("router-link",{attrs:{to:{name:"Index"}}},[e._v("Songs")])],1),e._v(" "),n("li",[e._v(e._s(e.song.title))])]),e._v(" "),n("div",[n("label",[e._v("Change key")]),e._v(" "),n("select",{directives:[{name:"model",rawName:"v-model",value:e.newKey,expression:"newKey"}],on:{change:[function(t){var n=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.newKey=t.target.multiple?n:n[0]},function(t){e.transpose()}]}},e._l(e.keys,function(t){return n("option",{domProps:{value:t}},[e._v(e._s(t))])})),e._v(" "),n("button",{attrs:{type:"button"},on:{click:function(t){e.reset()}}},[e._v("Reset")])]),e._v(" "),n("div",[e._v(e._s(e.song.title)+" - "+e._s(e.song.artists))]),e._v(" "),n("div",[n("ul",[n("li",[e._v("Key: "+e._s(e.newKey||e.song.key))]),e._v(" "),n("li",[e._v("BPM: "+e._s(e.song.bpm))]),e._v(" "),n("li",[e._v("Meter: "+e._s(e.song.meter))]),e._v(" "),e.song.commet?n("li",[e._v(e._s(e.song.comment))]):e._e()])]),e._v(" "),n("div",{domProps:{innerHTML:e._s(e.content)}})])},staticRenderFns:[]};var m=n("VU/8")(g,v,!1,function(e){n("e8kt")},"data-v-607c5a46",null).exports,f={name:"Login",data:function(){return{}},created:function(){this.handlers={success:function(e){},error:function(e){console.debug(e)}}},mounted:function(){},methods:{}},_={render:function(){this.$createElement;this._self._c;return this._m(0)},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"index"},[t("h1",[this._v("Login")])])}]};var y=n("VU/8")(f,_,!1,function(e){n("0+Fr")},"data-v-aa3544d8",null).exports;s.a.use(a.a);var b=new a.a({routes:[{path:"/",name:"Index",component:p},{path:"/songs/:id/:slug",name:"View",component:m,props:!0},{path:"/login",name:"Login",component:y}]});s.a.config.productionTip=!1,new s.a({el:"#app",router:b,components:{App:r},template:"<App/>"})},e8kt:function(e,t){},qz3L:function(e,t){},ryUD:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.163bf8d4eff290371467.js.map