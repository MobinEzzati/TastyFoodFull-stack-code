import React, { useState } from 'react'
import Header from './Header'
import foodData from "./foodData";

const Home = () => {
  const [meals] = useState(foodData)
  return (
    <div>
      <Header title='Cr Menu💖' />
    </div>
  );
}

export default Home