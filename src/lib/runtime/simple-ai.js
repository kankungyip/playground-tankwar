export const simple = `
const controller = runtime.createAbortController();
const signal = controller.signal;

runtime.when('start', (done) => {
  const funcId = 'simple-ai-tank';
  const warpMode = runtime.warpMode;
  return new Promise(async (resolve) => {
    let forceWait = Date.now();
    let renderMode = false;
    const handleAbort = (skipId) => {
      if (funcId === skipId) return;
      signal.off('abort', handleAbort);
      handleAbort.stopped = true;
      resolve();
    };
    signal.once('abort', handleAbort);
    while (true) {
      if (renderMode && !warpMode) {
        await runtime.nextFrame();
        forceWait = Date.now();
        renderMode = false;
      }
      await tankUtils.attack(target, signal, 0, MathUtils.random(5, 15) * 10);
      await tankUtils.attack(target, signal, 330, MathUtils.random(5, 15) * 10);
      await tankUtils.attack(target, signal, 300, MathUtils.random(5, 15) * 10);
      await tankUtils.attack(target, signal, 270, MathUtils.random(5, 15) * 10);
      await tankUtils.attack(target, signal, 300, MathUtils.random(5, 15) * 10);
      await tankUtils.attack(target, signal, 330, MathUtils.random(5, 15) * 10);
      if (handleAbort.stopped) break;
      if ((!renderMode && !warpMode) || Date.now() - forceWait > 300) {
        await runtime.nextTick();
        forceWait = Date.now();
      }
    }
    signal.off('abort', handleAbort);
    resolve();
  }).then(done).catch(done);
});
`;
