#!/usr/bin/env node

import type { API, FileInfo,  } from 'jscodeshift';
import { removeSmartCoreImports } from './smart-core-imports';
import { removeSmartHooksImports } from './smart-hooks-imports';

export const parser = 'tsx';

const transform = (fileInfo: FileInfo, { jscodeshift: j }: API) => {
  const root = j(fileInfo.source);

  // Pega o primeiro import de @s_mart/core
  const smartCoreImports = root
    .find(j.ImportDeclaration, { importKind: 'value' })
    .filter((path) => path.node.source.value === '@s_mart/core');

  const smartHooksImports = root
    .find(j.ImportDeclaration, { importKind: 'value' })
    .filter((path) => path.node.source.value === '@s_mart/hooks');

  const muiImport = root
    .find(j.ImportDeclaration, { importKind: 'value' })
    .filter((path) => path.node.source.value === '@mui/material')
    .at(0);

  const removedSmartCoreImports = removeSmartCoreImports(j, smartCoreImports);
  const removedSmartHooksImports = removeSmartHooksImports(j, smartHooksImports);

  const removedSpecifiersSmart = [...removedSmartCoreImports, ...removedSmartHooksImports];

  // Se já existe um import de @mui/material, adiciona os specifiers removidos de @s_mart/core
  if (removedSpecifiersSmart.length > 0) {
    if (muiImport.size() > 0) {
      muiImport
        .get()
        .node.specifiers?.push(...removedSpecifiersSmart.map((name) => j.importSpecifier(j.identifier(name))));
    } else {
      // Se não existe um import de @mui/material, cria um novo import com os specifiers removidos de @s_mart/core
      const newImportDeclaration = j.importDeclaration(
        removedSpecifiersSmart.map((name) => j.importSpecifier(j.identifier(name))),
        j.literal('@mui/material'),
      );

      root.get().node.program.body.unshift(newImportDeclaration);
    }
  }

  return root.toSource();
};

export default transform;
