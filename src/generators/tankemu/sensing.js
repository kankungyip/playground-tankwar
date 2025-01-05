import { TankemuGenerator } from './generator';

const proto = TankemuGenerator.prototype;

proto['sensing_scanwidth'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const widthValue = this.valueToCode(block, 'WIDTH', this.ORDER_NONE) || 5;
  code += `target.setAttr('scanWidth', ${widthValue});\n`;
  return code;
};

proto['sensing_scan'] = function (block) {
  const directionValue = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || 0;
  const code = `(await tankUtils.scan(target, ${directionValue}) !== Infinity)`;
  return [code, this.ORDER_EQUALITY];
};

proto['sensing_scandistance'] = function (block) {
  const directionValue = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || 0;
  const code = `(await tankUtils.scan(target, ${directionValue}))`;
  return [code, this.ORDER_FUNCTION_CALL];
};

proto['sensing_health'] = function () {
  return [`target.getAttr('health')`, this.ORDER_FUNCTION_CALL];
};
