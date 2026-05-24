(function(global){
  function criarCasaLateralPadrao(){
    const largura = 10;
    return {
      largura: largura,
      profundidade: 2.6,
      afastamentoCobertura: 0.35,
      corParede: 0xfa8072,
      corMuro: 0xd9c8a9,
      corJanela: 0x5c3a21,
      corPorta: 0xffffff,
      alturaMuro: 2.2,
      espessuraMuro: 0.14,
      deslocamentoExternoMuro: 0.02,
      aberturaProfundidade: 0.08,
      beiral: 0.12,
      quedaTelha: 0.32,
      aberturas: [
        {tipo: 'janela', y: 1.7, z: largura / 2 - 1.8, h: 1.2, w: 3.0},
        {tipo: 'janela', y: 1.7, z: -largura / 2 + 3.5, h: 1.2, w: 3.0},
        {tipo: 'porta', y: 1.4, z: -largura / 2 + 1.2, h: 2.0, w: 0.95}
      ]
    };
  }

  global.CasaConfig3D = {
    criarCasaLateralPadrao: criarCasaLateralPadrao
  };
})(window);
