interface GridResult {
  columns: number;
  itemWidth: number;
  itemsHeight: number;
}
export const calculateGridColumns = (
  containerWidth: number,
  containerHeight: number,
  padding: number = 0,
  gap: number = 0,
  videoCount: number,
  aspectRatio = 16 / 9,
): GridResult => {
  const availableWidth = containerWidth - padding * 2;
  const availableHeight = containerHeight - padding * 2;

  const minElementWidth = 240;
  const maxCols = Math.max(1, Math.floor(availableWidth / minElementWidth))

  let bestLayout = {
    cols: 0,
    rows: 0,
    width: 0,
    height: 0,
    area: 0,
  };

  for (let cols = 1; cols <= maxCols; cols++) {
    const rows = Math.ceil(videoCount / cols);

    const hScale = (availableWidth - gap * (cols - 1)) / (cols * aspectRatio);
    const vScale = (availableHeight - gap * (rows - 1)) / rows;
    const scale = Math.min(hScale, vScale);

    const width = Math.floor(scale * aspectRatio);
    const height = Math.floor(scale);
    const area = width * height;

    if (area > bestLayout.area) {
      bestLayout = { cols, rows, width, height, area };
    }
  }

  const { cols, width, height } = bestLayout;

  const rows = Math.ceil(videoCount / cols);

  const totalWidth = width * cols + gap * (cols - 1);
  const totalHeight = height * rows + gap * (rows - 1);
  const marginX = padding + (availableWidth - totalWidth) / 2;
  const marginY = padding + (availableHeight - totalHeight) / 2;

  return { columns: cols, itemsHeight: totalHeight, itemWidth: totalWidth };
};
