(function(global){
  function criar(container, carportConfig){
    const dimensions = carportConfig.dimensions;
    const deslocamentoZGaragem = carportConfig.alinhamento.deslocamentoZGaragem;
    const labels = [
      {
        text: dimensions.width + ' m',
        point: new global.THREE.Vector3(0, 0.3, dimensions.depth / 2 + 0.55 + deslocamentoZGaragem)
      },
      {
        text: dimensions.depth + ' m',
        point: new global.THREE.Vector3(dimensions.width / 2 + 0.55, 0.3, deslocamentoZGaragem)
      }
    ];

    return labels.map(function(label){
      const element = global.document.createElement('div');
      element.className = 'measure-label';
      element.textContent = label.text;
      container.appendChild(element);

      return {
        element: element,
        point: label.point.clone()
      };
    });
  }

  function atualizar(labels, container, cameraInstance){
    const width = container.clientWidth;
    const height = container.clientHeight;

    labels.forEach(function(label){
      const projectedPoint = label.point.clone().project(cameraInstance);
      const isVisible = projectedPoint.z >= -1 && projectedPoint.z <= 1;

      if(!isVisible){
        label.element.style.display = 'none';
        return;
      }

      label.element.style.display = 'block';
      label.element.style.left = ((projectedPoint.x * 0.5 + 0.5) * width) + 'px';
      label.element.style.top = ((-projectedPoint.y * 0.5 + 0.5) * height) + 'px';
    });
  }

  global.LabelsMedidas3D = {
    criar: criar,
    atualizar: atualizar
  };
})(window);
