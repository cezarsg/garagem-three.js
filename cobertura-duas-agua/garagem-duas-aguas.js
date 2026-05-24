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

    [-D3 / 2, D3 / 2].forEach(function(z){
      const empGeo = new global.THREE.BufferGeometry();
      const vE = new Float32Array([
        -W3 / 2, H3 + elevacaoTelha, z,
        W3 / 2, H3 + elevacaoTelha, z,
        0, ridgeY + elevacaoTelha, z
      ]);
      empGeo.setAttribute('position', new global.THREE.BufferAttribute(vE, 3));
      empGeo.setIndex(new global.THREE.BufferAttribute(new Uint16Array([0, 1, 2]), 1));
      empGeo.setAttribute('uv', new global.THREE.Float32BufferAttribute([0, 0, 1, 0, 0.5, 1], 2));
      empGeo.computeVertexNormals();
      const emp = global.GeometriaUtil3D.criarMeshComSombras(empGeo, materiais.roof);
      grupoCobertura.add(emp);
      paineisTelhado.push(emp);
    });

    return {
      grupoGaragem: grupoCobertura,
      paineisTelhado: paineisTelhado
    };
  }

  function criarViga(width, height, depth, material){
    return global.GeometriaUtil3D.criarMeshComSombras(new global.THREE.BoxGeometry(width, height, depth), material);
  }

  global.GaragemDuasAguas3D = {
    criar: criar
  };
})(window);
