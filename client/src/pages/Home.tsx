import React, { useState } from 'react'
import Form from '../components/Form';
import ItinerariesBoard from '../components/ItinerariesBoard';
import Loading from '../components/Loading';
import '../styles/Home.css'

const Home = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <Form setLoading={setLoading}/>
      {loading ? <Loading /> : <ItinerariesBoard />}
      
    </div>
  )
}

export default Home