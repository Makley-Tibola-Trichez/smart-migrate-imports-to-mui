import type { Collection, ImportDeclaration, JSCodeshift } from 'jscodeshift';

const deprecatedImportsFromSmartHooks = ['useMediaQuery'];

export function removeSmartHooksImports(j: JSCodeshift, smartHooksImports: Collection<ImportDeclaration>) {
  const removedSpecifiersSmart: string[] = [];

  // remove os specifiers de @s_mart/hooks que estão deprecated
  smartHooksImports
    .find(j.ImportSpecifier)
    .filter((path) => deprecatedImportsFromSmartHooks.includes(path.node.imported.name))
    .map((path) => {
      removedSpecifiersSmart.push(path.node.imported.name);
      return path;
    })
    .remove();

  // Remove os imports de @s_mart/hooks que não tem mais nenhum
  for (const path of smartHooksImports.paths()) {
    if (path.node.specifiers?.length === 0) {
      j(path).remove();
    }
  }

  return removedSpecifiersSmart;
}
