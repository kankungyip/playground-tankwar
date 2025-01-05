import { TankemuGenerator } from './generator';

const proto = TankemuGenerator.prototype;

proto['motion_attack'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const directionValue = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || '0';
  const distanceValue = this.valueToCode(block, 'DISTANCE', this.ORDER_NONE) || '100';
  code += `await tankUtils.attack(target, signal, ${directionValue}, ${distanceValue});\n`;
  return code;
};

proto['motion_move'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const directionValue = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || '0';
  const speedValue = this.valueToCode(block, 'SPEED', this.ORDER_NONE) || '100';
  code += `await tankUtils.move(target, signal, ${directionValue}, ${speedValue});\n`;
  return code;
};

proto['motion_turnright'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const degreesCode = this.valueToCode(block, 'DEGREES', this.ORDER_NONE) || 0;
  code += `await tankUtils.turnRight(target, signal, ${degreesCode});\n`;
  return code;
};

proto['motion_turnleft'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const degreesCode = this.valueToCode(block, 'DEGREES', this.ORDER_NONE) || 0;
  code += `await tankUtils.turnLeft(target, signal, ${degreesCode});\n`;
  return code;
};

proto['motion_pointindirection'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const directionCode = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || '0';
  code += `await tankUtils.setDirection(target, signal, ${directionCode});\n`;
  return code;
};

proto['motion_setspeed'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const speedCode = this.valueToCode(block, 'SPEED', this.ORDER_NONE) || '0';
  code += `tankUtils.setSpeed(target, ${speedCode});\n`;
  return code;
};

proto['motion_stop'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `tankUtils.stop(target);\n`;
  return code;
};

proto['motion_xposition'] = function (block) {
  return ['target.x()', this.ORDER_FUNCTION_CALL];
};

proto['motion_yposition'] = function (block) {
  return ['target.y()', this.ORDER_FUNCTION_CALL];
};

proto['motion_speed'] = function (block) {
  return [`target.getAttr('currentSpeed')`, this.ORDER_ATOMIC];
};

proto['motion_direction'] = function (block) {
  return ['tankUtils.getDirection(target)', this.ORDER_ATOMIC];
};
