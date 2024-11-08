import cv2
import json
import base64
import numpy as np
import lz4.frame

def run():
    # Load JSON file
    with open('../data/raw-data.json', 'r') as f:
        data = json.load(f)
    
    # Decode base64 string to bytes
    compressed_bytes = base64.b64decode(data['data'])

    # Decompress data using LZ4
    img_bytes = lz4.frame.decompress(compressed_bytes)
    
    # Convert bytes to numpy array
    img_array = np.frombuffer(img_bytes, dtype=np.uint8)
    
    # Reshape array to image dimensions
    img = img_array.reshape((data['rows'], data['cols'], 3))
    
    # Display image
    cv2.imshow('Image', img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    run()