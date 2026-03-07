import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const HeaderWrapper = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.medium};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  h1 {
    color: ${({ theme }) => theme.colors.white};
    font-size: 1.5rem;
    margin: 0;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.large};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xlarge};
  flex-direction: column;
  z-index: 1000;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.large};
  right: ${({ theme }) => theme.spacing.large};
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xlarge};
  margin-top: ${({ theme }) => theme.spacing.xlarge};
  
  a {
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
    text-decoration: none;
  }
`;

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <HeaderWrapper>
      <Nav>
        <Logo>
          <h1>Sushrut Shastri</h1>
        </Logo>
        
        <NavLinks>
          <StyledLink to="/">Home</StyledLink>
          <StyledLink to="/gallery">Gallery</StyledLink>
          <StyledLink to="/about">About</StyledLink>
          <StyledLink to="/contact">Contact</StyledLink>
        </NavLinks>
        
        <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
          <FiMenu />
        </MobileMenuButton>
      </Nav>

      <MobileMenu $isOpen={mobileMenuOpen}>
        <CloseButton onClick={() => setMobileMenuOpen(false)}>
          <FiX />
        </CloseButton>
        <MobileNavLinks>
          <StyledLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</StyledLink>
          <StyledLink to="/gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</StyledLink>
          <StyledLink to="/about" onClick={() => setMobileMenuOpen(false)}>About</StyledLink>
          <StyledLink to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</StyledLink>
        </MobileNavLinks>
      </MobileMenu>
    </HeaderWrapper>
  );
}

export default Header;