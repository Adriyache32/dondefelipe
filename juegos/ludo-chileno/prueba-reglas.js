// Prueba de reglas: node prueba-reglas.js  (simula miles de partidas y revisa casos puntuales)
const L=require('./ludo-logica.js');
function rng(seed){return ()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};}
function invariantes(est){
  est.equipos.forEach(e=>{if(est.fichas[e].length!==(est.reglas.fichas||4))throw 'n fichas';est.fichas[e].forEach(p=>{if(p<-1||p>56)throw 'pos fuera '+p;});});
  // nunca dos equipos distintos en una casilla no segura
  for(let idx=0;idx<52;idx++){if(L.esSegura(idx))continue;const eqs=new Set(L.ocupantes(est,idx).map(o=>o.eq));if(eqs.size>1)throw 'convivencia ilegal en '+idx;}
  if(est.reglas.barreras){/* no se verifica */}
}
const combos=[{},{salida:'1y6'},{tresSeis:false},{barreras:true},{terminarPrimero:false},{capturaExtra:false,metaExtra:false},{barreras:true,salida:'1y6',terminarPrimero:false},{fichas:2},{}];
let total=0,maxTurnos=0,sumT=0,atascos=0;
const victorias={facil:0,normal:0};
combos.forEach((reglas,ci)=>{
  for(let g=0;g<600;g++){
    const az=rng(1000+g*7+ci*99991);
    const eqs=[[0,1],[0,2],[0,1,2],[0,1,2,3],[1,3],[0,1,2,3]][g%6];
    const est=L.crearEstado(eqs,reglas);
    const nivel={};eqs.forEach((e,k)=>nivel[e]=(k%2?'facil':'normal'));
    let pasos=0;
    while(!est.fin){
      if(++pasos>20000){atascos++;break;}
      const d=1+Math.floor(az()*6);
      const r=L.lanzar(est,d);
      if(r.tipo==='elegir'){
        const m=L.elegirIA(est,r.movs,nivel[est.turno],az);
        if(r.movs.indexOf(m)<0)throw 'IA eligió movimiento inválido';
        const paes=ci===combos.length-1;L.jugar(est,m,paes?az()<.7:true);
      }
      if(ci!==combos.length-1)invariantes(est);
    }
    total++;maxTurnos=Math.max(maxTurnos,est.turnosTotales);sumT+=est.turnosTotales;
    if(est.ganadores.length){victorias[nivel[est.ganadores[0]]]++;}
    if(reglas.terminarPrimero===false && est.fin && est.ganadores.length!==eqs.length)throw 'ranking incompleto';
  }
});
// pruebas puntuales de reglas
const e=L.crearEstado([0,1]);
let r=L.lanzar(e,3);console.log('sin 6 en base ->',r.tipo,'turno pasa a',e.turno);
e.turno=0;r=L.lanzar(e,6);console.log('con 6 ->',r.tipo,r.movs.length,'opción(es)');
L.jugar(e,r.movs[0]);console.log('tras salir con 6, repite turno:',e.turno===0,'pos',e.fichas[0]);
// captura: ficha 0 de equipo 0 en p=5 (casilla 5); equipo 1 en casilla 5 -> p=(5-13+52)%52=44
const c=L.crearEstado([0,1]);c.fichas[0][0]=2;c.fichas[1][0]=44;c.turno=0;r=L.lanzar(c,3);
const mc=r.movs.find(m=>m.f===0);console.log('captura detectada:',mc.captura.length===1);L.jugar(c,mc);console.log('rival a la base:',c.fichas[1][0]===-1,'turno extra:',c.turno===0);
// casilla segura (estrella 8): no captura
const s=L.crearEstado([0,1]);s.fichas[0][0]=5;s.fichas[1][0]=(8-13+52)%52;s.turno=0;r=L.lanzar(s,3);console.log('estrella protege:',r.movs.find(m=>m.f===0).captura.length===0);
// meta exacta
const m=L.crearEstado([0,1]);m.fichas[0]=[54,-1,-1,-1];m.turno=0;r=L.lanzar(m,3);console.log('se pasa de la meta -> sin mover esa ficha:',!r.movs.some(x=>x.f===0));
m.turno=0;m.seisSeguidos=0;r=L.lanzar(m,2);console.log('número exacto llega:',r.movs.some(x=>x.f===0&&x.meta));
// tres seis
const t=L.crearEstado([0,1]);t.fichas[0]=[10,-1,-1,-1];t.turno=0;L.jugar(t,L.lanzar(t,6).movs[0]);L.jugar(t,L.lanzar(t,6).movs[0]);r=L.lanzar(t,6);console.log('tercer 6 pierde turno:',r.tipo,'turno ahora',t.turno);
// barrera
const b=L.crearEstado([0,1],{barreras:true});b.fichas[1][0]=b.fichas[1][1]=(10-13+52)%52;b.fichas[0][0]=7;b.turno=0;r=L.lanzar(b,5);console.log('barrera bloquea el paso:',!r.movs.some(x=>x.f===0));
console.log({partidas:total,atascos,promedioLanzamientos:Math.round(sumT/total),maxLanzamientos:maxTurnos,victorias});
