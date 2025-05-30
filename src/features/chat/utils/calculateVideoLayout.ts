interface VideoLayout {
  width: number;
  height: number;
  x: number;
  y: number;
}

export const calculateVideoLayout = (
  containerWidth: number,
  containerHeight: number,
  padding: number = 0,
  gap: number = 0,
  videoCount: number,
  aspectRatio = 16 / 9,
  mode: "grid" | "horizontal-scroll" = "grid",
): VideoLayout[] => {
  if (videoCount === 0) return [];

  const availableWidth = containerWidth - padding * 2;
  const availableHeight = containerHeight - padding * 2;

  if (mode === "horizontal-scroll") {
    const height = containerHeight - padding * 2;
    const width = height * aspectRatio;

    return Array(videoCount)
      .fill(0)
      .map((_, i) => ({
        width,
        height,
        x: padding + i * (width + gap),
        y: padding,
      }));
  }

  //   if (mode === "horizontal-scroll" && videoCount > 1) {
  //     // Режим демонстрации экрана - основной экран занимает большую часть
  //     const mainWidth = availableWidth * 0.7 - gap;
  //     const mainHeight = availableWidth / aspectRatio;

  //     const secondaryWidth = availableWidth * 0.3 - gap;
  //     const secondaryHeight =
  //       secondaryWidth /
  //       aspectRatio
  //     //   (availableHeight - gap * (videoCount - 2)) /
  //     //   (videoCount - 1);

  //     const layouts: VideoLayout[] = [
  //       {
  //         width: mainWidth,
  //         height: mainHeight,
  //         x: padding,
  //         y: padding,
  //       },
  //     ];

  //     for (let i = 1; i < videoCount; i++) {
  //       layouts.push({
  //         width: secondaryWidth,
  //         height: secondaryHeight,
  //         x: padding + mainWidth + gap,
  //         y: padding + (secondaryHeight + gap) * (i - 1),
  //       });
  //     }

  //     return layouts;
  //   }

  // Стандартная сетка
  let bestLayout = {
    cols: 0,
    rows: 0,
    width: 0,
    height: 0,
    area: 0,
  };

  for (let cols = 1; cols <= videoCount; cols++) {
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

  const layouts: VideoLayout[] = [];
  const { cols, width, height } = bestLayout;

  const rows = Math.ceil(videoCount / cols);

  const totalWidth = width * cols + gap * (cols - 1);
  const totalHeight = height * rows + gap * (rows - 1);
  const marginX = padding + (availableWidth - totalWidth) / 2;
  const marginY = padding + (availableHeight - totalHeight) / 2;

  for (let i = 0; i < videoCount; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    let offset = 0;
    if (row == rows - 1) {
      if (videoCount % cols !== 0)
        offset +=
          width / ((videoCount % cols) + 1) - gap * ((videoCount % cols) - 1);
    }

    layouts.push({
      width,
      height,
      x: marginX + col * (width + gap) + offset,
      y: marginY + row * (height + gap),
    });
  }

  return layouts;
};
