import React from 'react';
import styled from 'styled-components';
import Header from '../components/header/Header';
import Hero from '../components/hero/Hero';
import Categories from '../components/categories/Categories';
import Footer from '../components/footer/Footer';

const Main = styled.main`
  min-height: 100vh;
`;

function Home() {
  return (
    <>
      <Header />
      <Main>
        <Hero />
        <Categories />
        {/* We'll add featured photos grid next */}
      </Main>
      <Footer />
    </>
  );
}

export default Home;