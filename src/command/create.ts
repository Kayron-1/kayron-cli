import path from 'path';
import fs from 'fs-extra';
import { input, select } from '@inquirer/prompts';
import { clone } from '../utils/clone';

export interface TemplateInfo {
  name: string // 模板名称
  downloadUrl: string // 模板下载地址
  description: string // 模板描述
  branch: string // 模板分支
}

export const templates: Map<string, TemplateInfo> = new Map(
  [
    ['Vite-Vue3-Typescript-template', {
      name: 'Vite-Vue3-Typescript-template',
      downloadUrl: 'git@gitee.com:songkailong/admin-pro.git',
      description: 'vue3技术栈开发模板',
      branch: 'dev'
    }],
    ['Vite-template', {
      name: 'Vite-Vue3-Typescript-template',
      downloadUrl: 'git@gitee.com:songkailong/admin-pro.git',
      description: 'vue3技术栈开发模板',
      branch: 'master'
    }]
  ]
)

export function isOverWrite(fileName: string) {
  console.warn(`${fileName}文件夹已存在，是否覆盖`)
  return select({
    message: '是否覆盖',
    choices: [
      { name: '覆盖', value: true },
      { name: '取消', value: false }
    ]
  })
}

export async function create(projectName?: string) {
  // 初始化模板列表
  const templateList = Array.from(templates).map((item: [string, TemplateInfo]) => {
    const [name, info] = item
    return {
      name,
      value: name,
      description: info.description
    }
  })
  if (!projectName) {
    projectName = await input({ message: '请输入项目名称' })
  }

  // 如果文件夹存在，提示是否覆盖
  const filePath = path.resolve(process.cwd(), projectName)
  if (fs.existsSync(filePath)) {
    const run = await isOverWrite(projectName)
    if (run) {
      await fs.remove(filePath)
    } else {
      return
    }
  }
  const templateName = await select({
    message: '请选择模板',
    choices: templateList
  })
  const info = templates.get(templateName)
  console.log(info)
  if (info) {
    clone(info.downloadUrl, projectName!, ['-b', info.branch])
  }
}