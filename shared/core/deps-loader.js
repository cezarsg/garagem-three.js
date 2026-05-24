(function(global){
  function carregar(caminhos, versao){
    caminhos.forEach(function(caminho){
      global.document.write('<script src="' + caminho + '?v=' + versao + '"><\/script>');
    });
  }

  global.DepsLoader3D = {
    carregar: carregar
  };
})(window);
