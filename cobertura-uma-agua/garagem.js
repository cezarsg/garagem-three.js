(function(global){
  function criar(configuracao, materiais){
    const grupoCobertura = new global.THREE.Group();
    const paineis = [];

    grupoCobertura.position.z = configuracao.alinhamento.deslocamentoZGaragem;
    adicionarPilares(grupoCobertura, materiais, configuracao);
    adicionarVigasSuperiores(grupoCobertura, materiais.steel, configuracao);
    adicionarCaibros(grupoCobertura, materiais.steel, configuracao);
    adicionarTercas(grupoCobertura, materiais.steel, configuracao);
    adicionarPainelTelhado(grupoCobertura, materiais.roof, configuracao, paineis);
    adicionarCarro(grupoCobertura, materiais);

    return {
      grupoGaragem: grupoCobertura,
      paineisTelhado: paineis
    };
  }

  function adicionarPilares(targetScene, materialsMap, carportConfig){
    const dimensions = carportConfig.dimensions;
    const alturaPilar = carportConfig.structure.pillarHeight || 3;

    carportConfig.structure.pillarPositions.forEach(function(position){
      const fatorAltura = position.heightFactor || 1;
      const alturaPilarAtual = alturaPilar * fatorAltura;
      const material = position.material === 'gold' ? materialsMap.gold : materialsMap.steel;
      const pillar = criarViga(dimensions.profile, alturaPilarAtual, dimensions.profile, material);
      pillar.position.set(position.x, alturaPilarAtual / 2, position.z);
      targetScene.add(pillar);
    });
  }

  function adicionarVigasSuperiores(targetScene, material, carportConfig){
    const dimensions = carportConfig.dimensions;
    const roof = carportConfig.roof;
    const yCentroEstrutura = (roof.highY + roof.lowY) / 2 - roof.rebaixoEstrutura;

    [-dimensions.depth / 2, dimensions.depth / 2].forEach(function(z){
      const beam = criarViga(roof.span + dimensions.profile, dimensions.profile, dimensions.profile, material);
      beam.position.set(0, yCentroEstrutura, z);
      beam.rotation.z = -roof.angle;
      targetScene.add(beam);
    });

    [
      {x: -dimensions.width / 2, y: obterTopoYEstruturaEmX(-dimensions.width / 2, carportConfig)},
      {x: dimensions.width / 2, y: obterTopoYEstruturaEmX(dimensions.width / 2, carportConfig)}
    ].forEach(function(position){
      const beam = criarViga(dimensions.profile, dimensions.profile, dimensions.depth + dimensions.profile, material);
      beam.position.set(position.x, position.y, 0);
      targetScene.add(beam);
    });
  }

  function adicionarCaibros(targetScene, material, carportConfig){
    const dimensions = carportConfig.dimensions;
    const roof = carportConfig.roof;
    const count = carportConfig.structure.rafterCount;
    const yCentroEstrutura = (roof.highY + roof.lowY) / 2 - roof.rebaixoEstrutura;

    for(let index = 0; index < count; index += 1){
      const z = -dimensions.depth / 2 + index * (dimensions.depth / (count - 1));
      const rafter = criarViga(roof.span, dimensions.profile * 0.8, dimensions.profile * 0.8, material);
      rafter.position.set(0, yCentroEstrutura, z);
      rafter.rotation.z = -roof.angle;
      targetScene.add(rafter);
    }
  }

  function adicionarTercas(targetScene, material, carportConfig){
    const dimensions = carportConfig.dimensions;

    carportConfig.structure.purlinOffsets.forEach(function(offset){
      const x = -dimensions.width / 2 + offset * dimensions.width;
      const purlin = criarViga(dimensions.profile * 0.7, dimensions.profile * 0.7, dimensions.depth, material);
      purlin.position.set(x, obterTopoYEstruturaEmX(x, carportConfig), 0);
      targetScene.add(purlin);
    });
  }

  function adicionarPainelTelhado(targetScene, material, carportConfig, paineis){
    const dimensions = carportConfig.dimensions;
    const roof = carportConfig.roof;
    const beiralCaimento = roof.beiralCaimento;
    const quedaPorMetro = dimensions.slopeHeight / dimensions.width;
    const yBordaBaixa = roof.lowY - (beiralCaimento * quedaPorMetro) + roof.elevacaoTelha;
    const yBordaAlta = roof.highY + roof.elevacaoTelha;
    const geometry = global.GeometriaUtil3D.criarPainel([
      [-dimensions.width / 2, yBordaAlta, -dimensions.depth / 2],
      [dimensions.width / 2 + beiralCaimento, yBordaBaixa, -dimensions.depth / 2],
      [dimensions.width / 2 + beiralCaimento, yBordaBaixa, dimensions.depth / 2],
      [-dimensions.width / 2, yBordaAlta, dimensions.depth / 2]
    ], [0, 1, 2, 0, 2, 3]);

    const panel = new global.THREE.Mesh(geometry, material);
    panel.castShadow = true;
    panel.receiveShadow = true;
    targetScene.add(panel);
    paineis.push(panel);
  }

  function adicionarCarro(targetScene, materialsMap){
    const car = new global.THREE.Group();
    car.position.set(-0.2, 0, 0.15);

    const chassis = criarCaixaArredondada(3.6, 0.45, 1.7, 0.18, materialsMap.carBody);
    chassis.position.set(0, 0.58, 0);
    car.add(chassis);

    const cabin = criarCaixaArredondada(1.9, 0.55, 1.45, 0.16, materialsMap.carBody);
    cabin.position.set(-0.15, 0.98, 0);
    car.add(cabin);

    const windshield = criarCaixaArredondada(0.55, 0.35, 1.28, 0.09, materialsMap.carGlass);
    windshield.position.set(0.55, 1.02, 0);
    car.add(windshield);

    const rearWindow = criarCaixaArredondada(0.55, 0.32, 1.22, 0.09, materialsMap.carGlass);
    rearWindow.position.set(-0.85, 1.0, 0);
    car.add(rearWindow);

    [
      {x: -0.2, y: 1.0, z: -0.74},
      {x: -0.2, y: 1.0, z: 0.74}
    ].forEach(function(posicao){
      const vidroLateral = criarCaixaArredondada(1.45, 0.28, 0.06, 0.07, materialsMap.carGlass);
      vidroLateral.position.set(posicao.x, posicao.y, posicao.z);
      car.add(vidroLateral);
    });

    [
      {x: 1.83, y: 0.62, z: -0.62, material: materialsMap.headlight},
      {x: 1.83, y: 0.62, z: 0.62, material: materialsMap.headlight},
      {x: -1.83, y: 0.62, z: -0.62, material: materialsMap.taillight},
      {x: -1.83, y: 0.62, z: 0.62, material: materialsMap.taillight}
    ].forEach(function(lanterna){
      const lampada = global.GeometriaUtil3D.criarMeshComSombras(new global.THREE.SphereGeometry(0.11, 20, 20), lanterna.material);
      lampada.position.set(lanterna.x, lanterna.y, lanterna.z);
      car.add(lampada);
    });

    [
      {x: -1.1, z: -0.92},
      {x: 1.1, z: -0.92},
      {x: -1.1, z: 0.92},
      {x: 1.1, z: 0.92}
    ].forEach(function(position){
      const wheel = criarRodaCarro(materialsMap);
      wheel.position.set(position.x, 0.32, position.z);
      car.add(wheel);
    });

    targetScene.add(car);
  }

  function criarViga(width, height, depth, material){
    return global.GeometriaUtil3D.criarMeshComSombras(new global.THREE.BoxGeometry(width, height, depth), material);
  }

  function criarCaixaArredondada(largura, altura, profundidade, raio, material){
    const raioSeguro = Math.max(0.01, Math.min(raio, largura * 0.5, altura * 0.5));
    const shape = new global.THREE.Shape();
    const metadeL = largura * 0.5;
    const metadeA = altura * 0.5;

    shape.moveTo(-metadeL + raioSeguro, -metadeA);
    shape.lineTo(metadeL - raioSeguro, -metadeA);
    shape.quadraticCurveTo(metadeL, -metadeA, metadeL, -metadeA + raioSeguro);
    shape.lineTo(metadeL, metadeA - raioSeguro);
    shape.quadraticCurveTo(metadeL, metadeA, metadeL - raioSeguro, metadeA);
    shape.lineTo(-metadeL + raioSeguro, metadeA);
    shape.quadraticCurveTo(-metadeL, metadeA, -metadeL, metadeA - raioSeguro);
    shape.lineTo(-metadeL, -metadeA + raioSeguro);
    shape.quadraticCurveTo(-metadeL, -metadeA, -metadeL + raioSeguro, -metadeA);

    const geometry = new global.THREE.ExtrudeGeometry(shape, {
      depth: profundidade,
      bevelEnabled: false,
      curveSegments: 20
    });
    geometry.translate(0, 0, -profundidade * 0.5);
    geometry.computeVertexNormals();

    const mesh = new global.THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  function criarRodaCarro(materialsMap){
    const wheel = new global.THREE.Group();
    const tire = global.GeometriaUtil3D.criarMeshComSombras(new global.THREE.CylinderGeometry(0.32, 0.32, 0.24, 24), materialsMap.tire);
    tire.rotation.x = Math.PI / 2;
    wheel.add(tire);

    const rim = global.GeometriaUtil3D.criarMeshComSombras(new global.THREE.CylinderGeometry(0.18, 0.18, 0.26, 24), materialsMap.rim);
    rim.rotation.x = Math.PI / 2;
    wheel.add(rim);

    return wheel;
  }

  function obterTopoYEmX(x, carportConfig){
    const dimensions = carportConfig.dimensions;
    const roof = carportConfig.roof;
    const normalized = (x + dimensions.width / 2) / dimensions.width;
    return roof.highY + (roof.lowY - roof.highY) * normalized;
  }

  function obterTopoYEstruturaEmX(x, carportConfig){
    return obterTopoYEmX(x, carportConfig) - carportConfig.roof.rebaixoEstrutura;
  }

  global.Garagem3D = {
    criar: criar
  };
})(window);
