import { createBackground } from './background.js';
const pause=document.querySelector('#pause');
const status=document.querySelector('#status');
const background=createBackground(document.querySelector('canvas'), state=> {
  pause.textContent=['paused','reduced'].includes(state)?'Продолжить':'Пауза';
  pause.disabled=['lost','fallback','settled'].includes(state);
  status.textContent={running:'Импульс проходит по полотну',settled:'След затих · можно повторить импульс',paused:'Анимация на паузе',reduced:'Движение отключено по настройкам системы',lost:'Восстановление WebGL…',fallback:'WebGL недоступен · статичный фон'}[state];
},time=>{
  document.querySelector('#timeline').value=time;
  document.querySelector('#timeline-value').textContent=time.toFixed(2)+' с';
});
document.querySelector('#timeline').addEventListener('input',event=>background.seek(Number(event.target.value)));
pause.addEventListener('click',()=>background.toggle());
document.querySelector('#replay').addEventListener('click',()=>background.replay());
for(const name of ['speed','intensity','focus','aperture']) {
  document.querySelector('#'+name).addEventListener('input',event=> {
    const value=Number(event.target.value);
    const setters={speed:'setSpeed',intensity:'setIntensity',focus:'setFocus',aperture:'setAperture'};
    background[setters[name]](value);
    document.querySelector('#'+name+'-value').textContent=['speed','aperture'].includes(name)?value.toFixed(1)+'×':Math.round(value*100)+'%';
  });
}
const restore=document.querySelector('#restore');
document.querySelector('#clean').addEventListener('click',()=>{document.body.classList.add('clean');restore.hidden=false;restore.focus();});
function showUI() {document.body.classList.remove('clean');restore.hidden=true;document.querySelector('#clean').focus();}
restore.addEventListener('click',showUI);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.body.classList.contains('clean')) showUI();});

document.querySelector('#reference').addEventListener('click',()=>background.seek(.35));
