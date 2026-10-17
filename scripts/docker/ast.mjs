export function normalize(node){
 if(!node||typeof node!=='object')return node;
 if(Array.isArray(node))return node.map(normalize);
 if(node.type==='TemplateLiteral'){
  const segments=[node.quasis[0].value.cooked],expressions=[];
  for(let i=0;i<node.expressions.length;i++){
   const expression=node.expressions[i];
   if(expression.type==='Literal'&&typeof expression.value==='string')segments[segments.length-1]+=expression.value+node.quasis[i+1].value.cooked;
   else{expressions.push(normalize(expression));segments.push(node.quasis[i+1].value.cooked);}
  }
  return {type:'TemplateLiteral',segments,expressions};
 }
 return Object.fromEntries(Object.entries(node).filter(([key])=>!['start','end','raw','directive'].includes(key)).map(([key,value])=>[key,normalize(value)]));
}
