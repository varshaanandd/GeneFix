import { useEffect, useRef } from 'react';

const ProteinViewer = ({ pdbUrl }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!pdbUrl || !viewerRef.current) return;

    // Clear existing content
    viewerRef.current.innerHTML = '';

    const stage = new window.NGL.Stage(viewerRef.current);

    stage.loadFile(pdbUrl).then(component => {
      component.addRepresentation('cartoon', { color: 'residueindex' });
      component.autoView();
    });
  }, [pdbUrl]);

  return (
    <div
      ref={viewerRef}
      style={{ width: '100%', height: '500px', backgroundColor: 'black' }}
    />
  );
};

export default ProteinViewer;
