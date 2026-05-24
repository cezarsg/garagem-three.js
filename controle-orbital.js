(function(global){
  function criar(targetCanvas, targetCamera, cameraConfig){
    const state = {
      isDragging: false,
      prevX: 0,
      prevY: 0,
      lastPinchDistance: null,
      theta: cameraConfig.theta,
      phi: cameraConfig.phi,
      radius: cameraConfig.radius,
      minRadius: cameraConfig.minRadius,
      maxRadius: cameraConfig.maxRadius,
      target: cameraConfig.target.clone()
    };

    function atualizar(){
      const sinPhi = Math.sin(state.phi);
      const cosPhi = Math.cos(state.phi);
      targetCamera.position.set(
        state.target.x + state.radius * cosPhi * Math.sin(state.theta),
        state.target.y + state.radius * sinPhi,
        state.target.z + state.radius * cosPhi * Math.cos(state.theta)
      );
      targetCamera.lookAt(state.target);
    }

    function rotacionar(deltaX, deltaY){
      state.theta -= deltaX * 0.01;
      state.phi = limitar(state.phi - deltaY * 0.01, 0.05, Math.PI / 2 - 0.05);
      atualizar();
    }

    function aproximar(delta){
      state.radius = limitar(state.radius + delta, state.minRadius, state.maxRadius);
      atualizar();
    }

    targetCanvas.addEventListener('mousedown', function(event){
      state.isDragging = true;
      state.prevX = event.clientX;
      state.prevY = event.clientY;
    });

    targetCanvas.addEventListener('mouseup', function(){
      state.isDragging = false;
    });

    targetCanvas.addEventListener('mouseleave', function(){
      state.isDragging = false;
    });

    targetCanvas.addEventListener('mousemove', function(event){
      if(!state.isDragging) return;
      rotacionar(event.clientX - state.prevX, event.clientY - state.prevY);
      state.prevX = event.clientX;
      state.prevY = event.clientY;
    });

    targetCanvas.addEventListener('wheel', function(event){
      aproximar(event.deltaY * 0.02);
      event.preventDefault();
    }, {passive: false});

    targetCanvas.addEventListener('touchstart', function(event){
      if(event.touches.length === 1){
        state.isDragging = true;
        state.prevX = event.touches[0].clientX;
        state.prevY = event.touches[0].clientY;
      } else if(event.touches.length === 2){
        state.lastPinchDistance = obterDistanciaToque(event.touches);
      }
    }, {passive: true});

    targetCanvas.addEventListener('touchend', function(){
      state.isDragging = false;
      state.lastPinchDistance = null;
    });

    targetCanvas.addEventListener('touchmove', function(event){
      if(event.touches.length === 1 && state.isDragging){
        const touch = event.touches[0];
        rotacionar(touch.clientX - state.prevX, touch.clientY - state.prevY);
        state.prevX = touch.clientX;
        state.prevY = touch.clientY;
        return;
      }

      if(event.touches.length === 2 && state.lastPinchDistance !== null){
        const nextDistance = obterDistanciaToque(event.touches);
        aproximar(-(nextDistance - state.lastPinchDistance) * 0.05);
        state.lastPinchDistance = nextDistance;
      }
    }, {passive: true});

    return {atualizar: atualizar};
  }

  function obterDistanciaToque(touches){
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY
    );
  }

  function limitar(value, min, max){
    return Math.max(min, Math.min(max, value));
  }

  global.ControleOrbital3D = {
    criar: criar
  };
})(window);
