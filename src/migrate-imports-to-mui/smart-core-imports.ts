import type { Collection, ImportDeclaration, JSCodeshift } from 'jscodeshift';

export function removeSmartCoreImports(j: JSCodeshift, smartCoreImports: Collection<ImportDeclaration>) {
  const removedSpecifiersSmart: string[] = [];

  smartCoreImports
    .find(j.ImportSpecifier)
    .filter((path) => deprecatedImportsFromSmartCore.includes(path.node.imported.name))
    .map((path) => {
      removedSpecifiersSmart.push(path.node.imported.name);
      return path;
    })
    .remove();

  // Remove os imports de @s_mart/core que não tem mais nenhum specifier
  for (const path of smartCoreImports.paths()) {
    if (path.node.specifiers?.length === 0) {
      j(path).remove();
    }
  }

  return removedSpecifiersSmart;
}

const deprecatedImportsFromSmartCore = [
  'AccordionProps',
  'Avatar',
  'AvatarProps',
  'Backdrop',
  'BackdropProps',
  'Chip',
  'ChipProps',
  'CircularProgress',
  'CircularProgressProps',
  'Divider',
  'DividerProps',
  'Grid',
  'InputAdornment',
  'InputAdornmentProps',
  'Skeleton',
  'SkeletonProps',
  'Tooltip',
  'TooltipProps',
  'Typography',
  'TypographyProps',
];
