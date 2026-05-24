(function(global){
  function criar(configuracao, materiais){
    const dimensions = configuracao.dimensions;
    const estrutura = configuracao.structure;
    const roof = configuracao.roof;
    const W3 = dimensions.width;
    const D3 = dimensions.depth;
    const H3 = estrutura.pillarHeight;
    const ridgeH = roof.ridgeHeight;
    const ridgeY = H3 + ridgeH;
    const prof = dimensions.profile;
    const elevacaoTelha = roof.elevacaoTelha;
    const paineisTelhado = [];
    const grupoCobertura = new global.THREE.Group();

    grupoCobertura.position.z = configuracao.alinhamento.deslocamentoZGaragem;

    estrutura.pillarPositions.forEach(function(p){
      const pillar = criarViga(prof, H3, prof, p.gold ? materiais.gold : materiais.steel);
      pillar.position.set(p.x, H3 / 2, p.z);
      grupoCobertura.add(pillar);
    });

    [-D3 / 2, D3 / 2].forEach(function(z){
      const viga = criarViga(W3 + prof, prof, prof, materiais.steel);
      viga.position.set(0, H3, z);
      grupoCobertura.add(viga);
    });
    [-W3 / 2, W3 / 2].forEach(function(x){
      const viga = criarViga(prof, prof, D3 + prof, materiais.steel);
      viga.position.set(x, H3, 0);
      grupoCobertura.add(viga);
    });

    const ridgeBeam = criarViga(prof, prof, D3, materiais.steel);
    ridgeBeam.position.set(0, ridgeY, 0);
    grupoCobertura.add(ridgeBeam);

    [-D3 / 2, D3 / 2].forEach(function(z){
      const mont = criarViga(prof, ridgeH, prof, materiais.steel);
      mont.position.set(0, H3 + ridgeH / 2, z);
      grupoCobertura.add(mont);
    });

    const nCaibros = estrutura.rafterCount;
    for(let i = 0; i < nCaibros; i += 1){
      const z = -D3 / 2 + i * (D3 / (nCaibros - 1));
      const dx = W3 / 2;
      const dy = ridgeH;
      const len = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      const cLeft = criarViga(len, prof * 0.8, prof * 0.8, materiais.steel);
      cLeft.position.set(-W3 / 4, H3 + ridgeH / 2, z);
      cLeft.rotation.z = angle;
      grupoCobertura.add(cLeft);

      const cRight = criarViga(len, prof * 0.8, prof * 0.8, materiais.steel);
      cRight.position.set(W3 / 4, H3 + ridgeH / 2, z);
      cRight.rotation.z = -angle;
      grupoCobertura.add(cRight);
    }

    estrutura.purlinOffsets.forEach(function(offset){
      const tx = offset * (W3 / 2);
      const t = tx / (W3 / 2);
      const ty = H3 + ridgeH * (1 - t);
      [-1, 1].forEach(function(side){
        const terca = criarViga(prof * 0.7, prof * 0.7, D3, materiais.steel);
        terca.position.set(side * tx, ty, 0);
        grupoCobertura.add(terca);
      });
    });

    const roofGeoL = global.GeometriaUtil3D.criarPainel([
      [-W3 / 2, H3 + elevacaoTelha, -D3 / 2],
      [0, ridgeY + elevacaoTelha, -D3 / 2],
      [0, ridgeY + elevacaoTelha, D3 / 2],
      [-W3 / 2, H3 + elevacaoTelha, D3 / 2]
    ], [0, 1, 2, 0, 2, 3]);
    const roofL = global.GeometriaUtil3D.criarMeshComSombras(roofGeoL, materiais.roof);
    grupoCobertura.add(roofL);
    paineisTelhado.push(roofL);

    const roofGeoR = global.GeometriaUtil3D.criarPainel([
      [W3 / 2, H3 + elevacaoTelha, -D3 / 2],
      [0, ridgeY + elevacaoTelha, -D3 / 2],
      [0, ridgeY + elevacaoTelha, D3 / 2],
      [W3 / 2, H3 + elevacaoTelha, D3 / 2]
    ], [0, 2, 1, 0, 3, 2]);
    const roofR = global.GeometriaUtil3D.criarMeshComSombras(roofGeoR, materiais.roof);
    grupoCobertura.add(roofR);
    paineisTelhado.push(roofR);

    // Sem empenas de fechamento: manter os dois lados vazados.
    adicionarCarro(grupoCobertura, materiais);

    return {
      grupoGaragem: grupoCobertura,
      paineisTelhado: paineisTelhado
    };
  }

  function criarViga(width, height, depth, material){
    return global.GeometriaUtil3D.criarMeshComSombras(new global.THREE.BoxGeometry(width, height, depth), material);
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

  global.GaragemDuasAguas3D = {
    criar: criar
  };
})(window);
