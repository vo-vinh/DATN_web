import cv2  # Install opencv-python
import numpy as np
from keras.models import load_model  # TensorFlow is required for Keras to work

# Disable scientific notation for clarity
np.set_printoptions(suppress=True)

# Load the model
model = load_model("keras_Model.h5", compile=False)

# Load the labels
labels = ["No Mask", "Mask On", "No Human"]

# CAMERA can be 0 or 1 based on default camera of your computer
camera = cv2.VideoCapture(0)

def imageDetector():
    # Grab the webcamera's image.
    ret, image = camera.read()

    # Resize the raw image into (224-height,224-width) pixels
    image = cv2.resize(image, (224, 224), interpolation=cv2.INTER_AREA)

    # Show the image in a window
    #cv2.imshow("Webcam Image", image)

    # Make the image a numpy array and reshape it to the models input shape.
    image = np.asarray(image, dtype=np.float32).reshape(1, 224, 224, 3)

    # Normalize the image array
    image = (image / 127.5) - 1

    # Predicts the model
    prediction = model.predict(image)
    # index = np.argmax(prediction)
    # class_name = class_names[index]
    # confidence_score = prediction[0][index]

    # Print prediction and confidence score
    # print("Class:", class_name[2:], end="")
    # print("Confidence Score:", str(np.round(confidence_score * 100))[:-2], "%")
    #print(labels[np.argmax(prediction)])
    return labels[np.argmax(prediction)]
    # Listen to the keyboard for presses.

