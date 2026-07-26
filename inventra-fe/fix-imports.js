const { Project } = require("ts-morph");

const project = new Project();
project.addSourceFilesAtPaths("src/app/**/*.tsx");
project.addSourceFilesAtPaths("src/components/**/*.tsx");

for (const sourceFile of project.getSourceFiles()) {
  let modified = false;
  const imports = sourceFile.getImportDeclarations();
  
  let transImportCount = 0;
  for (const imp of imports) {
    const named = imp.getNamedImports();
    for (const n of named) {
      if (n.getName() === "Trans") {
        transImportCount++;
        if (transImportCount > 1) {
          // Remove this duplicate
          n.remove();
          modified = true;
        }
      }
    }
    // if import {} from "..." is now empty, we might want to remove it, but ts-morph doesn't strictly require it
    if (imp.getNamedImports().length === 0 && imp.getDefaultImport() == null) {
      imp.remove();
      modified = true;
    }
  }

  if (modified) {
    sourceFile.saveSync();
    console.log("Fixed imports in", sourceFile.getFilePath());
  }
}
