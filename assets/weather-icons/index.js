const modules = import.meta.glob('./icon-*.png')
const iconMap = {}
for (const [path, loader] of Object.entries(modules)) {
  const filename = path.replace('./', '').replace('.png', '')
  iconMap[filename] = loader
}
export default iconMap
