#!/usr/bin/env python3
"""
Simple bubble sort implementation in Python.
"""


def bubble_sort(arr):
    """
    Sort an array using the bubble sort algorithm.
    
    Args:
        arr: List of comparable elements to sort
        
    Returns:
        Sorted list (original array is modified in-place)
    """
    n = len(arr)
    # Make a copy to avoid modifying the original
    arr = arr.copy()
    
    # Traverse through all array elements
    for i in range(n):
        # Last i elements are already in place
        for j in range(0, n - i - 1):
            # Traverse the array from 0 to n-i-1
            # Swap if the element found is greater than the next element
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    
    return arr


if __name__ == "__main__":
    # Example usage
    test_array = [64, 34, 25, 12, 22, 11, 90]
    print(f"Original array: {test_array}")
    sorted_array = bubble_sort(test_array)
    print(f"Sorted array: {sorted_array}")

