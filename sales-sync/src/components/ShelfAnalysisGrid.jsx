import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Grid, Check, RefreshCw } from 'lucide-react';

const ShelfAnalysisGrid = ({ imageUrl, onShelfShareCalculated }) => {
  const [gridVisible, setGridVisible] = useState(false);
  const [gridSize, setGridSize] = useState({ rows: 4, cols: 6 });
  const [selectedCells, setSelectedCells] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null);

  // Load image and get dimensions
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        setImageLoaded(true);
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  // Toggle grid visibility
  const toggleGrid = () => {
    setGridVisible(!gridVisible);
    if (!gridVisible) {
      // Reset selected cells when showing grid
      setSelectedCells([]);
    }
  };

  // Toggle cell selection
  const toggleCell = (rowIndex, colIndex) => {
    const cellId = `${rowIndex}-${colIndex}`;
    if (selectedCells.includes(cellId)) {
      setSelectedCells(selectedCells.filter(id => id !== cellId));
    } else {
      setSelectedCells([...selectedCells, cellId]);
    }
  };

  // Calculate shelf share percentage
  useEffect(() => {
    if (gridVisible) {
      const totalCells = gridSize.rows * gridSize.cols;
      const selectedCount = selectedCells.length;
      const percentage = (selectedCount / totalCells) * 100;
      onShelfShareCalculated(Math.round(percentage));
    }
  }, [selectedCells, gridSize, gridVisible, onShelfShareCalculated]);

  // Reset grid
  const resetGrid = () => {
    setSelectedCells([]);
  };

  // Render grid cells
  const renderGrid = () => {
    const cells = [];
    const cellWidth = 100 / gridSize.cols;
    const cellHeight = 100 / gridSize.rows;

    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        const cellId = `${row}-${col}`;
        const isSelected = selectedCells.includes(cellId);
        
        cells.push(
          <div
            key={cellId}
            className={`absolute cursor-pointer border border-white/50 ${
              isSelected ? 'bg-blue-500/50' : 'bg-transparent hover:bg-white/20'
            }`}
            style={{
              left: `${col * cellWidth}%`,
              top: `${row * cellHeight}%`,
              width: `${cellWidth}%`,
              height: `${cellHeight}%`,
            }}
            onClick={() => toggleCell(row, col)}
          >
            {isSelected && (
              <div className="flex items-center justify-center h-full">
                <Check className="text-white h-4 w-4" />
              </div>
            )}
          </div>
        );
      }
    }

    return cells;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Shelf"
          className="w-full rounded border border-gray-200"
          onLoad={() => setImageLoaded(true)}
        />
        
        {gridVisible && imageLoaded && (
          <div className="absolute inset-0">
            {renderGrid()}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant={gridVisible ? "default" : "outline"}
          size="sm"
          onClick={toggleGrid}
        >
          <Grid className="h-4 w-4 mr-2" />
          {gridVisible ? "Hide Grid" : "Show Grid"}
        </Button>

        {gridVisible && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetGrid}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Selection
          </Button>
        )}
      </div>

      {gridVisible && (
        <div className="bg-gray-100 p-3 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Selected:</span>
            <span className="text-sm font-bold">{selectedCells.length} of {gridSize.rows * gridSize.cols} cells</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm font-medium">Brand Shelf Share:</span>
            <span className="text-sm font-bold text-blue-600">
              {Math.round((selectedCells.length / (gridSize.rows * gridSize.cols)) * 100)}%
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm font-medium">Competitor Shelf Share:</span>
            <span className="text-sm font-bold text-rose-600">
              {100 - Math.round((selectedCells.length / (gridSize.rows * gridSize.cols)) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelfAnalysisGrid;