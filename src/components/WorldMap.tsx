
import { useEffect, useRef } from "react";

interface RegionsData {
  [key: string]: { 
    ongoing: number; 
    completed: number; 
  };
}

interface WorldMapProps {
  regions: RegionsData;
  selectedFilter: 'all' | 'ongoing' | 'completed';
}

const WorldMap = ({ regions, selectedFilter }: WorldMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = mapRef.current.clientWidth;
    canvas.height = mapRef.current.clientHeight;
    mapRef.current.innerHTML = '';
    mapRef.current.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Define coordinates for each region (center points)
    const coordinates = {
      'North America': { x: canvas.width * 0.2, y: canvas.height * 0.4 },
      'Europe': { x: canvas.width * 0.48, y: canvas.height * 0.35 },
      'Asia': { x: canvas.width * 0.7, y: canvas.height * 0.4 },
      'South America': { x: canvas.width * 0.3, y: canvas.height * 0.7 },
      'Africa': { x: canvas.width * 0.5, y: canvas.height * 0.6 },
      'Middle East': { x: canvas.width * 0.58, y: canvas.height * 0.45 }
    };
    
    // Draw simplified world map outline
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#cccccc';
    ctx.beginPath();
    // Very simplified continent outlines
    // North America
    ctx.moveTo(canvas.width * 0.05, canvas.height * 0.3);
    ctx.lineTo(canvas.width * 0.25, canvas.height * 0.2);
    ctx.lineTo(canvas.width * 0.3, canvas.height * 0.5);
    ctx.lineTo(canvas.width * 0.15, canvas.height * 0.55);
    ctx.closePath();
    
    // South America
    ctx.moveTo(canvas.width * 0.25, canvas.height * 0.55);
    ctx.lineTo(canvas.width * 0.35, canvas.height * 0.6);
    ctx.lineTo(canvas.width * 0.3, canvas.height * 0.85);
    ctx.lineTo(canvas.width * 0.2, canvas.height * 0.75);
    ctx.closePath();
    
    // Europe
    ctx.moveTo(canvas.width * 0.45, canvas.height * 0.25);
    ctx.lineTo(canvas.width * 0.55, canvas.height * 0.2);
    ctx.lineTo(canvas.width * 0.53, canvas.height * 0.4);
    ctx.lineTo(canvas.width * 0.43, canvas.height * 0.45);
    ctx.closePath();
    
    // Africa
    ctx.moveTo(canvas.width * 0.45, canvas.height * 0.45);
    ctx.lineTo(canvas.width * 0.55, canvas.height * 0.45);
    ctx.lineTo(canvas.width * 0.58, canvas.height * 0.75);
    ctx.lineTo(canvas.width * 0.45, canvas.height * 0.8);
    ctx.lineTo(canvas.width * 0.4, canvas.height * 0.6);
    ctx.closePath();
    
    // Asia
    ctx.moveTo(canvas.width * 0.55, canvas.height * 0.2);
    ctx.lineTo(canvas.width * 0.9, canvas.height * 0.25);
    ctx.lineTo(canvas.width * 0.85, canvas.height * 0.6);
    ctx.lineTo(canvas.width * 0.6, canvas.height * 0.65);
    ctx.lineTo(canvas.width * 0.55, canvas.height * 0.45);
    ctx.closePath();
    
    ctx.stroke();
    
    // Draw project indicators based on filter
    Object.entries(regions).forEach(([region, data]) => {
      if (!coordinates[region as keyof typeof coordinates]) return;
      
      const { x, y } = coordinates[region as keyof typeof coordinates];
      
      // Determine which data to show based on filter
      let size = 0;
      if (selectedFilter === 'all') {
        size = data.ongoing + data.completed;
      } else if (selectedFilter === 'ongoing') {
        size = data.ongoing;
      } else {
        size = data.completed;
      }
      
      // Skip if no data to show
      if (size === 0) return;
      
      // Scale the circle size based on the data
      const radius = Math.max(15, Math.min(30, 10 + size * 5));
      
      // Draw circle for the region
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      
      // Color based on filter
      if (selectedFilter === 'ongoing') {
        ctx.fillStyle = 'rgba(52, 152, 219, 0.7)'; // Blue for ongoing
      } else if (selectedFilter === 'completed') {
        ctx.fillStyle = 'rgba(46, 204, 113, 0.7)'; // Green for completed
      } else {
        ctx.fillStyle = 'rgba(155, 89, 182, 0.7)'; // Purple for all
      }
      
      ctx.fill();
      ctx.stroke();
      
      // Add region name and count
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(region, x, y - 5);
      ctx.font = '12px Arial';
      ctx.fillText(size.toString(), x, y + 15);
    });
    
  }, [regions, selectedFilter]);
  
  return (
    <div ref={mapRef} className="w-full h-full"></div>
  );
};

export default WorldMap;
