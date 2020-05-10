import fs from 'fs';
import path from 'path';
import cpy from 'cpy';

const filesWithDots = (name: string) => {
  switch (name) {
    case 'gitkeep':
    case 'gitignore':
    case 'eslintrc':
    case 'stylelintrc':
    case 'yarnrc':
    case 'npmrc':
    case 'editorconfig':
    case 'babelrc': {
      return '.'.concat(name);
    }
    default: {
      return name;
    }
  }
};

const renameFoldersWithDots = (root: string) => {
  const folders = ['vscode', 'jest'];
  folders.forEach(folder => fs.renameSync(path.join(root, folder), path.join(root, `.${folder}`)));
};

type Props = {
  appRoot: string;
  baseTemplate: 'next';
  specificTemplate: 'next' | 'next-i18n';
}

export const copyAll = async ({ appRoot, baseTemplate }: Props) => {
  const templatesPath = path.join(__dirname, '..', '..', 'templates');
  await cpy('**/*', appRoot, {
    parents: true,
    cwd: path.join(templatesPath, 'default'),
    rename: filesWithDots,
  });

  await cpy('**/*', appRoot, {
    parents: true,
    cwd: path.join(templatesPath, baseTemplate),
    rename: filesWithDots,
  });

  // // Add specific template type files
  // if (baseTemplate !== specificTemplate) {
  //   await cpy('**', appRoot, {
  //     parents: true,
  //     cwd: path.join(templatesPath, specificTemplate),
  //     rename: filesWithDots,
  //   });
  // }

  renameFoldersWithDots(appRoot);
};

