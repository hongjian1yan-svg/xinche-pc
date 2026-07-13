import { readFileSync, writeFileSync, rmSync } from 'fs'

let html = readFileSync('./dist/index.html', 'utf-8')

// 清理 script 标签上的无效属性
html = html.replace(/<script\b[^>]*>/g, '<script>')

// 清理 style 标签上的无效属性
html = html.replace(/<style\b[^>]*>/g, '<style>')

// 将 script 从 <head> 移到 </body> 前（确保 #app 已渲染）
// 注意：JS 代码含 $attrs 等 $ 字符，必须用函数形式替换，避免 $ 被特殊处理
const scriptStart = html.indexOf('<script>')
const scriptEnd = html.indexOf('</script>') + '</script>'.length
if (scriptStart !== -1 && scriptEnd !== -1) {
  const block = html.slice(scriptStart, scriptEnd)
  html = html.slice(0, scriptStart) + html.slice(scriptEnd)
  html = html.replace('</body>', () => block + '\n</body>')
}

// 输出为独立文件，不覆盖源模板
writeFileSync('./冻结车管理.html', html, 'utf-8')

// 删除 dist 文件夹
rmSync('./dist', { recursive: true, force: true })

console.log('✓ 完成！双击「冻结车管理.html」即可打开')
