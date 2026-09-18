
(function(){
  function arrange(){
    var watch=document.getElementById('watchList')?.closest('.side-card');
    var sidebar=document.querySelector('.sidebar');
    var flight=document.getElementById('flightBoard');
    if(!watch||!sidebar||!flight)return;
    watch.classList.add('operations-watch-card');
    if(window.matchMedia('(max-width:680px)').matches){
      if(watch.nextElementSibling!==flight)flight.parentNode.insertBefore(watch,flight);
    }else{
      if(watch.parentNode!==sidebar||sidebar.firstElementChild!==watch)sidebar.insertBefore(watch,sidebar.firstElementChild);
    }
  }
  arrange();
  window.addEventListener('resize',arrange,{passive:true});
  window.addEventListener('orientationchange',arrange,{passive:true});
  setTimeout(arrange,300);
})();
