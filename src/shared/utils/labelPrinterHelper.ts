export function pxX(percent: number, widthPx: number) {
  return Math.round((percent / 100) * widthPx);
}

export function pxY(percent: number, heightPx: number) {
  return Math.round((percent / 100) * heightPx);
}

export function pxFont(percentHeight: number, heightPx: number) {
  // Escala tamaño de fuente relativo al alto
  return Math.round((percentHeight / 100) * heightPx);
}

export function qrMagnification(
  percentWidth: number,
  dpi: number,
  labelWidthInch: number
) {
  // 1 inch = dpi dots
  const labelWidthDots = labelWidthInch * dpi;

  // tamaño objetivo del QR en dots (ej: 30% del ancho de la etiqueta)
  const targetSizeDots = (percentWidth / 100) * labelWidthDots;

  // cada módulo del QR ocupa "magnification" dots
  // el QR tiene aprox 29 módulos base (depende del contenido pero 29 es el mínimo en QR versión 3)
  const modules = 29;

  // calcular magnification necesario
  return Math.round(targetSizeDots / modules);
}
