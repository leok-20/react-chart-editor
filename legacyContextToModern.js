const j = require('jscodeshift');

module.exports = function transformer(file, api) {
  const root = j(file.source);

  root.find(j.ClassDeclaration).forEach(path => {
    const classNode = path.node;
    const className = classNode.id.name;

    const contextProps = ['contextTypes', 'childContextTypes'];

    contextProps.forEach(prop => {
      const contextNode = classNode.body.body.find(
        n =>
          n.type === 'ClassProperty' &&
          n.static === true &&
          n.key.name === prop
      );

      if (contextNode) {
        const contextVarName = `${className}${prop === 'childContextTypes' ? 'Context' : 'Context'}`;
        const createContextDecl = j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier(contextVarName),
            j.callExpression(
              j.memberExpression(j.identifier('React'), j.identifier('createContext')),
              []
            )
          )
        ]);

        j(path).insertBefore([createContextDecl]);

        path.get('body', 'body').get(contextNode).prune();
      }
    });
  });

  return root.toSource({ quote: 'single' });
};
