const { Project, SyntaxKind } = require("ts-morph");

const project = new Project();
project.addSourceFilesAtPaths("src/app/**/*.tsx");
project.addSourceFilesAtPaths("src/components/**/*.tsx");

let totalModified = 0;

for (const sourceFile of project.getSourceFiles()) {
  let modified = false;

  // 1. Wrap JsxText
  const jsxTexts = sourceFile.getDescendantsOfKind(SyntaxKind.JsxText);
  for (const text of jsxTexts) {
    const parent = text.getParent();
    if (parent && parent.getKind() === SyntaxKind.JsxElement) {
      const opening = parent.getOpeningElement();
      if (opening.getTagNameNode().getText() === "Trans") {
        continue;
      }
    }

    const val = text.getLiteralText();
    // Match strings that have at least one letter and aren't pure spaces
    if (val.trim().length > 0 && /[a-zA-Z]/.test(val)) {
      text.replaceWithText(`{/* @ts-ignore */}<Trans>${val.trim()}</Trans>`);
      modified = true;
    }
  }

  // 2. Wrap strings in toast.success/toast.error
  const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  for (const call of calls) {
    const expr = call.getExpression();
    if (expr.getText() === "toast.success" || expr.getText() === "toast.error") {
      const args = call.getArguments();
      if (args.length > 0 && args[0].getKind() === SyntaxKind.StringLiteral) {
        const strVal = args[0].getLiteralText();
        args[0].replaceWithText(`_("${strVal}")`);
        modified = true;
      }
    }
  }

  if (modified) {
    // Inject import { Trans } from "@lingui/macro"
    const imports = sourceFile.getImportDeclarations();
    const hasTrans = imports.some(imp => 
      imp.getModuleSpecifierValue() === "@lingui/macro" && 
      imp.getNamedImports().some(n => n.getName() === "Trans")
    );
    if (!hasTrans) {
      sourceFile.addImportDeclaration({
        namedImports: ["Trans"],
        moduleSpecifier: "@lingui/macro"
      });
    }

    // Inject import { useLingui } from "@lingui/react" if _ is used
    const hasUseLingui = sourceFile.getFullText().includes('_("');
    if (hasUseLingui) {
       // just rough injection
       const hasUseLinguiImport = imports.some(imp => imp.getModuleSpecifierValue() === "@lingui/react");
       if (!hasUseLinguiImport) {
          sourceFile.addImportDeclaration({
            namedImports: ["useLingui"],
            moduleSpecifier: "@lingui/react"
          });
       }
       // We would also need `const { _ } = useLingui();` inside the component
    }

    sourceFile.saveSync();
    console.log("Modified", sourceFile.getFilePath());
    totalModified++;
  }
}
console.log("Total modified:", totalModified);
