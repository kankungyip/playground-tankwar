export default (script = '', AIs = []) => `
${AIs.join('\n')}

((tank) => {
let abort = false;
${script || ''}
})(runtime.player);

runtime.on('frame', () => {
  runtime.player.util.drive();
  runtime.redTank.util.drive();
  runtime.yellowTank.util.drive();
  runtime.greenTank.util.drive();
});

runtime.player.util.bringToFront();
runtime.start();
`;
