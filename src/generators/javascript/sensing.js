import { javascriptGenerator } from '@blockcode/blocks-player';

javascriptGenerator['sensing_scanwidth'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const widthValue = javascriptGenerator.valueToCode(block, 'WIDTH', javascriptGenerator.ORDER_NONE) || 5;
  code += `tank.util.scanWidth = ${widthValue};\n`;
  return code;
};

javascriptGenerator['sensing_scan'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const directionValue = javascriptGenerator.valueToCode(block, 'DIRECTION', javascriptGenerator.ORDER_NONE) || 0;
  code += `(await tank.util.scan(${directionValue}) !== Infinity)`;
  return [code, javascriptGenerator.ORDER_EQUALITY];
};

javascriptGenerator['sensing_scandistance'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const directionValue = javascriptGenerator.valueToCode(block, 'DIRECTION', javascriptGenerator.ORDER_NONE) || 0;
  code += `(await tank.util.scan(${directionValue}))`;
  return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator['sensing_health'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  code += `tank.util.health`;
  return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};
