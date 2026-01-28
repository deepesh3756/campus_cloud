const PdfViewer = ({
  src,
  title = "PDF Viewer",
  height = 520,
  className = "",
  style,
}) => {
  if (!src) return null;

  return (
    <div className={className} style={style}>
      <iframe
        src={src}
        title={title}
        width="100%"
        height={height}
        style={{ border: "0", borderRadius: 12 }}
      />
    </div>
  );
};

export default PdfViewer;
