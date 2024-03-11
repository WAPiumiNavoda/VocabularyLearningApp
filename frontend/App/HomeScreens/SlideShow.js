import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";

const images = [
  require("../../App/assets/slide5.jpg"),
  require("../../App/assets/slide1.jpg"),
  require("../../App/assets/slide4.png"),
  require("../../App/assets/slide7.jpg"),
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
          margin: 0,
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
