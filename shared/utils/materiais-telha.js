(function(global){
  function criarMateriais(colors){
    return {
      steel: new global.THREE.MeshStandardMaterial({color: colors.steel, metalness: 0.7, roughness: 0.3}),
      gold: new global.THREE.MeshStandardMaterial({color: colors.gold, metalness: 0.8, roughness: 0.2}),
      roof: new global.THREE.MeshStandardMaterial({color: colors.roof, metalness: 0.1, roughness: 0.7, side: global.THREE.DoubleSide}),
      ground: new global.THREE.MeshStandardMaterial({color: colors.ground, roughness: 0.9, metalness: 0}),
      carBody: new global.THREE.MeshStandardMaterial({color: colors.carBody, metalness: 0.55, roughness: 0.35}),
      carGlass: new global.THREE.MeshStandardMaterial({color: colors.carGlass, metalness: 0.2, roughness: 0.25}),
      tire: new global.THREE.MeshStandardMaterial({color: colors.tire, metalness: 0.05, roughness: 0.9}),
      rim: new global.THREE.MeshStandardMaterial({color: colors.rim, metalness: 0.7, roughness: 0.3}),
      headlight: new global.THREE.MeshStandardMaterial({color: colors.headlight, emissive: colors.headlight, emissiveIntensity: 0.4, metalness: 0.1, roughness: 0.35}),
      taillight: new global.THREE.MeshStandardMaterial({color: colors.taillight, emissive: colors.taillight, emissiveIntensity: 0.35, metalness: 0.1, roughness: 0.35})
    };
  }

  function aplicarTexturaTelha(materialTelha, rendererInstance){
    const loader = new global.THREE.TextureLoader();
    loader.load('../assets/textures/telha-colonial-pvc.png', function(textura){
      textura.wrapS = global.THREE.RepeatWrapping;
      textura.wrapT = global.THREE.RepeatWrapping;
      textura.repeat.set(5.5, 2.2);
      textura.anisotropy = rendererInstance.capabilities.getMaxAnisotropy();
      textura.encoding = global.THREE.sRGBEncoding;

      materialTelha.map = textura;
      materialTelha.color.setHex(0xffffff);
      materialTelha.roughness = 0.88;
      materialTelha.metalness = 0.02;
      materialTelha.needsUpdate = true;
    });
  }

  global.MateriaisTelha3D = {
    criarMateriais: criarMateriais,
    aplicarTexturaTelha: aplicarTexturaTelha
  };
})(window);
