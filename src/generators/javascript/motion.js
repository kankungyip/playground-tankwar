import { javascriptGenerator } from '@blockcode/blocks-player';

const AWAIT_ABORT = 'if (abort || !runtime.running) break;\n';

javascriptGenerator['motion_attack'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const directionValue = javascriptGenerator.valueToCode(block, 'DIRECTION', javascriptGenerator.ORDER_NONE) || 0;
  const distanceValue = javascriptGenerator.valueToCode(block, 'DISTANCE', javascriptGenerator.ORDER_NONE) || 100;
  code += `await tank.util.attack(${directionValue}, ${distanceValue});\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['motion_move'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const directionValue = javascriptGenerator.valueToCode(block, 'DIRECTION', javascriptGenerator.ORDER_NONE) || 0;
  const speedValue = javascriptGenerator.valueToCode(block, 'SPEED', javascriptGenerator.ORDER_NONE) || 100;
  code += `await tank.util.move(${directionValue}, ${speedValue});\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['motion_turnright'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const degreesCode = javascriptGenerator.valueToCode(block, 'DEGREES', javascriptGenerator.ORDER_NONE) || 0;
  code += `await tank.util.turnRight(${degreesCode});\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['motion_turnleft'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const degreesCode = javascriptGenerator.valueToCode(block, 'DEGREES', javascriptGenerator.ORDER_NONE) || 0;
  code += `await tank.util.turnLeft(${degreesCode});\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['motion_pointindirection'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const directionCode = javascriptGenerator.valueToCode(block, 'DIRECTION', javascriptGenerator.ORDER_NONE) || 0;
  code += `await tank.util.setDirection(+${directionCode});\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['motion_setspeed'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const speedCode = javascriptGenerator.valueToCode(block, 'SPEED', javascriptGenerator.ORDER_NONE) || 0;
  code += `tank.util.speed = ${speedCode};\n`;
  return code;
};

javascriptGenerator['motion_stop'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  code += `tank.util.speed = 0;\n`;
  return code;
};

javascriptGenerator['motion_xposition'] = (block) => {
  return ['tank.util.x', javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['motion_yposition'] = (block) => {
  return ['tank.util.y', javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['motion_speed'] = (block) => {
  return ['tank.util.currentSpeed', javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['motion_direction'] = (block) => {
  return ['tank.util.direction', javascriptGenerator.ORDER_ATOMIC];
};
