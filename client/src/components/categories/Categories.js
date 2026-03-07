import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { categories } from '../../dummy-data/images';

const CategoriesSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xlarge} 0;
  background-color: ${({ theme }) => theme.colors.surface};
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
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.large};
`;

const CategoryCard = styled(Link)`
  position: relative;
  height: 250px;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  
  &:hover img {
    transform: scale(1.1);
  }
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const CategoryOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.spacing.medium};
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: ${({ theme }) => theme.colors.white};
`;

const CategoryName = styled.h3`
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const CategoryCount = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;
`;

function Categories() {
  return (
    <CategoriesSection>
      <Container>
        <Title>Explore Categories</Title>
        <Grid>
          {categories.map((category) => (
            <CategoryCard key={category.id} to={`/gallery/${category.name.toLowerCase()}`}>
              <CategoryImage src={category.image} alt={category.name} />
              <CategoryOverlay>
                <CategoryName>{category.name}</CategoryName>
                <CategoryCount>{category.count} photos</CategoryCount>
              </CategoryOverlay>
            </CategoryCard>
          ))}
        </Grid>
      </Container>
    </CategoriesSection>
  );
}

export default Categories;