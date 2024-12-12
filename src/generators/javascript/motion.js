import { javascriptGenerator } from './generator';

javascriptGenerator['motion_attack'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const directionValue = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || 0;
  const distanceValue = this.valueToCode(block, 'DISTANCE', this.ORDER_NONE) || 100;
  code += this.wrapAsync(`await target.util.attack(${directionValue}, ${distanceValue});`);
  return code;
};

javascriptGenerator['motion_move'] = (block) => {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const directionValue = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || 0;
  const speedValue = this.valueToCode(block, 'SPEED', this.ORDER_NONE) || 100;
  code += this.wrapAsync(`await target.util.move(${directionValue}, ${speedValue});`);
  return code;
};

javascriptGenerator['motion_turnright'] = (block) => {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const degreesCode = this.valueToCode(block, 'DEGREES', this.ORDER_NONE) || 0;
  code += this.wrapAsync(`await target.util.turnRight(${degreesCode});`);
  return code;
};

javascriptGenerator['motion_turnleft'] = (block) => {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const degreesCode = this.valueToCode(block, 'DEGREES', this.ORDER_NONE) || 0;
  code += this.wrapAsync(`await target.util.turnLeft(${degreesCode});`);
  return code;
};

javascriptGenerator['motion_pointindirection'] = (block) => {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const directionCode = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || 0;
  code += this.wrapAsync(`await target.util.setDirection(+${directionCode});`);
  return code;
};

javascriptGenerator['motion_setspeed'] = (block) => {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const speedCode = this.valueToCode(block, 'SPEED', this.ORDER_NONE) || 0;
  code += `target.util.speed = ${speedCode};\n`;
  return code;
};

javascriptGenerator['motion_stop'] = (block) => {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `target.util.speed = 0;\n`;
  return code;
};

javascriptGenerator['motion_xposition'] = (block) => {
  return ['target.util.x', this.ORDER_ATOMIC];
};

javascriptGenerator['motion_yposition'] = (block) => {
  return ['target.util.y', this.ORDER_ATOMIC];
};

javascriptGenerator['motion_speed'] = (block) => {
  return ['target.util.currentSpeed', this.ORDER_ATOMIC];
};

javascriptGenerator['motion_direction'] = (block) => {
  return ['target.util.direction', this.ORDER_ATOMIC];
};
