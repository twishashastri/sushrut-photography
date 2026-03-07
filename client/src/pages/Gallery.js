import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { categories, featuredPhotos } from '../dummy-data/images';

const GallerySection = styled.section`
  padding: ${({ theme }) => theme.spacing.xlarge} 0;
  min-height: 60vh;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.medium};
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: capitalize;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.large};
`;

const ImageCard = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.spacing.medium};
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: ${({ theme }) => theme.colors.white};
`;

const Category = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

function Gallery() {
  const { category } = useParams();
  
  // Filter photos by category
  const categoryPhotos = featuredPhotos.filter(
    photo => photo.category.toLowerCase() === category.toLowerCase()
  );
  
  // Find the category display name
  const categoryInfo = categories.find(
    c => c.name.toLowerCase() === category.toLowerCase()
  );

  return (
    <>
      <Header />
      <GallerySection>
        <Container>
          <Title>
            {categoryInfo ? categoryInfo.name : category} Photography
          </Title>
          
          {categoryPhotos.length > 0 ? (
            <Grid>
              {categoryPhotos.map((photo) => (
                <ImageCard key={photo.id}>
                  <Image src={photo.url} alt={photo.category} />
                  <ImageOverlay>
                    <Category>{photo.category}</Category>
                  </ImageOverlay>
                </ImageCard>
              ))}
            </Grid>
          ) : (
            <p style={{ textAlign: 'center' }}>
              No photos available in this category yet.
            </p>
          )}
        </Container>
      </GallerySection>
      <Footer />
    </>
  );
}

export default Gallery;