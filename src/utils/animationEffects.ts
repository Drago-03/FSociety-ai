/**
 * Animation effects utility for FSociety AI
 * Provides functions to create interactive security-themed animations
 */

/**
 * Creates a virus particle at the specified coordinates
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param container - Container element to append the virus to
 * @returns The created virus element
 */
export const createVirusParticle = (x: number, y: number, container: HTMLElement): HTMLElement => {
  const virus = document.createElement('div');
  virus.className = 'virus-particle';
  virus.style.left = `${x}px`;
  virus.style.top = `${y}px`;
  container.appendChild(virus);
  return virus;
};

/**
 * Eliminates a virus particle with animation
 * @param virus - The virus element to eliminate
 * @param trashBinElement - Optional trash bin element for the virus to move towards
 */
export const eliminateVirus = (virus: HTMLElement, trashBinElement?: HTMLElement): void => {
  virus.classList.add('virus-eliminated');
  
  if (trashBinElement) {
    // Get positions for animation
    const virusRect = virus.getBoundingClientRect();
    const trashRect = trashBinElement.getBoundingClientRect();
    
    // Calculate translation values
    const translateX = trashRect.left - virusRect.left + (trashRect.width / 2) - (virusRect.width / 2);
    const translateY = trashRect.top - virusRect.top + (trashRect.height / 2);
    
    // Apply custom animation with translation towards trash bin
    virus.style.setProperty('--tx', `${translateX}px`);
    virus.style.setProperty('--ty', `${translateY}px`);
  }
  
  // Remove the virus element after animation completes
  setTimeout(() => {
    if (virus.parentNode) {
      virus.parentNode.removeChild(virus);
    }
  }, 800);
};

/**
 * Creates a crawling bug element
 * @param startX - Starting X coordinate
 * @param startY - Starting Y coordinate
 * @param container - Container element to append the bug to
 * @returns The created bug element
 */
export const createBug = (startX: number, startY: number, container: HTMLElement): HTMLElement => {
  const bug = document.createElement('div');
  bug.className = 'bug';
  bug.style.left = `${startX}px`;
  bug.style.top = `${startY}px`;
  
  // Randomize the animation duration between 2-4 seconds
  const duration = 2 + Math.random() * 2;
  bug.style.animation = `bug-crawl ${duration}s linear infinite alternate`;
  
  container.appendChild(bug);
  return bug;
};

/**
 * Activates the shield protection effect on an element
 * @param element - The element to apply the shield effect to
 */
export const activateShield = (element: HTMLElement): void => {
  element.classList.add('shield-protection');
  
  // Remove the class after animation completes
  setTimeout(() => {
    element.classList.remove('shield-protection');
  }, 2000);
};

/**
 * Shows a scan complete animation on an element
 * @param element - The element to apply the scan complete effect to
 */
export const showScanComplete = (element: HTMLElement): void => {
  element.classList.add('scan-complete');
  
  // Remove the class after animation completes
  setTimeout(() => {
    element.classList.remove('scan-complete');
  }, 1000);
};

/**
 * Creates data packet animations between two elements
 * @param fromElement - Source element
 * @param toElement - Destination element
 * @param count - Number of data packets to create
 * @param container - Container element to append the packets to
 */
export const createDataTransfer = (
  fromElement: HTMLElement, 
  toElement: HTMLElement, 
  count: number = 5,
  container: HTMLElement
): void => {
  const fromRect = fromElement.getBoundingClientRect();
  const toRect = toElement.getBoundingClientRect();
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const packet = document.createElement('div');
      packet.className = 'data-packet';
      
      // Random starting position within the source element
      const startX = fromRect.left + Math.random() * fromRect.width;
      const startY = fromRect.top + Math.random() * fromRect.height;
      
      packet.style.left = `${startX}px`;
      packet.style.top = `${startY}px`;
      
      // Calculate translation values
      const translateX = (toRect.left + toRect.width/2) - startX;
      const translateY = (toRect.top + toRect.height/2) - startY;
      
      // Set custom properties for the animation
      packet.style.setProperty('--tx', `${translateX}px`);
      packet.style.setProperty('--ty', `${translateY}px`);
      
      // Apply animation
      packet.style.animation = `data-transfer ${0.8 + Math.random() * 0.4}s ease-in forwards`;
      
      container.appendChild(packet);
      
      // Remove the packet after animation completes
      setTimeout(() => {
        if (packet.parentNode) {
          packet.parentNode.removeChild(packet);
        }
      }, 1200);
    }, i * 100); // Stagger the creation of packets
  }
};

/**
 * Initializes a trash bin element with animation
 * @param element - The element to convert to a trash bin
 * @returns The initialized trash bin element
 */
export const initTrashBin = (element: HTMLElement): HTMLElement => {
  // Add necessary classes
  element.classList.add('trash-bin');
  
  // Create the lid element if it doesn't exist
  if (!element.querySelector('.trash-bin-lid')) {
    const lid = document.createElement('div');
    lid.className = 'trash-bin-lid';
    element.prepend(lid);
  }
  
  // Add event listeners for hover effect
  element.addEventListener('mouseenter', () => {
    element.classList.add('active');
  });
  
  element.addEventListener('mouseleave', () => {
    element.classList.remove('active');
  });
  
  return element;
};