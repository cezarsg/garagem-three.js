(function(global){
  function criar(opcoes){
    const configuracao = opcoes || {};
    const canvas = configuracao.canvas;
    const corCeu = configuracao.skyColor;
    const materialPiso = configuracao.groundMaterial;

    const renderer = global.SceneBase3D.criarRenderizador(canvas, corCeu);
    const scene = global.SceneBase3D.criarCena(corCeu);
    const camera = global.SceneBase3D.criarCamera(canvas);

    global.SceneBase3D.adicionarLuzes(scene);
    global.SceneBase3D.adicionarPiso(scene, materialPiso);
    global.SceneBase3D.tratarRedimensionamento(canvas, renderer, camera);

    return {
      renderer: renderer,
      scene: scene,
      camera: camera
    };
  }

  global.SceneBootstrap3D = {
    criar: criar
  };
})(window);
