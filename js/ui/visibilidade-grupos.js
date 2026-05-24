(function(global){
  function configurar(campoToggle, grupos){
    if(!campoToggle) return;
    campoToggle.addEventListener('change', function(){
      grupos.forEach(function(grupo){
        grupo.visible = campoToggle.checked;
      });
    });
  }

  global.VisibilidadeGrupos3D = {
    configurar: configurar
  };
})(window);
