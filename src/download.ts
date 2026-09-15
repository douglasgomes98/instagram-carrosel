export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadZip(
  files: { filename: string; blob: Blob }[],
  zipFilename: string,
) {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const usedNames = new Map<string, number>();

  files.forEach(({ filename, blob }) => {
    const seen = usedNames.get(filename) ?? 0;
    usedNames.set(filename, seen + 1);
    const name =
      seen === 0 ? filename : filename.replace(/(\.[^.]+)$/, `-${seen + 1}$1`);
    zip.file(name, blob);
  });

  const blob = await zip.generateAsync({ type: "blob", compression: "STORE" });
  downloadBlob(blob, zipFilename);
}
