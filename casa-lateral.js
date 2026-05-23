(function(global){
  function criarGeometriaPainelCasa(vertices, indices){
    const geometry = new global.THREE.BufferGeometry();
    const positions = [];

    vertices.forEach(function(vertex){
      positions.push(vertex[0], vertex[1], vertex[2]);
    });

    geometry.setAttribute('position', new global.THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }

  function criarCasaLateral(configuracaoCasa, materialTelha){
    const dimensions = configuracaoCasa.dimensions;
    const roof = configuracaoCasa.roof;
    const casa = configuracaoCasa.casaLateral;
    const grupoCasa = new global.THREE.Group();
    const xFrontal = -dimensions.width / 2 - casa.afastamentoCobertura;
    const xCentroCasa = xFrontal - casa.profundidade / 2;
    const alturaCasa = roof.highY;

    const matParede = new global.THREE.MeshStandardMaterial({color: casa.corParede, roughness: 0.8, metalness: 0.02});
    const matJanela = new global.THREE.MeshStandardMaterial({color: casa.corJanela, roughness: 0.7, metalness: 0.02});
    const matPorta = new global.THREE.MeshStandardMaterial({color: casa.corPorta, roughness: 0.65, metalness: 0.02});

    const corpoCasa = new global.THREE.Mesh(
      new global.THREE.BoxGeometry(casa.profundidade, alturaCasa, casa.largura),
      matParede
    );
    corpoCasa.position.set(xCentroCasa, alturaCasa / 2, 0);
    corpoCasa.castShadow = true;
    corpoCasa.receiveShadow = true;
    grupoCasa.add(corpoCasa);

    const aberturaProfundidade = casa.aberturaProfundidade || 0.08;
    casa.aberturas.forEach(function(abertura){
      const materialAbertura = abertura.tipo === 'porta' ? matPorta : matJanela;
      const aberturaCasa = new global.THREE.Mesh(
        new global.THREE.BoxGeometry(aberturaProfundidade, abertura.h, abertura.w),
        materialAbertura
      );
      aberturaCasa.position.set(
        xFrontal + aberturaProfundidade / 2,
        abertura.y,
        abertura.z
      );
      aberturaCasa.castShadow = true;
      aberturaCasa.receiveShadow = true;
      grupoCasa.add(aberturaCasa);
    });

    const quedaTelhaCasa = casa.quedaTelha || 0.32;
    const beiralCasa = casa.beiral || 0.12;
    const telhaCasa = new global.THREE.Mesh(
      criarGeometriaPainelCasa([
        [xFrontal + beiralCasa, alturaCasa + 0.02, -casa.largura / 2 - beiralCasa],
        [xFrontal - casa.profundidade - beiralCasa, alturaCasa + quedaTelhaCasa + 0.02, -casa.largura / 2 - beiralCasa],
        [xFrontal - casa.profundidade - beiralCasa, alturaCasa + quedaTelhaCasa + 0.02, casa.largura / 2 + beiralCasa],
        [xFrontal + beiralCasa, alturaCasa + 0.02, casa.largura / 2 + beiralCasa]
      ], [0, 1, 2, 0, 2, 3]),
      materialTelha
    );
    telhaCasa.castShadow = true;
    telhaCasa.receiveShadow = true;
    grupoCasa.add(telhaCasa);

    return grupoCasa;
  }

  global.CasaLateral3D = {
    criarCasaLateral: criarCasaLateral
  };
})(window);
