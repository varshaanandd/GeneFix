import React, { useEffect, useRef, useState } from 'react';
import '3dmol/build/3Dmol-min.js';

const DualProteinViewer = ({ 
  wildTypePdbUrl, 
  mutantPdbUrl, 
  wildTypeLabel = "Wild Type", 
  mutantLabel = "Mutant",
  mutationSite = 175  // Default to your R175H mutation
}) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [viewMode, setViewMode] = useState('cartoon'); // 'cartoon', 'stick', 'sphere'
  const viewerRef = useRef(null);
  const viewerInstance = useRef(null);
  const wildTypeModel = useRef(null);
  const mutantModel = useRef(null);

  useEffect(() => {
    if (!viewerRef.current || !window.$3Dmol) return;

    // Initialize viewer only once
    if (!viewerInstance.current) {
      viewerInstance.current = window.$3Dmol.createViewer(viewerRef.current, {
        backgroundColor: 'white',
      });
    }

    const viewer = viewerInstance.current;

    // Clear any existing models
    viewer.removeAllModels();
    wildTypeModel.current = null;
    mutantModel.current = null;

    // Load wild type PDB
    fetch(wildTypePdbUrl)
      .then(response => {
        if (!response.ok) throw new Error('Failed to load wild type PDB');
        return response.text();
      })
      .then(data => {
        wildTypeModel.current = viewer.addModel(data, 'pdb');
        
        // Style the entire protein
        wildTypeModel.current.setStyle({}, { 
          cartoon: { color: 'lightblue', opacity: 1 - (sliderValue / 100) } 
        });
        
        // Highlight the mutation site
        wildTypeModel.current.setStyle({resi: mutationSite}, { 
          stick: { colorscheme: 'greenCarbon', radius: 0.3, opacity: 1 - (sliderValue / 100) },
          cartoon: { color: 'green', opacity: 1 - (sliderValue / 100) }
        });
        
        // Add labels
        viewer.addLabel("R" + mutationSite + " (WT)", 
                       {position: wildTypeModel.current.selectedAtoms({resi: mutationSite, atom: "CA"})[0], 
                        backgroundColor: 'mintcream',
                        fontColor: 'darkgreen',
                        fontSize: 12,
                        showBackground: true});
        
        // Zoom to fit after first model is loaded
        viewer.zoomTo({resi: mutationSite});
        viewer.render();
      })
      .catch(error => console.error('Error loading wild type PDB:', error));

    // Load mutant PDB
    fetch(mutantPdbUrl)
      .then(response => {
        if (!response.ok) throw new Error('Failed to load mutant PDB');
        return response.text();
      })
      .then(data => {
        mutantModel.current = viewer.addModel(data, 'pdb');
        
        // Style the entire protein
        mutantModel.current.setStyle({}, { 
          cartoon: { color: 'pink', opacity: sliderValue / 100 } 
        });
        
        // Highlight the mutation site
        mutantModel.current.setStyle({resi: mutationSite}, { 
          stick: { colorscheme: 'redCarbon', radius: 0.3, opacity: sliderValue / 100 },
          cartoon: { color: 'red', opacity: sliderValue / 100 }
        });
        
        // Add labels
        viewer.addLabel("H" + mutationSite + " (Mut)", 
                       {position: mutantModel.current.selectedAtoms({resi: mutationSite, atom: "CA"})[0], 
                        backgroundColor: 'mistyrose',
                        fontColor: 'darkred',
                        fontSize: 12,
                        showBackground: true});
        
        // Update visibility based on current slider value
        updateViewMode(viewMode);
        viewer.render();
      })
      .catch(error => console.error('Error loading mutant PDB:', error));

    // Cleanup function
    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.removeAllModels();
      }
    };
  }, [wildTypePdbUrl, mutantPdbUrl, mutationSite]);

  // Update models' visibility when slider changes
  const updateModelVisibility = (value) => {
    if (!viewerInstance.current) return;
    
    if (wildTypeModel.current) {
      // Update whole protein
      wildTypeModel.current.setStyle({}, { 
        cartoon: { 
          color: 'lightblue',
          opacity: 1 - (value / 100)
        } 
      });
      
      // Update mutation site
      wildTypeModel.current.setStyle({resi: mutationSite}, { 
        stick: { colorscheme: 'greenCarbon', radius: 0.3, opacity: 1 - (value / 100) },
        cartoon: { color: 'green', opacity: 1 - (value / 100) }
      });
    }
    
    if (mutantModel.current) {
      // Update whole protein
      mutantModel.current.setStyle({}, { 
        cartoon: { 
          color: 'pink',
          opacity: value / 100
        } 
      });
      
      // Update mutation site
      mutantModel.current.setStyle({resi: mutationSite}, { 
        stick: { colorscheme: 'redCarbon', radius: 0.3, opacity: value / 100 },
        cartoon: { color: 'red', opacity: value / 100 }
      });
    }
    
    viewerInstance.current.render();
  };

  const updateViewMode = (mode) => {
    if (!viewerInstance.current) return;
    
    let wildStyle = {};
    let mutStyle = {};
    let wildMutationStyle = {};
    let mutMutationStyle = {};
    
    // Base styles for the whole protein
    if (mode === 'cartoon') {
      wildStyle = { cartoon: { color: 'lightblue', opacity: 1 - (sliderValue / 100) } };
      mutStyle = { cartoon: { color: 'pink', opacity: sliderValue / 100 } };
    } else if (mode === 'stick') {
      wildStyle = { stick: { colorscheme: 'cyanCarbon', radius: 0.2, opacity: 1 - (sliderValue / 100) } };
      mutStyle = { stick: { colorscheme: 'magentaCarbon', radius: 0.2, opacity: sliderValue / 100 } };
    } else if (mode === 'sphere') {
      wildStyle = { sphere: { colorscheme: 'cyanCarbon', radius: 1.0, opacity: 1 - (sliderValue / 100) } };
      mutStyle = { sphere: { colorscheme: 'magentaCarbon', radius: 1.0, opacity: sliderValue / 100 } };
    }
    
    // Special styles for mutation site
    if (mode === 'cartoon') {
      wildMutationStyle = { 
        stick: { colorscheme: 'greenCarbon', radius: 0.3, opacity: 1 - (sliderValue / 100) },
        cartoon: { color: 'green', opacity: 1 - (sliderValue / 100) }
      };
      mutMutationStyle = { 
        stick: { colorscheme: 'redCarbon', radius: 0.3, opacity: sliderValue / 100 },
        cartoon: { color: 'red', opacity: sliderValue / 100 }
      };
    } else if (mode === 'stick') {
      wildMutationStyle = { stick: { colorscheme: 'greenCarbon', radius: 0.4, opacity: 1 - (sliderValue / 100) } };
      mutMutationStyle = { stick: { colorscheme: 'redCarbon', radius: 0.4, opacity: sliderValue / 100 } };
    } else if (mode === 'sphere') {
      wildMutationStyle = { sphere: { colorscheme: 'greenCarbon', radius: 1.2, opacity: 1 - (sliderValue / 100) } };
      mutMutationStyle = { sphere: { colorscheme: 'redCarbon', radius: 1.2, opacity: sliderValue / 100 } };
    }
    
    // Apply styles
    if (wildTypeModel.current) {
      wildTypeModel.current.setStyle({}, wildStyle);
      wildTypeModel.current.setStyle({resi: mutationSite}, wildMutationStyle);
    }
    
    if (mutantModel.current) {
      mutantModel.current.setStyle({}, mutStyle);
      mutantModel.current.setStyle({resi: mutationSite}, mutMutationStyle);
    }
    
    viewerInstance.current.render();
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setSliderValue(value);
    updateModelVisibility(value);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    updateViewMode(mode);
  };

  return (
    <div className="protein-viewer-container">
      <div className="relative mb-6">
        <div 
          ref={viewerRef} 
          className="w-full h-96 border border-gray-300 rounded-lg shadow-md"
        />
        
        <div className="absolute top-4 left-4 bg-white bg-opacity-75 px-3 py-2 rounded shadow-sm text-sm">
          <span className="font-semibold">{sliderValue === 0 ? wildTypeLabel : 
            sliderValue === 100 ? mutantLabel : 
            `Transitioning (${sliderValue}%)`}</span>
        </div>
        
        <div className="absolute top-4 right-4 bg-white bg-opacity-75 px-3 py-2 rounded shadow-sm">
          <div className="flex space-x-2 text-sm">
            <button 
              onClick={() => handleViewModeChange('cartoon')}
              className={`px-2 py-1 rounded ${viewMode === 'cartoon' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Cartoon
            </button>
            <button 
              onClick={() => handleViewModeChange('stick')}
              className={`px-2 py-1 rounded ${viewMode === 'stick' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Stick
            </button>
            <button 
              onClick={() => handleViewModeChange('sphere')}
              className={`px-2 py-1 rounded ${viewMode === 'sphere' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Sphere
            </button>
          </div>
        </div>
      </div>
      
      <div className="slider-container flex items-center space-x-4 mb-4">
        <span className="text-blue-600 font-medium">{wildTypeLabel}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={handleSliderChange}
          className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-red-600 font-medium">{mutantLabel}</span>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        <div>Green highlight: Wild Type Arg175</div>
        <div>Red highlight: Mutant His175</div>
      </div>
    </div>
  );
};

export default DualProteinViewer;