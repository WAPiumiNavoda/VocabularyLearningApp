import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";

const images = [
  require("../../App/assets/edu.jpeg"),
  require("../../App/assets/login.png"),
  require("../../App/assets/edu1.png"),
  // Add more images as needed
];

export default function SlideShow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <View>
      <Image
        source={images[currentImageIndex]}
        style={{
          marginTop: 0,
          width: "100%",
          height: 200,
          resizeMode: "cover",
          borderRadius: 0,
          backgroundColor: "black",
        }}
      />
    </View>
  );
}
