(function(global){
  function criarPainel(vertices, indices){
    const geometry = new global.THREE.BufferGeometry();
    geometry.setAttribute('position', new global.THREE.BufferAttribute(new Float32Array(vertices.flat()), 3));
    geometry.setIndex(new global.THREE.BufferAttribute(new Uint16Array(indices), 1));
    geometry.setAttribute('uv', new global.THREE.BufferAttribute(new Float32Array([
      0, 0,
      1, 0,
      1, 1,
      0, 1
    ]), 2));
    geometry.computeVertexNormals();
    return geometry;
  }

  function criarMeshComSombras(geometry, material){
    const mesh = new global.THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  global.GeometriaUtil3D = {
    criarPainel: criarPainel,
    criarMeshComSombras: criarMeshComSombras
  };
})(window);
