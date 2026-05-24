(function(global){
  function criarRenderizador(targetCanvas, backgroundColor){
    const rendererInstance = new global.THREE.WebGLRenderer({
      canvas: targetCanvas,
      antialias: true,
      alpha: true
    });
    rendererInstance.shadowMap.enabled = true;
    rendererInstance.shadowMap.type = global.THREE.PCFSoftShadowMap;
    rendererInstance.setClearColor(backgroundColor, 1);
    atualizarViewport(targetCanvas, rendererInstance);
    return rendererInstance;
  }

  function criarCena(backgroundColor){
    const sceneInstance = new global.THREE.Scene();
    sceneInstance.fog = new global.THREE.Fog(backgroundColor, 30, 60);
    return sceneInstance;
  }

  function criarCamera(targetCanvas){
    const size = obterTamanhoCanvas(targetCanvas);
    return new global.THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 100);
  }

  function adicionarLuzes(targetScene){
    const ambient = new global.THREE.AmbientLight(0xffffff, 0.6);
    targetScene.add(ambient);

    const dirLight = new global.THREE.DirectionalLight(0xfff8e7, 1.2);
    dirLight.position.set(8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.bias = -0.001;
    targetScene.add(dirLight);
  }

  function adicionarPiso(targetScene, material){
    const ground = new global.THREE.Mesh(new global.THREE.PlaneGeometry(20, 20), material);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    targetScene.add(ground);
  }

  function tratarRedimensionamento(targetCanvas, rendererInstance, cameraInstance){
    global.addEventListener('resize', function(){
      atualizarViewport(targetCanvas, rendererInstance);
      const size = obterTamanhoCanvas(targetCanvas);
      cameraInstance.aspect = size.width / size.height;
      cameraInstance.updateProjectionMatrix();
    });
  }

  function atualizarViewport(targetCanvas, rendererInstance){
    const size = obterTamanhoCanvas(targetCanvas);
    const pixelRatio = Math.min(global.devicePixelRatio || 1, 2);
    targetCanvas.width = size.width * pixelRatio;
    targetCanvas.height = size.height * pixelRatio;
    targetCanvas.style.width = size.width + 'px';
    targetCanvas.style.height = size.height + 'px';
    rendererInstance.setPixelRatio(pixelRatio);
    rendererInstance.setSize(size.width, size.height, false);
  }

  function obterTamanhoCanvas(targetCanvas){
    return {
      width: targetCanvas.parentElement.clientWidth,
      height: targetCanvas.parentElement.clientHeight
    };
  }

  global.SceneBase3D = {
    criarRenderizador: criarRenderizador,
    criarCena: criarCena,
    criarCamera: criarCamera,
    adicionarLuzes: adicionarLuzes,
    adicionarPiso: adicionarPiso,
    tratarRedimensionamento: tratarRedimensionamento
  };
})(window);
