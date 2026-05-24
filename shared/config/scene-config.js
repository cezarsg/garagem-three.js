(function(global){
  function criarCameraPadrao(){
    return {
      theta: -0.6,
      phi: 0.55,
      radius: 14,
      minRadius: 4,
      maxRadius: 30,
      target: new global.THREE.Vector3(0, 2, 0)
    };
  }

  function criarCoresBase(){
    return {
      sky: 0xb8d4f0,
      steel: 0x8a9099,
      gold: 0xe8a820,
      roof: 0x8b1a1a,
      ground: 0x7dc87a,
      carBody: 0x4b6cb7,
      carGlass: 0x9fd3ff,
      tire: 0x1f1f1f,
      rim: 0xbac4cf,
      headlight: 0xfff1b3,
      taillight: 0xff5252
    };
  }

  global.SceneConfig3D = {
    criarCameraPadrao: criarCameraPadrao,
    criarCoresBase: criarCoresBase
  };
})(window);
