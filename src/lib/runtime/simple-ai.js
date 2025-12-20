export const simple = `
const scripter = new ScriptController();

runtime.when('start', (done) => {
const userscript = async () => {
  while (true) {
    if (userscript.aborted) return;
    for (let i0 = 0; i0 < 2; i0++) {
      if (userscript.aborted) return;
      await tankUtils.turnRight(userscript, target, 20);
      await tankUtils.attack(userscript, target, tankUtils.getDirection(target), MathUtils.random(5, 15) * 10);
    }
    for (let i1 = 0; i1 < 4; i1++) {
      if (userscript.aborted) return;
      await tankUtils.turnLeft(userscript, target, 20);
      await tankUtils.attack(userscript, target, tankUtils.getDirection(target), MathUtils.random(5, 15) * 10);
    }
    for (let i2 = 0; i2 < 2; i2++) {
      if (userscript.aborted) return;
      await tankUtils.turnRight(userscript, target, 20);
      await tankUtils.attack(userscript, target, tankUtils.getDirection(target), MathUtils.random(5, 15) * 10);
    }
  }
};
userscript.i = 0;
userscript.warpMode = runtime.warpMode;
return scripter.execute(userscript).then(done).catch(done);
});
`;
