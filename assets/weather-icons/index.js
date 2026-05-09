const modules = import.meta.glob('./icon-*.png', { eager: true, import: 'default' })
const iconMap = {}
for (const [path, url] of Object.entries(modules)) {
  const filename = path.replace('./', '').replace('.png', '')
  iconMap[filename] = url
}
export default iconMap
