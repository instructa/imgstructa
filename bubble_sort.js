/**
 * Simple bubble sort implementation in JavaScript.
 */

/**
 * Sort an array using the bubble sort algorithm.
 * 
 * @param {number[]} arr - Array of numbers to sort
 * @returns {number[]} Sorted array (original array is not modified)
 */
function bubbleSort(arr) {
  // Make a copy to avoid modifying the original
  const sorted = [...arr];
  const n = sorted.length;

  // Traverse through all array elements
  for (let i = 0; i < n; i++) {
    // Last i elements are already in place
    for (let j = 0; j < n - i - 1; j++) {
      // Traverse the array from 0 to n-i-1
      // Swap if the element found is greater than the next element
      if (sorted[j] > sorted[j + 1]) {
        // Swap elements
        [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
      }
    }
  }

  return sorted;
}

// Example usage
if (require.main === module || typeof window === 'undefined') {
  const testArray = [64, 34, 25, 12, 22, 11, 90];
  console.log('Original array:', testArray);
  const sortedArray = bubbleSort(testArray);
  console.log('Sorted array:', sortedArray);
}

// Export for use as a module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { bubbleSort };
}

