import { javascriptGenerator } from './generator';

javascriptGenerator['sensing_scanwidth'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const widthValue = this.valueToCode(block, 'WIDTH', this.ORDER_NONE) || 5;
  code += `target.util.scanWidth = ${widthValue};\n`;
  return code;
};

javascriptGenerator['sensing_scan'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const directionValue = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || 0;
  code += `(await target.util.scan(${directionValue}) !== Infinity)`;
  return [code, this.ORDER_EQUALITY];
};

javascriptGenerator['sensing_scandistance'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const directionValue = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || 0;
  code += `(await target.util.scan(${directionValue}))`;
  return [code, this.ORDER_FUNCTION_CALL];
};

javascriptGenerator['sensing_health'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `target.util.health`;
  return [code, this.ORDER_FUNCTION_CALL];
};
